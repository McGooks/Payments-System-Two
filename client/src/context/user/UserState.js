import React, { useReducer } from "react";
import axios from "axios";
import UserContext from "./userContext.js";
import userReducer from "./UserReducer";

import {
  GET_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  CLEAR_ERRORS,
  USER_ERROR,
  CLEAR_USER
} from "../types";

const UserState = (props) => {
  const initialState = {
    loading: true,
    user: null,
    current: null,
    error: null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  //Get User
  const getUser = async (id) => {
    try {
      const res = await axios.get(`/api/user/${id}`);
      dispatch({ type: GET_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.error
      });
    }
  };

  //Update User Record
  const updateUser = async (user) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(`/api/user/${user._id}`, user, config);
      dispatch({ type: UPDATE_USER, payload: res.data });
      setCurrent(user)
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.error
      });
    }
  };

  const clearUserAccount = () => {
    dispatch({ type: CLEAR_USER });
  };

  //Set Current User
  const setCurrent = (user) => {
    dispatch({ type: SET_CURRENT, payload: user });
  };

  //Clear Current User
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  //Clear Errors User
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        current: state.current,
        error: state.error,
        getUser,
        setCurrent,
        clearCurrent,
        updateUser,
        clearErrors,
        clearUserAccount
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
