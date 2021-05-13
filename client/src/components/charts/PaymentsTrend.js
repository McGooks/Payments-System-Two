import React, { useContext, useEffect } from "react";
import StatsContext from "../../context/stats/statsContext";
import { Chart } from "react-charts";
import Card from "@material-ui/core/Card";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const PaymentTrend = () => {
  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const data = React.useMemo(
    () => [
      {
        label: "Series 1",
        data: [
          [1, 1],
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 7],
          [5, 0],
        ],
      },
      {
        label: "Series 2",
        data: [
          [0, 3],
          [1, 1],
          [2, 5],
          [3, 6],
          [4, 4],
        ],
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
    <Card>
      <div
        style={{
          width: 450,
          height: 300,
          margin: 15,
          padding: 1
        }}
      >
        <Chart data={data} axes={axes} />
      </div>
    </Card>
  );
};
export default PaymentTrend;
