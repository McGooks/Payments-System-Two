import React, { useContext, useEffect, useState } from "react";
//Navigation
import NavButtonPayments from "../../components/layouts/NavButtonPayments";
import ProgressIndicator from "../layouts/Spinner";
//Components
import Payments from "../../components/payments/Payments";
import PaymentsNav from "../../components/payments/PaymentsNav";
import Dialog from "../layouts/ConfirmationDialog";
//State
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";
import { useSnackbar } from "notistack";

const Payment = (props) => {
  const authContext = useContext(AuthContext);
  const paymentContext = useContext(PaymentContext);
  const { loadUser, isAdmin, user } = authContext;
  const {
    getPayments,
    payments,
    loading,
    setLoading,
    error,
    clearErrors,
    rejectAllPayments,
    approveAllPayments,
    paidAllPayments,
  } = paymentContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    loadUser();
    getPayments();
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

  const [formShowing, setFormShowing] = useState(false);
  const [stage, setStage] = useState("");

  const showForm = () => {
    setFormShowing(true);
  };
  
  const hideForm = () => {
    setFormShowing(false);
  };

  const onClickReject = () => {
    showForm();
    setStage("RejectAllPayments");
  };

  const onClickApprove = () => {
    showForm();
    setStage("ApproveAllPayments");
  };

  const onClickPaid = () => {
    showForm();
    setStage("PaidAllPayments");
  };

  const onClickRejectConfirm = () => {
    hideForm();
    setStage("");
    setLoading();
    rejectAllPayments();
    getPayments();
  };

  const onClickApproveConfirm = () => {
    hideForm();
    setStage("");
    setLoading();
    approveAllPayments();
    getPayments();
  };

  const onClickPaidConfirm = () => {
    hideForm();
    setStage("");
    setLoading();
    paidAllPayments();
    getPayments();
  };

  return (
    <>
      {loading ? (
        <ProgressIndicator />
      ) : (
        <>
            <NavButtonPayments />
            

          <PaymentsNav
            onClickReject={onClickReject}
            onClickApprove={onClickApprove}
            onClickPaid={onClickPaid}
            />
            
          <Payments user={user} isAdmin={isAdmin} payments={payments} />
          {formShowing && (
            <Dialog
              RejectAllPayments={onClickRejectConfirm}
              ApproveAllPayments={onClickApproveConfirm}
              PaidAllPayments={onClickPaidConfirm}
              hideForm={hideForm}
              stage={stage}
            />
          )}
        </>
      )}
    </>
  );
};

export default Payment;
