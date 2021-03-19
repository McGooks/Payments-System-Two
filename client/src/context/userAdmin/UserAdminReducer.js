/* eslint-disable import/no-anonymous-default-export */
import {
  GET_USERS,
  GET_ACTIVE_USERS,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  CLEAR_ERRORS,
  USER_ERROR,
  CLEAR_USERS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_USERS: {
      return {
        ...state,
        users: action.payload,
        importedUsersAdded: false,
        loading: false,
      };
    }
    case GET_ACTIVE_USERS: {
      return {
        ...state,
        activeUsers: action.payload,
        loading: false,
      };
    }
    case ADD_USER: {
      return {
        ...state,
        users: [action.payload, ...state.users],
        importedUsersAdded: true,
        loading: false,
      };
    }
    case DELETE_USER: {
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        loading: false,
      };
    }
    case UPDATE_USER: {
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        loading: false,
      };
    }
    case CLEAR_USERS: {
      return {
        ...state,
        users: null,
        error: null,
        current: null,
        activeUsers: null,
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
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case USER_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case OPEN_DIALOG: {
      return {
        ...state,
        toggleDialog: true,
      };
    }
    case CLOSE_DIALOG: {
      return {
        ...state,
        current: null,
        toggleDialog: false,
      };
    }
    default:
      return state;
  }
};
