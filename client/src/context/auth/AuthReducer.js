/* eslint-disable import/no-anonymous-default-export */
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_EMAIL_FAIL,
  PASSWORD_RESET,
  RESEND_VERIFY,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
  CLEAR_ERRORS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log(action.payload.token);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: action.payload.role === "Admin" ? true : false,
        loading: false,
        user: action.payload,
      };
    case PASSWORD_RESET_REQUEST:
    case PASSWORD_RESET:
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isAdmin: null,
        loading: false,
        user: null,
        error: action.payload,
      };
    case RESEND_VERIFY:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case PASSWORD_RESET_EMAIL_FAIL:
      return {
        ...state,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
