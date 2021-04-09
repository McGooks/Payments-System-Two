import React, { useContext, Fragment, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import {
  deliveryCategory,
  semester,
  academicYear,
  schoolMenu,
  monthWords,
  yearsDD,
} from "../../utils/dropdowns";

//Context
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
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
import clsx from "clsx";
import MarkingRange from "../layouts/MarkingRange";
import Dialog from "../layouts/ConfirmationDialog";
import UserPayments from "./UserPayments";
// import CustomToolbar from "../layouts/CustomToolbar";

const CUR = "£";
const TAX_RATE = -0.2;
const AC1_RATE = 14.73;
const AC2_RATE = 17.57;
const BANDA_RATE = 15.01;
const BANDB_RATE = 20.01;
const MHC_A = 0.1667;
const MHC_B = 0.3333;
const MHC_C1 = 0.3333;
const MHC_C2 = 0.5;
const MHC_C3 = 0.6667;
const MHC_C4 = 0.75;
const MHC_C5 = 0.5;
const MHC_D = 1.5;
const OFFR = 0.5;

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
  spacer: {
    marginTop: theme.spacing(2),
  },
  textField: {
    "& > *": {},
  },
  footer: {
    minHeight: 100,
  },
  inputField: {
    textAlign: "center",
  },
  inputCenter: {
    textAlign: "center",
    color: "black",
    fontSize: theme.typography.pxToRem(14),
  },
  finalButton: {
    margin: theme.spacing(2),
  },
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 1000,
    fontSize: theme.typography.pxToRem(0.1),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function subtotal(totals) {
  return totals.map(({ payment }) => payment).reduce((sum, i) => sum + i, 0);
}

function totalPaidHours(totals) {
  return totals.reduce((sum, i) => sum + i.totalPaidHours, 0);
}

function totalGrade1Hours(totals) {
  return totals
    .filter((totals) => totals.grade === "AC1" || totals.grade === "Band A")
    .reduce((sum, i) => sum + i.totalPaidHours, 0);
}

function totalGrade2Hours(totals) {
  return totals
    .filter((totals) => totals.grade === "AC2" || totals.grade === "Band B")
    .reduce((sum, i) => sum + i.totalPaidHours, 0);
}

function totalOfficeHours(totals) {
  return totals.reduce((sum, i) => sum * i.count, 1);
}

function pad(num, size) {
  return ("0" + num).substr(-size);
}

const CreatePayment = (props) => {
  const classes = useStyles();
  const paymentContext = useContext(PaymentContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { payments, addPayment, loading, error} = paymentContext;
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (props.activeUsers !== null) {
      setUserSelect(props.activeUsers);
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
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  }, [props.activeUsers]);

  //State
  let month = new Date().getMonth() + 1;
  const [payment, setPayment] = useState({
    user: "",
    deliveredBy: "TA",
    school: "Electronics, Electrical Engineering and Computer Science",
    academicYear: "2020/2021",
    paymentPeriod: month,
    paymentPeriodYear: new Date().getFullYear(),
    paymentPeriodNum: parseInt(
      new Date().getFullYear().toString() + pad(month.toString(), 2)
    ),
    semester: "1",
    QUBID: "10000000",
    account: "",
    projectCode: "",
    projectName: "",
    subAnalysis: "",
    amount: 0.0,
    student_cohort: true,
    cohort_id: "00",
    paymentStatus: "Pending",
  });
  const [markingCalc, setMarkingCalc] = useState([
    {
      range: "A",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "B",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "C-1",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "C-2",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "C-3",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "C-4",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "C-5",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
    {
      range: "D",
      grade: "",
      numOfStudents: 0,
      numOfCWPcsPerStudent: 0,
      OralExamHours: 0,
      total: 0,
      totalPaidHours: 0.0,
    },
  ]);
  const [officeHoursCalc, setOfficeHoursCalc] = useState([
    {
      description: "No of Seminar Groups per week",
      count: 0,
    },
    {
      description: "No of weeks",
      count: 0,
    },
  ]);
  const [paymentCalc, setPaymentCalc] = useState({
    lecture: [
      {
        activity: "Prep - 1st delivery",
        paymentGrade: "",
        paymentRate: 0.0,
        time: 0,
        count: 0,
        totalhrs: 0.0,
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
        time: 0.0,
        count: 0,
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
  const [hourlyRates, setHourlyRates] = useState({
    rate1: AC1_RATE,
    rate2: AC2_RATE,
  });
  const [isDisabled, setIsDisabled] = useState({
    panel1: false,
    panel2: true,
    panel3: true,
    resetButton: true,
    addPaymentButton: true,
  });
  const [isExpanded, setExpanded] = useState({
    panel1: true,
    panel2: false,
    panel3: false,
  });
  const [userSelect, setUserSelect] = useState([]);
  const [finalised, setFinalised] = useState(false);
  const [grade, setGrade] = useState({
    grade1: "AC1",
    grade2: "AC2",
  });
  const [formShowing, setFormShowing] = useState(false);
  const [stage, setStage] = useState("");

  //Events
  const onChange = (e, i, g, r, rng) => {
    let rate = "";
    // console.log(e,i, g, r)
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
        payment.paymentPeriodNum = parseInt(
          payment.paymentPeriodYear.toString() +
            pad(payment.paymentPeriod.toString(), 2)
        );
        if (e.target.name === "user") {
          let userQUBID = userSelect.filter(function (val) {
            return val._id === e.target.value;
          });
          payment.QUBID = userQUBID[0].QUBID;
        }
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
      case 5:
        switch (rng) {
          case "A":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_A)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[0].time = parseFloat(
              ccyFormat(totalGrade1Hours(markingCalc))
            );
            paymentCalc.marking[0].totalhrs = parseFloat(
              ccyFormat(totalGrade1Hours(markingCalc))
            );
            paymentCalc.marking[0].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[0].payment = parseFloat(
              ccyFormat(paymentCalc.marking[0].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "B":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_B)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[0].time = parseFloat(
              ccyFormat(totalGrade1Hours(markingCalc))
            );
            paymentCalc.marking[0].totalhrs = parseFloat(
              ccyFormat(totalGrade1Hours(markingCalc))
            );
            paymentCalc.marking[0].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[0].payment = parseFloat(
              ccyFormat(paymentCalc.marking[0].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "C-1":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_C1)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[1].time = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].totalhrs = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[1].payment = parseFloat(
              ccyFormat(paymentCalc.marking[1].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "C-2":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_C2)
            );
            setMarkingCalc([...markingCalc]);
            break;
          case "C-3":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_C3)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[1].time = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].totalhrs = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[1].payment = parseFloat(
              ccyFormat(paymentCalc.marking[1].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "C-4":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_C4)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[1].time = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].totalhrs = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[1].payment = parseFloat(
              ccyFormat(paymentCalc.marking[1].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "C-5":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseInt(
              markingCalc[r].numOfStudents * markingCalc[r].numOfCWPcsPerStudent
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total * MHC_C5)
            );
            setMarkingCalc([...markingCalc]);
            paymentCalc.marking[1].time = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].totalhrs = parseFloat(
              ccyFormat(totalGrade2Hours(markingCalc))
            );
            paymentCalc.marking[1].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[1].payment = parseFloat(
              ccyFormat(paymentCalc.marking[1].time * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          case "D":
            markingCalc[r][e.target.name] = parseInt(e.target.value);
            markingCalc[r].grade = g;
            markingCalc[r].total = parseFloat(
              markingCalc[r].OralExamHours * MHC_D
            );
            markingCalc[r].totalPaidHours = parseFloat(
              ccyFormat(markingCalc[r].total)
            );
            setMarkingCalc([...markingCalc]);

            paymentCalc.marking[2].totalhrs = parseFloat(
              markingCalc[r].OralExamHours * MHC_D
            );
            paymentCalc.marking[2].paymentGrade = g;
            if (markingCalc[r].grade === grade.grade1) {
              rate = hourlyRates.rate1;
            } else {
              rate = hourlyRates.rate2;
            }
            paymentCalc.marking[2].payment = parseFloat(
              ccyFormat(paymentCalc.marking[2].totalhrs * rate)
            );
            setPaymentCalc({ ...paymentCalc });
            break;
          default:
            break;
        }
        break;
      case 6:
        officeHoursCalc[r][e.target.name] = parseInt(e.target.value);
        setOfficeHoursCalc([...officeHoursCalc]);
        paymentCalc.office[0].paymentGrade = g;
        paymentCalc.office[0].time = totalOfficeHours(officeHoursCalc);
        paymentCalc.office[0].totalhrs = parseInt(
          totalOfficeHours(officeHoursCalc) * OFFR
        );
        paymentCalc.office[0].payment = parseFloat(
          paymentCalc.office[0].totalhrs * hourlyRates.rate1
        );
        setPaymentCalc({ ...paymentCalc });
        break;
      default:
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
    }
  };
  const reset = () => {
    setOfficeHoursCalc([
      {
        description: "No of Seminar Groups per week",
        count: 0,
      },
      {
        description: "No of weeks",
        count: 0,
      },
    ]);
    setFinalised(false);
    payment.user = "";
    setPayment({
      user: "",
      deliveredBy: "",
      school: "",
      academicYear: "",
      paymentPeriod: "",
      paymentPeriodNum: "",
      paymentPeriodYear: "",
      semester: "",
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
    setHourlyRates({
      rate1: 14.73,
      rate2: 17.57,
    });
    setIsDisabled({
      panel1: false,
      panel2: true,
      panel3: true,
      resetButton: true,
      addPaymentButton: true,
    });
    setExpanded({ panel1: true, panel2: false, panel3: false });
    setPaymentCalc({
      lecture: [
        {
          activity: "Prep - 1st delivery",
          paymentGrade: "",
          paymentRate: 0.0,
          time: 0,
          count: 0,
          totalhrs: 0.0,
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
          time: 0.0,
          count: 0,
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
    setMarkingCalc([
      {
        range: "A",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "B",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "C-1",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "C-2",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "C-3",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "C-4",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "C-5",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
      {
        range: "D",
        grade: "",
        numOfStudents: 0,
        numOfCWPcsPerStudent: 0,
        OralExamHours: 0,
        total: 0,
        totalPaidHours: 0.0,
      },
    ]);
  };
  const showForm = () => {
    setFormShowing(true);
  };
  const hideForm = () => {
    setFormShowing(false);
  };
  const SubmitPayment = (e) => {
    e.preventDefault();
    const submitArray = [
      { ...payment },
      { ...paymentCalc },
      [...markingCalc],
      [...officeHoursCalc],
    ];
    addPayment(submitArray);
    history.push("/payments");
  };
  const continuePayment = (e) => {
    e.preventDefault();
    setIsDisabled({
      panel1: true,
      panel2: false,
      panel3: true,
      resetButton: false,
      addPaymentButton: true,
    });
    setExpanded({ panel1: false, panel2: true, panel3: false });
  };
  const continueMarkingOfficeHours = (e) => {
    e.preventDefault();
    setIsDisabled({
      panel1: true,
      panel2: true,
      panel3: false,
      resetButton: false,
      addPaymentButton: true,
    });
    setExpanded({ panel1: false, panel2: false, panel3: true });
    setStage("SubmitPaymentForm");
  };
  const finalisePayment = (e) => {
    setStage("");
    hideForm();
    setIsDisabled({
      panel1: true,
      panel2: true,
      panel3: true,
      resetButton: false,
      addPaymentButton: false,
    });
    setExpanded({ panel1: false, panel2: false, panel3: false });
    setFinalised(true);
    setPayment({
      ...payment,
      amount: invoiceTotal,
    });
  };

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
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;
  // console.log("markingCalc", markingCalc);
  // console.log("paymentCalc", paymentCalc);
  // console.log("OfficeCalc", officeHoursCalc);
  // console.log("payment", payment);
  // console.log("userSelect", userSelect)
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
                          Calculator
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      className={clsx(classes.root, classes.right)}
                    >
                      <Button
                        disabled={isDisabled.resetButton}
                        variant="contained"
                        onClick={reset}
                        color="secondary"
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Accordion
                  defaultExpanded
                  expanded={isExpanded.panel1}
                  disabled={isDisabled.panel1}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={6}
                        className={clsx(classes.root, classes.left)}
                      >
                        <Typography variant="h5">Set Payment</Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <form onSubmit={(e) => continuePayment(e)}>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={2}
                            className={clsx(classes.root, classes.left)}
                          >
                            <TextField
                              error={
                                payment.deliveredBy.length === 0 ? true : false
                              }
                              helperText={
                                payment.deliveredBy.length === 0
                                  ? "Please select a value"
                                  : ""
                              }
                              required
                              className={classes.textField}
                              fullWidth
                              select
                              variant="outlined"
                              name="deliveredBy"
                              label="Delivered By"
                              value={payment.deliveredBy}
                              onChange={(e) => onChange(e, 1)}
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
                              error={
                                payment.semester.length === 0 ? true : false
                              }
                              helperText={
                                payment.semester.length === 0
                                  ? "Please select a semester"
                                  : ""
                              }
                              required
                              className={classes.textField}
                              fullWidth
                              select
                              variant="outlined"
                              name="semester"
                              label="Semester"
                              value={payment.semester}
                              onChange={(e) => onChange(e)}
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
                              error={
                                payment.academicYear.length === 0 ? true : false
                              }
                              helperText={
                                payment.academicYear.length === 0
                                  ? "Please select an academic year"
                                  : ""
                              }
                              required
                              className={classes.textField}
                              fullWidth
                              select
                              variant="outlined"
                              name="academicYear"
                              label="Academic Year"
                              value={payment.academicYear}
                              onChange={(e) => onChange(e)}
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
                              error={
                                payment.paymentPeriod.length === 0
                                  ? true
                                  : false
                              }
                              helperText={
                                payment.paymentPeriod.length === 0
                                  ? "Please select a month"
                                  : ""
                              }
                              required
                              fullWidth
                              className={classes.textField}
                              select
                              variant="outlined"
                              name="paymentPeriod"
                              label="Payment Month"
                              value={payment.paymentPeriod}
                              onChange={(e) => onChange(e, 2)}
                            >
                              {monthWords.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
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
                              error={
                                payment.paymentPeriodYear.length === 0
                                  ? true
                                  : false
                              }
                              helperText={
                                payment.paymentPeriodYear.length === 0
                                  ? "Please select a payment year"
                                  : ""
                              }
                              required
                              fullWidth
                              className={classes.textField}
                              select
                              variant="outlined"
                              name="paymentPeriodYear"
                              label="Payment Year"
                              value={payment.paymentPeriodYear}
                              onChange={(e) => onChange(e, 2)}
                            >
                              {yearsDD.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                              error={payment.user.length === 0 ? true : false}
                              helperText={
                                payment.user.length === 0
                                  ? "Please select a user"
                                  : ""
                              }
                              required
                              fullWidth
                              className={classes.textField}
                              select
                              variant="outlined"
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
                              error={payment.school.length === 0 ? true : false}
                              helperText={
                                payment.school.length === 0
                                  ? "Please select a school"
                                  : ""
                              }
                              required
                              fullWidth
                              className={classes.textField}
                              select
                              variant="outlined"
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
                              name="projectName"
                              label="Module"
                              value={payment.projectName}
                              onChange={(e) => onChange(e)}
                            ></TextField>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={clsx(classes.root, classes.right)}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              Continue
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={isExpanded.panel2}
                  disabled={isDisabled.panel2}
                >
                  <AccordionSummary
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
                      <Grid
                        item
                        xs={6}
                        className={clsx(classes.root, classes.right)}
                      >
                        <HtmlTooltip
                          placement="bottom-end"
                          title={
                            <React.Fragment>
                              <MarkingRange />
                            </React.Fragment>
                          }
                        >
                          <InfoIcon></InfoIcon>
                        </HtmlTooltip>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <form onSubmit={(e) => continueMarkingOfficeHours(e)}>
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
                              {markingCalc.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell align="left">
                                    {row.range}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.range === "A" || row.range === "B"
                                      ? grade.grade1
                                      : grade.grade2}
                                  </TableCell>
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
                                        type="number"
                                        size="small"
                                        margin="dense"
                                        classes={{
                                          input: classes.inputCenter,
                                        }}
                                        variant="filled"
                                        name="numOfStudents"
                                        value={row.numOfStudents}
                                        onChange={(e) => {
                                          row.range === "A" || row.range === "B"
                                            ? onChange(
                                                e,
                                                5,
                                                grade.grade1,
                                                i,
                                                row.range
                                              )
                                            : onChange(
                                                e,
                                                5,
                                                grade.grade2,
                                                i,
                                                row.range
                                              );
                                        }}
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
                                        type="number"
                                        size="small"
                                        margin="dense"
                                        classes={{
                                          input: classes.inputCenter,
                                        }}
                                        variant="filled"
                                        name="numOfCWPcsPerStudent"
                                        value={row.numOfCWPcsPerStudent}
                                        onChange={(e) => {
                                          row.range === "A" || row.range === "B"
                                            ? onChange(
                                                e,
                                                5,
                                                grade.grade1,
                                                i,
                                                row.range
                                              )
                                            : onChange(
                                                e,
                                                5,
                                                grade.grade2,
                                                i,
                                                row.range
                                              );
                                        }}
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
                                        type="number"
                                        size="small"
                                        margin="dense"
                                        classes={{
                                          input: classes.inputCenter,
                                        }}
                                        variant="filled"
                                        name="OralExamHours"
                                        value={row.OralExamHours}
                                        onChange={(e) => {
                                          row.range === "A" || row.range === "B"
                                            ? onChange(
                                                e,
                                                5,
                                                grade.grade1,
                                                i,
                                                row.range
                                              )
                                            : onChange(
                                                e,
                                                5,
                                                grade.grade2,
                                                i,
                                                row.range
                                              );
                                        }}
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
                                        onChange={(e) => {
                                          row.range === "A" || row.range === "B"
                                            ? onChange(
                                                e,
                                                5,
                                                grade.grade1,
                                                i,
                                                row.range
                                              )
                                            : onChange(
                                                e,
                                                5,
                                                grade.grade2,
                                                i,
                                                row.range
                                              );
                                        }}
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
                                        onChange={(e) => {
                                          row.range === "A" || row.range === "B"
                                            ? onChange(
                                                e,
                                                5,
                                                grade.grade1,
                                                i,
                                                row.range
                                              )
                                            : onChange(
                                                e,
                                                5,
                                                grade.grade2,
                                                i,
                                                row.range
                                              );
                                        }}
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
                                      onChange={(e) => {
                                        row.range === "A" || row.range === "B"
                                          ? onChange(
                                              e,
                                              5,
                                              grade.grade1,
                                              i,
                                              row.range
                                            )
                                          : onChange(
                                              e,
                                              5,
                                              grade.grade2,
                                              i,
                                              row.range
                                            );
                                      }}
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
                                      type="number"
                                      size="small"
                                      margin="dense"
                                      classes={{
                                        input: classes.inputCenter,
                                      }}
                                      variant="filled"
                                      name="count"
                                      value={row.count}
                                      onChange={(e) =>
                                        onChange(
                                          e,
                                          6,
                                          grade.grade1,
                                          i,
                                          row.range
                                        )
                                      }
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
                                    value={parseFloat(
                                      ccyFormat(totOfficeHours)
                                    )}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={12}
                            className={clsx(classes.root, classes.right)}
                          >
                            <Button
                              disabled={
                                isDisabled.panel2 ||
                                (totOfficeHours === 0 && totPaidHours === 0)
                              }
                              variant="contained"
                              type="submit"
                              color="primary"
                            >
                              Continue
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </form>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={isExpanded.panel3}
                  disabled={isDisabled.panel3}
                >
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
                            <TableRow key={uuidv4()}>
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
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.lecture[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.lecture[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.seminar[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.seminar[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.seminar[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.lab[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.lab[1].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                                  name="totalhrs"
                                  value={
                                    paymentCalc.lab[2].count *
                                    paymentCalc.lab[2].time
                                  }
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.lab[2].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                                  type="number"
                                  size="small"
                                  margin="dense"
                                  classes={{
                                    input: classes.inputCenter,
                                  }}
                                  variant="filled"
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
                                  name="totalhrs"
                                  value={paymentCalc.office[0].time}
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.office[0]
                                    )
                                  }
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
                                  onChange={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.office[0]
                                    )
                                  }
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
                                  name="time"
                                  value={paymentCalc.marking[0].time}
                                  onChange={(e) =>
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
                              <TableCell align="center">{`${CUR}${ccyFormat(
                                paymentCalc.marking[0].payment
                              )}`}</TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
                              <TableCell align="left">
                                {paymentCalc.marking[1].activity}
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
                                  onChangeCapture={(e) =>
                                    onChange(
                                      e,
                                      3,
                                      grade.grade1,
                                      paymentCalc.marking[1]
                                    )
                                  }
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
                              <TableCell align="center">
                                {grade.grade2}
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
                              <TableCell colSpan={3}>Subtotal</TableCell>
                              <TableCell align="center">
                                {`£${ccyFormat(invoiceSubtotal)}`}
                              </TableCell>
                            </TableRow>
                            <TableRow key={uuidv4()}>
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
                            </TableRow>
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
                      <Grid container spacing={4}>
                        <Grid item xs={12} className={classes.finalButton}>
                          <Button
                            fullWidth
                            disabled={isDisabled.panel3 || invoiceTotal === 0}
                            variant="contained"
                            onClick={showForm}
                            color="primary"
                          >
                            Finalise Payment
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              {finalised ? (
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={8}
                        className={clsx(classes.root, classes.left)}
                      >
                        <div>
                          <Typography variant="h5">
                            Submit New Payment
                          </Typography>
                          <Typography variant="caption">
                            A new Payment request to the value of{" "}
                            {`${CUR}${ccyFormat(invoiceTotal)}`} will be
                            submitted
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        className={clsx(classes.root, classes.right)}
                      >
                        <Button
                          disabled={isDisabled.addPaymentButton}
                          variant="contained"
                          color="primary"
                          onClick={SubmitPayment}
                        >
                          Submit Payment
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ) : (
                ""
              )}
              <Grid container spacing={10}>
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.footer, classes.left)}
                >
                  {" "}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <ProgressIndicator />
          )}
        </div>
      </div>
      {formShowing && (
        <Dialog
          finalisePayment={finalisePayment}
          hideForm={hideForm}
          stage={stage}
          invoiceTotal={ccyFormat(invoiceTotal)}
        />
      )}
    </Fragment>
  );
};

export default CreatePayment;
