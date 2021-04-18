import React, {useState, useContext} from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from '@material-ui/icons/Menu';
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Reports from "@material-ui/icons/Assessment";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
// UI
import UserAdminAddModal from "../userAdmin/UserAdminAddModal";

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


const NavButtonUserMgmt = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const userAdminContext = useContext(UserAdminContext);
  const {
    setDialogOpen,
    setDialogClosed,
    toggleDialog,
  } = userAdminContext;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const openDialog = () => {
    setDialogOpen()
  }

  const closeDialog = () => {
    setDialogClosed()
  }


  function handleClick (e,id){
    e.preventDefault();
    if(id === 3){
      openDialog()
    }else if(id === 4){
      console.log("blab")
    }
  };

  const actions = [
    { id: 1, icon: (<Link to="/"><ArrowBackIcon /></Link>), name: "Back", },
    { id: 2, icon: (<Link to="/import"><GroupAddIcon /></Link>), name: "Import User File"},
    { id: 3, icon: (<Link to="#"><PersonAddIcon /></Link>), name: "Manually Add User"},
  ];
  

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="User Management Navigation Control"
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
            onClick={(e) => {
              handleClick(e, action.id)
         }}
          />
        ))}
      </SpeedDial>
      <>
      <UserAdminAddModal open={toggleDialog} onClose={closeDialog}/>
      </>
    </div>
  );
};

export default NavButtonUserMgmt;
