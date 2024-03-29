import React, { useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import AuthContext from "../../context/auth/authContext";
//Components

const Verify = (props) => {
  const {token} = useParams()
  const authContext = useContext(AuthContext);
  const { verifyEmail, logout } = authContext;

  useEffect(() => {
    verifyEmail(token)
    logout()
    props.history.push("/login")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);
  return (<>
  <p>Thank you for verifying your email address</p>
  </>);
};

export default Verify;
