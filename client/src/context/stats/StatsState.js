import React, { useReducer } from "react";
import axios from "axios";
import StatsContext from "./statsContext.js";
import StatsReducer from "./StatsReducer";

import { GET_STATS, STATS_ERROR } from "../types";

const StatsState = (props) => {
  const initialState = {
    stats: null,
    error: null,
  };

  const [state, dispatch] = useReducer(StatsReducer, initialState);

  //Get Users where their status is set to "Active"
  const getStatData = async () => {
    try {
      let res = await axios.get("/api/stats");
      dispatch({ type: GET_STATS, payload: res.data });
    } catch (error) {
      dispatch({ type: STATS_ERROR, payload: error.response.data.error });
    }
  };
  return (
    <StatsContext.Provider
      value={{
        stats: state.stats,
        error: state.error,
        getStatData,
      }}
    >
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsState;
