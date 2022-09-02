import React, { useContext, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import SpeedDial from "@mui/lab/SpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import Payments from "@mui/icons-material/AccountBalanceWallet";
import Reports from "@mui/icons-material/Assessment";
import Admin from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { v4 as uuidv4 } from "uuid";

//State
import AuthContext from "../../context/auth/authContext";

const PREFIX = 'NavButtonHome';

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

const NavButtonHome = (props) => {

  const [open, setOpen] = React.useState(false);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const { isAdmin } = props;

  useEffect(() => {
    if (user !== null) {
      setUserID(user._id);
    } else {
      setUserID({
        _id: "",
      });
    }
  }, [authContext, user]);

  const [userID, setUserID] = useState({
    _id: "",
  });

  let actions;

  // eslint-disable-next-line no-lone-blocks
  {
    isAdmin
      ? (actions = [
          {
            id: 1,
            icon: (
              <Link to="/userAdmin">
                <GroupIcon />
              </Link>
            ),
            name: "User Management",
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
          // {
          //   id: 3,
          //   icon: (
          //     <Link to="#">
          //       <Reports />
          //     </Link>
          //   ),
          //   name: "Report Manager",
          // },
          // {
          //   id: 4,
          //   icon: (
          //     <Link to="#">
          //       <Admin />
          //     </Link>
          //   ),
          //   name: "Admin",
          // },
          {
            id: 5,
            icon: (
              <Link to="/about">
                <InfoIcon />
              </Link>
            ),
            name: "About",
          },
        ])
      : (actions = [
          {
            id: 6,
            icon: (
              <Link to={`/user/${userID}`}>
                <PersonIcon />
              </Link>
            ),
            name: "My Profile",
          },
          {
            id: 5,
            icon: (
              <Link to="/about">
                <InfoIcon />
              </Link>
            ),
            name: "About",
          },
        ]);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Root className={classes.root}>
      <SpeedDial
        ariaLabel="Home Navigation Control"
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

export default NavButtonHome;
