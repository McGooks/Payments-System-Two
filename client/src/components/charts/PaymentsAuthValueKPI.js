import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Moment from 'react-moment';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
    whiteSpace: "pre-line",
  },
}));

const PaymentsAuthValueKPI = () => {
  const classes = useStyles();

  let currentMonth = new Date();
  console.log(currentMonth);

  return (
    <Card className={classes.root}>
      <CardHeader
        title="£7,159.47"
        subheader={<>Authorised in <Moment format="MMMM YY">{currentMonth}</Moment></>}
      />
    </Card>
  );
};
export default PaymentsAuthValueKPI;
