import React, { Fragment } from "react";

import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import ImportNSP from "./components/pages/ImportNSP";

//Public Pages
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Verify from "./components/auth/Verify";
import PasswordReset from "./components/auth/PasswordReset";
import PasswordResetRequest from "./components/auth/PasswordResetRequest";

//Components
import NavigationBar from "./components/layouts/NavigationBar";
import PrivateRoute from "./components/routing/PrivateRoute";
import { SnackbarProvider } from "notistack";
//State
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
        <UserState>
          <StatsState>
            <UserAdminState>
              <PaymentState>
                <BrowserRouter>
                  <Fragment>
                    <NavigationBar />
                    <div className="container">
                      <Routes>
                        <Route
                          exact
                          path="/"
                          element={<PrivateRoute component={Home} />}
                        />
                        <Route
                          exact
                          path="/userAdmin"
                          element={<PrivateRoute component={<UserAdmin />} />}
                        />
                        <Route
                          exact
                          path="/import"
                          element={<PrivateRoute component={<Import />} />}
                        />
                        <Route
                          exact
                          path="/importNSP"
                          element={<PrivateRoute component={<ImportNSP />} />}
                        />
                        <Route
                          exact
                          path="/payments"
                          element={<PrivateRoute component={<Payments />} />}
                        />
                        <Route
                          exact
                          path="/payments/new"
                          element={
                            <PrivateRoute component={<PaymentsCreate />} />
                          }
                        />
                        <Route
                          exact
                          path="/payments/:id"
                          element={
                            <PrivateRoute component={<ViewPayments />} />
                          }
                        />
                        <Route
                          exact
                          path="/user/:id/payments"
                          element={
                            <PrivateRoute component={<UserPayments />} />
                          }
                        />
                        <Route
                          exact
                          path="/user/:id"
                          element={<PrivateRoute component={<User />} />}
                        />
                        <Route
                          exact
                          path="/users/confirm-email/:token"
                          element={<Verify />}
                        />
                        <Route
                          exact
                          path="/users/password-reset/:token"
                          element={<PasswordReset />}
                        />
                        <Route exact path="/about" element={<About />} />
                        <Route
                          exact
                          path="/users/register"
                          element={<Register />}
                        />
                        <Route
                          exact
                          path="/password-reset"
                          element={<PasswordResetRequest />}
                        />
                        <Route exact path="/login" element={<Login />} />
                        <Route element={<Navigate from="*" to="/" />} />
                      </Routes>
                    </div>
                  </Fragment>
                </BrowserRouter>
              </PaymentState>
            </UserAdminState>
          </StatsState>
        </UserState>
      </AuthState>
    </SnackbarProvider>
  );
};

export default App;
