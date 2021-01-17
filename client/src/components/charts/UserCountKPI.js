import React, { useContext, useEffect } from "react";
import StatsContext from "../../context/stats/statsContext";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ProgressIndicator from "../layouts/Spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
    whiteSpace: "pre-line",
  },
}));

const UserCountKPI = () => {
  const classes = useStyles();
  const statsContext = useContext(StatsContext);
  const { stats, getStatData, loading } = statsContext;

  useEffect(() => {
    getStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {stats !== null && !loading ? (
        <Card className={classes.root}>
          <CardHeader
            key={stats[0].id}
            title={stats[0].statsActive}
            subheader={"Active Users"}
          />
        </Card>
      ) : (
        <ProgressIndicator />
      )}
    </>
  );
};
export default UserCountKPI;
