import classnames from "classnames";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

//icons

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
// import Dashboard from "../../pages/dashboard/Dashboard";
// import Charts from "../../pages/charts";
// import Icons from "../../pages/icons";
// import Maps from "../../pages/maps";
import Tables from "../../pages/tables";

// context
import { useLayoutState } from "../../context/LayoutContext";
import Notifications from "../../pages/notifications";

function Layout(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  // global
  const layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          {/* <Route path="/app/dashboard" element={Dashboard} /> */}
          {/* <Route path="/app/typography" element={Typography} /> */}
          <Route path="/" element={<Tables />} />
          <Route path="/notification" element={<Notifications />} />
          {/* <Route path="/app/ui" element={<Navigate to="/app/ui/icons" />} /> */}
          {/* <Route path="/app/ui/maps" element={Maps} />
            <Route path="/app/ui/icons" element={Icons} />
            <Route path="/app/ui/charts" element={Charts} /> */}
          {/* <Box
              mt={5}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent="space-between"
            >
              <div>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/'}
                  target={'_blank'}
                  className={classes.link}
                >
                  Flatlogic
                </Link>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/about'}
                  target={'_blank'}
                  className={classes.link}
                >
                  About Us
                </Link>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/blog'}
                  target={'_blank'}
                  className={classes.link}
                >
                  Blog
                </Link>
              </div>
              <div>
                <Link
                  href={'https://www.facebook.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton aria-label="facebook">
                    <Icon
                      path={FacebookIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
                <Link
                  href={'https://twitter.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton aria-label="twitter">
                    <Icon
                      path={TwitterIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
                <Link
                  href={'https://github.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton
                    aria-label="github"
                    style={{marginRight: -12}}
                  >
                    <Icon
                      path={GithubIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
              </div>
            </Box> */}
        </div>
      </>
    </div>
  );
}

export default Layout;
