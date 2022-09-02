import React, { useContext, Fragment, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { useHistory, useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

//Context
import PaymentContext from "../../context/payment/paymentContext";
//Components
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Input,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useSnackbar } from "notistack";
import clsx from "clsx";

const PREFIX = 'ViewPayment';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  right: `${PREFIX}-right`,
  left: `${PREFIX}-left`,
  table: `${PREFIX}-table`,
  spacer: `${PREFIX}-spacer`,
  textField: `${PREFIX}-textField`,
  footer: `${PREFIX}-footer`,
  inputField: `${PREFIX}-inputField`,
  inputCenter: `${PREFIX}-inputCenter`,
  finalButton: `${PREFIX}-finalButton`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    textAlign: "right",
    color: theme.palette.text.secondary,
  },

  [`& .${classes.right}`]: {
    textAlign: "right",
  },

  [`& .${classes.left}`]: {
    textAlign: "left",
  },

  [`& .${classes.table}`]: {
    minWidth: 700,
  },

  [`& .${classes.spacer}`]: {
    marginTop: theme.spacing(2),
  },

  [`& .${classes.textField}`]: {
    "& > *": {},
  },

  [`& .${classes.footer}`]: {
    minHeight: 100,
  },

  [`& .${classes.inputField}`]: {
    textAlign: "center",
  },

  [`& .${classes.inputCenter}`]: {
    textAlign: "center",
    color: "black",
    fontSize: theme.typography.pxToRem(14),
  },

  [`& .${classes.finalButton}`]: {
    margin: theme.spacing(2),
  }
}));

const CUR = "£";
const AC1_RATE = 14.73;
const AC2_RATE = 17.57;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function subtotal(totals) {
  return totals.map(({ payment }) => payment).reduce((sum, i) => sum + i, 0);
}

function totalPaidHours(totals) {
  return totals.reduce((sum, i) => sum + i.totalPaidHours, 0);
}

function totalOfficeHours(totals) {
  return totals.reduce((sum, i) => sum * i.count, 1);
}

