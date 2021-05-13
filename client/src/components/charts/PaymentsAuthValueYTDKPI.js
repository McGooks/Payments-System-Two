import React, { useContext, useEffect } from "react";
import StatsContext from "../../context/stats/statsContext";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ProgressIndicator from "../layouts/Spinner";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    whiteSpace: 'pre-line',
  },
}));

const PaymentsAuthValueYTDKPI = () => {
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
      ) : stats && stats[5].statsPaymentAuthYTD.length ? (
        <Card className={classes.root}>
          <CardHeader
              title={`£${ccyFormat(stats[5].statsPaymentAuthYTD[0].total)}`}
              subheader={
                <>
                {"Approved for \n"}{stats[6].CurrentAcaYear}
              </>
            }
          />
        </Card>
      ) : (
        <Card className={classes.root}>
          <CardHeader
            title={`£0.00`}
            subheader={
              <>
                  {"Approved for \n"}{stats[6].CurrentAcaYear}
              </>
            }
          />
        </Card>
      )}
    </>
  );
}
export default PaymentsAuthValueYTDKPI