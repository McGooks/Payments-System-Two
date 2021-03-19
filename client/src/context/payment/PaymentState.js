import React, { useReducer } from "react";
import axios from "axios";
import paymentContext from "./paymentContext";
import paymentReducer from "./PaymentReducer";
import {
  GET_PAYMENTS,
  GET_USER_PAYMENTS,
  ADD_PAYMENT,
  ADD_USER_PAYMENT,
  DELETE_PAYMENT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_PAYMENT,
  FILTER_PAYMENTS,
  CLEAR_FILTER,
  PAYMENT_ERROR,
  CLEAR_PAYMENTS,
} from "../types";

const PaymentState = (props) => {
  const initialState = {
    payments: null,
    userPayments: null,
    current: null,
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(paymentReducer, initialState);

  //Get User Payments
  const getUserPayments = async (id) => {
    try {
      const res = await axios.get(`/api/user/${id}/payments`);
      console.log("cl from res", res);
      dispatch({ type: GET_USER_PAYMENTS, payload: res.data.payments });
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
    } catch (error) {
      dispatch({ type: PAYMENT_ERROR, payload: error.response.data.error });
    }
  };

  //Add Payment

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
  const deletePayment = async (id, pid) => {
    try {
      await axios.delete(`/api/user/${id}/payments/${pid}`);
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
        `/api/userAdmin/${payment._id}`,
        payment,
        config
      );
      dispatch({ type: UPDATE_PAYMENT, payload: res.data });
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

  //Filter Payments

  const filterPayments = (text) => {
    dispatch({ type: FILTER_PAYMENTS, payload: text });
  };

  //Clear Filters

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  //Clear Payments

  const clearPayments = () => {
    dispatch({ type: CLEAR_PAYMENTS });
  };

  return (
    <paymentContext.Provider
      value={{
        payments: state.payments,
        userPayments: state.userPayments,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        getPayments,
        getUserPayments,
        addPayment,
        addUserPayment,
        deletePayment,
        setCurrent,
        clearCurrent,
        updatePayment,
        filterPayments,
        clearFilter,
        clearPayments,
      }}
    >
      {props.children}
    </paymentContext.Provider>
  );
};

export default PaymentState;
