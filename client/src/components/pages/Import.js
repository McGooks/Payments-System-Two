import React, { useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import NavButtonUserMgmtImport from "../layouts/NavButtonUserMgmtImport"
import { useSnackbar } from "notistack";
import Import from "../import/Import"


const ImportUsers = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authContext = useContext(AuthContext);
  const userAdminContext = useContext(UserAdminContext);
  const {
    importedUsersAdded,
    error, 
    clearErrors
  } = userAdminContext;

  useEffect(() => {
    authContext.loadUser();
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
  }, [importedUsersAdded, props.history]);

  return (
    <div>
      <NavButtonUserMgmtImport />
      <div className="grid-1">
          <Import />
      </div>
    </div>
  );
};

export default ImportUsers;
