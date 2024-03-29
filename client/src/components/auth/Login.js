import React, { useState, useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
//Components
import { useSnackbar } from "notistack";
//Context
import AuthContext from "../../context/auth/authContext";
import { Typography, TextField, Button } from "@mui/material";

const PREFIX = 'Login';

const classes = {
  root: `${PREFIX}-root`,
  textFieldFull: `${PREFIX}-textFieldFull`,
  button: `${PREFIX}-button`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: "flex",
    flexWrap: "wrap",
  },

  [`& .${classes.textFieldFull}`]: {
    marginTop: theme.spacing(2),
    width: "100%",
  },

  [`& .${classes.button}`]: {
    backgroundColor: "rgb(214, 0, 13)",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const Login = (props) => {

  const authContext = useContext(AuthContext);
  const { login, error, clearErrors, isAuthenticated } = authContext;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    } else {
      login({
        email,
        password,
      });
    }
  };
  return (
    <Root className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            className={classes.textFieldFull}
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            label="Email"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className={classes.textFieldFull}
            id="password"
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={onChange}
            label="Password"
            variant="outlined"
          />
        </div>
        <Button
          size="large"
          fullWidth={true}
          className={classes.button}
          onClick={onSubmit}
          color="secondary"
          variant="contained"
        >
          Login
        </Button>
      </form>
      <Typography component={Link} to="/password-reset/">
        Password Reset
      </Typography>
    </Root>
  );
};

export default Login;
