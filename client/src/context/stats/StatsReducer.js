/* eslint-disable import/no-anonymous-default-export */
import {
GET_STATS,
// GET_STATS_PENDING_PAYMENT,
// GET_STATS_VALUE_PENDING_AUTH,
// GET_STATS_MTD_VALUE_AUTH_TOTAL,
// GET_STATS_YTD_VALUE_AUTH_TOTAL,
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
