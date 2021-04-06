import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonPayments from "../../components/layouts/NavButtonPayments";
import ProgressIndicator from "../layouts/Spinner";
//Components
import Payments from "../../components/payments/Payments";
import PaymentsNav from "../../components/payments/PaymentsNav";
//State
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";
import { useSnackbar } from "notistack";

const Payment = (props) => {
  const authContext = useContext(AuthContext);
  const paymentContext = useContext(PaymentContext);
  const { loadUser, isAdmin, user } = authContext;
  const { getPayments, payments, loading, setLoading, error, clearErrors, rejectAllPayments, approveAllPayments } = paymentContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    loadUser();
    getPayments()
    if (!authContext.loading && !isAdmin) {
      props.history.push("/");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
  }, [isAdmin, props.history, error, loading]);

  const onClickReject = () => {
    setLoading()
    rejectAllPayments()
    getPayments()
  }

  const onClickApprove = () => {
    setLoading()
    approveAllPayments()
    getPayments()
  }

  return (
    <>
      {loading ? (
        <ProgressIndicator />
      ) : (
        <>
          <NavButtonPayments />
            <PaymentsNav onClickReject={onClickReject} onClickApprove={onClickApprove}/>
          <Payments user={user} isAdmin={isAdmin} payments={payments} />
        </>
      )}
    </>
  );
};

export default Payment;
