import React, { useContext, useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
//State
import UserContext from "../../context/user/userContext";
import {
  titlesMenu,
  pronounMenu,
  countryMenu,
  Counties,
} from "../../utils/dropdowns";
//Components
import {
  Radio,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Tooltip,
  Button,
  Grid,
  Box,
  TextField,
  Tabs,
  Tab,
  Checkbox,
  Switch,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import clsx from "clsx";
import { useSnackbar } from "notistack";

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
    fontWeight: "bold",
  },
  taxTextSpacingTop: {
    marginTop: 30,
  },
  taxTextSpacingBottom: {
    marginBottom: 30,
  },
  Subtext: {
    margin: theme.spacing(1),
  },
}));

const User = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const userContext = useContext(UserContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { activeUser, isAdmin } = props;
  // console.log("active user is: ", activeUser._id)
  const {
    user,
    current,
    getUser,
    setCurrent,
    loading,
    updateUser,
  } = userContext;

  useEffect(() => {
    if (current !== null) {
      setData(current);
    } else {
      getUser(id);
      setCurrent(user);
    }
  }, [userContext, current]);

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [data, setData] = useState({
    address: [
      {
        street: "",
        city: "",
        county: "",
        country: "",
        postcode: "",
      },
    ],
    contact: [
      {
        mobile: "",
        landline: "",
      },
    ],
    bank: [
      {
        bankName: "",
        branchName: "",
        sortCode: "",
        accNumber: "",
        buildingSocietyNumber: "",
      },
    ],
    dob: "",
    email: "",
    emailTokenIssued: "",
    emailTokenExpiry: "",
    emailVerified: false,
    emailVerifiedDate: "",
    firstName: "",
    lastName: "",
    nino: "",
    password: "",
    password1: "",
    passwordResetToken: "",
    passwordResetTokenExpiresAt: "",
    pronoun: "",
    payment: "",
    payment1: "",
    QUBID: "",
    qubSchool: "",
    role: "",
    status: "",
    title: "",
    taxDeclaration: [
      {
        employeeStatements_section1: "A",
        employeeStatements_section2: 1,
        employeeStatements_section3q1: false,
        employeeStatements_section3q2: false,
        employeeStatements_section3q3: false,
        employeeStatements_section3q4: 1,
        employeeStatements_section3q5: false,
        signed: false,
      },
    ],
  });

  const [tab, setTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    updateUser(data);
    enqueueSnackbar("User Profile Updated", {
      variant: "success",
    });
  };
  const handleUpdatePassword = () => {
    console.log("Update Password Test");
  };
  const handleChangePassword = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };
  const onChange = (e, i) => {
    switch (i) {
      case 1:
        data.address[0][e.target.name] = e.target.value;
        setData({ ...data });
        break;
      case 2:
        data.bank[0][e.target.name] = e.target.value;
        setData({ ...data });
        break;
      case 3:
        data.contact[0][e.target.name] = e.target.value;
        setData({ ...data });
        break;
      case 4:
        data.taxDeclaration[0][e.target.name] = e.target.value;
        setData({ ...data });
        break;
      default:
        setData({
          ...data,
          [e.target.name]: e.target.value,
        });
    }
  };
  const handleSwitchChange = (e) => {
    data.taxDeclaration[0][e.target.name] = e.target.checked;
    setData({ ...data });
  };

  return (
    <Fragment>
      <div>
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
                {/* <Tab label="CHANGE PASSWORD" icon={<LockIcon />} /> */}
                {/* <Tab label="SETTINGS" icon={<SettingsIcon />} /> */}
              </Tabs>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid item justify={"center"} container>
              <Box display={"flex"} flexDirection={"column"} width={600}>
                <form>
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
                          value={data.QUBID}
                          onChange={onChange}
                          label="QUB ID"
                          variant="outlined"
                        />
                        {current && current.status !== "Pending" ? (
                          <Tooltip
                            title={`Verified on: ${moment(
                              data.emailVerifiedDate
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
                              value={data.status}
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
                            value={data.status}
                            onChange={onChange}
                            helperText="Please verify your email"
                          />
                        )}
                      </div>
                      <TextField
                        disabled
                        className={classes.textFieldFull}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={data.email}
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
                        value={data.role}
                        onChange={onChange}
                      />
                      <TextField
                        disabled
                        className={classes.textFieldFull}
                        variant="outlined"
                        id="qubSchool"
                        name="qubSchool"
                        label="QUB School"
                        value={data.qubSchool}
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
                          value={data.title}
                          onChange={(e) => onChange(e)}
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
                          value={data.pronoun}
                          onChange={(e) => onChange(e)}
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
                          value={data.firstName}
                          onChange={(e) => onChange(e)}
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
                          value={data.lastName}
                          onChange={(e) => onChange(e)}
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
                          value={data.dob}
                          onChange={(e) => onChange(e)}
                          label="Date Of Birth"
                          variant="outlined"
                        />
                        <TextField
                          className={classes.textField}
                          required
                          id="nino"
                          type="text"
                          name="nino"
                          placeholder="XX000000X"
                          value={data.nino}
                          onChange={(e) => onChange(e)}
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
                          value={data.contact[0].mobile}
                          onChange={(e) => onChange(e, 3)}
                          label="Mobile Number"
                          variant="outlined"
                        />
                        <TextField
                          className={classes.textField}
                          id="landline"
                          type="tel"
                          name="landline"
                          placeholder="020 0000 0000"
                          value={data.contact[0].landline}
                          onChange={(e) => onChange(e, 3)}
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
                        id="street"
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={data.address[0].street}
                        onChange={(e) => onChange(e, 1)}
                        label="Street Address"
                        variant="outlined"
                      />
                      <TextField
                        required
                        className={classes.textFieldFull}
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={data.address[0].city}
                        onChange={(e) => onChange(e, 1)}
                        label="City"
                        variant="outlined"
                      />
                      <div>
                        <TextField
                          required
                          className={classes.textField}
                          select
                          variant="outlined"
                          id="county"
                          name="county"
                          label="County"
                          value={data.address[0].county}
                          onChange={(e) => onChange(e, 1)}
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
                          id="country"
                          name="country"
                          label="Country"
                          value={data.address[0].country}
                          onChange={(e) => onChange(e, 1)}
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
                        id="postcode"
                        type="text"
                        name="postcode"
                        placeholder="Postcode"
                        value={data.address[0].postcode}
                        onChange={(e) => onChange(e, 1)}
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
                        id="bankName"
                        type="text"
                        name="bankName"
                        placeholder="Bank Name"
                        value={data.bank[0].bankName}
                        onChange={(e) => onChange(e, 2)}
                        label="Bank Name"
                        variant="outlined"
                      />
                      <TextField
                        required
                        className={classes.textFieldFull}
                        id="branchName"
                        type="text"
                        name="branchName"
                        placeholder="Branch Name"
                        value={data.bank[0].branchName}
                        onChange={(e) => onChange(e, 2)}
                        label="Branch Name"
                        variant="outlined"
                      />
                      <div>
                        <TextField
                          required
                          className={classes.textField}
                          id="sortCode"
                          type="text"
                          name="sortCode"
                          placeholder="Sort Code"
                          value={data.bank[0].sortCode}
                          onChange={(e) => onChange(e, 2)}
                          label="Sort Code"
                          variant="outlined"
                        />
                        <TextField
                          required
                          className={classes.textField}
                          id="accNumber"
                          type="text"
                          name="accNumber"
                          placeholder="Account Number"
                          value={data.bank[0].accNumber}
                          onChange={(e) => onChange(e, 2)}
                          label="Account Number"
                          variant="outlined"
                        />
                      </div>
                      <TextField
                        className={classes.textFieldFull}
                        id="buildingSocietyNumber"
                        type="text"
                        name="buildingSocietyNumber"
                        placeholder="Building Society Number"
                        value={data.bank[0].buildingSocietyNumber}
                        onChange={(e) => onChange(e, 2)}
                        label="Building Society Number"
                        variant="outlined"
                      />
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
                      <Typography className={classes.taxText}>
                        <h2>Section 1</h2>
                        <h3>Employee Statement</h3>
                        <p>
                          You need to select only one of the following
                          statements A, B or C, if you do not have a P45 or the
                          leaving date on your P45 is before last 6th April.
                        </p>
                      </Typography>
                      <FormControl
                        disabled={data.taxDeclaration[0].signed}
                        component="fieldset"
                        error={
                          data.taxDeclaration[0].signed &&
                          data.taxDeclaration[0].employeeStatements_section1 ===
                            ""
                        }
                      >
                        <RadioGroup
                          className={clsx(
                            classes.taxTextSpacingTop,
                            classes.taxTextSpacingBottom
                          )}
                          name="employeeStatements_section1"
                          value={
                            data.taxDeclaration[0].employeeStatements_section1
                          }
                          onChange={(e) => onChange(e, 4)}
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
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section1 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={1}>
                              <Typography variant="p" weight="medium">
                                B
                              </Typography>
                            </Grid>
                            <Grid item xs={10}>
                              <Typography variant="p" weight="medium">
                                This is now my only job but since last 6 April I
                                have had another job, or received taxable
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
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section1 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
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
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section1 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      </FormControl>
                      <hr></hr>
                      <Typography
                        className={clsx(
                          classes.taxText,
                          classes.taxTextSpacingTop
                        )}
                      >
                        <h2>Section 2</h2>
                        <h3>Employee Statement</h3>
                        <p>Please select the statement which applies to you</p>
                      </Typography>

                      <FormControl
                        disabled={data.taxDeclaration[0].signed}
                        component="fieldset"
                        error={
                          data.taxDeclaration[0].signed &&
                          data.taxDeclaration[0].employeeStatements_section2 ===
                            ""
                        }
                      >
                        <RadioGroup
                          className={clsx(
                            classes.taxTextSpacingTop,
                            classes.taxTextSpacingBottom
                          )}
                          name="employeeStatements_section2"
                          value={
                            data.taxDeclaration[0].employeeStatements_section2
                          }
                          onChange={(e) => onChange(e, 4)}
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
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section2 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={1}>
                              <Typography variant="p" weight="medium">
                                2
                              </Typography>
                            </Grid>
                            <Grid item xs={10}>
                              <Typography variant="p" weight="medium">
                                I am a Non-EU/EEA/Swiss National (I agree to the
                                terms and conditions below)
                              </Typography>
                            </Grid>
                            <Grid item xs={1}>
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2"
                              />
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section2 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="p" weight="medium">
                                <p>
                                  Please Note: Current Tier 4 students cannot be
                                  engaged via the NSP payroll. If you are a Tier
                                  4 student, please contact OnCampus jobs ext:
                                  3953 in the first instance.
                                </p>
                                <br></br>
                                <p>
                                  If you are subject to any other restrictions
                                  on your visa, completion of this form confirms
                                  you fully understand any restrictions on
                                  working hours of your immigration permission
                                  and you agree to abide by those restrictions
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      </FormControl>
                      <hr></hr>
                      <Typography
                        className={clsx(
                          classes.taxText,
                          classes.taxTextSpacingTop
                        )}
                      >
                        <h2>Section 3</h2>
                        <p>Student Loan Declaration</p>
                        <p>
                          Please read the following questions carefully and
                          select the statement which applies to you.
                        </p>
                      </Typography>
                      <FormControl
                        disabled={data.taxDeclaration[0].signed}
                        component="fieldset"
                        error={
                          (data.taxDeclaration[0].signed &&
                            data.taxDeclaration[0]
                              .employeeStatements_section1 === "") ||
                          data.taxDeclaration[0].employeeStatements_section2 ===
                            "" ||
                          data.taxDeclaration[0]
                            .employeeStatements_section3q1 === "" ||
                          (data.taxDeclaration[0]
                            .employeeStatements_section3q1 === "true" &&
                            data.taxDeclaration[0]
                              .employeeStatements_section3q2 === "") ||
                          (data.taxDeclaration[0]
                            .employeeStatements_section3q2 === "true" &&
                            data.taxDeclaration[0]
                              .employeeStatements_section3q3 === "") ||
                          (data.taxDeclaration[0]
                            .employeeStatements_section3q3 === "false" &&
                            data.taxDeclaration[0]
                              .employeeStatements_section3q4 === "") ||
                          data.taxDeclaration[0]
                            .employeeStatements_section3q5 === ""
                        }
                      >
                        <RadioGroup
                          className={clsx(
                            classes.taxTextSpacingTop,
                            classes.taxTextSpacingBottom
                          )}
                          name="employeeStatements_section3q1"
                          value={
                            data.taxDeclaration[0].employeeStatements_section3q1
                          }
                          onChange={(e) => onChange(e, 4)}
                        >
                          <Grid
                            className={classes.taxAlign}
                            xs={12}
                            container
                            spacing={3}
                            alignItems={"center"}
                          >
                            <Grid item xs={12}>
                              <Typography weight="medium">
                                <p>Question 1:</p>
                                <p>
                                  Have you left full-time education before the
                                  last 6th April?
                                </p>
                              </Typography>
                              <FormHelperText>
                                {data.taxDeclaration[0].signed &&
                                data.taxDeclaration[0]
                                  .employeeStatements_section3q1 === ""
                                  ? "Required"
                                  : ""}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControlLabel
                                value={"true"}
                                control={<Radio />}
                                label="Yes"
                              />
                              <Typography variant="p" weight="medium">
                                (Go to Question 2)
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControlLabel
                                value={"false"}
                                control={<Radio />}
                                label="No"
                              />
                              <Typography variant="p" weight="medium">
                                (Sign the declaration below)
                              </Typography>
                            </Grid>
                          </Grid>
                        </RadioGroup>
                        {data.taxDeclaration[0]
                          .employeeStatements_section3q1 === "true" ? (
                          <>
                            <RadioGroup
                              className={clsx(classes.taxTextSpacingBottom)}
                              name="employeeStatements_section3q2"
                              value={
                                data.taxDeclaration[0]
                                  .employeeStatements_section3q2
                              }
                              onChange={(e) => onChange(e, 4)}
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
                                    <p>Question 2:</p>
                                    <p>
                                      Do you have a Student Loan which is not
                                      fully repaid?
                                    </p>
                                  </Typography>
                                  <FormHelperText>
                                    {data.taxDeclaration[0].signed &&
                                    data.taxDeclaration[0]
                                      .employeeStatements_section3q2 === ""
                                      ? "Required"
                                      : ""}
                                  </FormHelperText>
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
                            {data.taxDeclaration[0]
                              .employeeStatements_section3q2 === "true" ? (
                              <>
                                <RadioGroup
                                  className={clsx(classes.taxTextSpacingBottom)}
                                  name="employeeStatements_section3q3"
                                  value={
                                    data.taxDeclaration[0]
                                      .employeeStatements_section3q3
                                  }
                                  onChange={(e) => onChange(e, 4)}
                                >
                                  <Grid
                                    className={classes.taxAlign}
                                    xs={12}
                                    container
                                    spacing={3}
                                    alignItems={"center"}
                                  >
                                    <Grid item xs={12}>
                                      <Typography weight="medium">
                                        <p>Question 3:</p>
                                        <p>
                                          Are you repaying your Student Loan
                                          direct to the Student Loan Company by
                                          agreed monthly payments?
                                        </p>
                                      </Typography>
                                      <FormHelperText>
                                        {data.taxDeclaration[0].signed &&
                                        data.taxDeclaration[0]
                                          .employeeStatements_section3q3 === ""
                                          ? "Required"
                                          : ""}
                                      </FormHelperText>
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
                                {data.taxDeclaration[0]
                                  .employeeStatements_section3q3 === "false" ? (
                                  <>
                                    <RadioGroup
                                      className={clsx(
                                        classes.taxTextSpacingBottom
                                      )}
                                      name="employeeStatements_section3q4"
                                      value={
                                        data.taxDeclaration[0]
                                          .employeeStatements_section3q4
                                      }
                                      onChange={(e) => onChange(e, 4)}
                                    >
                                      <Grid
                                        className={classes.taxAlign}
                                        xs={12}
                                        container
                                        spacing={3}
                                        alignItems={"center"}
                                      >
                                        <Grid item xs={12}>
                                          <Typography weight="medium">
                                            <p>Question 4:</p>
                                            <p>
                                              Student Load Plans - Please select
                                              Plan 1 or Plan 2
                                            </p>
                                            <em>
                                              <div
                                                style={{
                                                  paddingLeft: 30,
                                                  paddingTop: 10,
                                                }}
                                              >
                                                <p>
                                                  Note: You will have a Plan 1
                                                  student loan if:
                                                </p>
                                                <ol>
                                                  <li>
                                                    You lived in Scotland or
                                                    Northern Ireland when you
                                                    started your course, or
                                                  </li>
                                                  <li>
                                                    You lived in England or
                                                    Wales and started your
                                                    course before 1st September
                                                    2012
                                                  </li>
                                                </ol>
                                              </div>
                                            </em>
                                            <FormHelperText>
                                              {data.taxDeclaration[0].signed &&
                                              data.taxDeclaration[0]
                                                .employeeStatements_section3q4 ===
                                                ""
                                                ? "Required"
                                                : ""}
                                            </FormHelperText>
                                          </Typography>
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
                                      className={clsx(
                                        classes.taxTextSpacingBottom
                                      )}
                                      name="employeeStatements_section3q5"
                                      checked={
                                        data.taxDeclaration[0]
                                          .employeeStatements_section3q5
                                      }
                                      onChange={(e) => onChange(e, 4)}
                                    >
                                      <Grid
                                        className={classes.taxAlign}
                                        xs={12}
                                        container
                                        spacing={3}
                                        alignItems={"center"}
                                      >
                                        <Grid item xs={12}>
                                          <Typography weight="medium">
                                            <p>Question 5:</p>
                                            <p>
                                              Post Graduate Student Loan - Have
                                              you left full-time education
                                              before the last 6th April and have
                                              a Post Graduate Student Loan which
                                              is not fully repaid which is not
                                              being repaid via Direct Debit to
                                              the Student Loan Company?
                                            </p>
                                            <FormHelperText>
                                              {data.taxDeclaration[0].signed &&
                                              data.taxDeclaration[0]
                                                .employeeStatements_section3q5 ===
                                                ""
                                                ? "Required"
                                                : ""}
                                            </FormHelperText>
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <FormControlLabel
                                            value="Yes"
                                            control={<Radio />}
                                            label="Yes"
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <FormControlLabel
                                            value="No"
                                            control={<Radio />}
                                            label="No"
                                          />
                                        </Grid>
                                      </Grid>
                                    </RadioGroup>
                                  </>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </FormControl>
                      {isAdmin ? (
                        <>
                          <Box
                            display={"flex"}
                            mt={2}
                            mb={2}
                            alignItems={"center"}
                          >
                            <Typography weight={"medium"}>
                              {
                                "I confirm the data provided is correct & hereby sign this declaration"
                              }
                            </Typography>
                            <Switch
                              checked={data.taxDeclaration[0].signed}
                              onChange={(e) => handleSwitchChange(e, 4)}
                              name="signed"
                              color={"secondary"}
                            />
                          </Box>
                          <Box>
                            <Button
                              disabled={
                                !data.taxDeclaration[0].signed ||
                                data.taxDeclaration[0]
                                  .employeeStatements_section1 === "" ||
                                data.taxDeclaration[0]
                                  .employeeStatements_section2 === "" ||
                                data.taxDeclaration[0]
                                  .employeeStatements_section3q1 === "" ||
                                (data.taxDeclaration[0]
                                  .employeeStatements_section3q1 === "true" &&
                                  data.taxDeclaration[0]
                                    .employeeStatements_section3q2 === "") ||
                                (data.taxDeclaration[0]
                                  .employeeStatements_section3q2 === "true" &&
                                  data.taxDeclaration[0]
                                    .employeeStatements_section3q3 === "") ||
                                (data.taxDeclaration[0]
                                  .employeeStatements_section3q3 === "false" &&
                                  data.taxDeclaration[0]
                                    .employeeStatements_section3q4 === "") ||
                                (data.taxDeclaration[0]
                                  .employeeStatements_section3q4 !== "" &&
                                  data.taxDeclaration[0]
                                    .employeeStatements_section3q5 === "")
                              }
                              size="large"
                              fullWidth={true}
                              className={classes.button}
                              onClick={(e) => onSubmit(e)}
                              color="secondary"
                              variant="contained"
                            >
                              Save
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          {data.taxDeclaration[0].signed ? (
                            <>
                              <Box
                                display={"flex"}
                                mt={2}
                                mb={2}
                                alignItems={"center"}
                              >
                                <Typography weight={"medium"}>
                                  {
                                    "I confirm the data provided is correct & hereby sign this declaration"
                                  }
                                </Typography>
                                <Switch
                                  disabled={
                                    data.taxDeclaration[0].signed ? true : false
                                  }
                                  checked={data.taxDeclaration[0].signed}
                                  onChange={(e) => handleSwitchChange(e, 4)}
                                  name="signed"
                                  color={"secondary"}
                                />
                              </Box>
                              <Box>
                                <Button
                                  disabled={
                                    !data.taxDeclaration[0].signed ||
                                    data.taxDeclaration[0]
                                      .employeeStatements_section1 === "" ||
                                    data.taxDeclaration[0]
                                      .employeeStatements_section2 === "" ||
                                    data.taxDeclaration[0]
                                      .employeeStatements_section3q1 === "" ||
                                    (data.taxDeclaration[0]
                                      .employeeStatements_section3q1 ===
                                      "true" &&
                                      data.taxDeclaration[0]
                                        .employeeStatements_section3q2 ===
                                        "") ||
                                    (data.taxDeclaration[0]
                                      .employeeStatements_section3q2 ===
                                      "true" &&
                                      data.taxDeclaration[0]
                                        .employeeStatements_section3q3 ===
                                        "") ||
                                    (data.taxDeclaration[0]
                                      .employeeStatements_section3q3 ===
                                      "false" &&
                                      data.taxDeclaration[0]
                                        .employeeStatements_section3q4 ===
                                        "") ||
                                    (data.taxDeclaration[0]
                                      .employeeStatements_section3q4 !== "" &&
                                      data.taxDeclaration[0]
                                        .employeeStatements_section3q5 === "")
                                  }
                                  size="large"
                                  fullWidth={true}
                                  className={classes.button}
                                  onClick={(e) => onSubmit(e)}
                                  color="secondary"
                                  variant="contained"
                                >
                                  Save
                                </Button>
                              </Box>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    // ) : tab === 3 ? (
                    //   <>
                    //     <Typography
                    //       variant="h5"
                    //       weight="medium"
                    //       className={classes.text}
                    //     >
                    //       Change your password
                    //     </Typography>
                    //     <TextField
                    //       className={classes.textFieldFull}
                    //       id="password-current"
                    //       type="password"
                    //       name="currentPassword"
                    //       placeholder="Current Password"
                    //       value={password.currentPassword || ""}
                    //       onChange={handleChangePassword}
                    //       label="Current Password"
                    //       variant="outlined"
                    //       helperText={"Forgot Password?"}
                    //     />
                    //     <TextField
                    //       className={classes.textFieldFull}
                    //       id="password-new"
                    //       type="password"
                    //       name="newPassword"
                    //       placeholder="New Password"
                    //       value={password.newPassword || ""}
                    //       onChange={handleChangePassword}
                    //       label="New Password"
                    //       variant="outlined"
                    //     />
                    //     <TextField
                    //       className={classes.textFieldFull}
                    //       id="password-new1"
                    //       type="password"
                    //       name="confirmPassword"
                    //       placeholder="Confirm New Password"
                    //       value={password.confirmPassword || ""}
                    //       onChange={handleChangePassword}
                    //       label="Confirm New Password"
                    //       variant="outlined"
                    //     />
                    //   </>
                    // ) : (
                    ""
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
                    //     <Switch color={"primary"} />
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
                </form>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default User;
