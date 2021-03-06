/* 
Login navbar used for the login page - no individual links apart from
the help button
*/
import React, { Component, useEffect, useState } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import LoginHelp from "./LoginHelp";
import { getLoginStatus } from "../../scripts/auth";
import { homeRedirect } from "../../scripts/redirects";

function LoginNavbar(props) {
  /**
   * Login Page special case of the Navbar
   * - If authenticated by server, redirects to home page, else
   * allow to login
   */
  const [modalShow, setModalShow] = useState(false);

  async function processLoginStatus() {
    // Async function to check if logged in - if logged in, redirect
    // to home page
    const response = await getLoginStatus();
    if (response.login) {
      homeRedirect();
    }
  }

  useEffect(() => {
    processLoginStatus();
  });

  return (
    <div>
      <div id="nav">
        <Navbar expand="lg" bg="dark" variant="dark">
          <div className="container-fluid">
            <Navbar.Brand href="/">Antelope: Transcript Labelling</Navbar.Brand>
          </div>
          <Nav className="mr-auto">
            <Nav.Link
              onClick={() => {
                setModalShow(true);
              }}
              href="#"
            >
              Help
            </Nav.Link>
          </Nav>
          <LoginHelp onHide={() => setModalShow(false)} show={modalShow} />
        </Navbar>
      </div>
    </div>
  );
}

export default LoginNavbar;
