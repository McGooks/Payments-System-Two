import React, { useState, useContext, useEffect } from "react";
//Components
import { useSnackbar } from "notistack";
//Context
import AuthContext from "../../context/auth/authContext";
//UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textFieldFull: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  button: {
    backgroundColor: "rgb(214, 0, 13)",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const PasswordResetRequest = (props) => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const {
    register,
    error,
    clearErrors,
    isAuthenticated,
    passwordResetRequestPublic,
    logout
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
  console.log(user);
  return (
    <div className="form-container">
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
    </div>
  );
};

export default PasswordResetRequest;
