import { createContext, ReactNode, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { gameApi, IResponseMessage } from "../api";
import { userApi } from "../api/userApi";
import { IUser } from "../models/User";
import {
  GET_GAME_USER_LIST_FAILED,
  GET_GAME_USER_LIST_SUCCESS,
} from "./action";

interface State {
  user?: {
    data: IUser[];
    page: number;
    totalPages: number;
    totalDocs: number;
  };
}

interface Action {
  type: string;
  payload?: {
    data: IUser[];
    page: number;
    totalPages: number;
    totalDocs: number;
  };
}

type Dispatch = React.Dispatch<Action>;

const UserStateContext = createContext<State | undefined>(undefined);
const UserDispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
);

const gameReducer: Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case GET_GAME_USER_LIST_SUCCESS:
      return { ...state, user: action.payload };
    case GET_GAME_USER_LIST_FAILED:
      return {
        ...state,
        user: undefined,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

interface ProviderProps {
  children: ReactNode;
}

type Reducer = (state: State, action: Action) => State;

function GameProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer<Reducer>(gameReducer, {
    user: undefined,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useGameState() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useGameUserState must be used within a GameUserProvider");
  }
  return context;
}

function useGameDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useGameDispatch must be used within a GameUserProvider");
  }
  return context;
}

// ###########################################################

// const loginUser = async (dispatch, login, password, history, setIsLoading, setError) => {
//   setError(false);
//   setIsLoading(true);

//   if (!!login && !!password) {
//     const result = await authApi.login({ email: login, password: password })
//     console.log(result);
//     if (result) {
//       localStorage.setItem('id_token', result.data.accessToken)
//       localStorage.setItem('user', JSON.stringify(result.data.user))
//       setError(null)
//       dispatch({ type: LOGIN_SUCCESS, user: result.data.user })
//       history.push('/app/dashboard')
//     } else {
//       dispatch({ type: LOGIN_FAILURE });
//       setError(true);
//     }
//     setIsLoading(false);
//     // setTimeout(() => {
//     //   localStorage.setItem('id_token', 1)
//     //   setError(null)
//     //   setIsLoading(false)
//     //   dispatch({ type: 'LOGIN_SUCCESS' })

//     // }, 2000);
//   } else {
//     dispatch({ type: LOGIN_FAILURE });
//     setError(true);
//     setIsLoading(false);
//   }
// }

// function signOut(dispatch, history) {
//   localStorage.removeItem("id_token");
//   localStorage.removeItem("user");
//   dispatch({ type: SIGN_OUT_SUCCESS });
//   history.push("/login");
// }

const getGameUserList = async (
  dispatch: Dispatch,
  page: number = 0,
  size: number = 25
) => {
  try {
    const { data } = await userApi.getAll(page + 1, size);
    dispatch({
      type: GET_GAME_USER_LIST_SUCCESS,
      payload: {
        data: data.users,
        page: data.page,
        totalPages: data.totalPages,
        totalDocs: data.totalDocs,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Failed to fetch users");
    dispatch({ type: GET_GAME_USER_LIST_FAILED });
  }
};

const deleteUser = async (userId: string, state: State, dispatch: Dispatch) => {
  try {
    const result = await gameApi.deleteUser(userId);

    if (result.message === IResponseMessage.OK && state.user != null) {
      const newState = { ...state.user };

      newState.data = newState.data.filter((item) => item._id !== userId);
      dispatch({ type: GET_GAME_USER_LIST_SUCCESS, payload: newState });
    }
  } catch (error) {
    console.log("result console.error();", error);
    // dispatch({ type: GET_GAME_USER_LIST_FAILED });
  }
};

// const deleteUsers = async (
//   usernames: string[],
//   state: State,
//   dispatch: Dispatch
// ) => {
//   try {
//     const result = await gameApi.deleteUsers(usernames);

//     const newState = state.user?.data.filter(
//       (item) => !usernames.includes(item.username)
//     );
//     dispatch({ type: GET_GAME_USER_LIST_SUCCESS, payload: newState });
//     return result.data;
//   } catch (error) {
//     console.log("result console.error();", error);
//     throw error;
//     // dispatch({ type: GET_GAME_USER_LIST_FAILED });
//   }
// };

// const updateUser = async (
//   data: IUpdateUserPayload,
//   state: State,
//   dispatch: Dispatch
// ) => {
//   try {
//     const result = await gameApi.updateUser(data);

//     const index = state.user?.data.findIndex(
//       (item) => item._id === result.data._id
//     );

//     if (index !== -1) {
//       const newState = { ...state.user };
//       newState.data![index!] = result.data;

//       dispatch({ type: GET_GAME_USER_LIST_SUCCESS, payload: newState });
//     }
//   } catch (error) {
//     console.log("result console.error();", error);
//     throw error;
//   }
// };

const updateCoin = async (
  userId: string,
  coins: string,
  state: State,
  dispatch: Dispatch
) => {
  try {
    const result = await gameApi.updateCoin(coins, userId);

    if (result.message === IResponseMessage.OK) {
      const index = state.user?.data.findIndex((item) => item._id === userId);

      if (index !== -1) {
        const newState = { ...state.user! };
        newState.data![index!] = result.data;
        dispatch({ type: GET_GAME_USER_LIST_SUCCESS, payload: newState });
      }
    }
  } catch (error) {
    console.log("result console.error();", error);
    throw error;
  }
};

const searchUser = async (searchText: string, dispatch: Dispatch) => {
  try {
    const result = await gameApi.searchUser(searchText);

    if (result.message === IResponseMessage.OK) {
      dispatch({
        type: GET_GAME_USER_LIST_SUCCESS,
        payload: {
          data: result.data.users,
          page: result.data.page,
          totalPages: result.data.totalPages,
          totalDocs: result.data.totalDocs,
        },
      });
    }
  } catch (error) {
    console.log("result console.error();", error);
  }
};

export { GameProvider, useGameState, useGameDispatch };

export const gameAction = {
  getGameUserList,
  deleteUser,
  // updateUser,
  // deleteUsers,
  updateCoin,
  searchUser,
};
