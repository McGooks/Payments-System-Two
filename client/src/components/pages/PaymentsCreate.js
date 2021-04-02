import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonPayments from "../layouts/NavButtonPayments"
//Components
import CreatePayments from "../payments/CreatePayments"
//Context
import UserContext from "../../context/user/userContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";

const Home = () => {
  const authContext = useContext(AuthContext);
  const userAdminContext = useContext(UserAdminContext);
  const userContext = useContext(UserContext);
  const paymentContext = useContext(PaymentContext);
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

  useEffect(() => {
    authContext.loadUser();
    getActiveUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <NavButtonPayments />
      <CreatePayments activeUsers={activeUsers}/>
    </>
  );
};

export default Home;
