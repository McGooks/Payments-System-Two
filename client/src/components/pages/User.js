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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
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
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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

const countryMenu = [
  { id: 1, value: "England", label: "England" },
  { id: 2, value: "Scotland", label: "Scotland" },
  { id: 3, value: "Wales", label: "Wales" },
  { id: 4, value: "Northern Ireland", label: "Northern Ireland" },
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
  taxText: {
    textAlign: "center",
    marginBottom: 30,
    marginTop: 30,
    fontWeight: "bold",
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
    street: "",
    city: "",
    county: "",
    country: "",
    postcode: "",
    mobile: "",
    landline: "",
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

  const handleChangePassword = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  }

  const onChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

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
                    <Tab label="TAX" icon={<BusinessCenterIcon />} />
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
                            required
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
                            required
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
                            id="contact-mobile"
                            type="tel"
                            name="contact-mobile"
                            placeholder="07000 000000"
                            value={user.mobile}
                            onChange={onChange}
                            label="Mobile Number"
                            variant="outlined"
                          />
                          <TextField
                            className={classes.textField}
                            id="contact-landline"
                            type="tel"
                            name="contact-landline"
                            placeholder="020 0000 0000"
                            value={user.landline}
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
                          id="address-street"
                          type="text"
                          name="address-street"
                          placeholder="Street Address"
                          value={user.street}
                          onChange={onChange}
                          label="Street Address"
                          variant="outlined"
                        />
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="address-city"
                          type="text"
                          name="address-city"
                          placeholder="City"
                          value={user.city}
                          onChange={onChange}
                          label="City"
                          variant="outlined"
                        />
                        <div>
                          <TextField
                            required
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="address-county"
                            name="address-county"
                            label="County"
                            value={user.county}
                            onChange={onChange}
                          >
                            {Counties.map((option) => (
                              <MenuItem key={option.id} value={option.name}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            required
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="address-country"
                            name="address-country"
                            label="Country"
                            value={user.country}
                            onChange={onChange}
                          >
                            {countryMenu.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                        <TextField
                          required
                          className={classes.textField}
                          id="address-postcode"
                          type="text"
                          name="address-postcode"
                          placeholder="Postcode"
                          value={user.postcode}
                          onChange={onChange}
                          label="Postcode"
                          variant="outlined"
                        />
                        <Typography
                          variant="h6"
                          weight="medium"
                          className={classes.Subtext}
                        >
                          Bank Information
                        </Typography>
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="bank-name"
                          type="text"
                          name="bank-name"
                          placeholder="Bank Name"
                          value={user.bankName}
                          onChange={onChange}
                          label="Bank Name"
                          variant="outlined"
                        />
                        <TextField
                          required
                          className={classes.textFieldFull}
                          id="bank-branch-name"
                          type="text"
                          name="bank-branch-name"
                          placeholder="Branch Name"
                          value={user.branchName}
                          onChange={onChange}
                          label="Branch Name"
                          variant="outlined"
                        />
                        <div>
                          <TextField
                            required
                            className={classes.textField}
                            id="bank-sort-code"
                            type="text"
                            name="bank-sort-code"
                            placeholder="Sort Code"
                            value={user.sortCode}
                            onChange={onChange}
                            label="Sort Code"
                            variant="outlined"
                          />{" "}
                          <TextField
                            required
                            className={classes.textField}
                            id="bank-account-number"
                            type="text"
                            name="bank-account-number"
                            placeholder="Account Number"
                            value={user.accNumber}
                            onChange={onChange}
                            label="Account Number"
                            variant="outlined"
                          />
                        </div>
                        <TextField
                          className={classes.textFieldFull}
                          id="bank-building-society-number"
                          type="text"
                          name="bank-building-society-number"
                          placeholder="Building Society Number"
                          value={user.buildingSocietyNumber}
                          onChange={onChange}
                          label="Building Society Number"
                          variant="outlined"
                        />
                      </>
                    ) : tab === 2 ? (
                      <>
                        <Typography
                          variant="h5"
                          weight="medium"
                          className={classes.text}
                        >
                          Tax Declaration
                        </Typography>
                        <Typography variant="p" className={classes.taxText}>
                          <p>Employee Statement 1</p>
                          You need to select only one of the following
                          statements A, B or C, if you do not have a P45 or the
                          leaving date on your P45 is before last 6th April.
                        </Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            name="employeeStatements-section1"
                            value={user.Section1}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={1}>
                                <Typography variant="p" weight="medium">
                                  A
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography variant="p" weight="medium">
                                  This is my first job since last 6 April and I
                                  have not been receiving taxable Jobseeker’s
                                  Allowance, Employment and Support Allowance,
                                  taxable A Incapacity Benefit, State or
                                  Occupational Pension.
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value="A"
                                  control={<Radio />}
                                  label="A"
                                />
                              </Grid>
                              <Grid item xs={1}>
                                <Typography variant="p" weight="medium">
                                  B
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography variant="p" weight="medium">
                                  This is now my only job but since last 6 April
                                  I have had another job, or received taxable
                                  Jobseeker’s Allowance, Employment and Support
                                  Allowance or taxable Incapacity Benefit. I do
                                  not receive a State or B Occupational Pension.
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value="B"
                                  control={<Radio />}
                                  label="B"
                                />
                              </Grid>
                              <Grid item xs={1}>
                                <Typography variant="p" weight="medium">
                                  C
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography variant="p" weight="medium">
                                  As well as my new job, I have another job or
                                  receive a State or Occupational Pension.
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value="C"
                                  control={<Radio />}
                                  label="C"
                                />
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                        <br></br>
                        <hr></hr>
                        <Typography variant="p" className={classes.taxText}>
                          <p>Employee Statement 2</p>
                          Please select the statement which applies to you
                        </Typography>

                        <FormControl component="fieldset">
                          <RadioGroup
                            name="employeeStatements-section2"
                            value={user.Section2}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={1}>
                                <Typography variant="p" weight="medium">
                                  1
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography variant="p" weight="medium">
                                  I am an EU/EEA/Swiss National
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value="1"
                                  control={<Radio />}
                                  label="1"
                                />
                              </Grid>
                              <Grid item xs={1}>
                                <Typography variant="p" weight="medium">
                                  2
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography variant="p" weight="medium">
                                  I am a Non-EU/EEA/Swiss National (I agree to
                                  the terms and conditions below)
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value="2"
                                  control={<Radio />}
                                  label="2"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <p>
                                    Please Note: C Current Tier 4 students
                                    cannot be engaged via the NSP payroll. If
                                    you are a Tier 4 student, please contact
                                    OnCampus jobs ext: 3953 in the first
                                    instance.
                                  </p>
                                  <br></br>
                                  <p>
                                    If you are subject to any other restrictions
                                    on your visa, completion of this form
                                    confirms you fully understand any
                                    restrictions on working hours of your
                                    immigration permission and you agree to
                                    abide by those restrictions
                                  </p>
                                </Typography>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                        <br></br>
                        <hr></hr>
                        <Typography variant="p" className={classes.taxText}>
                          <p>Section 3</p>
                          Student Loan Declaration
                          <br></br>
                        </Typography>
                        <p>
                          Please read the following questions carefully and
                          select the statement which applies to you.
                        </p>
                        <FormControl component="fieldset">
                          <RadioGroup
                            name="student-loan-declaration-section3-Q1"
                            value={user.Section3Q1}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <br></br>
                                  <p>Question 1:</p> Have you left full-time
                                  education before the last 6th April?
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="true"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <Typography variant="p" weight="medium">
                                  (Go to Question 2)
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="false"
                                  control={<Radio />}
                                  label="No"
                                />
                                <Typography variant="p" weight="medium">
                                  (Sign the declaration below)
                                </Typography>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          <RadioGroup
                            name="employeeStatements-section3-Q2"
                            value={user.Section3Q2}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <br></br>
                                  <p>Question 2:</p> Do you have a Student Loan
                                  which is not fully repaid?
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="true"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <Typography variant="p" weight="medium">
                                  (Go to Question 3)
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="false"
                                  control={<Radio />}
                                  label="No"
                                />
                                <Typography variant="p" weight="medium">
                                  (Sign the declaration below)
                                </Typography>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          <RadioGroup
                            name="employeeStatements-section3-Q3"
                            value={user.Section3Q3}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <br></br>
                                  <p>Question 3:</p> Are you repaying your
                                  Student Loan direct to the Student Loan
                                  Company by agreed monthly payments?
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="true"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <Typography variant="p" weight="medium">
                                  (Sign the declaration below)
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="false"
                                  control={<Radio />}
                                  label="No"
                                />
                                <Typography variant="p" weight="medium">
                                  (Go to Question 4)
                                </Typography>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                      
                          <RadioGroup
                            name="employeeStatements-section3-Q4"
                            value={user.Section3Q4}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <br></br>
                                  <p>Question 4 - Student Load Plans:</p>
                                  <p>Please select Plan 1 or Plan 2</p>
                                  <br></br>
                                  <p>You will have a Plan 1 Student Loan if:</p>
                                </Typography>

                                <p style={{ marginLeft: "30px" }}>
                                  You lived in Scotland or Northern Ireland when
                                  you started your course, or
                                </p>
                                <p style={{ marginLeft: "30px" }}>
                                  You lived in England or Wales and started your
                                  course before 1st September 2012
                                </p>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="1"
                                  control={<Radio />}
                                  label="Plan 1"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="2"
                                  control={<Radio />}
                                  label="Plan 2"
                                />
                              </Grid>
                            </Grid>
                          </RadioGroup>
                          <RadioGroup
                            name="employeeStatements-section3-Q5"
                            value={user.Section3Q5}
                            onChange={onChange}
                          >
                            <Grid
                              className={classes.taxAlign}
                              xs={12}
                              container
                              spacing={3}
                              alignItems={"center"}
                            >
                              <Grid item xs={12}>
                                <Typography variant="p" weight="medium">
                                  <br></br>
                                  <p>
                                    Question 5 - Post Graduate Student Loan:
                                  </p>
                                  <p>
                                    Have you left full-time education before the
                                    last 6th April and have a Post Graduate
                                    Student Loan which is not fully repaid which
                                    is not being repaid via Direct Debit to the
                                    Student Loan Company?
                                  </p>
                                  <br></br>
              
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="true"
                                  control={<Radio />}
                                  label="Yes"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  value="false"
                                  control={<Radio />}
                                  label="No"
                                />
                              </Grid>
                            </Grid>
                          </RadioGroup>
                      
                        </FormControl>
                        <Typography variant="p" className={classes.taxText}>
                          <p>Declaration</p>
                          Please click the save button below to sign
                          <br></br>
                        </Typography>
                      </>
                    ) : tab === 3 ? (
                      <>
                        <Typography
                          variant="h5"
                          weight="medium"
                          className={classes.text}
                        >
                          Change your password
                        </Typography>
                        <TextField
                        className={classes.textFieldFull}
                          id="password-current"
                          type="password"
                          name="currentPassword"
                          placeholder="Current Password"
                          value={password.currentPassword || ""}
                          onChange={handleChangePassword}
                          label="Current Password"
                          variant="outlined"
                          helperText={"Forgot Password?"}
                        />
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
                      </>
                    ) : (""
                      // <>
                      //   <Typography
                      //     variant={"h5"}
                      //     weight={"medium"}
                      //     style={{ marginBottom: 35 }}
                      //   >
                      //     Settings
                      //   </Typography>
                      //   <FormControl
                      //     variant="outlined"
                      //     style={{ marginBottom: 35 }}
                      //   >
                      //     <Select
                      //       labelId="demo-simple-select-outlined-label"
                      //       id="demo-simple-select-outlined"
                      //       value={10}
                      //     >
                      //       <MenuItem value={10}>English</MenuItem>
                      //       <MenuItem value={20}>Admin</MenuItem>
                      //       <MenuItem value={30}>Super Admin</MenuItem>
                      //     </Select>
                      //   </FormControl>
                      //   <Typography weight={"bold"}>Communication:</Typography>
                      //   <Box display={"flex"}>
                      //     <FormControlLabel
                      //       control={
                      //         <Checkbox
                      //           checked
                      //           name="checkedB"
                      //           color="secondary"
                      //         />
                      //       }
                      //       label="Email"
                      //     />
                      //     <FormControlLabel
                      //       control={
                      //         <Checkbox name="checkedB" color="secondary" />
                      //       }
                      //       label="Messages"
                      //     />
                      //     <FormControlLabel
                      //       control={
                      //         <Checkbox name="checkedB" color="secondary" />
                      //       }
                      //       label="Phone"
                      //     />
                      //   </Box>
                      //   <Box display={"flex"} mt={2} alignItems={"center"}>
                      //     <Typography weight={"medium"}>
                      //       Email notification
                      //     </Typography>
                      //     <Switch color={"primary"} checked />
                      //   </Box>
                      //   <Box
                      //     display={"flex"}
                      //     mt={2}
                      //     mb={2}
                      //     alignItems={"center"}
                      //   >
                      //     <Typography weight={"medium"}>
                      //       Send copy to personal email
                      //     </Typography>
                      //     <Switch color={"primary"} />
                      //   </Box>
                      // </>
                    )}
                    <Box>

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
