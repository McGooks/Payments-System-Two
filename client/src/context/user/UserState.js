import React, { useReducer } from "react";
import axios from "axios";
import UserContext from "./userContext.js";
import userReducer from "./UserReducer";

import {
  GET_USER,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  USER_ERROR,
  CLEAR_ERRORS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  GET_UK_TOWNS,
} from "../types";

const UserState = (props) => {
  const initialState = {
    loading: true,
    user: null,
    towns: null,
    current: null,
    error: null,
    toggleDialog: false,
    data: null
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

    //Get Users
    const getTowns = async () => {
      try {
        const res = await axios.get("/api/user/");
        dispatch({ type:  GET_UK_TOWNS, payload: res.data });
      } catch (error) {
        dispatch({
          type: USER_ERROR,
          payload: error.response.data.msg[0].msg,
        });
      }
    };

  //Get User
  const getUser = async (id) => {
    try {
      const res = await axios.get(`/api/user/${id}`);
      dispatch({ type: GET_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.msg[0].msg,
      });
    }
  };

  //Add User
  const addUser = async (user) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("api/user", user, config);
      dispatch({ type: ADD_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.msg[0].msg,
      });
    }
  };

  //Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`api/user/${id}`);
      dispatch({ type: DELETE_USER, payload: id });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.msg[0].msg,
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
      const res = await axios.put(`api/user/${user._id}`, user, config);
      dispatch({ type: UPDATE_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.msg[0].msg,
      });
    }
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

  //Set Dialog Open
  const setDialogOpen = () => {
    dispatch({ type: OPEN_DIALOG });
  };

  //Set Dialog Open
  const setDialogClosed = () => {
    dispatch({ type: CLOSE_DIALOG });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        toggleDialog: state.toggleDialog,
        loading: state.loading,
        current: state.current,
        error: state.error,
        getUser,
        addUser,
        deleteUser,
        setCurrent,
        clearCurrent,
        updateUser,
        clearErrors,
        setDialogOpen,
        setDialogClosed,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
