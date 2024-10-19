import { createContext, ReactNode, useContext, useReducer } from "react";

interface LayoutState {
  isSidebarOpened: boolean;
}

interface LayoutAction {
  type: string;
}

const LayoutStateContext = createContext<LayoutState | undefined>({
  isSidebarOpened: false,
});
const LayoutDispatchContext = createContext<
  ((action: LayoutAction) => void) | undefined
>(undefined);

const layoutReducer = (state: LayoutState, action: LayoutAction) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

interface LayoutProviderProps {
  children: ReactNode;
}

const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [state, dispatch] = useReducer(layoutReducer, {
    isSidebarOpened: true,
  });

  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
};

export const useLayoutState = () => {
  const context = useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
};

export const useLayoutDispatch = () => {
  const context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
};

export default LayoutProvider;

// ###########################################################
export const toggleSidebar = (dispatch: (action: LayoutAction) => void) => {
  dispatch({
    type: "TOGGLE_SIDEBAR",
  });
};
