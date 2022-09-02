import React from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import SpeedDial from "@mui/lab/SpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Import from "@mui/icons-material/Publish";
import Reports from "@mui/icons-material/Assessment";
import { v4 as uuidv4 } from "uuid";

const PREFIX = 'NavButtonPayments';

const classes = {
  root: `${PREFIX}-root`,
  speedDial: `${PREFIX}-speedDial`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },

  [`& .${classes.speedDial}`]: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const actions = [
  {
    id: 1,
    icon: (
      <Link to="/">
        <ArrowBackIcon />
      </Link>
    ),
    name: "Back",
  },
  {
    id: 2,
    icon: (
      <Link to="/import">
        <Import />
      </Link>
    ),
    name: "Import File",
  },
  // {
  //   id: 3,
  //   icon: (
  //     <Link to="/payments">
  //       <AttachMoneyIcon />
  //     </Link>
  //   ),
  //   name: "Manually Add Payment",
  // },
  // {
  //   id: 4,
  //   icon: (
  //     <Link to="#">
  //       <Reports />
  //     </Link>
  //   ),
  //   name: "Report Manager",
  // },
];

const NavButtonPayments = () => {

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Root className={classes.root}>
      <SpeedDial
        ariaLabel="Payments Navigation Control"
        className={classes.speedDial}
        icon={<MenuIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{ color: "secondary" }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={uuidv4()}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Root>
  );
};

export default NavButtonPayments;
