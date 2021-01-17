import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
  },
}));

const PaymentPendingAuthValueKPI = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        title="£1,159.47"
        subheader="Pending Authorisation"
      />
    </Card>
  );
}
export default PaymentPendingAuthValueKPI