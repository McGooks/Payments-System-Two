import React, { Fragment, useEffect } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
//Authentication
import SetAuthToken from "./utils/SetAuthToken";
//Authenticated Pages
import Home from "./components/pages/Home";
import UserAdmin from "./components/pages/UserAdmin";
import User from "./components/pages/User";
import UserPayments from "./components/pages/UserPayments";
import Payments from "./components/pages/Payments";
import PaymentsCreate from "./components/pages/PaymentsCreate";
import ViewPayments from "./components/pages/PaymentsView";
import About from "./components/pages/About";
import Import from "./components/pages/Import";

//Public Pages
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Verify from "./components/auth/Verify";
import PasswordReset from "./components/auth/PasswordReset";
import PasswordResetRequest from "./components/auth/PasswordResetRequest"

//Components
import NavigationBar from "./components/layouts/NavigationBar";
import PrivateRoute from "./components/routing/PrivateRoute";
import { SnackbarProvider } from "notistack";
//State
import ContactState from "./context/contact/ContactState";
import UserState from "./context/user/UserState";
import UserAdminState from "./context/userAdmin/UserAdminState";
import PaymentState from "./context/payment/PaymentState";
import StatsState from "./context/stats/StatsState";
import AuthState from "./context/auth/AuthState";

if (localStorage.token) {
  SetAuthToken(localStorage.token);
}

const App = () => {
  return (
    <SnackbarProvider maxSnack={10}>
      <AuthState>
        <ContactState>
          <UserState>
            <StatsState>
              <UserAdminState>
                <PaymentState>
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
                          <PrivateRoute
                            exact
                            path="/import"
                            component={Import}
                          />
                          <PrivateRoute
                            exact
                            path="/payments"
                            component={Payments}
                          />
                          <PrivateRoute
                            exact
                            path="/payments/new"
                            component={PaymentsCreate}
                          />
                          <PrivateRoute
                            exact
                            path="/payments/:id"
                            component={ViewPayments}
                          />
                          <PrivateRoute
                            exact
                            path="/user/:id/payments"
                            component={UserPayments}
                          />
                          <PrivateRoute
                            exact
                            path="/user/:id"
                            component={User}
                          />

                          <Route
                            exact
                            path="/users/confirm-email/:token"
                            component={Verify}
                          />
                          <Route
                            exact
                            path="/users/password-reset/:token"
                            component={PasswordReset}
                          />
                          <Route exact path="/about" component={About} />
                          <Route
                            exact
                            path="/users/register"
                            component={Register}
                          />
                          <Route
                            exact
                            path="/password-reset"
                            component={PasswordResetRequest}
                          />
                          <Route exact path="/login" component={Login} />
                          <Redirect from="*" to="/" />
                        </Switch>
                      </div>
                    </Fragment>
                  </Router>
                </PaymentState>
              </UserAdminState>
            </StatsState>
          </UserState>
        </ContactState>
      </AuthState>
    </SnackbarProvider>
  );
};

export default App;
