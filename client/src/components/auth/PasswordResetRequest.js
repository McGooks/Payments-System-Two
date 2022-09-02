import React, { useState, useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
//Components
import { useSnackbar } from "notistack";
//Context
import AuthContext from "../../context/auth/authContext";
//UI
import { Button, TextField } from "@mui/material";
const PREFIX = 'PasswordResetRequest';

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

const PasswordResetRequest = (props) => {

  const authContext = useContext(AuthContext);
  const {
    register,
    error,
    clearErrors,
    isAuthenticated,
    passwordResetRequestPublic,
    logout,
  } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
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
  });
  const { QUBID, email } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (QUBID === "" || email === "") {
      enqueueSnackbar(`Please complete all fields`, {
        variant: "warning",
      });
    } else {
      passwordResetRequestPublic(user);
      logout();
      props.history.push("/");
      enqueueSnackbar(`Please check ${email} for reset instructions`, {
        variant: "success",
      });
    }
  };
  return (
    <Root className="form-container">
      <h1>
        Password Reset <span className="text-primary">Request</span>
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
        <Button
          size="large"
          fullWidth={true}
          className={classes.button}
          onClick={onSubmit}
          color="secondary"
          variant="contained"
        >
          Request Reset
        </Button>
      </form>
    </Root>
  );
};

export default PasswordResetRequest;
