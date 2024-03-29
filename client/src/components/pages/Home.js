import React, { useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import { Alert, AlertTitle } from "@mui/lab";
import Button from "@mui/material/Button";
import clsx from "clsx";
//ScoreCards
import UserCountKPI from "../charts/UserCountKPI";
import UserCountKPITaxSigned from "../charts/UserCountKPITaxSigned";
import PaymentPendingAuthCountKPI from "../charts/PaymentPendingAuthCountKPI";
import PaymentPendingAuthValueKPI from "../charts/PaymentPendingAuthValueKPI";
import PaymentsAuthValueKPI from "../charts/PaymentsAuthValueKPI";
import PaymentsAuthValueYTDKPI from "../charts/PaymentsAuthValueYTDKPI";
import UserPaymentsView from "../payments/UserPayments";
import ProgressIndicator from "../layouts/Spinner";

//Navigation
import NavButtonHome from "../layouts/NavButtonHome";
//State
import AuthContext from "../../context/auth/authContext";
import StatsContext from "../../context/stats/statsContext";
import PaymentContext from "../../context/payment/paymentContext";

const PREFIX = "Home";

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
  finalButton: `${PREFIX}-finalButton`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
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
  },
}));

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const Home = () => {
  const statsContext = useContext(StatsContext);
  const { stats, getStatData } = statsContext;
  const authContext = useContext(AuthContext);
  const { user, loadUser, resendVerifyEmail, isAdmin } = authContext;
  const paymentContext = useContext(PaymentContext);
  const { loading, getUserPayments, userPayments } = paymentContext;

  const getGreeting = () => {
    const timeOfDayWords = new Date();
    if (timeOfDayWords.getHours() >= 4 && timeOfDayWords.getHours() < 12) {
      return "Good Morning";
    } else if (
      timeOfDayWords.getHours() >= 12 &&
      timeOfDayWords.getHours() <= 16
    ) {
      return "Good Day";
    } else if (
      timeOfDayWords.getHours() >= 17 &&
      timeOfDayWords.getHours() <= 23
    ) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const [userID, setUserID] = useState({
    id: "",
  });

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user._id) {
      getUserPayments(user._id);
      setUserID({ id: user._id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resendEmail = () => {
    resendVerifyEmail(userID.id);
  };

  return (
    <Root>
      <h1 className="HomeGreeting">
        {getGreeting()}, {user && user.firstName}
      </h1>
      {loading && authContext.loading ? (
        <ProgressIndicator />
      ) : (
        <>
          {isAdmin ? (
            <>
              <NavButtonHome isAdmin={isAdmin} />
              {stats && stats[1].statsPending !== 0 ? (
                <h3 className="HomeGreetingSubtitle">You have pending tasks</h3>
              ) : (
                <h3 className="HomeGreetingSubtitle">You are all caught up</h3>
              )}
              <Grid container direction={"row"} spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <UserCountKPI key={1} />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <UserCountKPITaxSigned key={10} />
                </Grid>
                <Grid item md={3}xs={12}  sm={6}>
                  <PaymentPendingAuthCountKPI key={2} />
                </Grid>

                <Grid item md={3}xs={12}  sm={6}>
                  <PaymentPendingAuthValueKPI key={3} />
                </Grid>
                <Grid item md={3}xs={12}  sm={6}>
                  <PaymentsAuthValueKPI />
                </Grid>
                <Grid item md={3}xs={12}  sm={6}>
                  <PaymentsAuthValueYTDKPI />
                </Grid>
              </Grid>
              <Grid container spacing={10}>
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.footer, classes.left)}
                ></Grid>
              </Grid>
            </>
          ) : user && user.role === "Module Owner" ? (
            <>
              <NavButtonHome isAdmin={isAdmin} />
              {stats && stats[1].statsPending !== 0 ? (
                <h3 className="HomeGreetingSubtitle">You have pending tasks</h3>
              ) : (
                <h3 className="HomeGreetingSubtitle">You are all caught up</h3>
              )}
              <Grid container direction="row" spacing={4} alignItems="stretch">
                <Grid item md={6} xs={12} sm={6}>
                  <UserCountKPI key={1} />
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <PaymentPendingAuthCountKPI key={2} />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={4} alignItems="stretch">
                <Grid item xs={12} md sm={6}>
                  <PaymentPendingAuthValueKPI key={3} />
                </Grid>
                <Grid item xs={12} md sm={6}>
                  <PaymentsAuthValueKPI />
                </Grid>
                <Grid item xs={12} md sm={6}>
                  <PaymentsAuthValueYTDKPI />
                </Grid>
              </Grid>
              <Grid container spacing={10}>
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.footer, classes.left)}
                ></Grid>
              </Grid>
            </>
          ) : (
            <>
              {user && !user.emailVerified ? (
                <MuiAlert
                  style={{ marginBottom: "20px" }}
                  severity="warning"
                  action={
                    <Button onClick={resendEmail} color="inherit" size="small">
                      Resend Email
                    </Button>
                  }
                >
                  <AlertTitle>Email Address Pending Validation</AlertTitle>
                  Please click the verify link issued to {user.email} or click
                  the resend email button
                </MuiAlert>
              ) : user && user.NINO === "" ? (
                <>
                  <MuiAlert
                    style={{ marginBottom: "20px" }}
                    severity="warning"
                    action={
                      <Button
                        component={Link}
                        to={`/user/${user._id}`}
                        color="inherit"
                        size="small"
                      >
                        My Profile
                      </Button>
                    }
                  >
                    <AlertTitle>Please complete your User Profile</AlertTitle>
                    Your user account is currently incomplete, please navigate
                    to your user profile and complete all of the required fields
                  </MuiAlert>
                  <NavButtonHome isAdmin={isAdmin} />
                </>
              ) : (
                <NavButtonHome isAdmin={isAdmin} />
              )}
              {user && !user.taxDeclaration[0].signed ? (
                <>
                  <MuiAlert
                    style={{ marginBottom: "20px" }}
                    severity="error"
                    action={
                      <Button
                        component={Link}
                        to={`/user/${user._id}`}
                        color="inherit"
                        size="small"
                      >
                        My Profile
                      </Button>
                    }
                  >
                    <AlertTitle>
                      Please complete your Tax Declaration
                    </AlertTitle>
                    <p>
                      You must complete the tax declaration before you can be
                      undertake any demonstrator activities.
                    </p>
                    Your module coordinator will be unable to process payments
                    until you have successfully submitted a tax declaration.
                    Please navigate to your user profile to complete
                  </MuiAlert>
                  <NavButtonHome isAdmin={isAdmin} />
                </>
              ) : (
                ""
              )}
              {!loading && user && userPayments.payments.length ? (
                <Grid container spacing={10}>
                  <Grid item xs={12}>
                    <UserPaymentsView
                      user={user}
                      userPayments={userPayments.payments}
                      userPaymentsLoading={loading}
                    />
                  </Grid>
                </Grid>
              ) : (
                <h4>
                  You currently have no payments recorded. If required, please
                  liaise with your module coordinator
                </h4>
              )}
              <Grid container spacing={10}>
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.footer, classes.left)}
                ></Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </Root>
  );
};

export default Home;
