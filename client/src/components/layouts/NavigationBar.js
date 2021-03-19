import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import UserContext from "../../context/user/userContext";


function NavigationBar({ title, icon }) {
  const authContext = useContext(AuthContext);
  const userAdminContext = useContext(UserAdminContext);
  const userContext = useContext(UserContext);
  const { isAuthenticated, logout } = authContext;
  const { clearUserAccount } = userContext;
  const { clearUserAdmin } = userAdminContext;

  const onLogout = () => {
    clearUserAdmin();
    clearUserAccount()
    logout();
  };

  const authLinks = (
    <Fragment>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const unAuthLinks = (
    <Fragment>
      <li>
        <Link to="/users/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <Link to="/">
        <i className={icon} />
        {title}
        </Link>
      </h1>
      <ul>
        {isAuthenticated ? authLinks : unAuthLinks}
      </ul>
    </div>
  );
}
NavigationBar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};
NavigationBar.defaultProps = {
  title: " DemPay",
  icon: "fas fa-handshake",
};
export default NavigationBar;