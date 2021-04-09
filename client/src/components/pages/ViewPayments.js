import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonPaymentsAdd from "../layouts/NavButtonPaymentsAdd"
//Components
import CreatePayments from "../payments/CreatePayments"
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";


const Home = () => {
  const authContext = useContext(AuthContext);
  const userAdminContext = useContext(UserAdminContext);
  const { activeUsers, getActiveUsers } = userAdminContext;
  const { loadUser } = authContext

  useEffect(() => {
    loadUser();
    getActiveUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavButtonPaymentsAdd />
      <CreatePayments activeUsers={activeUsers}/>
    </>
  );
};

export default Home;
