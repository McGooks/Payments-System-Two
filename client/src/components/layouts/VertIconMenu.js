import React, { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ViewListIcon from "@material-ui/icons/ViewList";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { Typography, Grid } from "@material-ui/core";

const options = [
  {
    id: 1,
    icon: (
      <Link to="/payments">
        <ViewListIcon />
      </Link>
    ),
    name: <Link to="/payments">View</Link>,
  },
  // {
  //   id: 2,
  //   icon: (
  //     <Link to="/payments/approve">
  //       <ThumbUpIcon />
  //     </Link>
  //   ),
  //   name:<Link to="/payments/approve">Approve All</Link>
  // },
  // {
  //   id: 3,
  //   icon: (
  //     <Link to="/payments">
  //       <ThumbDownIcon />
  //     </Link>
  //   ),
  //   name: <Link to="/payments">
  //   Reject All
  // </Link>,
  // },
  // { icon: <Admin />, name: "Admin" },
];

const LongMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <Grid
          container
          spacing={1}
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          {options.map((option) => (
            <MenuItem key={option.id} onClick={handleClose}>
              <Grid item>{option.icon}</Grid>
              <Grid item>
                <Typography>{option.name}</Typography>
              </Grid>
            </MenuItem>
          ))}
        </Grid>
      </Menu>
    </div>
  );
};
export default LongMenu;
