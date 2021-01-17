import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
    whiteSpace: 'pre-line',
  },
}));

const PaymentsAuthValueYTDKPI = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        title="£10,067.03"
        subheader={"Authorised\n YTD"}
      />
    </Card>
  );
}
export default PaymentsAuthValueYTDKPI