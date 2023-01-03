import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const PrivateRoute = ({ Component , ...rest })  => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return !isAuthenticated && !loading ? (
    <Navigate to="/login" />
  ) : (
    <Component {...rest} />
  )
};

export default PrivateRoute;
