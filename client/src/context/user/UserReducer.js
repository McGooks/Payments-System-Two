/* eslint-disable import/no-anonymous-default-export */
import {
  GET_USER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_USER,
  CLEAR_ERRORS,
  CLEAR_USER,
  USER_ERROR,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_USER: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }
    case UPDATE_USER: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }
    case CLEAR_USER: {
      return {
        ...state,
        user: null,
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
    default:
      return state;
  }
};
