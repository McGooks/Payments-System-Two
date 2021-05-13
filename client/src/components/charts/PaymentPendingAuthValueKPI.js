import React, { useContext, useEffect } from "react";
import StatsContext from "../../context/stats/statsContext";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ProgressIndicator from "../layouts/Spinner";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    whiteSpace: "pre-line",
  },
}));
const PaymentPendingAuthValueKPI = () => {
  const classes = useStyles();
  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <ProgressIndicator />
      ) : stats && stats[3].statsPaymentPendingAuth.length ? (
        <Card className={classes.root}>
          <CardHeader
            title={`£${ccyFormat(stats[3].statsPaymentPendingAuth[0].total)}`}
            subheader={"Pending\n Approval"}
          />
        </Card>
      ) : (
        <Card className={classes.root}>
          <CardHeader title={`£0.00`} subheader={"Pending Authorisation"} />
        </Card>
      )}
    </>
  );
};

export default PaymentPendingAuthValueKPI;
