import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuIcon from '@material-ui/icons/Menu';
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Import from "@material-ui/icons/Publish";
import Reports from "@material-ui/icons/Assessment";

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
  { id: 1, icon: (<Link to="/"><ArrowBackIcon /></Link>), name: "Back" },
  { id: 2, icon: (<Link to="/import"><Import /></Link>), name: "Import File" },
  { id: 3, icon: (<Link to="/payments"><AttachMoneyIcon /></Link>), name: "Manually Add Payment" },
  { id: 4, icon: <Reports />, name: "Report Manager" },
];

const AddBtn = () => {
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
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<MenuIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{ color: "secondary"}}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default AddBtn;
