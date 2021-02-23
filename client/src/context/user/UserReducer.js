/* eslint-disable import/no-anonymous-default-export */
import {
  GET_USER,
  ADD_USER,
  DELETE_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  FILTER_USERS,
  CLEAR_FILTER,
  CLEAR_ERRORS,
  USER_ERROR,
  CLEAR_USERS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  GET_UK_TOWNS
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_UK_TOWNS : {
      return {
      ...state,
      towns: action.payload,
      loading: false,
      }
    }
    case GET_USER: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }
    case ADD_USER: {
      return {
        ...state,
        users: [action.payload, ...state.users],
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
    case FILTER_USERS: {
      return {
        ...state,
        filtered: state.users.filter((user) => {
          const regex = new RegExp(`${action.payload}`, "gi"); //GI = Global Insensitive Search
          return user.firstName.match(regex) || user.email.match(regex);
        }),
      };
    }
    case CLEAR_FILTER: {
      return {
        ...state,
        filtered: null,
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
