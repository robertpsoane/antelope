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
import LabellingSchema from "./pages/LabellingSchema.js";
import TranscriptCoder from "./pages/TranscriptCoder.js";
import TranscriptManager from "./pages/TranscriptManager.js";
import UserSettings from "./pages/UserSettings.js";
import ModifyLabellingSchema from "./pages/ModifyLabellingSchema";
import ViewTranscript from "./pages/ViewTranscript.js";
import LabelTranscript from "./pages/LabelTranscript.js";
import Setup from "./pages/Setup.js";

/**
 *
 * App - Entry point to the main app.
 *
 */

function App(props) {
  function getTranscriptID() {
    var out;
    try {
      const id = window.location.pathname.split("/")[2];
      out = parseInt(id);
    } catch {
      out = null;
    }
    return out;
  }

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
                    <TranscriptCoder />
                  </div>
                </Route>
                <Route exact path="/settings">
                  <div id="page">
                    <UserSettings />
                  </div>
                </Route>
                <Route exact path="/labelling_schema">
                  <div id="page">
                    <LabellingSchema />
                  </div>
                </Route>
                <Route exact path="/login">
                  <div id="page">
                    <Login />
                  </div>
                </Route>
                <Route exact path="/modify_schema/">
                  <div id="page">
                    <ModifyLabellingSchema />
                  </div>
                </Route>
                <Route path="/view">
                  <div id="page">
                    <ViewTranscript transcript_id={getTranscriptID()} />
                  </div>
                </Route>
                <Route path="/label">
                  <div id="page">
                    <LabelTranscript transcript_id={getTranscriptID()} />
                  </div>
                </Route>
                <Route path="/setup">
                  <div id="page">
                    <Setup />
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
