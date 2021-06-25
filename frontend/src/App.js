import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

// Components
import MainNavbar from "./components/navbars/MainNavbar.js";
import LoginNavbar from "./components/navbars/LoginNavbar.js";

// Pages
import Login from "./pages/Login.js";
import CodingSchema from "./pages/CodingSchema.js";
import SessionCoder from "./pages/SessionCoder.js";
import TranscriptManager from "./pages/TranscriptManager.js";
import UserSettings from "./pages/UserSettings.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        {/* Switch on url path, display relevant page based on path */}
        <Router>
          <Switch>
            <Route exact path="/coder">
              <div id="nav">
                <MainNavbar page="none" />
              </div>
              <div id="page">
                <SessionCoder />
              </div>
            </Route>
            <Route exact path="/settings">
              <div id="nav">
                <MainNavbar page="settings" />
              </div>
              <div id="page">
                <UserSettings />
              </div>
            </Route>
            <Route exact path="/coding_schema">
              <div id="nav">
                <MainNavbar page="schema" />
              </div>
              <div id="page">
                <CodingSchema />
              </div>
            </Route>
            <Route exact path="/login">
              <div id="nav">
                <LoginNavbar />
              </div>
              <div id="page">
                <Login />
              </div>
            </Route>
            <Route exact path="/">
              <div id="nav">
                <MainNavbar page="transcripts" />
              </div>
              <div id="page">
                <TranscriptManager />
              </div>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
