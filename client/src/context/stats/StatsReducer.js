/* eslint-disable import/no-anonymous-default-export */
import {
GET_STATS,
STATS_ERROR
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_STATS: {
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    }
    case STATS_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
