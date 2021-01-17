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
//Components
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter"
//State
import AuthContext from "../../context/auth/authContext"

const Home = () => {
 const authContext = useContext(AuthContext)
 const { user } = authContext;

 useEffect(() => {
  authContext.loadUser()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])


  return (
    <>
    <NavButtonHome/>
    <h1 className="HomeGreeting">Hi, {user && user.firstName}</h1>
      <h3 className="HomeGreetingSubtitle">You have pending tasks</h3>{" "}
      {/*needs to be updated to be conditional based on db records*/}
      <Grid container direction='row' spacing={4} alignItems='stretch' >
        <Grid item xs={12} md sm={6}>
        <UserCountKPI/>
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentPendingAuthCountKPI />
        </Grid>
        <Grid item xs={12} md sm={6}>
        <PaymentPendingAuthValueKPI />
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
    <div className="grid-2">
      <div>
        <ContactForm />
      </div>
      <div>
        <ContactFilter/>
      </div>
    </div>
    </>
  );
};

export default Home;
