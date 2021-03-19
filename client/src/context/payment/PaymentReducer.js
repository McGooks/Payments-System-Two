/* eslint-disable import/no-anonymous-default-export */
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

export default (state, action) => {
  switch (action.type) {
    case GET_PAYMENTS: {
      return {
        ...state,
        payments: action.payload,
        loading: false,
      };
    }
    case GET_USER_PAYMENTS: {
      return {
        ...state,
        userPayments: action.payload,
        loading: false,
      };
    }
    case ADD_USER_PAYMENT:
    case ADD_PAYMENT: {
      return {
        ...state,
        payments: [action.payload, ...state.payments],
        loading: false,
      };
    }
    case DELETE_PAYMENT: {
      return {
        ...state,
        payments: state.payments.filter(
          (payment) => payment._id !== action.payload
        ),
        loading: false,
      };
    }
    case UPDATE_PAYMENT: {
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment._id === action.payload._id ? action.payload : payment
        ),
        loading: false,
      };
    }
    case CLEAR_PAYMENTS: {
      return {
        ...state,
        payments: null,
        filtered: null,
        error: null,
        current: null,
      };
    }
    case SET_CURRENT: {
      return {
        ...state,
        current: action.payload,
      };
    }
    case CLEAR_CURRENT: {
      return {
        ...state,
        current: null,
      };
    }
    case FILTER_PAYMENTS: {
      return {
        ...state,
        filtered: state.payments.filter((payment) => {
          const regex = new RegExp(`${action.payload}`, "gi"); //GI = Global Insensitive Search
          return payment.name.match(regex) || payment.email.match(regex);
        }),
      };
    }
    case CLEAR_FILTER: {
      return {
        ...state,
        filtered: null,
      };
    }
    case PAYMENT_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
