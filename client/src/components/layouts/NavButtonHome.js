import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from "@material-ui/icons/Menu";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import Payments from "@material-ui/icons/AccountBalanceWallet";
import Reports from "@material-ui/icons/Assessment";
import Admin from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";

//State
import AuthContext from "../../context/auth/authContext";

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

const NavButtonHome = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const { isAdmin } = props;

  useEffect(() => {
    if (user !== null) {
      setUserID(user._id);
      console.log(user._id);
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
    <div className={classes.root}>
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
