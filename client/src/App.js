import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Authentication
import SetAuthToken from "./utils/SetAuthToken";
//Authenticated Pages
import Home from "./components/pages/Home";
import UserAdmin from "./components/pages/UserAdmin";
import Payments from "./components/pages/Payments";
import About from "./components/pages/About";
//Public Pages
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
//Components
import NavigationBar from "./components/layouts/NavigationBar";
import Alerts from "./components/layouts/Alerts";
import PrivateRoute from "./components/routing/PrivateRoute";
//State
import AlertState from "./context/alert/AlertState";
import ContactState from "./context/contact/ContactState";
import UserAdminState from "./context/userAdmin/UserAdminState";
import StatsState from "./context/stats/StatsState";
import AuthState from "./context/auth/AuthState";

if (localStorage.token) {
  SetAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <ContactState>
      <StatsState>
        <UserAdminState>
          <AlertState>
            <Router>
              <Fragment>
                <NavigationBar />
                <div className="container">
                  <Alerts />
                  <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute
                      exact
                      path="/userAdmin"
                      component={UserAdmin}
                    />
                    <PrivateRoute exact path="/payments" component={Payments} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                  </Switch>
                </div>
              </Fragment>
            </Router>
          </AlertState>
          
        </UserAdminState>
        </StatsState>
      </ContactState>
    </AuthState>
  );
};

export default App;
