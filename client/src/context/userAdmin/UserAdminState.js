import React, { useReducer } from "react";
import axios from "axios";
import UserAdminContext from "./userAdminContext.js";
import userReducer from "./UserAdminReducer";

import {
  GET_USERS,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_FILTER,
  USER_ERROR,
  CLEAR_USERS,
  CLEAR_ERRORS,
} from "../types";

const UserAdminState = (props) => {
  const initialState = {
    loading: true,
    users: null,
    current: null,
    error: null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  //Get Users
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/userAdmin");
      dispatch({ type: GET_USERS, payload: res.data });
    } catch (error) {
      dispatch({ type: USER_ERROR, payload: error.response.data.msg});
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
      const res = await axios.post("api/userAdmin", user, config);
      dispatch({ type: ADD_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: USER_ERROR, payload: error.response.data.msg });
    }
  };

  //Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`api/userAdmin/${id}`);
      dispatch({ type: DELETE_USER, payload: id });
    } catch (error) {
      dispatch({ type: USER_ERROR, payload: error.response.data.msg});
    }
  };

  //Update User

  const updateUser = async (user) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `api/userAdmin/${user._id}`,
        user,
        config
      );
      dispatch({ type: UPDATE_USER, payload: res.data });
    } catch (error) {
      dispatch({ type: USER_ERROR, payload: error.response.msg });
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

  //Filter Users

  const filterUsers = (text) => {
    dispatch({ type: FILTER_USERS, payload: text });
  };

  //Clear Filters

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  //Clear Users

  const clearUsers = () => {
    dispatch({ type: CLEAR_USERS });
  };

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <UserAdminContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        current: state.current,
        error: state.error,
        getUsers,
        addUser,
        deleteUser,
        setCurrent,
        clearCurrent,
        updateUser,
        clearUsers
      }}
    >
      {props.children}
    </UserAdminContext.Provider>
  );
};

export default UserAdminState;
