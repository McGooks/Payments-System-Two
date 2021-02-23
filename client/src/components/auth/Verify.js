import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import AuthContext from "../../context/auth/authContext";
//Components
import { useSnackbar } from "notistack";

const Verify = (props) => {
  const {token} = useParams()
  const authContext = useContext(AuthContext);
  const { verifyEmail, logout } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  

  useEffect(() => {
    verifyEmail(token)
    // enqueueSnackbar(`Email address confirmed, please log in`, {
    //   variant: "success",
    // })
    props.history.push("/login")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);
  return (<>
  <p>Thank you for verifying your email address</p>
  </>);
};

export default Verify;
