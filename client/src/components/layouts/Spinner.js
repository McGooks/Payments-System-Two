import React from "react";
import { styled } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";

const PREFIX = 'ProgressIndicator';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
    flexDirection: "row",
    justifyContent: "center",
  }
}));

const ProgressIndicator = () => {


  return (
    <Root className={classes.root}>
      <CircularProgress color="secondary" />
    </Root>
  );
};
export default ProgressIndicator;
