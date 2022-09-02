import React, { useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
import StatsContext from "../../context/stats/statsContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ProgressIndicator from "../layouts/Spinner";

const PREFIX = 'PaymentPendingAuthValueKPI';

const classes = {
  root: `${PREFIX}-root`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    height: "100%",
    whiteSpace: "pre-line",
  }
}));

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const PaymentPendingAuthValueKPI = () => {

  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    (<Root>
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
          <CardHeader title={`£0.00`} subheader={"Pending \nAuthorisation"} />
        </Card>
      )}
    </Root>)
  );
};

export default PaymentPendingAuthValueKPI;
