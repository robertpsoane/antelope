import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

// Components
import Navbar from "./components/navbars/Navbar.js";

// Pages
import Login from "./pages/Login.js";
import CodingSchema from "./pages/CodingSchema.js";
import SessionCoder from "./pages/SessionCoder.js";
import TranscriptManager from "./pages/TranscriptManager.js";
import UserSettings from "./pages/UserSettings.js";
import ModifyCodingSchema from "./pages/ModifyCodingSchema";

function App(props) {
  return (
    <div>
      <div id="nav">
        <Navbar />
      </div>
      <div className="container-fluid">
        {/* Switch on url path, display relevant page based on path */}
        <div className="row mt-3">
          <div className="col"></div>
          <div className="col-10">
            <Router>
              <Switch>
                <Route exact path="/coder">
                  <div id="page">
                    <SessionCoder />
                  </div>
                </Route>
                <Route exact path="/settings">
                  <div id="page">
                    <UserSettings />
                  </div>
                </Route>
                <Route exact path="/coding_schema">
                  <div id="page">
                    <CodingSchema />
                  </div>
                </Route>
                <Route exact path="/login">
                  <div id="page">
                    <Login />
                  </div>
                </Route>
                <Route exact path="/modify_schema/">
                  <div id="page">
                    <ModifyCodingSchema />
                  </div>
                </Route>
                <Route exact path="/">
                  <div id="page">
                    <TranscriptManager />
                  </div>
                </Route>
              </Switch>
            </Router>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
