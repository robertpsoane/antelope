import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { handleLogin } from "../scripts/auth";

function Login(props) {
  const [modalShow, setModalShow] = React.useState(false);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <div className="f-center">
      <h3>Login</h3>
      <p></p>
      <Form>
        <Form.Group controlId="formUser">
          <Form.Label>Username</Form.Label>
          <Form.Control
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
            type="user"
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <p></p>
        <div id="error-msg"></div>
        <Form.Group controlId="formSubmit">
          <Button
            onClick={() => {
              handleLogin();
            }}
            variant="primary"
          >
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Login;
