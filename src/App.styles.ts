import { makeStyles, Theme } from "@material-ui/core/styles";

export default makeStyles((theme: Theme) => ({
  notificationContainer: {
    display: "flex",
    alignItems: "center",
  },
  toastsContainer: {
    width: 400,
    marginTop: theme.spacing(6),
    right: 0,
  },
  notificationContained: {
    borderRadius: 45,
    height: 45,
    boxShadow: theme.customShadows.widgetDark,
  },
  notificationContainedShadowless: {
    boxShadow: "none",
  },
  notificationIconContainer: {
    minWidth: 45,
    height: 45,
    borderRadius: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
  },
  notificationIconContainerContained: {
    fontSize: 18,
    color: "#FFFFFF80",
  },
  notificationIconContainerRounded: {
    marginRight: theme.spacing(2),
  },
  containedTypography: {
    color: "white",
  },
  messageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  extraButton: {
    color: "white",
    "&:hover, &:focus": {
      background: "transparent",
    },
  },
  notificationCloseButton: {
    position: "absolute",
    right: theme.spacing(2),
  },

  root: {
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
    backgroundColor: "white",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100vw - 240px)`,
    minHeight: "100vh",
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));
