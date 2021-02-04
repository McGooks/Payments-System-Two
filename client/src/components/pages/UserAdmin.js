import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonUserMgmt from "../../components/layouts/NavButtonUserMgmt"
//Components
import UsersAdminTable from "../userAdmin/UserAdmin";
//State
import AuthContext from "../../context/auth/authContext";

const UserAdmin = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <NavButtonUserMgmt />
    <div className="grid-1">
      <UsersAdminTable />
    </div>
    </>
  );
};

export default UserAdmin;
