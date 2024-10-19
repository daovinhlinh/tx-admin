import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  card: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
  },
  pieChartLegendWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: theme.spacing(1),
  },
  legendItemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
}));