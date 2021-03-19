import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonPayments from "../../components/layouts/NavButtonPayments"
//Components
import Payments from "../../components/payments/Payments"
//State
import AuthContext from "../../context/auth/authContext";

const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavButtonPayments />
      <Payments/>
    <div className="grid-1">
    </div>
    </>
  );
};

export default Home;
