import React, { useReducer } from "react";
import axios from "axios";
import UserAdminContext from "./userAdminContext.js";
import userReducer from "./UserAdminReducer";

import {
  GET_USERS,
  GET_ACTIVE_USERS,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  USER_ERROR,
  CLEAR_ERRORS,
  CLEAR_USERS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
} from "../types";

const UserAdminState = (props) => {
  const initialState = {
    importedUsersAdded: false,
    loading: true,
    users: null,
    activeUsers: null,
    current: null,
    error: null,
    toggleDialog: false,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  //Get Users
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/userAdmin");
      dispatch({ type: GET_USERS, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.error
      });
    }
  };

    //Get Users
    const getActiveUsers = async () => {
      try {
        const res = await axios.get("/api/userAdmin/active");
        dispatch({ type: GET_ACTIVE_USERS, payload: res.data });
      } catch (error) {
        dispatch({
          type: USER_ERROR,
          payload: error.response.data.error
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
      const res = await axios.post("/api/userAdmin", user, config);
      dispatch({ type: ADD_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.error
      });
    }
  };

  //Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/userAdmin/${id}`);
      dispatch({ type: DELETE_USER, payload: id });
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
      const res = await axios.put(`/api/userAdmin/${user._id}`, user, config);
      dispatch({ type: UPDATE_USER, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.error
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

  const clearUserAdmin = () => {
    dispatch({ type: CLEAR_USERS });
  };

  const clearActiveUsers = () => {
    dispatch({ type: CLEAR_USERS });
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
    <UserAdminContext.Provider
      value={{
        importedUsersAdded: state.importedUsersAdded,
        users: state.users,
        activeUsers: state.activeUsers,
        toggleDialog: state.toggleDialog,
        loading: state.loading,
        current: state.current,
        error: state.error,
        getUsers,
        getActiveUsers,
        addUser,
        deleteUser,
        setCurrent,
        clearCurrent,
        updateUser,
        clearErrors,
        setDialogOpen,
        setDialogClosed,
        clearUserAdmin,
        clearActiveUsers
      }}
    >
      {props.children}
    </UserAdminContext.Provider>
  );
};

export default UserAdminState;