const ViewPayment = (props) => {
  const { current, isAdmin } = props;

  //State
  const [payment, setPayment] = useState(current);
  const [markingCalc, setMarkingCalc] = useState([
    ...current.paymentDetail.markingCalc,
  ]);
  const [officeHoursCalc, setOfficeHoursCalc] = useState([
    ...current.paymentDetail.officeHours,
  ]);
  const [paymentCalc, setPaymentCalc] = useState(
    current.paymentDetail.paymentCalc
  );
  const [hourlyRates, setHourlyRates] = useState({
    rate1: AC1_RATE,
    rate2: AC2_RATE,
  });
  const [grade, setGrade] = useState({
    grade1: "AC1",
    grade2: "AC2",
  });

  //declarations
  const invoiceSubtotal =
    subtotal(paymentCalc.training) +
    subtotal(paymentCalc.marking) +
    subtotal(paymentCalc.office) +
    subtotal(paymentCalc.fieldTrip) +
    subtotal(paymentCalc.lab) +
    subtotal(paymentCalc.seminar) +
    subtotal(paymentCalc.lecture);
  const totPaidHours = totalPaidHours(markingCalc);
  const totOfficeHours = totalOfficeHours(officeHoursCalc);
  //   const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceSubtotal;
  return (
    <Root>
      <div>
        <div>
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
                      <Typography variant="h5">View Payment</Typography>
                      <Typography variant="caption">
                        Teaching Support Framework - Contract and Payment
                        Calculator
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    className={clsx(classes.root, classes.right)}
                  >
                    {isAdmin && (
                      <Button
                        variant="contained"
                        component={Link}
                        to="/payments/"
                        color="secondary"
                      >
                        Back to Payments
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Accordion expanded>
                {/* <AccordionSummary
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
                          {"Marking & Office Hours"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary> */}
                <AccordionSummary
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      className={clsx(classes.root, classes.left)}
                    >
                      <Typography variant="h5">
                        {"Marking & Office Hours"}
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
                        name="rate1"
                        label={`${grade.grade1} Rate`}
                        value={hourlyRates.rate1}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">£</InputAdornment>
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
                        name="rate2"
                        label={`${grade.grade2} Rate`}
                        value={hourlyRates.rate2}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">£</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <form>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table
                          className={classes.table}
                          aria-label="spanning table"
                          size="small"
                        >
                          <TableHead>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left" colSpan={4}>
                                Marking hours Calculation (Exam / Non Exam /
                                Coursework)
                              </TableCell>

                              <TableCell />
                              <TableCell />
                              <TableCell />
                            </TableRow>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left">Range</TableCell>
                              <TableCell align="center">
                                Payment Grade
                              </TableCell>
                              <TableCell align="center">
                                No of Students
                              </TableCell>
                              <TableCell align="center">
                                No of Pieces of Coursework per Student
                              </TableCell>
                              <TableCell align="center">
                                Oral Exam Contact Hours
                              </TableCell>
                              <TableCell align="center">Total</TableCell>
                              <TableCell align="center">
                                Total Paid hours
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {payment.paymentDetail.markingCalc.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell align="left">{row.range}</TableCell>
                                <TableCell align="center">
                                  {row.range === "A" || row.range === "B"
                                    ? grade.grade1
                                    : grade.grade2}
                                </TableCell>
                                {row.range === "D" ? (
                                  <TableCell align="center">
                                    <Input
                                      disabled
                                      disableUnderline={true}
                                      type="number"
                                      size="small"
                                      margin="dense"
                                      classes={{
                                        input: classes.inputCenter,
                                      }}
                                      variant="filled"
                                      name="time"
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell align="center">
                                    <Input
                                      disabled
                                      disableUnderline={true}
                                      type="number"
                                      size="small"
                                      margin="dense"
                                      classes={{
                                        input: classes.inputCenter,
                                      }}
                                      variant="filled"
                                      name="numOfStudents"
                                      value={row.numOfStudents}
                                    />
                                  </TableCell>
                                )}
                                {row.range === "D" ? (
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
                                      name="time"
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell align="center">
                                    <Input
                                      disabled
                                      disableUnderline={true}
                                      type="number"
                                      size="small"
                                      margin="dense"
                                      classes={{
                                        input: classes.inputCenter,
                                      }}
                                      variant="filled"
                                      name="numOfCWPcsPerStudent"
                                      value={row.numOfCWPcsPerStudent}
                                    />
                                  </TableCell>
                                )}
                                {row.range !== "D" ? (
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
                                      name="time"
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell align="center">
                                    <Input
                                      disabled
                                      disableUnderline={true}
                                      type="number"
                                      size="small"
                                      margin="dense"
                                      classes={{
                                        input: classes.inputCenter,
                                      }}
                                      variant="filled"
                                      name="OralExamHours"
                                      value={row.OralExamHours}
                                    />
                                  </TableCell>
                                )}
                                {row.range !== "D" ? (
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
                                      name="total"
                                      value={
                                        row.numOfCWPcsPerStudent *
                                        row.numOfStudents
                                      }
                                    />
                                  </TableCell>
                                ) : (
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
                                      name="total"
                                      value={row.OralExamHours}
                                    />
                                  </TableCell>
                                )}
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
                                    name="totalhrs"
                                    value={row.totalPaidHours}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow key={uuidv4()} selected={true}>
                              <TableCell colSpan={6} align="right">
                                Total Paid Hours
                              </TableCell>
                              <TableCell align="center">
                                {parseFloat(ccyFormat(totPaidHours))}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TableContainer
                        className={clsx(classes.spacer)}
                        component={Paper}
                      >
                        <Table
                          className={clsx(classes.table)}
                          aria-label="spanning table"
                          size="small"
                        >
                          <TableHead>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left">
                                Office hours Calculation
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {officeHoursCalc.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell align="left">
                                  {row.description}
                                </TableCell>
                                <TableCell align="right">
                                  <Input
                                    disabled
                                    disableUnderline={true}
                                    type="number"
                                    size="small"
                                    margin="dense"
                                    classes={{
                                      input: classes.inputCenter,
                                    }}
                                    variant="filled"
                                    name="count"
                                    value={row.count}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow key={uuidv4()} selected={true}>
                              <TableCell align="left">Total Hours</TableCell>
                              <TableCell align="right">
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
                                  name="count"
                                  value={parseFloat(ccyFormat(totOfficeHours))}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TableContainer
                        className={clsx(classes.spacer)}
                        component={Paper}
                      >
                        <Table
                          className={clsx(classes.table)}
                          aria-label="spanning table"
                          size="small"
                        >
                          <TableHead>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left">
                                Lab Supervision/Demonstrating
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left">
                                {paymentCalc.lab[3].activity}
                              </TableCell>
                              <TableCell align="right">
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
                                  name="totalhrs"
                                  value={paymentCalc.lab[3].totalhrs}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()} selected={true}>
                              <TableCell align="left">Total Hours</TableCell>
                              <TableCell align="right">
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
                                  name="count"
                                  value={paymentCalc.lab[3].totalhrs}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </form>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded>
                <AccordionSummary
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      className={clsx(classes.root, classes.left)}
                    >
                      <Typography variant="h5">
                        Other Payment Details
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
                        name="rate1"
                        label={`${grade.grade1} Rate`}
                        value={hourlyRates.rate1}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">£</InputAdornment>
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
                        name="rate2"
                        label={`${grade.grade2} Rate`}
                        value={hourlyRates.rate2}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">£</InputAdornment>
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
                          <TableRow key={uuidv4()}>
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
                          <TableRow key={uuidv4()}>
                            <TableCell rowSpan={3}>Lecture</TableCell>
                            <TableCell align="left">
                              {paymentCalc.lecture[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.lecture[0].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.lecture[0].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.lecture[0].count *
                                  paymentCalc.lecture[0].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lecture[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.lecture[1].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.lecture[1].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.lecture[1].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.lecture[1].count *
                                  paymentCalc.lecture[1].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lecture[1].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.lecture[2].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
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
                                name="time"
                                value={null}
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
                                name="count"
                                value={null}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="totalhrs"
                                value={paymentCalc.lecture[2].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lecture[2].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Lectures
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.lecture)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell rowSpan={4}>
                              Seminar / Tutorial / Oral Classes
                            </TableCell>
                            <TableCell align="left">
                              {paymentCalc.seminar[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.seminar[0].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.seminar[0].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.seminar[0].count *
                                  paymentCalc.seminar[0].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.seminar[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.seminar[1].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.seminar[1].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.seminar[1].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.seminar[1].count *
                                  paymentCalc.seminar[1].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.seminar[1].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.seminar[2].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.seminar[2].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.seminar[2].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.seminar[2].count *
                                  paymentCalc.seminar[2].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.seminar[2].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.seminar[3].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
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
                                name="count"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="totalhrs"
                                value={paymentCalc.seminar[3].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.seminar[3].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Seminar/Tutorial/Oral Classes
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.seminar)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell rowSpan={4}>
                              Lab Supervision / Demonstrating
                            </TableCell>
                            <TableCell align="left">
                              {paymentCalc.lab[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.lab[0].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.lab[0].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.lab[0].count *
                                  paymentCalc.lab[0].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lab[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.lab[1].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.lab[1].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.lab[1].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.lab[1].count *
                                  paymentCalc.lab[1].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lab[1].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.lab[2].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="time"
                                value={paymentCalc.lab[2].time}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="count"
                                value={paymentCalc.lab[2].count}
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
                                name="totalhrs"
                                value={
                                  paymentCalc.lab[2].count *
                                  paymentCalc.lab[2].time
                                }
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lab[2].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.lab[3].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
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
                                name="count"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="totalhrs"
                                value={paymentCalc.lab[3].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.lab[3].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Lab Supervision/Demonstrating
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.lab)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell>Field Trip Assistance</TableCell>
                            <TableCell align="left">
                              {paymentCalc.fieldTrip[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="totalhrs"
                                value={paymentCalc.fieldTrip[0].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.fieldTrip[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Field Trip Assistance
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.fieldTrip)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell>Office Hours</TableCell>
                            <TableCell align="left">
                              {paymentCalc.office[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
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
                                name="totalhrs"
                                value={paymentCalc.office[0].time}
                              />
                            </TableCell>
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
                                name="totalhrs"
                                value={paymentCalc.office[0].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.office[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Office Hours
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.office)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell rowSpan={3}>Marking</TableCell>
                            <TableCell align="left">
                              {paymentCalc.marking[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
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
                                name="time"
                                value={paymentCalc.marking[0].time}
                              />
                            </TableCell>
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
                                name="totalhrs"
                                value={paymentCalc.marking[0].time}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.marking[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.marking[1].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
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
                                name="time"
                                value={paymentCalc.marking[1].time}
                              />
                            </TableCell>
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
                                name="totalhrs"
                                value={paymentCalc.marking[1].time}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.marking[1].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell align="left">
                              {paymentCalc.marking[2].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade2}</TableCell>
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
                                name="totalhrs"
                                value={paymentCalc.marking[2].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.marking[2].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Marking
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.marking)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell>Training</TableCell>
                            <TableCell align="left">
                              {paymentCalc.training[0].activity}
                            </TableCell>
                            <TableCell align="center">{grade.grade1}</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell align="center">
                              <Input
                                disabled
                                disableUnderline={true}
                                type="number"
                                size="small"
                                margin="dense"
                                classes={{
                                  input: classes.inputCenter,
                                }}
                                variant="filled"
                                name="totalhrs"
                                value={paymentCalc.training[0].totalhrs}
                              />
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              paymentCalc.training[0].payment
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()} selected={true}>
                            <TableCell colSpan={6} align="left">
                              Total Training
                            </TableCell>
                            <TableCell align="center">{`${CUR}${ccyFormat(
                              subtotal(paymentCalc.training)
                            )}`}</TableCell>
                          </TableRow>
                          <TableRow key={uuidv4()}>
                            <TableCell rowSpan={3} />
                            <TableCell />
                            <TableCell />
                            <TableCell colSpan={3}></TableCell>
                            <TableCell align="center">
                              {/* {`£${ccyFormat(invoiceSubtotal)}`} */}
                            </TableCell>
                          </TableRow>
                          {/* <TableRow key={uuidv4()}>
                              <TableCell />
                              <TableCell />
                              <TableCell>Tax</TableCell>
                              <TableCell align="center">{`${(
                                -TAX_RATE * 100
                              ).toFixed(0)} %`}</TableCell>
                              <TableCell />
                              <TableCell align="center">
                                {`£${ccyFormat(invoiceTaxes)}`}
                              </TableCell>
                            </TableRow> */}
                          <TableRow key={uuidv4()}>
                            <TableCell />
                            <TableCell />
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell align="center">
                              {`£${ccyFormat(invoiceTotal)}`}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid container spacing={30}>
              <Grid item xs={12} className={clsx(classes.footer, classes.left)}>
                {" "}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </Root>
  );
};

export default ViewPayment;
