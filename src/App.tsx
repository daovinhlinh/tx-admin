import { Close as CloseIcon } from "@material-ui/icons";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./App.styles";

// components
// import Layout from "./components/Layout";

// pages

// context
import classnames from "classnames";
import * as React from "react";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useLayoutState } from "./context/LayoutContext";
import { useUserState } from "./context/UserContext";
import Error from "./pages/error/Error";
import Login from "./pages/login/Login";
import Notifications from "./pages/notifications/Notifications";
import Tables from "./pages/tables/Tables";
import CheckIn from "./pages/checkin/CheckIn";

function CloseButton({
  closeToast,
  className,
}: {
  closeToast: () => void;
  className: string;
}) {
  return <CloseIcon className={className} onClick={closeToast} />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Tables />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Route>
  )
);

export default function App() {
  // global
  const classes = useStyles();

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/*" element={<PrivateRoute />}>
    //       <Route path="/*" element={<Layout />} />
    //     </Route>
    //     <Route path="/login" element={<PublicRoute />}>
    //       <Route path="/login" element={<Login />} />
    //     </Route>
    //     <Route path="*" element={<Error />} />
    //   </Routes>

    // <ToastContainer
    //   pauseOnFocusLoss={false}
    //   className={classes.toastsContainer}
    //   closeButton={
    //     <CloseButton
    //       closeToast={() => {}}
    //       className={classes.notificationCloseButton}
    //     />
    //   }
    //   closeOnClick={false}
    // />
    // </BrowserRouter>
    <React.Fragment>
      <RouterProvider router={router} />
      <ToastContainer
        pauseOnFocusLoss={false}
        className={classes.toastsContainer}
        closeButton={
          <CloseButton
            closeToast={() => {}}
            className={classes.notificationCloseButton}
          />
        }
        closeOnClick={false}
      />
    </React.Fragment>
  );
}

function PrivateRoute() {
  const { isAuthenticated } = useUserState();
  const classes = useStyles();
  const layoutState = useLayoutState();

  return isAuthenticated ? (
    <div className={classes.root}>
      <>
        <Header />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <Outlet />
        </div>
      </>
    </div>
  ) : (
    <Navigate
      to={{
        pathname: "/login",
      }}
    />
  );
}

function PublicRoute() {
  const { isAuthenticated } = useUserState();

  return isAuthenticated ? (
    <Navigate
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <Outlet />
  );
}
