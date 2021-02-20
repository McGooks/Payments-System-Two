import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import AuthReducer from "./AuthReducer";
import SetAuthToken from "../../utils/SetAuthToken";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PASSWORD_RESET_EMAIL_SUCCESS,
  PASSWORD_RESET_EMAIL_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

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
        payload: error.response.data.msg[0].msg,
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
      const res = await axios.post("/api/users", formData, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.msg[0].msg,
      });
    }
  };

  const verifyEmail = async (token) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.put(`/api/users/confirm-email/${token}`, null, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      loadUser();
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.msg[0].msg,
      });
    }
  };

  // //REGISTER USER
  // const accountActivate = async (formData) => {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   try {
  //     const res = await axios.post("/api/users/signup", formData, config);
  //     dispatch({
  //       type: REGISTER_SUCCESS,
  //       payload: res.data,
  //     });
  //     loadUser();
  //   } catch (error) {
  //     dispatch({
  //       type: REGISTER_FAIL,
  //       payload: error.response.data.msg[0].msg,
  //     });
  //   }
  // };

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
        payload: error.response.data.msg[0].msg,
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
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
        verifyEmail,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
