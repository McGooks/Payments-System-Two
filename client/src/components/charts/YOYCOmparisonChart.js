import React, { useContext, useEffect } from "react";
import StatsContext from "../../context/stats/statsContext";
import { Chart } from "react-charts";
import Card from "@mui/material/Card";
import ProgressIndicator from "../layouts/Spinner";

const YOYCOmparisonChart = (props) => {
  const statsContext = useContext(StatsContext);
  const { getStatData, loading } = statsContext;
  const { stats } = props;

  useEffect(() => {
    getStatData();
    const statsCurrentSemComp =
      !loading &&
      stats &&
      stats[7].statsCurrentSemComp.length &&
      stats[8].statsPrevSemComp.length
        ? stats[7].statsCurrentSemComp
        : [{ x: 0, y: 10.0 }];

    const statsPrevSemComp =
      !loading &&
      stats &&
      stats[7].statsCurrentSemComp.length &&
      stats[8].statsPrevSemComp.length
        ? stats[8].statsPrevSemComp
        : [{ x: 0, y: 10.0 }];

    const data =
      (() => [
        {
          label: "Current Academic Year",
          data: statsCurrentSemComp,
        },
        {
          label: "Previous Academic Year",
          data: statsPrevSemComp,
        },
      ],
      []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsCurrentSemComp =
    !loading &&
    stats &&
    stats[7].statsCurrentSemComp.length &&
    stats[8].statsPrevSemComp.length
      ? stats[7].statsCurrentSemComp
      : [{ x: 0, y: 10.0 }];

  const statsPrevSemComp =
    !loading &&
    stats &&
    stats[7].statsCurrentSemComp.length &&
    stats[8].statsPrevSemComp.length
      ? stats[8].statsPrevSemComp
      : [{ x: 0, y: 10.0 }];

  const data = React.useMemo(
    () => [
      {
        label: "Current Academic Year",
        data: statsCurrentSemComp,
      },
      {
        label: "Previous Academic Year",
        data: statsPrevSemComp,
      },
    ],
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  // A react-chart hyper-responsively and continuously fills the available
  // space of its parent element automatically
  return (
    <>
      {loading ? (
        <ProgressIndicator />
      ) : stats &&
        stats[7].statsCurrentSemComp.length &&
        stats[8].statsPrevSemComp.length ? (
        <Card>
          <div
            style={{
              width: 450,
              height: 300,
              margin: 15,
              padding: 1,
            }}
          >
            <Chart data={data} series={{ type: "bar" }} axes={axes} />
          </div>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};
export default YOYCOmparisonChart;
