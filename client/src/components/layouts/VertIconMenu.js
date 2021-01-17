import React from "react";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ViewListIcon from '@material-ui/icons/ViewList';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const options = [
  { icon: (<Link to="/payments"><ViewListIcon /></Link>), name: "View" },
  { icon: (<Link to="/payments"><ThumbUpIcon /></Link>), name: "Approve All" },
  { icon: (<Link to="/payments"><ThumbDownIcon /></Link>), name: "Reject All" },
  // { icon: <Admin />, name: "Admin" },
];

const LongMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
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
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={handleClose}>
            {option.icon}{"  "}{option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
export default LongMenu
