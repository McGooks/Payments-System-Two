import React, { Fragment, useEffect } from "react";

import "./App.css";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
//Authentication
import SetAuthToken from "./utils/SetAuthToken";
//Authenticated Pages
import Home from "./components/pages/Home";
import UserAdmin from "./components/pages/UserAdmin";
import Payments from "./components/pages/Payments";
import About from "./components/pages/About";
import Import from "./components/pages/Import";

//Public Pages
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Verify from "./components/auth/Verify"

//Components
import NavigationBar from "./components/layouts/NavigationBar";
import PrivateRoute from "./components/routing/PrivateRoute";
import { SnackbarProvider } from "notistack";
//State
import ContactState from "./context/contact/ContactState";
import UserAdminState from "./context/userAdmin/UserAdminState";
import StatsState from "./context/stats/StatsState";
import AuthState from "./context/auth/AuthState";

if (localStorage.token) {
  SetAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {});

  return (
    <AuthState>
      <ContactState>
        <StatsState>
          <UserAdminState>
            <SnackbarProvider maxSnack={10}>
              <Router>
                <Fragment>
                  <NavigationBar />
                  <div className="container">
                    <Switch>
                      <PrivateRoute exact path="/" component={Home} />
                      <PrivateRoute
                        exact
                        path="/userAdmin"
                        component={UserAdmin}
                      />
                      <PrivateRoute exact path="/import" component={Import} />
                      <PrivateRoute
                        exact
                        path="/payments"
                        component={Payments}
                      />
                      <Route exact path="/users/confirm-email/:token" component={Verify}/>
                      <Route exact path="/about" component={About} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/login" component={Login} />
                      <Redirect from="*" to="/"/>
                    </Switch>
                  </div>
                </Fragment>
              </Router>
            </SnackbarProvider>
          </UserAdminState>
        </StatsState>
      </ContactState>
    </AuthState>
  );
};

export default App;
