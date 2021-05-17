import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_EMAIL_FAIL,
  PASSWORD_RESET,
  RESEND_VERIFY,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";
import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import AuthReducer from "./AuthReducer";
import SetAuthToken from "../../utils/SetAuthToken";
import { useSnackbar } from "notistack";


const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isAdmin: null,
    loading: true,
    user: null,
    error: null,
  };
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //Password Reset Request Email
  const passwordUpdateRequest = async (token, formData) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.put(
        `/api/users/password-reset/${token}`,
        formData,
        config
      );
      dispatch({ type: PASSWORD_RESET, payload: res.data });
      enqueueSnackbar("Password reset, please login", {
        variant: "success",
      });
      logout();
    } catch (error) {
      dispatch({
        type: PASSWORD_RESET_EMAIL_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //LOAD USER
  const loadUser = async () => {
    if (localStorage.token) {
      SetAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("/api/auth");
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response.data.error,
      });
    }
  };

  //REGISTER USER
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/users/register", formData, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      enqueueSnackbar(`New User Registered`, {
        variant: "success",
      });
      loadUser();
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //Verify Email
  const verifyEmail = async (token) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.put(
        `/api/users/confirm-email/${token}`,
        null,
        config
      );
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      enqueueSnackbar("Email address confirmed, please log in", {
        variant: "success",
      });
      loadUser();
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //Password Reset Request Email
  const passwordResetRequest = async (id) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.post(
        `/api/users/password-reset-request/${id}`,
        null,
        config
      );
      dispatch({ type: PASSWORD_RESET_REQUEST, payload: res.data });
    } catch (error) {
      dispatch({
        type: PASSWORD_RESET_EMAIL_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //Password Reset Request Email
  const passwordResetRequestPublic = async (formData) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.post(
        `/api/users/password-reset-request-public`,
        formData,
        config
      );
      let ID = res.data;
      await passwordResetRequest(ID);
    } catch (error) {
      dispatch({
        type: PASSWORD_RESET_EMAIL_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //Verify Email
  const resendVerifyEmail = async (id) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.post(`/api/user/resend/${id}`, null, config);
      dispatch({ type: RESEND_VERIFY, payload: res.data });
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //LOGIN USER
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/auth", formData, config);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  //LOGOUT
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  //CLEAR ERRORS
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
        verifyEmail,
        resendVerifyEmail,
        passwordResetRequest,
        passwordUpdateRequest,
        passwordResetRequestPublic,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
