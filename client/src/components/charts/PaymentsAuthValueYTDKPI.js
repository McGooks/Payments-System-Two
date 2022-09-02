import React, { useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
import StatsContext from "../../context/stats/statsContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ProgressIndicator from "../layouts/Spinner";

const PREFIX = 'PaymentsAuthValueYTDKPI';

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

const PaymentsAuthValueYTDKPI = () => {

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
      ) : stats && stats[5].statsPaymentAuthYTD.length ? (
        <Card className={classes.root}>
          <CardHeader
            title={`£${ccyFormat(stats[5].statsPaymentAuthYTD[0].total)}`}
            subheader={
              <>
                {"Approved for \n"}
                {stats[6].CurrentAcaYear}
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
                {"Approved for \n"}
                {stats[6].CurrentAcaYear}
              </>
            }
          />
        </Card>
      )}
    </Root>)
  );
};
export default PaymentsAuthValueYTDKPI;
