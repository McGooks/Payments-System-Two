import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import VertIconMenu from "../../components/layouts/VertIconMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
  },
}));

const PaymentPendingAuthCountKPI = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        action={<VertIconMenu />}
        title="3"
        subheader="Payments Pending"
      />
    </Card>
  );
};
export default PaymentPendingAuthCountKPI;
