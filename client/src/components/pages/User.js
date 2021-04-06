import React, { useContext, useEffect } from "react";
//State
import AuthContext from "../../context/auth/authContext";
//Components
import NavButtonUserMgmtImport from "../layouts/NavButtonUserMgmtImport";
import UserProfile from "../user/User";

const User = (props) => {
  const authContext = useContext(AuthContext);
  const { loadUser, user, isAdmin } = authContext;

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div>
      <NavButtonUserMgmtImport />
      <UserProfile activeUser={user} isAdmin={isAdmin}/>
    </div>
  );
};

export default User;
