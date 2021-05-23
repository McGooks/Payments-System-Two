import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from "@material-ui/icons/Menu";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Payments from "@material-ui/icons/AccountBalanceWallet";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Reports from "@material-ui/icons/Assessment";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
// UI
import UserAdminAddModal from "../userAdmin/UserAdminAddModal";
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

const NavButtonUserProfile = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { isAdmin } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  let actions;

  // eslint-disable-next-line no-lone-blocks
  {
    isAdmin
      ? (actions = [
          {
            id: 1,
            icon: (
              <Link to="/userAdmin">
                <ArrowBackIcon />
              </Link>
            ),
            name: "Back",
          },
          {
            id: 2,
            icon: (
              <Link to="/payments">
                <Payments />
              </Link>
            ),
            name: "Payments",
          },
        ])
      : (actions = [
          {
            id: 1,
            icon: (
              <Link to={"/"}>
                <ArrowBackIcon />
              </Link>
            ),
            name: "Back",
          },
        ]);
  }

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="User Profile Navigation Control"
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

export default NavButtonUserProfile;
