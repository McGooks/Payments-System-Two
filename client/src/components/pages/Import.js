import React, { useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import NavButtonUserMgmtImport from "../layouts/NavButtonUserMgmtImport"
import { useSnackbar } from "notistack";
import Import from "../import/Import"


const ImportUsers = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authContext = useContext(AuthContext);
  const { loadUser, isAdmin } = authContext;
  const userAdminContext = useContext(UserAdminContext);
  const {
    importedUsersAdded,
    error, 
    clearErrors
  } = userAdminContext;

  useEffect(() => {
    loadUser();
    if (!isAdmin) {
      props.history.push("/");
    }
    if (importedUsersAdded) {
      props.history.push("/userAdmin");
      clearErrors();
    } else if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedUsersAdded, isAdmin, props.history]);
console.log(isAdmin)
  return (
    <div>
      <NavButtonUserMgmtImport />
      <div className="grid-1">
        <Import isAdmin={isAdmin}/>
      </div>
    </div>
  );
};

export default ImportUsers;
