import React, { useContext, useEffect } from "react";
//Navigation
import NavButtonUserMgmt from "../../components/layouts/NavButtonUserMgmt";
//Components
import UsersAdminTable from "../userAdmin/UserAdmin";
//State
import AuthContext from "../../context/auth/authContext";

const UserAdmin = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser, isAdmin, user, loading } = authContext;

  useEffect(() => {
    loadUser();
    if (!loading && !isAdmin) {
      props.history.push("/");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, props.history]);
  return (
    <>
      <NavButtonUserMgmt />
      <div className="grid-1">
        <UsersAdminTable user={user} isAdmin={isAdmin}/>
      </div>
    </>
  );
};

export default UserAdmin;
