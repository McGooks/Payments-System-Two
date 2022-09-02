import React, { useState, useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
//Components
import { useSnackbar } from "notistack";
//Context
import AuthContext from "../../context/auth/authContext";
//UI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
const PREFIX = 'Register';

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

const Register = (props) => {

  const authContext = useContext(AuthContext);
  const { register, error, clearErrors, isAuthenticated } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
    QUBID: "",
    email: "",
    password: "",
    password2: "",
  });
  const { QUBID, email, password, password2 } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (QUBID === "" || email === "" || password === "") {
      enqueueSnackbar(`Please complete all fields`, {
        variant: "warning",
      });
    } else if (password !== password2) {
      enqueueSnackbar(`Passwords do not match`, {
        variant: "error",
      });
    } else {
      register({
        QUBID,
        email,
        password,
      });
    }
  };
  return (
    <Root className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div>
          <div>
            <TextField
              className={classes.textFieldFull}
              required
              id="QUBID"
              type="text"
              name="QUBID"
              value={QUBID}
              onChange={onChange}
              placeholder="QUB ID Number"
              label="QUB ID"
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              className={classes.textFieldFull}
              required
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onChange}
              label="Email"
              variant="outlined"
              autoComplete="username"
            />
          </div>
        </div>
        <div>
          <TextField
            className={classes.textFieldFull}
            required
            id="password"
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={onChange}
            label="Password"
            variant="outlined"
            autoComplete="current-password"
            minLength="6"
          />
        </div>
        <div>
          <TextField
            className={classes.textFieldFull}
            required
            id="password2"
            type="password"
            name="password2"
            placeholder="password"
            value={password2}
            onChange={onChange}
            label="Confirm Password"
            variant="outlined"
            minLength="6"
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
          Register
        </Button>
      </form>
    </Root>
  );
};

export default Register;
