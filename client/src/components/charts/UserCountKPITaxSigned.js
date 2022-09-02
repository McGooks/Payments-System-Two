import React, { useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
import StatsContext from "../../context/stats/statsContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ProgressIndicator from "../layouts/Spinner";

const PREFIX = 'UserCountKPITAxSigned';

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

const UserCountKPITAxSigned = () => {

  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    (<Root>
      {stats !== null && !loading ? (
        <Card className={classes.root}>
          <CardHeader title={stats[0].statsActive} subheader={"Active Users"} />
        </Card>
      ) : (
        <ProgressIndicator />
      )}
    </Root>)
  );
};
export default UserCountKPITAxSigned;
