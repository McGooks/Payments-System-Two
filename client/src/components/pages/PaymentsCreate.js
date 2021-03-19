import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonPayments from "../layouts/NavButtonPayments"
//Components
import CreatePayments from "../payments/CreatePayments"
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
      <CreatePayments />
    <div className="grid-1">
    </div>
    </>
  );
};

export default Home;
