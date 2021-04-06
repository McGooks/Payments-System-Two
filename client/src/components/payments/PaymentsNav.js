import React, {Fragment } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
//Components
import { Grid, Paper, Button } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "right",
    color: theme.palette.text.secondary,
  },
  right: {
    textAlign: "right",
  },
  left: {
    textAlign: "left",
  },
}));

const PaymentsNav = (props) => {
  const classes = useStyles();

  const { onClickReject, onClickApprove } = props;

  const onClickRejectAll = () => {
    onClickReject();
  };
    
  const onClickApproveAll = () => {
    onClickApprove();
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Grid item xs={6} className={clsx(classes.root, classes.left)}>
                <Button
                  onClick={onClickRejectAll}
                  variant="contained"
                  color="secondary"
                >
                  Reject All Pending
                </Button>
              </Grid>
              <Grid item xs={6} className={clsx(classes.root, classes.right)}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/payments/new"
                  color="default"
                >
                  Add Payment
                </Button>
                <Button
                  onClick={onClickApproveAll}
                  variant="contained"
                  color="primary"
                >
                  Approve All Pending
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default PaymentsNav;