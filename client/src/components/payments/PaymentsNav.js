import React, { Fragment } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
//Components
import { Grid, Paper, Button } from "@mui/material";
import clsx from "clsx";

const PREFIX = 'PaymentsNav';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  right: `${PREFIX}-right`,
  left: `${PREFIX}-left`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    textAlign: "right",
    color: theme.palette.text.secondary,
  },

  [`& .${classes.right}`]: {
    textAlign: "right",
  },

  [`& .${classes.left}`]: {
    textAlign: "left",
  }
}));

const PaymentsNav = (props) => {

  const { onClickReject, onClickApprove, onClickPaid } = props;

  const onClickRejectAll = () => {
    onClickReject();
  };

  const onClickApproveAll = () => {
    onClickApprove();
  };

  const onClickPaidAll = () => {
    onClickPaid();
  };

  return (
    <Root>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Grid item xs={4} className={clsx(classes.root, classes.left)}>
                <Button
                  onClick={onClickRejectAll}
                  variant="contained"
                  color="secondary"
                >
                  Reject All Pending
                </Button>
              </Grid>
              <Grid item xs={8} className={clsx(classes.root, classes.right)}>
                <Button variant="contained" component={Link} to="/payments/new">
                  Add Payment
                </Button>
                <Button
                  onClick={onClickApproveAll}
                  variant="contained"
                  color="primary"
                >
                  Approve All Pending
                </Button>
                <Button
                  onClick={onClickPaidAll}
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                  }}
                >
                  Mark All As Paid
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Root>
  );
};

export default PaymentsNav;
