import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonUserMgmt from "../../components/layouts/NavButtonUserMgmt"
//Components
import Users from "../userAdmin/UserAdmin";
//State
import AuthContext from "../../context/auth/authContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";


const UserAdmin = () => {
  const authContext = useContext(AuthContext);


  useEffect(() => {
    authContext.loadUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <NavButtonUserMgmt />
    <div className="grid-1">
      <Users />
    </div>
    </>
  );
};

export default UserAdmin;
