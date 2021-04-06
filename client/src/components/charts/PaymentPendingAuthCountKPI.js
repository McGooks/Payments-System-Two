import React, {useContext, useEffect} from "react";
import StatsContext from "../../context/stats/statsContext";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ProgressIndicator from "../layouts/Spinner";
import VertIconMenu from "../../components/layouts/VertIconMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    whiteSpace: 'pre-line'
  },
}));

const PaymentPendingAuthCountKPI = () => {
  const classes = useStyles();
  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;
 
  useEffect(() => {
    getStatData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

  return (
    <>
    {stats !== null && !loading ? (
     <Card className={classes.root}>
     <CardHeader
     action={<VertIconMenu />}
       title={stats[1].statsPending}
       subheader={"Payments Pending"}
     />
   </Card>
    ) : (
      <ProgressIndicator />
    )}
  </>
  );
};
export default PaymentPendingAuthCountKPI;

