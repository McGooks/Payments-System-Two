/* eslint-disable import/no-anonymous-default-export */
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
  CLEAR_FILTER,
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

export default (state, action) => {
  switch (action.type) {
   
    case GET_PAYMENTS: {
      return {
        ...state,
        payments: action.payload,
        loading: false,
      };
    }
    case GET_PAYMENT: 
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
        payments: action.payload,
        loading: false,
      };
    }
    case REJECT_PAYMENT:
    case APPROVE_PAYMENT:
    case HOLD_PAYMENT:
    case PENDING_PAYMENT:
    case PAID_PAYMENT:
    case PAID_ALL_PAYMENTS:
    case REJECT_ALL_PAYMENTS:
    case APPROVE_ALL_PAYMENTS: {
      return {
        ...state,
        payments: action.payload,
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
    case CLEAR_ERRORS: {
      return {
        ...state,
        error: null,
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    default:
      return state;
  }
};
