import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from "@material-ui/icons/Menu";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const NavButtonAbout = () => {
  const classes = useStyles();
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
    <div className={classes.root}>
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
    </div>
  );
};

export default NavButtonAbout;
