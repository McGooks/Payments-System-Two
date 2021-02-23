import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Fragment,
} from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import moment from "moment";
//State
import AuthContext from "../../context/auth/authContext";
import UserContext from "../../context/user/userContext";
import Counties from "../../utils/Counties.json";
//Components
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { Grid, Box, TextField } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import ProgressIndicator from "../layouts/Spinner";


const titlesMenu = [
  { id: 1, value: "Mr", label: "Mr" },
  { id: 2, value: "Mrs", label: "Mrs" },
  { id: 3, value: "Miss", label: "Miss" },
  { id: 4, value: "Dr", label: "Dr" },
  { id: 5, value: "Ms", label: "Ms" },
  { id: 6, value: "Prof", label: "Prof" },
  { id: 7, value: "Other", label: "Other" },
];

const pronounMenu = [
  { id: 1, value: "He/Him", label: "He/Him" },
  { id: 2, value: "She/Her", label: "She/Her" },
  { id: 3, value: "They/Them", label: "They/Them" },
  { id: 4, value: "Other", label: "Other" },
];

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
  text: {
    textAlign: "center",
    marginBottom: 30,
  },
  Subtext: {
    margin: theme.spacing(1),
  },
}));

const User = () => {
  const classes = useStyles();
  const { id } = useParams();
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  // const { user, loadUser, loading } = authContext;
  const { user, getUser, loading } = userContext;


  useEffect(() => {
    getUser(id);
    if (user === null) {
      setData(user);
      console.log(user);
    } else {
      getUser(id);
      console.log(user);
    }
  }, []);

  const [tab, setTab] = useState(0);
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [data, setData] = useState({
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

  //   const {
  //     dob,
  //     email,
  //     firstName,
  //     lastName,
  //     password,
  //     password1,
  //     QUBID,
  //     role,
  //     status,
  //   } = data;

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const location = useLocation();
  const history = useHistory();

  //   useEffect(() => {
  //       loadUser()
  //     if (location.pathname.includes("edit")) {
  //       setEditable(true);
  //     }
  //   }, [location.pathname]);

  // useEffect(() => {
  //     setData(managementValue.currentUser)
  // }, [managementDispatch, managementValue, id])

  function onSubmit() {}

  function handleUpdatePassword() {}

  function handleChangePassword(e) {
    // setPassword({
    //   ...password,
    //   [e.target.name]: e.target.value,
    // });
  }

  function onChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Fragment>
      <div>
        <div>
          {user !== null && !loading ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"center"}>
                  <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    value={tab}
                    onChange={handleChangeTab}
                  >
                    <Tab label="ACCOUNT" icon={<AccountBoxIcon />} />
                    <Tab label="PROFILE" icon={<PersonIcon />} />
                    <Tab label="CHANGE PASSWORD" icon={<LockIcon />} />
                    <Tab label="SETTINGS" icon={<SettingsIcon />} />
                  </Tabs>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid item justify={"center"} container>
                  <Box display={"flex"} flexDirection={"column"} width={600}>
                    {tab === 0 ? (
                      <>
                        <Typography
                          variant="h5"
                          weight="medium"
                          className={classes.text}
                        >
                          Edit your DemPay account details
                        </Typography>
                        <div>
                          <TextField
                            className={classes.textField}
                            disabled
                            id="QUBID"
                            type="text"
                            name="QUBID"
                            value={user.QUBID}
                            onChange={onChange}
                            label="QUB ID"
                            variant="outlined"
                          />
                          {user && user.status !== "Pending" ? (
                            <Tooltip
                              title={`Verified on: ${moment(
                                user.emailVerifiedDate
                              ).format("DD/MM/YYYY h:mm A")}`}
                              arrow
                            >
                              <TextField
                                className={classes.textField}
                                disabled
                                variant="outlined"
                                id="status"
                                name="status"
                                label="Status"
                                value={user.status}
                                onChange={onChange}
                              />
                            </Tooltip>
                          ) : (
                            <TextField
                              error
                              className={classes.textField}
                              disabled
                              variant="outlined"
                              id="status"
                              name="status"
                              label="Status"
                              value={user.status}
                              onChange={onChange}
                              helperText="Please verify your email"
                            />
                          )}
                        </div>
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={user.email}
                          onChange={onChange}
                          label="Email Address"
                          variant="outlined"
                        />
                        <TextField
                          disabled
                          className={classes.textFieldFull}
                          variant="outlined"
                          id="role"
                          name="role"
                          label="Role"
                          value={user.role}
                          onChange={onChange}
                        />
                      </>
                    ) : tab === 1 ? (
                      <>
                        <Typography
                          variant="h5"
                          weight="medium"
                          className={classes.text}
                        >
                          Edit your personal information
                        </Typography>
                        <Typography
                          variant="h6"
                          weight="medium"
                          className={classes.Subtext}
                        >
                          Personal information
                        </Typography>
                        <div>
                          <TextField
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="title"
                            name="title"
                            label="Title"
                            value={user.title}
                            onChange={onChange}
                          >
                            {titlesMenu.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="pronoun"
                            name="pronoun"
                            label="Pronoun"
                            value={user.pronoun}
                            onChange={onChange}
                          >
                            {pronounMenu.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                        <div>
                          <TextField
                            className={classes.textField}
                            required
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={user.firstName}
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
                            value={user.lastName}
                            onChange={onChange}
                            label="Last Name"
                            variant="outlined"
                          />
                        </div>
                        <div>
                          <TextField
                            required
                            className={classes.textField}
                            id="dob"
                            type="date"
                            name="dob"
                            value={user.dob}
                            onChange={onChange}
                            label="Date Of Birth"
                            variant="outlined"
                          />
                          <TextField
                            className={classes.textField}
                            required
                            id="NINO"
                            type="text"
                            name="NINO"
                            placeholder="XX000000X"
                            value={user.nino}
                            onChange={onChange}
                            label="National Insurance"
                            variant="outlined"
                          />
                        </div>
                        <div>
                          <TextField
                            className={classes.textField}
                            id="mobile"
                            type="tel"
                            name="mobile"
                            placeholder="07000 000000"
                            value={user.contact.mobile}
                            onChange={onChange}
                            label="Mobile Number"
                            variant="outlined"
                          />
                          <TextField
                            className={classes.textField}
                            id="landline"
                            type="tel"
                            name="landline"
                            placeholder="020 0000 0000"
                            value={user.contact.landline}
                            onChange={onChange}
                            label="Landline Number"
                            variant="outlined"
                          />
                        </div>
                        <Typography
                          variant="h6"
                          weight="medium"
                          className={classes.Subtext}
                        >
                          Address information
                        </Typography>
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="Street-Address"
                          type="text"
                          name="Street-Address"
                          placeholder="Street Address"
                          value={user.address.street}
                          onChange={onChange}
                          label="Street Address"
                          variant="outlined"
                        />
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="City"
                          type="text"
                          name="City"
                          placeholder="City"
                          value={user.address.city}
                          onChange={onChange}
                          label="City"
                          variant="outlined"
                        />
                        <TextField
                          className={classes.textField}
                          select
                          variant="outlined"
                          id="county"
                          name="county"
                          label="County"
                          value={user.address.county}
                          onChange={onChange}
                        >
                          {Counties.map((option) => (
                            <MenuItem key={option.id} value={option._id.county}>
                              {option._id.county}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"Company@gmail.com"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"1-353-969-7070"}
                        />
                        <Typography
                          variant={"h5"}
                          weight={"medium"}
                          style={{ marginBottom: 35 }}
                        >
                          Social
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"https://www.facebook.com/janejonson"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"https://twitter/janejonson"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"https://www.instagram.com/janejonson"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"https://github.com/janejonson"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"https://codepen.io/janejonson"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"@janejonson"}
                        />
                      </>
                    ) : tab === 2 ? (
                      <>
                        <Typography
                          variant={"h5"}
                          weight={"medium"}
                          style={{ marginBottom: 35 }}
                        >
                          Password
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"Current Password"}
                          value={password.currentPassword || ""}
                          name="currentPassword"
                          onChange={handleChangePassword}
                          helperText={"Forgot Password?"}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"New Password"}
                          value={password.newPassword || ""}
                          name="newPassword"
                          onChange={handleChangePassword}
                        />
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                          defaultValue={"Verify Password"}
                          value={password.confirmPassword || ""}
                          name="confirmPassword"
                          onChange={handleChangePassword}
                        />
                      </>
                    ) : (
                      <>
                        <Typography
                          variant={"h5"}
                          weight={"medium"}
                          style={{ marginBottom: 35 }}
                        >
                          Settings
                        </Typography>
                        <FormControl
                          variant="outlined"
                          style={{ marginBottom: 35 }}
                        >
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={10}
                          >
                            <MenuItem value={10}>English</MenuItem>
                            <MenuItem value={20}>Admin</MenuItem>
                            <MenuItem value={30}>Super Admin</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography weight={"bold"}>Communication:</Typography>
                        <Box display={"flex"}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked
                                name="checkedB"
                                color="secondary"
                              />
                            }
                            label="Email"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox name="checkedB" color="secondary" />
                            }
                            label="Messages"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox name="checkedB" color="secondary" />
                            }
                            label="Phone"
                          />
                        </Box>
                        <Box display={"flex"} mt={2} alignItems={"center"}>
                          <Typography weight={"medium"}>
                            Email notification
                          </Typography>
                          <Switch color={"primary"} checked />
                        </Box>
                        <Box
                          display={"flex"}
                          mt={2}
                          mb={2}
                          alignItems={"center"}
                        >
                          <Typography weight={"medium"}>
                            Send copy to personal email
                          </Typography>
                          <Switch color={"primary"} />
                        </Box>
                      </>
                    )}
                    <Box>
                      {tab !== 2 ? (
                        <>
                          <Button
                            size="large"
                            fullWidth={true}
                            className={classes.button}
                            onClick={onSubmit}
                            color="secondary"
                            variant="contained"
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outlined" color="primary">
                            Reset
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleUpdatePassword}
                          >
                            Save Password
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <ProgressIndicator />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default User;
