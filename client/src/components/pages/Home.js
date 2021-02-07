import React, {useContext, useEffect} from "react";
import { Grid } from "@material-ui/core";
//ScoreCards
import UserCountKPI from "../../components/charts/UserCountKPI";
import PaymentPendingAuthCountKPI from "../../components/charts/PaymentPendingAuthCountKPI";
import PaymentPendingAuthValueKPI from "../../components/charts/PaymentPendingAuthValueKPI";
import PaymentsAuthValueKPI from "../../components/charts/PaymentsAuthValueKPI";
import PaymentsAuthValueYTDKPI from "../../components/charts/PaymentsAuthValueYTDKPI";
// Charts
import PaymentsTrend from "../../components/charts/PaymentsTrend";
import DemoChart from "../../components/charts/DemoChart";
//Navigation
import NavButtonHome from "../../components/layouts/NavButtonHome";
//State
import AuthContext from "../../context/auth/authContext"


const Home = () => {
 const authContext = useContext(AuthContext)
 const { user } = authContext;

 const getGreeting = () => {
  const timeOfDayWords = new Date();
  if (timeOfDayWords.getHours() >= 4 && timeOfDayWords.getHours() <= 12) {
    return "Good Morning";
  } else if (timeOfDayWords.getHours() >= 13 && timeOfDayWords.getHours() <= 16) {
    return "Good Day";
  } else if (timeOfDayWords.getHours() >= 17 && timeOfDayWords.getHours() <= 23) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

 useEffect(() => {
  authContext.loadUser()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

  return (
    <>
    <NavButtonHome/>
    <h1 className="HomeGreeting">{getGreeting()}, {user && user.firstName}</h1>
      <h3 className="HomeGreetingSubtitle">You have pending tasks</h3>{" "}
      {/*needs to be updated to be conditional based on db records*/}
      <Grid container direction='row' spacing={4} alignItems='stretch' >
        <Grid item xs={12} md sm={6}>
        <UserCountKPI key={1}/>
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentPendingAuthCountKPI key={2}/>
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentPendingAuthValueKPI key={3}/>
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentsAuthValueKPI />
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentsAuthValueYTDKPI />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item md={6} xs={12}>
          <PaymentsTrend />
        </Grid>
        <Grid item md={6} xs={12}>
          <DemoChart />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
