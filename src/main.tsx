import { ThemeProvider } from "@material-ui/core";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GameProvider } from "./context/GameContext";
import LayoutProvider from "./context/LayoutContext";
import SocketProvider from "./context/SocketContext";
import UserProvider from "./context/UserContext";
import "./index.css";
import themes from "./themes";

createRoot(document.getElementById("root")!).render(
  <LayoutProvider>
    <UserProvider>
      <GameProvider>
        <SocketProvider>
          <ThemeProvider theme={themes.default}>
            <App />
          </ThemeProvider>
        </SocketProvider>
      </GameProvider>
    </UserProvider>
  </LayoutProvider>
);
