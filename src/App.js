// src/App.js
import "./index.css";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import GetAccess from "./pages/GetAccess";
import CreateUser from "./pages/CreateUser";
import SelectPayment from "./pages/SelectPayment";
import ConfirmPayment from "./pages/ConfirmPayment";
import EditUser from "./pages/EditUser";

import Index from "./pages/Index";
import Up from "./pages/Up";
import Haryana from "./pages/Haryana";
import Uttrakhand from "./pages/Uttrakhand";
import Punjab from "./pages/Punjab";
import Bihar from "./pages/Bihar";
import Bills from "./pages/Bills";
import Users from "./pages/Users";
import Gujrat from "./pages/Gujrat";
import Maharashtra from "./pages/Maharashtra";
import Rajasthan from "./pages/Rajasthan";
import MadhyaPardesh from "./pages/MadhyaPardesh";
import Karnataka from "./pages/Karnataka";
import HimachalPradesh from "./pages/HimachalPradesh";
import Jharkhand from "./pages/Jharkhand";
import Chhattisgarh from "./pages/Chhattisgarh";
import Odisha from "./pages/Odisha";
import Tamilnadu from "./pages/Tamilnadu";
import Kerala from "./pages/Kerala";
import Assam from "./pages/Assam";
import DamanDiu from "./pages/DamanDiu";
import Puducherry from "./pages/Puducherry";
import Sikkim from "./pages/Sikkim";
import Telangana from "./pages/Telangana";
import Tripura from "./pages/Tripura";

import { APP_BASENAME } from "./constants";
import { webIndexApi } from "./utils/api";
import { clearSession, getStoredToken, getStoredUser, saveSession } from "./utils/auth";

function App() {
  return (
    <div className="App">
      <Router basename={APP_BASENAME}>
        <Switch>
          <ProtectedRoute exact path="/" component={Index} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin/login" component={AdminLogin} />

          <AdminRoute exact path="/admin/users" component={Users} />
          <AdminRoute exact path="/admin/create-user" component={CreateUser} />
          <AdminRoute
            exact
            path="/admin/edit-user/:id"
            component={EditUser}
          />

          <ProtectedRoute exact path="/reports" component={Bills} />
          <ProtectedRoute exact path="/pb" component={Punjab} />
          <ProtectedRoute exact path="/hr" component={Haryana} />
          <ProtectedRoute exact path="/uk" component={Uttrakhand} />
          <ProtectedRoute exact path="/up" component={Up} />
          <ProtectedRoute exact path="/bh" component={Bihar} />
          <ProtectedRoute exact path="/gj" component={Gujrat} />
          <ProtectedRoute exact path="/rj" component={Rajasthan} />
          <ProtectedRoute exact path="/mh" component={Maharashtra} />
          <ProtectedRoute exact path="/hp" component={HimachalPradesh} />
          <ProtectedRoute exact path="/ka" component={Karnataka} />
          <ProtectedRoute exact path="/mp" component={MadhyaPardesh} />
          <ProtectedRoute exact path="/jh" component={Jharkhand} />
          <ProtectedRoute exact path="/cg" component={Chhattisgarh} />
          <ProtectedRoute exact path="/od" component={Odisha} />
          <ProtectedRoute exact path="/tn" component={Tamilnadu} />
          <ProtectedRoute exact path="/kl" component={Kerala} />
          <ProtectedRoute exact path="/ts" component={Telangana} />
          <ProtectedRoute exact path="/as" component={Assam} />
          <ProtectedRoute exact path="/py" component={Puducherry} />
          <ProtectedRoute exact path="/dd" component={DamanDiu} />
          <ProtectedRoute exact path="/sk" component={Sikkim} />
          <ProtectedRoute exact path="/tr" component={Tripura} />

          <ProtectedRoute
            exact
            path="/select-payment"
            component={SelectPayment}
          />
          <ProtectedRoute
            exact
            path="/confirm-payment"
            component={ConfirmPayment}
          />

          <Route exact path="/register/:token/get-access" component={GetAccess} />

          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>

        {/* runs once on mount to validate user session */}
        <Check />
      </Router>
    </div>
  );
}

export default App;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const Check = () => {
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      const token = getStoredToken();
      const currentUser = getStoredUser();

      if (!token || !currentUser) {
        clearSession();
        history.push("/login");
        return;
      }

      const { data, error } = await webIndexApi({
        authToken: token,
      });

      if (data && data.success && data.user) {
        saveSession(token, data.user);
      } else {
        history.push("/login");
        clearSession();
        console.log(error?.message || "user not found");
      }
    };

    init();
  }, [history]);

  return null;
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = getStoredToken();
  const userInfo = getStoredUser();

  if (token && userInfo) {
    return (
      <Route
        {...rest}
        render={(props) => <Component {...rest} {...props} />}
      />
    );
  }

  clearSession();
  return (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};

const AdminRoute = ({ component: Component, ...rest }) => {
  const token = getStoredToken();
  const userInfo = getStoredUser();

  if (token && userInfo?.role === "admin") {
    return (
      <Route
        {...rest}
        render={(props) => <Component {...rest} {...props} />}
      />
    );
  }

  clearSession();
  return (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
};
