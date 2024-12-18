// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers/Wrappers";

export default function PageTitle(props) {
  const classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography
        className={classes.typo}
        variant="h1"
        size="sm"
        color={"black"}
      >
        {props.title}
      </Typography>
      {props.button && props.button}
    </div>
  );
}
