import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function PasswordReset(props) {
  /**
   * Password reset form in the settings page
   * Includes client side validation
   *
   */
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      changePassword();
    }
  }
  return (
    <div>
      <h3>Change Password</h3>
      <p></p>
      <Form>
        <Form.Group controlId="oldPassword">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
            type="password"
            placeholder="Old Password"
          />
        </Form.Group>

        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
            type="password"
            placeholder="New Password"
          />
        </Form.Group>

        <Form.Group controlId="repeatNewPassword">
          <Form.Label>Repeat New Password</Form.Label>
          <Form.Control
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
            type="password"
            placeholder="Repeat New Password"
          />
        </Form.Group>
        <p></p>
        <div id="error-msg"></div>

        <Form.Group controlId="formSubmit">
          <Button
            onClick={() => {
              changePassword();
            }}
            variant="primary"
          >
            Change Password
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
export default PasswordReset;
