/* 
Main navbar for most pages - different to the login navbar used for 
the login page
*/
import React, { Component, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { handleLogout, getLoginStatus } from "../../scripts/auth";
import { loginRedirect } from "../../scripts/redirects";

function MainNavbar(props) {
  const page = props.page;

  async function processLoginStatus() {
    // Async function to check if logged in - if not logged in, redirect
    // to login page
    const response = await getLoginStatus();
    if (!response.login) {
      // Redirect to login page
      loginRedirect();
    }
  }
  processLoginStatus();

  // Setting active page in navbar
  const pageStatus = {
    transcripts: "",
    schema: "",
    settings: "",
  };
  pageStatus[page] = "active";

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <div className="container-fluid">
        <Navbar.Brand href="/">Session Labelling</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link className={pageStatus.transcripts} href="/">
            Transcripts
          </Nav.Link>
          <Nav.Link className={pageStatus.schema} href="/coding_schema">
            Coding Schema
          </Nav.Link>
          <Nav.Link className={pageStatus.settings} href="/settings">
            Settings
          </Nav.Link>
          <Nav.Link
            onClick={() => {
              handleLogout();
            }}
            href="#"
          >
            Logout
          </Nav.Link>
        </Nav>
      </div>
    </Navbar>
  );
}

export default MainNavbar;
