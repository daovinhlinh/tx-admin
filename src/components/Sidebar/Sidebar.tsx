import { Drawer, IconButton, List, Theme } from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  BorderAll as TableIcon,
  NotificationsNone as NotificationsIcon,
} from "@material-ui/icons";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import { useTheme } from "@material-ui/styles";
import classNames from "classnames";
import { useEffect, useState } from "react";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  toggleSidebar,
  useLayoutDispatch,
  useLayoutState,
} from "../../context/LayoutContext";



const structure = [
  // { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  { id: 1, label: "Users", link: "/", icon: <TableIcon /> },
  {
    id: 2,
    label: "Notification",
    link: "/notification",
    icon: <NotificationsIcon />,
  },
  {
    id: 3,
    label: "Check in",
    link: "/checkin",
    icon: <EventAvailableIcon />,
  },

  // {
  //   id: 3,
  //   label: "Notifications",
  //   link: "/notifications",
  //   icon: <NotificationsIcon />,
  // },
  // {
  //   id: 4,
  //   label: "UI Elements",
  //   link: "/app/ui",
  //   icon: <UIElementsIcon />,
  //   children: [
  //     { label: "Icons", link: "/app/ui/icons" },
  //     { label: "Charts", link: "/app/ui/charts" },
  //     { label: "Maps", link: "/app/ui/maps" },
  //   ],
  // },
  // { id: 5, type: "divider" },
  // { id: 6, type: "title", label: "HELP" },
  // {
  //   id: 7,
  //   label: "Library",
  //   link: "https://flatlogic.com/templates",
  //   icon: <LibraryIcon />,
  // },
  // {
  //   id: 8,
  //   label: "Support",
  //   link: "https://flatlogic.com/forum",
  //   icon: <SupportIcon />,
  // },
  // {
  //   id: 9,
  //   label: "FAQ",
  //   link: "https://flatlogic.com/forum",
  //   icon: <FAQIcon />,
  // },
  // { id: 10, type: "divider" },
  // { id: 11, type: "title", label: "PROJECTS" },
  // {
  //   id: 12,
  //   label: "My recent",
  //   link: "",
  //   icon: <Dot size="small" color="warning" />,
  // },
  // {
  //   id: 13,
  //   label: "Starred",
  //   link: "",
  //   icon: <Dot size="small" color="primary" />,
  // },
  // {
  //   id: 14,
  //   label: "Background",
  //   link: "",
  //   icon: <Dot size="small" color="secondary" />,
  // },
];

function Sidebar() {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  // global
  const { isSidebarOpened } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  // local
  const [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default Sidebar;
