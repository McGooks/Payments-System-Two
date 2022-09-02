import React, { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
//Components
import { useSnackbar } from "notistack";
import { TextField, Button, Box } from "@mui/material";
const PREFIX = 'PasswordReset';

const classes = {
  root: `${PREFIX}-root`,
  textFieldFull: `${PREFIX}-textFieldFull`,
  button: `${PREFIX}-button`,
  text: `${PREFIX}-text`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "1.2rem",
  },

  [`& .${classes.textFieldFull}`]: {
    margin: theme.spacing(1),
    width: "97%",
  },

  [`& .${classes.button}`]: {
    backgroundColor: "rgb(214, 0, 13)",
    margin: theme.spacing(1),
    width: "97%",
  },

  [`& .${classes.text}`]: {
    textAlign: "center",
    marginBottom: 30,
  }
}));

const PasswordReset = (props) => {

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
    (<Root>
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
    </Root>)
  );
};

export default PasswordReset;
