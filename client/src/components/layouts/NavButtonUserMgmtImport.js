import React, { useState, useContext } from "react";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import SpeedDial from "@mui/lab/SpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedDialAction from "@mui/lab/SpeedDialAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CallMerge from "@mui/icons-material/CallMerge";
import { v4 as uuidv4 } from "uuid";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
// UI
import UserAdminAddModal from "../userAdmin/UserAdminAddModal";

const PREFIX = 'NavButtonUserMgmtImport';

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

const NavButtonUserMgmtImport = () => {

  const [open, setOpen] = useState(false);
  const userAdminContext = useContext(UserAdminContext);
  const { setDialogOpen, setDialogClosed, toggleDialog } = userAdminContext;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const openDialog = () => {
    setDialogOpen();
  };

  const closeDialog = () => {
    setDialogClosed();
  };

  function handleClick(e, id) {
    e.preventDefault();
    if (id === 2) {
      openDialog();
    }
  }
  const actions = [
    {
      id: 1,
      icon: (
        <Link to="/UserAdmin">
          <ArrowBackIcon />
        </Link>
      ),
      name: "Back",
    },
    // {
    //   id: 2,
    //   icon: (
    //     <Link to="#">
    //       <PersonAddIcon />
    //     </Link>
    //   ),
    //   name: "Manually Add User",
    // },
    {
      id: 3,
      icon: (
        <Link to="/importNSP">
          <CallMerge />
        </Link>
      ),
      name: "Import NSP Data",
    },
  ];

  return (
    <Root className={classes.root}>
      <SpeedDial
        ariaLabel="User Import Navigation Control"
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
            onClick={(e) => {
              handleClick(e, action.id);
            }}
          />
        ))}
      </SpeedDial>
      <>
        <UserAdminAddModal open={toggleDialog} onClose={closeDialog} />
      </>
    </Root>
  );
};

export default NavButtonUserMgmtImport;
