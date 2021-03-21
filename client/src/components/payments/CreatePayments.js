import React, {
  useContext,
  Fragment,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  deliveryCategory,
  semester,
  academicYear,
  schoolMenu,
  monthWords,
  yearsDD,
} from "../../utils/dropdowns";
//Context
import UserContext from "../../context/user/userContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";

//Components
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Input,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
import clsx from "clsx";
// import CustomToolbar from "../layouts/CustomToolbar";

const TAX_RATE = -0.20;
const AC1_RATE = 14.73;
const AC2_RATE = 17.57;
const BANDA_RATE = 15.01;
const BANDB_RATE = 20.01;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "right",
    color: theme.palette.text.secondary,
  },
  right: {
    textAlign: "right",
  },
  left: {
    textAlign: "left",
  },
  table: {
    minWidth: 700,
  },
  textField: {
    "& > *": {
      margin: theme.spacing(-1),
    },
  },
  inputField: {
    textAlign: "center",
  },
  inputCenter: {
    textAlign: "center",
    color: "black",
  },
}));

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(totals) {
  return totals.map(({ payment }) => payment).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const CreatePayment = () => {
  const classes = useStyles();
  const userAdminContext = useContext(UserAdminContext);
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const paymentContext = useContext(PaymentContext);
  const { user, loadUser } = authContext;
  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    payments,
    getPayments,
    loading,
    error,
    clearErrors,
    setDialogOpen,
    setCurrent,
    deletePayment,
  } = paymentContext;
  const { activeUsers, getActiveUsers } = userAdminContext;

  const history = useHistory();

  useEffect(() => {
    getActiveUsers();
    if (activeUsers !== null) {
      setUserSelect(activeUsers);
    } else {
      setUserSelect([
        {
          _id: 0,
          firstName: "",
          lastName: "",
          QUBID: "",
        },
      ]);
    }
    // console.log("activeUsers", activeUsers);
    // if(user.role !== "Admin") history.push("/")
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
  }, []);

  const [payment, setPayment] = useState({
    user: "",
    deliveredBy: "TA",
    school: "",
    academicYear: "2020/2021",
    paymentPeriod: "",
    paymentPeriodNum: "",
    semester: "Semester 1",
    QUBID: "",
    account: "",
    projectCode: "",
    projectName: "",
    subAnalysis: "",
    amount: 0.0,
    student_cohort: true,
    cohort_id: "00",
    paymentStatus: "Pending",
  });

  const [paymentCalc, setPaymentCalc] = useState({
    lecture: [
      {
        activity: "Prep - 1st delivery",
        paymentGrade: "",
        paymentRate: 0.0,
        time: 0,
        count: 0,
        totalhrs: 0.1,
        payment: 0.0,
      },
      {
        activity: "Prep - Repeat in same week (one repeat only)",
        paymentGrade: "",
        paymentRate: 0.0,
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Delivery",
        paymentGrade: "",
        paymentRate: 0.0,
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    seminar: [
      {
        activity: "Prep - 1st delivery (1hr)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Prep - 1st delivery (2hrs)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Prep - Repeat in same week (one repeat only)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Delivery",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    lab: [
      {
        activity: "Prep - 1st delivery (0.5hrs)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Prep - 1st delivery (1hr)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Prep - Repeat in same week (one repeat only)",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Delivery",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    fieldTrip: [
      {
        activity: "Number of contact hours",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    office: [
      {
        activity: "0.5 hours per seminar group per week",
        paymentGrade: "",
        time: 0.5,
        count: 1,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    marking: [
      {
        activity: "Exam / Non Exam / Coursework",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Exam / Non Exam / Coursework",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
      {
        activity: "Oral Exam",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
    training: [
      {
        activity: "Number of hours",
        paymentGrade: "",
        time: 0,
        count: 0,
        totalhrs: 0.0,
        payment: 0.0,
      },
    ],
  });
  // console.log("paymentCalc", paymentCalc);

  const reset = () => {
    payment.user = "";
    setPayment({
      user: "",
      deliveredBy: "",
      school: "",
      academicYear: "",
      paymentPeriod: "",
      paymentPeriodNum: "",
      semester: "",
      QUBID: "",
      account: "",
      projectCode: "",
      projectName: "",
      subAnalysis: "",
      amount: "",
      student_cohort: true,
      cohort_id: "",
      paymentStatus: "Pending",
    });
    setHourlyRates({
      rate1: 14.73,
      rate2: 17.57,
    });
    setIsDisabled(false);
  };
  const [hourlyRates, setHourlyRates] = useState({
    rate1: AC1_RATE,
    rate2: AC2_RATE,
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [grade, setGrade] = useState({
    grade1: "AC1",
    grade2: "AC2",
  });

  const onChange = (e, i, g, r) => {
    let rate = "";
    switch (i) {
      case 1:
        if (e.target.value === "TA") {
          setHourlyRates({
            rate1: ccyFormat(AC1_RATE),
            rate2: ccyFormat(AC2_RATE),
          });
          setGrade({
            grade1: "AC1",
            grade2: "AC2",
          });
        } else {
          setHourlyRates({
            rate1: ccyFormat(BANDA_RATE),
            rate2: ccyFormat(BANDB_RATE),
          });
          setGrade({
            grade1: "Band A",
            grade2: "Band B",
          });
        }
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
        break;
      case 2:
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
        break;
      case 3:
        r[e.target.name] = parseFloat(e.target.value);
        r.paymentGrade = g;
        if (r.paymentGrade === grade.grade1) {
          rate = hourlyRates.rate1;
        } else {
          rate = hourlyRates.rate2;
        }
        r.totalhrs = parseFloat(r.count * r.time);
        r.payment = parseFloat(r.totalhrs * rate);
        setPaymentCalc({ ...paymentCalc });
        break;
      case 4:
        r[e.target.name] = parseFloat(e.target.value);
        r.paymentGrade = g;
        if (r.paymentGrade === grade.grade1) {
          rate = hourlyRates.rate1;
        } else {
          rate = hourlyRates.rate2;
        }
        r.payment = parseFloat(r.totalhrs * rate);
        setPaymentCalc({ ...paymentCalc });
        break;
      default:
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
    }
  };

  if (payments !== null && payments.length === 0 && !loading) {
    return <h4>You have no payments recorded</h4>; // if user list is empty
  }

  const openDialog = (e, dataIndex) => {
    e.preventDefault();
    setDialogOpen();
    setCurrent(payments[dataIndex]._id);
    console.log("Handled Click", setCurrent(payments[dataIndex]));
  };

  const editProfile = (e, dataIndex) => {
    userContext.setCurrent(payments[dataIndex]);
    console.log("UserContext SetCurrent set to:", payments[dataIndex]._id);
    let path = `/user/${payments[dataIndex]._id}`;
    history.push(path);
  };

  const invoiceSubtotal =
    subtotal(paymentCalc.training) +
    subtotal(paymentCalc.marking) +
    subtotal(paymentCalc.office) +
    subtotal(paymentCalc.fieldTrip) +
    subtotal(paymentCalc.lab) +
    subtotal(paymentCalc.seminar) +
    subtotal(paymentCalc.lecture);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;
  return (
    <Fragment>
      <div>
        <div>
          {payments !== null && !loading ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={8}
                      className={clsx(classes.root, classes.left)}
                    >
                      <div>
                        <Typography variant="h5">Add New Payment</Typography>
                        <Typography variant="caption">
                          Teaching Support Framework - Contract and Payment
                          Calculator. Please use for marking calculations only
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={clsx(classes.root, classes.right)}
                    >
                      <Button
                        variant="contained"
                        onClick={reset}
                        color="secondary"
                      >
                        Reset
                      </Button>
                      <Button variant="contained" color="primary">
                        Add Payment
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="h5">Set Payment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid
                          item
                          xs={2}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            className={classes.textField}
                            fullWidth
                            select
                            variant="outlined"
                            id="deliveredBy"
                            name="deliveredBy"
                            label="Delivered By"
                            value={payment.deliveredBy}
                            onChange={(e) => onChange(e, 1)}
                            disabled={isDisabled}
                          >
                            {deliveryCategory.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            className={classes.textField}
                            fullWidth
                            select
                            variant="outlined"
                            id="semester"
                            name="semester"
                            label="Semester"
                            value={payment.semester}
                            onChange={(e) => onChange(e)}
                            disabled={isDisabled}
                          >
                            {semester.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            className={classes.textField}
                            fullWidth
                            select
                            variant="outlined"
                            id="academicYear"
                            name="academicYear"
                            label="Academic Year"
                            value={payment.academicYear}
                            onChange={(e) => onChange(e)}
                            disabled={isDisabled}
                          >
                            {academicYear.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="paymentPeriod"
                            name="paymentPeriod"
                            label="Payment Period"
                            value={payment.paymentPeriod}
                            onChange={(e) => onChange(e)}
                          >
                            {monthWords.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="paymentPeriodNum"
                            name="paymentPeriodNum"
                            label="Payment Period"
                            value={payment.paymentPeriod}
                            onChange={(e) => onChange(e)}
                          >
                            {yearsDD.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="user"
                            name="user"
                            label="Name"
                            value={payment.user}
                            onChange={(e) => onChange(e, 2)}
                          >
                            {userSelect.map((option) => (
                              <MenuItem key={option._id} value={option._id}>
                                {`${option.firstName} ${option.lastName} (${option.QUBID})`}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            className={classes.textField}
                            select
                            variant="outlined"
                            id="school"
                            name="school"
                            label="School"
                            value={payment.school}
                            onChange={(e) => onChange(e)}
                          >
                            {schoolMenu.map((option) => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            className={classes.textField}
                            variant="outlined"
                            id="projectName"
                            name="projectName"
                            label="Module"
                            value={payment.projectName}
                            onChange={(e) => onChange(e)}
                          ></TextField>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={6}
                        className={clsx(classes.root, classes.left)}
                      >
                        <Typography variant="h5">
                          Enter Payment Details
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={clsx(classes.root, classes.left)}
                      >
                        <TextField
                          fullWidth
                          disabled
                          size="small"
                          className={classes.textField}
                          variant="outlined"
                          id="rate1"
                          name="rate1"
                          label={`${grade.grade1} Rate`}
                          value={hourlyRates.rate1}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                £
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={clsx(classes.root, classes.left)}
                      >
                        <TextField
                          fullWidth
                          disabled
                          size="small"
                          className={classes.textField}
                          variant="outlined"
                          id="rate2"
                          name="rate2"
                          label={`${grade.grade2} Rate`}
                          value={hourlyRates.rate2}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                £
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table
                          className={classes.table}
                          aria-label="spanning table"
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell align="left" colSpan={2}>
                                Activity
                              </TableCell>
                              <TableCell align="center">
                                Payment Grade
                              </TableCell>
                              <TableCell align="center">
                                Delivery/ Completion time (hrs)
                              </TableCell>
                              <TableCell align="center">
                                No of lectures/ Seminars/ Tutorials
                              </TableCell>
                              <TableCell align="center">Total hours</TableCell>
                              <TableCell align="center">Payment £</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* {rows.map((row) => (
                              <TableRow key={row.desc}>
                                <TableCell>{row.desc}</TableCell>
                                <TableCell align="right">{row.qty}</TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right">
                                  {ccyFormat(row.price)}
                                </TableCell>
                              </TableRow>
                            ))} */}
                            <TableRow key={1}>
                              <TableCell rowSpan={3}>Lecture</TableCell>
                              <TableCell align="left">
                                {paymentCalc.lecture[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.lecture[0].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.lecture[0].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lecture[0].count *
                                    paymentCalc.lecture[0].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lecture[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.lecture[1].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.lecture[1].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.lecture[1].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lecture[1].count *
                                    paymentCalc.lecture[1].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lecture[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.lecture[2].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={null}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={null}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.lecture[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.lecture[2].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade2,
                                      paymentCalc.lecture[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lecture[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Lectures
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.lecture)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={2}>
                              <TableCell rowSpan={4}>
                                Seminar / Tutorial / Oral Classes
                              </TableCell>
                              <TableCell align="left">
                                {paymentCalc.seminar[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.seminar[0].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.seminar[0].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.seminar[0].count *
                                    paymentCalc.seminar[0].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.seminar[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.seminar[1].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.seminar[1].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.seminar[1].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.seminar[1].count *
                                    paymentCalc.seminar[1].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.seminar[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.seminar[2].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.seminar[2].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.seminar[2].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.seminar[2].count *
                                    paymentCalc.seminar[2].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.seminar[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.seminar[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.seminar[3].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.seminar[3].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade2,
                                      paymentCalc.seminar[3]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.seminar[3].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Seminar/Tutorial/Oral Classes
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.seminar)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={2}>
                              <TableCell rowSpan={4}>
                                Lab Supervision / Demonstrating
                              </TableCell>
                              <TableCell align="left">
                                {paymentCalc.lab[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.lab[0].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.lab[0].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lab[0].count *
                                    paymentCalc.lab[0].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lab[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.lab[1].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.lab[1].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.lab[1].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lab[1].count *
                                    paymentCalc.lab[1].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lab[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.lab[2].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.lab[2].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                  value={paymentCalc.lab[2].count}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lab[2].count *
                                    paymentCalc.lab[2].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.lab[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lab[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.lab[3].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="count"
                                  name="count"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.lab[3].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade1,
                                      paymentCalc.lab[3]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.lab[3].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Lab Supervision/Demonstrating
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.lab)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={3}>
                              <TableCell>Field Trip Assistance</TableCell>
                              <TableCell align="left">
                                {paymentCalc.fieldTrip[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.fieldTrip[0].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade1,
                                      paymentCalc.fieldTrip[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.fieldTrip[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Field Trip Assistance
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.fieldTrip)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={3}>
                              <TableCell>Office Hours</TableCell>
                              <TableCell align="left">
                                {paymentCalc.office[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={
                                    paymentCalc.office[0].count *
                                    paymentCalc.office[0].time
                                  }
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.office[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.office[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Office Hours
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.office)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={4}>
                              <TableCell rowSpan={3}>Marking</TableCell>
                              <TableCell align="left">
                                {paymentCalc.marking[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.marking[0].time}
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.marking[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.marking[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.marking[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell align="center">
                                <Input
                                  disabled
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  disableUnderline={true}
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="time"
                                  name="time"
                                  value={paymentCalc.marking[1].time}
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade2,
                                      paymentCalc.marking[1]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.marking[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                {paymentCalc.marking[2].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade2}
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.marking[2].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade2,
                                      paymentCalc.marking[2]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.marking[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Marking
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.marking)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={5}>
                              <TableCell>Training</TableCell>
                              <TableCell align="left">
                                {paymentCalc.training[0].activity}
                              </TableCell>
                              <TableCell align="center">
                                {grade.grade1}
                              </TableCell>
                              <TableCell />
                              <TableCell />
                              <TableCell align="center">
                                <Input
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
                                  id="totalhrs"
                                  name="totalhrs"
                                  value={paymentCalc.training[0].totalhrs}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      4,
                                      grade.grade1,
                                      paymentCalc.training[0]
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                paymentCalc.training[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                                Total Training
                              </TableCell>
                              <TableCell align="center">{`£ ${ccyFormat(
                                subtotal(paymentCalc.training)
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell rowSpan={3} />
                              <TableCell />
                              <TableCell />
                              <TableCell colSpan={3}>Subtotal</TableCell>
                              <TableCell align="right">
                                {`£ ${ccyFormat(invoiceSubtotal)}`}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell />
                              <TableCell />
                              <TableCell>Tax</TableCell>
                              <TableCell align="right">{`${(
                                TAX_RATE * 100
                              ).toFixed(0)} %`}</TableCell>
                              <TableCell />
                              <TableCell align="right">
                                {`£ ${ccyFormat(invoiceTaxes)}`}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell />
                              <TableCell />
                              <TableCell colSpan={3}>Total</TableCell>
                              <TableCell align="right">
                                {`£ ${ccyFormat(invoiceTotal)}`}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion disabled>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                  >
                    <Typography className={classes.heading}>
                      Disabled Accordion
                    </Typography>
                  </AccordionSummary>
                </Accordion>
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

export default CreatePayment;
