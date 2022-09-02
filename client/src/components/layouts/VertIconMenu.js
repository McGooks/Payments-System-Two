import React, { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewListIcon from "@mui/icons-material/ViewList";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Typography, Grid } from "@mui/material";

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
        size="large">
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
          justifyContent="flex-start"
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
