import React, { useContext, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
//Navigation
import NavButtonPaymentsAdd from "../layouts/NavButtonPaymentsAdd";
//Components
import ViewPayments from "../payments/ViewPayments";
import ProgressIndicator from "../layouts/Spinner";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";

const PaymentsView = () => {
  const authContext = useContext(AuthContext);
  const userAdminContext = useContext(UserAdminContext);
  const paymentContext = useContext(PaymentContext);
  const {
    getPayment,
    loading,
    current,
  } = paymentContext;
  const { getActiveUsers } = userAdminContext;
  const { loadUser, isAdmin } = authContext;
  const { id } = useParams();

  useEffect(() => {
    getPayment(id);
  }, [id]);

  useEffect(() => {
    loadUser();
    getActiveUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NavButtonPaymentsAdd />
      {!loading && current ? <ViewPayments current={current} isAdmin={isAdmin} /> : <ProgressIndicator />}
    </>
  );
};

export default PaymentsView;
