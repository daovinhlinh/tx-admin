// /* eslint-disable react-refresh/only-export-components */
// import { Drawer, IconButton, List, Theme, withStyles } from "@material-ui/core";
// import {
//   ArrowBack as ArrowBackIcon,
//   BorderAll as TableIcon,
//   FormatSize as TypographyIcon,
// } from "@material-ui/icons";
// import classNames from "classnames";
// import SidebarLink from "./components/SidebarLink/SidebarLink";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import { ExtendThemeOptions } from "../../themes/default";

// const structure = [
//   { id: 1, label: "Tables", link: "/tables", icon: <TableIcon /> },
//   {
//     id: 2,
//     label: "Typography",
//     link: "/notification",
//     icon: <TypographyIcon />,
//   },
//   {
//     id: 3,
//     label: "Check in",
//     link: "/checkin",
//     icon: <EventAvailableIcon />,
//   },
//   // {
//   //   id: 3,
//   //   label: "Notifications",
//   //   link: "/app/notifications",
//   //   icon: <NotificationsIcon />,
//   // },
//   // {
//   //   id: 4,
//   //   label: "UI Elements",
//   //   link: "/app/ui",
//   //   icon: <UIElementsIcon />,
//   //   children: [
//   //     { label: "Icons", link: "/app/ui/icons" },
//   //     { label: "Charts", link: "/app/ui/charts" },
//   //     { label: "Maps", link: "/app/ui/maps" },
//   //   ],
//   // },
//   // { id: 5, type: "divider" },
//   // { id: 6, type: "title", label: "HELP" },
//   // {
//   //   id: 7,
//   //   label: "Library",
//   //   link: "https://flatlogic.com/templates",
//   //   icon: <LibraryIcon />,
//   // },
//   // {
//   //   id: 8,
//   //   label: "Support",
//   //   link: "https://flatlogic.com/forum/",
//   //   icon: <SupportIcon />,
//   // },
//   // {
//   //   id: 9,
//   //   label: "FAQ",
//   //   link: "https://flatlogic.com/forum/",
//   //   icon: <FAQIcon />,
//   // },
//   // { id: 10, type: "divider" },
//   // { id: 11, type: "title", label: "PROJECTS" },
//   // {
//   //   id: 12,
//   //   label: "My recent",
//   //   link: "",
//   //   icon: <Dot size="small" color="secondary" />,
//   // },
//   // {
//   //   id: 13,
//   //   label: "Starred",
//   //   link: "",
//   //   icon: <Dot size="small" color="primary" />,
//   // },
//   // {
//   //   id: 14,
//   //   label: "Background",
//   //   link: "",
//   //   icon: <Dot size="small" color="secondary" />,
//   // },
// ];

// const SidebarView = ({
//   classes,
//   toggleSidebar,
//   isSidebarOpened,
//   isPermanent,
// }) => {
//   const classes = useStyles();

//   return (
//     <Drawer
//       variant={isPermanent ? "permanent" : "temporary"}
//       className={classNames(classes.drawer, {
//         [classes.drawerOpen]: isSidebarOpened,
//         [classes.drawerClose]: !isSidebarOpened,
//       })}
//       classes={{
//         paper: classNames(classes.drawer, {
//           [classes.drawerOpen]: isSidebarOpened,
//           [classes.drawerClose]: !isSidebarOpened,
//         }),
//       }}
//       open={isSidebarOpened}
//     >
//       <div className={classes.mobileBackButton}>
//         <IconButton onClick={toggleSidebar}>
//           <ArrowBackIcon
//             classes={{
//               root: classNames(classes.headerIcon, classes.headerIconCollapse),
//             }}
//           />
//         </IconButton>
//       </div>
//       <List className={classes.sidebarList}>
//         {structure.map((link) => (
//           <SidebarLink
//             key={link.id}
//             isSidebarOpened={isSidebarOpened}
//             {...link}
//           />
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default SidebarView;
