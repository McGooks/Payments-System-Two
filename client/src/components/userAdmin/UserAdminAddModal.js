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
    width: "47%",
  },
  textLabel: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    width: "26ch",
  },
  textFieldFull: {
    margin: theme.spacing(1),
    width: "97%",
  },
  text: {
    textAlign: "center",
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
    error,
  } = userAdminContext;

  useEffect(() => {
    if (current !== null) {
      setUser(current);
      console.log("Current being set from Modal", current);
    } else {
      setUser({
        address: {
          street: ".",
          city: ".",
          county: ".",
          country: ".",
          postcode: ".",
        },
        contact: {
          mobile: "",
          landline: "",
        },

        bankName: "",
        branchName: "",
        sortCode: "100000",
        accNumber: "10000000",
        buildingSocietyNumber: "",

        dob: "2000-01-01",
        email: "glennyboi1@me.com",
        emailTokenIssued: "",
        emailTokenExpiry: "",
        emailVerified: false,
        emailVerifiedDate: "",
        firstName: "Louisa",
        lastName: "Marshall",
        nino: "",
        password: "123456",
        password1: "123456",
        passwordResetToken: "",
        passwordResetTokenExpiresAt: "",
        pronoun: "",
        payment: "",
        payment1: "",
        QUBID: "10000000",
        qubSchool: "",
        role: "User",
        status: "Pending",
        title: "",
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
    bankName,
    branchName,
    sortcode,
    accNumber,
    buildingSocietyNumber,
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
    if (!error) {
      if (current === null) {
        if (password !== password1) {
          enqueueSnackbar(`Password Error! Check Passwords Match`, {
            variant: "error",
          });
        } else {
          addUser(user);
          onCloseDialog();
        }
      } else {
        updateUser(user);
        onCloseDialog();
        enqueueSnackbar(`User Updated`, {
          variant: "success",
        });
      }
      clearAll();
    } else {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
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
            <DialogContentText className={classes.text}>
              To edit a new user please update the fields fields below
            </DialogContentText>
          ) : (
            <DialogContentText className={classes.text}>
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
              {current ? (
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
              ) : (
                <TextField
                  className={classes.textField}
                  disabled
                  variant="outlined"
                  id="status"
                  name="status"
                  label="Select Status"
                  value="Pending"
                  onChange={onChange}
                />
              )}
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
            {current ? (
              <>
                <DialogActions>
                  <Button
                    onClick={passwordReset}
                    variant="outlined"
                    color="primary"
                  >
                    Password Reset
                  </Button>
                  <Button
                    onClick={onCloseDialog}
                    variant="outlined"
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={onSubmit} variant="outlined" color="primary">
                    Update
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                <DialogActions>
                  <Button
                    onClick={onCloseDialog}
                    variant="outlined"
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={onSubmit} variant="outlined" color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdminAddModal;
