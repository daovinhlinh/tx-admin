import { Button, Grid, Paper, Typography } from "@material-ui/core";
import classnames from "classnames";
import { Link } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";

export default function Error() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotype}>
        <img className={classes.logotypeIcon} src={logo} alt="logo" />
        <Typography variant="h3" color="white" className={classes.logotypeText}>
          Material Admin
        </Typography>
      </div>
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          color="primary"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          404
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Oops. Looks like the page you're looking for no longer exists
        </Typography>
        <Typography
          variant="h6"
          color="text"
          colorBrightness="secondary"
          className={classnames(classes.textRow, classes.safetyText)}
        >
          But we're here to bring you back to safety
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          className={classes.backButton}
        >
          Back to Home
        </Button>
      </Paper>
    </Grid>
  );
}