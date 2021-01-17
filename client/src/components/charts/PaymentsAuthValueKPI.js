import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
    whiteSpace: 'pre-line'
  },
}));

const PaymentsAuthValueKPI = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        title="£7,159.47"
        subheader={"Authorised as of\n January 21"}
      />
    </Card>
  );
}
export default PaymentsAuthValueKPI