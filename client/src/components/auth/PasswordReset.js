import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
//Components
import { useSnackbar } from "notistack";
import { Typography, TextField, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "1.2rem",
  },
  textFieldFull: {
    margin: theme.spacing(1),
    width: "97%",
  },
  button: {
    backgroundColor: "rgb(214, 0, 13)",
    margin: theme.spacing(1),
    width: "97%",
  },
  text: {
    textAlign: "center",
    marginBottom: 30,
  },
}));

const PasswordReset = (props) => {
  const classes = useStyles();
  const { token } = useParams();
  const authContext = useContext(AuthContext);
  const { passwordUpdateRequest, logout, error, clearErrors } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    logout();
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (password.confirmPassword === "" || password.newPassword === "") {
      enqueueSnackbar(`Please complete all fields`, {
        variant: "warning",
      });
    } else if (password.confirmPassword !== password.newPassword) {
      enqueueSnackbar(`Passwords do not match`, {
        variant: "error",
      });
    } else {
      password.password = password.newPassword;
      setPassword({
        ...password,
      });
      passwordUpdateRequest(token, password);
      logout();
      props.history.push("/");
    }
  };
  const handleChangePassword = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="form-container">
        <h1>
          Password <span className="text-primary">Reset</span>
        </h1>
        <TextField
          className={classes.textFieldFull}
          id="password-new"
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={password.newPassword || ""}
          onChange={handleChangePassword}
          label="New Password"
          variant="outlined"
        />
        <TextField
          className={classes.textFieldFull}
          id="password-new1"
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={password.confirmPassword || ""}
          onChange={handleChangePassword}
          label="Confirm New Password"
          variant="outlined"
        />
        <Box>
          <Button
            size="large"
            fullWidth={true}
            className={classes.button}
            onClick={handleUpdatePassword}
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </div>
    </>
  );
};

export default PasswordReset;
