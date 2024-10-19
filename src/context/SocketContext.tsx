/* eslint-disable react-refresh/only-export-components */
import { createContext, FC, useEffect, useState } from "react";
import { useUserState } from "./UserContext";
import { io, Socket } from "socket.io-client";
import { getLocalItem } from "../services/localData";
import * as React from "react";

interface SocketProviderProps {
  children: React.ReactElement;
}
const defaultValue = null as Socket | null | undefined;

const SocketContext = createContext(defaultValue);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    console.log("useSocket is used without a SocketProvider");
    return null;
  }
  return context;
};

const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>();

  const userData = useUserState();

  useEffect(() => {
    if (userData.isAuthenticated && userData.user) {
      const token = getLocalItem("access_token");

      const newSocket = io(process.env["REACT_APP_API_URL"], {
        auth: {
          token,
        },
        reconnection: true, // whether to reconnect automatically
        reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
        reconnectionDelay: 1000, // how long to wait before attempting a new reconnection
        reconnectionDelayMax: 5000, // maximum amount of time to wait between reconnections
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
    return undefined;
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
