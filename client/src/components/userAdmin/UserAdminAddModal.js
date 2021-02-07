import React, { useState, useContext, useEffect } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import { useSnackbar } from "notistack";
//UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const statusMenu = [
  { id: 1, value: "Pending", label: "Pending" },
  { id: 2, value: "Active", label: "Active" },
  { id: 3, value: "Disabled", label: "Disabled" },
  { id: 4, value: "Expired", label: "Expired" },
];

const roleMenu = [
  { id: 1, value: "User", label: "User" },
  { id: 2, value: "Admin", label: "Admin" },
  { id: 3, value: "Module Owner", label: "Module Owner" },
  { id: 4, value: "School Management", label: "School Management" },
  { id: 5, value: "Clerical", label: "Clerical" },
  { id: 6, value: "Adhoc", label: "Adhoc" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    margin: theme.spacing(1),
    width: "26ch",
  },
  textLabel: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: "26ch",
  },
  textFieldFull: {
    margin: theme.spacing(1),
    width: "54ch",
  },
}));

const UserAdminAddModal = () => {
  const classes = useStyles();
  const userAdminContext = useContext(UserAdminContext);
  const {
    addUser,
    clearCurrent,
    current,
    updateUser,
    setDialogClosed,
    toggleDialog,
  } = userAdminContext;

  useEffect(() => {
    if (current !== null) {
      setUser(current);
      console.log("Current being set from Modal", current);
    } else {
      setUser({
        dob: "2000-01-01",
        email: "",
        emailVerificationToken: "",
        emailVerificationTokenExpiresAt: "",
        emailVerified: false,
        userImg: "",
        firstName: "",
        lastName: "",
        password: "",
        password1: "",
        passwordResetToken: "",
        passwordResetTokenExpiresAt: "",
        payment: "",
        payment1: "",
        QUBID: "",
        role: "User",
        status: "Pending",
      });
    }
  }, [userAdminContext, current]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [user, setUser] = useState({
    dob: "",
    email: "",
    emailVerificationToken: "",
    emailVerificationTokenExpiresAt: "",
    emailVerified: false,
    userImg: "",
    firstName: "",
    lastName: "",
    password: "",
    password1: "",
    passwordResetToken: "",
    passwordResetTokenExpiresAt: "",
    payment: "",
    payment1: "",
    QUBID: "",
    role: "User",
    status: "Pending",
  });

  const {
    dob,
    email,
    firstName,
    lastName,
    password,
    password1,
    QUBID,
    role,
    status,
  } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onCloseDialog = () => {
    clearCurrent();
    clearAll();
    setDialogClosed();
  };

  const passwordReset = () => {
    onCloseDialog();
    enqueueSnackbar(`Password Reset Sent`, {
      variant: "success",
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (current === null) {
      if (password !== password1) {
        enqueueSnackbar(`Password Error! Check Passwords Match`, {
          variant: "error",
        });
      } else {
        addUser(user);
        onCloseDialog();
        enqueueSnackbar(`User Added`, {
          variant: "success",
        });
      }
    } else {
      updateUser(user);
      onCloseDialog();
      enqueueSnackbar(`User Updated`, {
        variant: "success",
      });
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <div>
      <Dialog
        open={toggleDialog}
        onClose={onCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        {current ? (
          <DialogTitle id="form-dialog-title">Edit a user</DialogTitle>
        ) : (
          <DialogTitle id="form-dialog-title">Add a user</DialogTitle>
        )}

        <DialogContent>
          {current ? (
            <DialogContentText>
              To edit a new user please update the fields fields below
            </DialogContentText>
          ) : (
            <DialogContentText>
              To add a new user please complete all fields below
            </DialogContentText>
          )}
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                className={classes.textField}
                required
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={onChange}
                label="First Name"
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                required
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={onChange}
                label="Last Name"
                variant="outlined"
              />
              <TextField
                required
                className={classes.textFieldFull}
                id="email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={onChange}
                label="Email Address"
                variant="outlined"
              />
              <TextField
                required
                className={classes.textField}
                id="dob"
                type="date"
                name="dob"
                value={dob}
                onChange={onChange}
                label="Date Of Birth"
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                required
                id="QUBID"
                type="text"
                name="QUBID"
                placeholder="QUB ID"
                value={QUBID}
                onChange={onChange}
                label="QUB ID"
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                select
                variant="outlined"
                id="status"
                name="status"
                label="Select Status"
                value={status}
                onChange={onChange}
              >
                {statusMenu.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                className={classes.textField}
                select
                variant="outlined"
                id="role"
                name="role"
                label="Select Role"
                value={role}
                onChange={onChange}
              >
                {roleMenu.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <div>
                {current ? (
                  ""
                ) : (
                  <>
                    <FormLabel className={classes.textLabel} component="legend">
                      Set Password
                    </FormLabel>
                    <TextField
                      className={classes.textField}
                      required
                      id="password"
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="Set Password"
                      value={password}
                      onChange={onChange}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      required
                      id="password1"
                      label="Password"
                      type="password"
                      name="password1"
                      placeholder="Repeat Password"
                      value={password1}
                      onChange={onChange}
                      variant="outlined"
                    />
                  </>
                )}
              </div>
            </div>
          </form>
          <DialogActions>
            {current ? (
              <>
                <Button onClick={passwordReset} color="primary">
                  Password Reset
                </Button>
                <Button onClick={onCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={onSubmit} color="primary">
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={onSubmit} color="primary">
                  Submit
                </Button>
              </>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdminAddModal;
