import {
  Button,
  CircularProgress,
  Fade,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";

// styles
import useStyles from "./styles";

// logo
// import google from "../../images/google.svg";

// context
import { userAction, useUserDispatch } from "../../context/UserContext";

function Login() {
  const classes = useStyles();

  // global
  const userDispatch = useUserDispatch();

  // local
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [nameValue, setNameValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <React.Fragment>
            <Typography variant="h1" className={classes.greeting}>
              Login
            </Typography>
            <Fade in={error}>
              <Typography color="secondary" className={classes.errorMessage}>
                Something is wrong with your login or password :(
              </Typography>
            </Fade>
            <TextField
              id="email"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              margin="normal"
              placeholder="Email Adress"
              type="email"
              fullWidth
            />
            <TextField
              id="password"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              margin="normal"
              placeholder="Password"
              type="password"
              fullWidth
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    loginValue.length === 0 || passwordValue.length === 0
                  }
                  onClick={
                    () =>
                      userAction.loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        setIsLoading,
                        setError
                      )
                    // navigate("/")
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Login
                </Button>
              )}
            </div>
          </React.Fragment>
        </div>
      </div>
    </Grid>
  );
}

export default Login;
