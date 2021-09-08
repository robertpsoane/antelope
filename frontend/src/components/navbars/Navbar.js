import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import MainNavbar from "./MainNavbar";
import LoginNavbar from "./LoginNavbar";

function Navbar(props) {
  /**
   * Router which loads Navbar correct to page.  Based on page path
   */
  const page = props.page;

  return (
    <div>
      {/* Switch on url path, display relevant page based on path */}
      <Router>
        <Switch>
          <Route exact path="/settings">
            <MainNavbar page="settings" />
          </Route>
          <Route exact path="/labelling_schema">
            <MainNavbar page="schema" />
          </Route>
          <Route exact path="/login">
            <LoginNavbar />
          </Route>
          <Route exact path="/modify_schema/">
            <MainNavbar page="none" />
          </Route>
          <Route path="/label">
            <MainNavbar page="label" />
          </Route>
          <Route exact path="/">
            <MainNavbar page="transcripts" />
          </Route>
          <Route>
            <MainNavbar page="none" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Navbar;
