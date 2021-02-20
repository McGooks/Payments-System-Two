import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from '@material-ui/icons/Menu';
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import GroupIcon from '@material-ui/icons/Group';
import Payments from "@material-ui/icons/AccountBalanceWallet";
import Reports from "@material-ui/icons/Assessment";
import Admin from "@material-ui/icons/Settings";
import InfoIcon from '@material-ui/icons/Info';

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

const actions = [
  { id: 1, icon: (<Link to="/userAdmin"><GroupIcon /></Link>), name: "User Management" },
  { id: 2, icon: (<Link to="/payments"><Payments /></Link>), name: "Payments" },
  { id: 3, icon: (<Link to="#"><Reports /></Link>), name: "Report Manager" },
  { id: 4, icon: (<Link to="#"><Admin /></Link>), name: "Admin" },
  { id: 5, icon: (<Link to="/about"><InfoIcon /></Link>), name: "About" },
];

const NavButtonHome = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="Home Navigation Control"
        className={classes.speedDial}
        icon={<MenuIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{ color: "secondary"}}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.id}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default NavButtonHome;

