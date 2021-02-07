import React, { useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import NavButtonUserMgmt from "../layouts/NavButtonUserMgmt"
import Importer from "../import/Importer"
import Import from "../import/Import"


const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavButtonUserMgmt />
      <div className="grid-1">
      <div>
          {/* <Importer /> */}
          <Import />
        </div>
      </div>
    </div>
  );
};

export default Home;
