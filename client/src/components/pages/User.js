import React, {
  useContext,
  useEffect,
} from "react";
import UserContext from "../../context/user/userContext";
import { useParams, useHistory } from "react-router-dom";
//State
import AuthContext from "../../context/auth/authContext";
//Components
import NavButtonUserMgmtImport from "../layouts/NavButtonUserMgmtImport";
import UserProfile from "../user/User";

const User = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext
  const history = useHistory();

  useEffect(() => {
    const user = loadUser();
    // if(user.role !== "Admin") history.push("/")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div>
      <NavButtonUserMgmtImport />
      <UserProfile/>
      </div>
  );
};

export default User;
