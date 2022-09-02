import React, { useState, useContext } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import SpeedDial from "@mui/lab/SpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Payments from "@mui/icons-material/AccountBalanceWallet";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Reports from "@mui/icons-material/Assessment";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
// UI
import UserAdminAddModal from "../userAdmin/UserAdminAddModal";
import { v4 as uuidv4 } from "uuid";

const PREFIX = 'NavButtonUserProfile';

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

const NavButtonUserProfile = (props) => {

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
    <Root className={classes.root}>
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
    </Root>
  );
};

export default NavButtonUserProfile;
