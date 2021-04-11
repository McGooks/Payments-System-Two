import React, { useContext, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
//ScoreCards
import UserCountKPI from "../../components/charts/UserCountKPI";
import PaymentPendingAuthCountKPI from "../../components/charts/PaymentPendingAuthCountKPI";
import PaymentPendingAuthValueKPI from "../../components/charts/PaymentPendingAuthValueKPI";
import PaymentsAuthValueKPI from "../../components/charts/PaymentsAuthValueKPI";
import PaymentsAuthValueYTDKPI from "../../components/charts/PaymentsAuthValueYTDKPI";
import UserPayments from "../../components/payments/UserPayments";
import ProgressIndicator from "../layouts/Spinner";

//Navigation
import NavButtonHome from "../../components/layouts/NavButtonHome";
//State
import AuthContext from "../../context/auth/authContext";
import StatsContext from "../../context/stats/statsContext";
import PaymentContext from "../../context/payment/paymentContext";

function MuiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

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

const Home = () => {
  const classes = useStyles();
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
    <>
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
              {user && user.emailVerified === false ? (
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
              ) : (
                <NavButtonHome isAdmin={isAdmin} />
              )}

              {user && !loading && userPayments.payments !== null ? (
                <Grid container spacing={10}>
                  <Grid item xs={12}>
                    <UserPayments
                      user={user}
                      userPayments={userPayments.payments}
                      userPaymentsLoading={loading}
                    />
                  </Grid>
                </Grid>
              ) : (
                ""
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
    </>
  );
};

export default Home;
