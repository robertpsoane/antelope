import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

// Components
import Header from "./components/Header.js";

// Pages
import Login from "./pages/Login.js";
import AdminPanel from "./pages/AdminPanel.js";
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
        <div id="header">
          <Header />
        </div>
        <div id="page">
          <Router>
            <Switch>
              <Route path="/transcripts">
                <TranscriptManager />
              </Route>
              <Route path="/coder">
                <SessionCoder />
              </Route>
              <Route path="/settings">
                <UserSettings />
              </Route>
              <Route path="/settings/admin">
                <AdminPanel />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
