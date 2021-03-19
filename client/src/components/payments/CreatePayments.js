import React, { useContext, Fragment, useEffect, useState } from "react";
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

const TAX_RATE = 0.07;

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

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

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
    console.log(activeUsers);
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
    rate1: 14.73,
    rate2: 17.57,
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [userSelect, setUserSelect] = useState([]);

  const onChange = (e, i) => {
    switch (i) {
      case 1:
        if (e.target.value === "TA") {
          setHourlyRates({
            rate1: ccyFormat(14.73),
            rate2: ccyFormat(17.57),
          });
        } else {
          setHourlyRates({
            rate1: ccyFormat(15),
            rate2: ccyFormat(20),
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
      // case 3:
      //   data.contact[0][e.target.name] = e.target.value;
      //   setData({ ...data });
      //   break;
      // case 4:
      //   data.taxDeclaration[0][e.target.name] = e.target.value;
      //   setData({ ...data });
      //   break;
      default:
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
    }
  };
  console.log(payment);

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
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography variant="h5">Enter Payment Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid
                          item
                          xs={3}
                          className={clsx(classes.root, classes.left)}
                        >
                          <TextField
                            fullWidth
                            disabled
                            className={classes.textField}
                            variant="outlined"
                            id="rate1"
                            name="rate1"
                            label={
                              payment.deliveredBy === "TA" &&
                              payment.deliveredBy !== ""
                                ? "AC1 Rate"
                                : "Band 1 Rate"
                            }
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
                            className={classes.textField}
                            variant="outlined"
                            id="rate2"
                            name="rate2"
                            label={
                              payment.deliveredBy === "TA" &&
                              payment.deliveredBy !== ""
                                ? "AC2 Rate"
                                : "Band 2 Rate"
                            }
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
                              <TableCell align="center">Payment Grade</TableCell>
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
                                Prep - 1st delivery
                              </TableCell>
                              <TableCell align="center">AC2</TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">0.00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">
                                Prep - Repeat in same week (one repeat only)
                              </TableCell>
                              <TableCell align="center">AC2</TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">0.00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="left">Delivery</TableCell>
                              <TableCell align="center">AC2</TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  className={classes.textField}
                                  variant="filled"
                                  id="amount"
                                  name="amount"
                                  value={payment.amount}
                                  onChange={(e) => onChange(e)}
                                />
                              </TableCell>
                              <TableCell align="center">0.00</TableCell>
                            </TableRow>
                            <TableRow selected={true}>
                              <TableCell colSpan={6} align="left">
                              Total Lectures
                              </TableCell>
                              <TableCell align="center">0.00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell rowSpan={3} />
                              <TableCell colSpan={2}>Subtotal</TableCell>
                              <TableCell align="right">
                                {ccyFormat(invoiceSubtotal)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Tax</TableCell>
                              <TableCell align="right">{`${(
                                TAX_RATE * 100
                              ).toFixed(0)} %`}</TableCell>
                              <TableCell align="right">
                                {ccyFormat(invoiceTaxes)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={2}>Total</TableCell>
                              <TableCell align="right">
                                {ccyFormat(invoiceTotal)}
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
