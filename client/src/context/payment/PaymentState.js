import React, { useReducer } from "react";
import axios from "axios";
import paymentContext from "./paymentContext";
import paymentReducer from "./PaymentReducer";
import {
  GET_PAYMENTS,
  GET_PAYMENT,
  GET_USER_PAYMENTS,
  ADD_PAYMENT,
  ADD_USER_PAYMENT,
  DELETE_PAYMENT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_PAYMENT,
  FILTER_PAYMENTS,
  PAYMENT_ERROR,
  CLEAR_PAYMENTS,
  APPROVE_ALL_PAYMENTS,
  REJECT_ALL_PAYMENTS,
  PAID_ALL_PAYMENTS,
  APPROVE_PAYMENT,
  REJECT_PAYMENT,
  HOLD_PAYMENT,
  PENDING_PAYMENT,
  PAID_PAYMENT,
  SET_LOADING,
  CLEAR_ERRORS,
} from "../types";

const PaymentState = (props) => {
  const initialState = {
    payments: null,
    userPayments: null,
    current: null,
    filtered: null,
    error: null,
    loading: true,
  };

  const [state, dispatch] = useReducer(paymentReducer, initialState);

  //Get User Payments
  const getUserPayments = async (id) => {
    try {
      const res = await axios.get(`/api/user/${id}/payments`);
      dispatch({ type: GET_USER_PAYMENTS, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Get Payments
  const getPayments = async () => {
    try {
      const res = await axios.get("/api/payments");
      dispatch({ type: GET_PAYMENTS, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

    //Get Payment
    const getPayment = async (id) => {
      try {
        const res = await axios.get(`/api/payments/${id}`);
        dispatch({ type: GET_PAYMENT, payload: res.data });
      } catch (error) {
        dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
      }
    };

  //Add Payment
  const addPayment = async (payment) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`/api/payments/new`, payment, config);
      dispatch({ type: ADD_PAYMENT, payload: res.data });
      getPayments();
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Add User Payment

  const addUserPayment = async (id, payment) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`/api/user/${id}/payments`, payment, config);
      dispatch({ type: ADD_USER_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Delete Payment
  const deletePayment = async (pid) => {
    try {
      await axios.delete(`/api/payments/${pid}`);
      dispatch({ type: DELETE_PAYMENT, payload: pid });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Update Payment

  const updatePayment = async (payment) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/payments/${payment._id}`,
        payment,
        config
      );
      dispatch({ type: UPDATE_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Approve Payment
  const approvePayment = async (id) => {
    try {
      const res = await axios.put(`/api/payments/${id}/approve`);
      dispatch({ type: APPROVE_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Reject Payment
  const rejectPayment = async (id) => {
    try {
      const res = await axios.put(`/api/payments/${id}/reject`);
      dispatch({ type: REJECT_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Hold Payment
  const holdPayment = async (id) => {
    try {
      const res = await axios.put(`/api/payments/${id}/onhold`);
      dispatch({ type: HOLD_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Pending Payment
  const pendingPayment = async (id) => {
    try {
      const res = await axios.put(`/api/payments/${id}/pending`);
      dispatch({ type: PENDING_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Hold Payment
  const paidPayment = async (id) => {
    try {
      const res = await axios.put(`/api/payments/${id}/paid`);
      dispatch({ type: PAID_PAYMENT, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Approve All Pending Payments
  const approveAllPayments = async () => {
    try {
      const res = await axios.put(`/api/payments/approve`);
      dispatch({ type: APPROVE_ALL_PAYMENTS, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Reject All Pending Payments
  const paidAllPayments = async () => {
    try {
      const res = await axios.put(`/api/payments/paid`);
      dispatch({ type: PAID_ALL_PAYMENTS, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Reject All Pending Payments
  const rejectAllPayments = async () => {
    try {
      const res = await axios.put(`/api/payments/reject`);
      dispatch({ type: REJECT_ALL_PAYMENTS, payload: res.data });
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Set Current Payment
  const setCurrent = (payment) => {
    dispatch({ type: SET_CURRENT, payload: payment });
  };

  //Clear Current Payment
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };


  //Clear Payments

  const clearPayments = () => {
    dispatch({ type: CLEAR_PAYMENTS });
  };

  //Clear Payments

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };
  const setLoading = () => {
    return {
      type: SET_LOADING,
    };
  };

  return (
    <paymentContext.Provider
      value={{
        payments: state.payments,
        userPayments: state.userPayments,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getPayments,
        getPayment,
        getUserPayments,
        addPayment,
        addUserPayment,
        deletePayment,
        setCurrent,
        clearCurrent,
        updatePayment,
        clearPayments,
        approvePayment,
        rejectPayment,
        holdPayment,
        pendingPayment,
        paidPayment,
        approveAllPayments,
        rejectAllPayments,
        paidAllPayments,
        setLoading,
        clearErrors,
      }}
    >
      {props.children}
    </paymentContext.Provider>
  );
};

export default PaymentState;
