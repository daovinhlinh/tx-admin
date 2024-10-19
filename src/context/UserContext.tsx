import { ReactNode, useReducer, createContext, useContext } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api";
import { IUser } from "../models/User";
import { getLocalItem, setLocalItem } from "../services/localData";
import { LOGIN_FAILURE, LOGIN_SUCCESS, SIGN_OUT_SUCCESS } from "./action";

interface UserState {
  isAuthenticated: boolean;
  user: IUser | null;
}

interface UserAction {
  type: string;
  payload?: Partial<UserState>;
}

type Dispatch = React.Dispatch<UserAction>;

const UserStateContext = createContext<UserState | undefined>(undefined);
const UserDispatchContext = createContext<
  ((action: UserAction) => void) | undefined
>(undefined);

const userReducer = (state: UserState, action: UserAction) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default: {
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  }
};

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer<
    (state: UserState, action: UserAction) => UserState
  >(userReducer, {
    isAuthenticated: !!getLocalItem("access_token"),
    user: JSON.parse(getLocalItem("user") ?? "null"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
};

export const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
};

// ###########################################################

const loginUser = async (
  dispatch: Dispatch,
  username: string,
  password: string,
  navigate: NavigateFunction,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setError(false);
  setIsLoading(true);

  if (!!username && !!password) {
    const result = await authApi.login({
      username: username,
      password: password,
    });
    if (result && result.data && result.data.user.role === "admin") {
      setLocalItem("access_token", result.data.accessToken);
      setLocalItem("refresh_token", result.data.refreshToken);
      setLocalItem("user", JSON.stringify(result.data.user));
      setError(false);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: result.data.user,
          isAuthenticated: true,
        },
      });
      // navigate("/");
    } else {
      dispatch({ type: LOGIN_FAILURE });
      toast.error("Login failed");
      setError(true);
    }
    setIsLoading(false);
    // setTimeout(() => {
    //   localStorage.setItem('access_token', 1)
    //   setError(null)
    //   setIsLoading(false)
    //   dispatch({ type: 'LOGIN_SUCCESS' })

    // }, 2000);
  } else {
    dispatch({ type: LOGIN_FAILURE });
    setError(true);
    setIsLoading(false);
  }
};

const signOut = async (dispatch: Dispatch, navigate: NavigateFunction) => {
  const refreshToken = getLocalItem("refresh_token");
  if (refreshToken) {
    authApi.logout(refreshToken);
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  dispatch({ type: SIGN_OUT_SUCCESS });
  navigate("/login");
};

export default UserProvider;

export const userAction = {
  loginUser,
  signOut,
};
