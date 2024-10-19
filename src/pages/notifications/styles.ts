import { makeStyles } from "@material-ui/core";
import tinycolor from "tinycolor2";

export default makeStyles((theme) => ({
  layoutContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  layoutText: {
    color: tinycolor(theme.palette.background.default).darken().toHexString(),
  },
  layoutButtonsRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  layoutButton: {
    backgroundColor: theme.palette.background.default,
    width: 125,
    height: 50,
    outline: "none",
    border: "none",
  },
  layoutButtonActive: {
    backgroundColor: tinycolor(theme.palette.background.default)
      .darken()
      .toHexString(),
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  notificationCallButton: {
    color: "white",
    marginBottom: theme.spacing(1),
    textTransform: "none",
  },
  codeContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  codeComponent: {
    flexGrow: 1,
  },
  notificationItem: {
    marginTop: theme.spacing(2),
  },
  notificationCloseButton: {
    position: "absolute",
    right: theme.spacing(2),
  },
  toastsContainer: {
    width: 400,
    marginTop: theme.spacing(6),
    right: 0,
  },
  progress: {
    visibility: "hidden",
  },
  notification: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    boxShadow: "none",
    overflow: "visible",
  },
  notificationComponent: {
    paddingRight: theme.spacing(4),
  },
  widgetHeader: {
    paddingBottom: 8,
  },
}));
