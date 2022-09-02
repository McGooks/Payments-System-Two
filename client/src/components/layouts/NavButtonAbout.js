import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import SpeedDial from "@mui/lab/SpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { v4 as uuidv4 } from "uuid";

const PREFIX = 'NavButtonAbout';

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

const NavButtonAbout = () => {

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
  ];

  return (
    <Root className={classes.root}>
      <SpeedDial
        ariaLabel="About Navigation Control"
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

export default NavButtonAbout;
