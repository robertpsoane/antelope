// JS Functions for authentication
import Cookies from "universal-cookie";
import { loginRedirect, homeRedirect } from "./redirects";

// Handles login attempt
export async function handleLogin() {
  /**
   * Client side function to attempt login.
   * Sends client username and password to server and if login
   * successful redirects to home page.
   */
  const cookies = new Cookies();

  const user = document.getElementById("formUser").value;
  const pass = document.getElementById("formPassword").value;

  const loginResponse = await fetch("/api/auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify({ username: user, password: pass }),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );

  if (loginResponse.login) {
    // successfully logged in - redirect to home
    homeRedirect();
  } else {
    loginFailed();
  }
}

// Displays error message and clears password for login failed
function loginFailed() {
  /**
   * Manages error messages if server rejects login.
   */
  const errorDiv = document.getElementById("error-msg");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-danger");
  document.getElementById("formPassword").value = "";
  errorDiv.innerHTML = "<b>Error:</b> Unmatched username and password.";
}

// Handles logout
export function handleLogout() {
  /**
   * Handles attempt to logout - calls the logout endpoint and redirects
   * to login page.
   */
  fetch("/api/auth_logout/");
  loginRedirect();
}

export async function getLoginStatus() {
  /**
   * Checks whether server has authenticated user.
   */
  const response = await fetch("/api/auth_check/").then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}

// Change password
export async function changePassword() {
  /**
   * Manages serverseide validation of change password attempt,
   * then sends request to server to change password.
   */
  const old = document.getElementById("oldPassword").value;
  const pass = document.getElementById("newPassword").value;
  const repeat = document.getElementById("repeatNewPassword").value;

  if (pass === repeat) {
    const response = await sendChangePassword(old, pass);
    if (response.success) {
      changePasswordSuccess();
    } else {
      changePasswordError();
    }
  } else {
    changePasswordError();
  }
}

async function sendChangePassword(old, newPassword) {
  /**
   * Function to put together http request to change password,
   * sends new password and old password to server to attempt change
   */
  const cookies = new Cookies();
  const response = await fetch("/api/change_pass/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify({ old: old, new: newPassword }),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}

function clearChangePasswordForm() {
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("repeatNewPassword").value = "";
}

function changePasswordError() {
  /**
   * Generate change password error message in the form.
   */
  const errorDiv = document.getElementById("error-msg");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-danger");
  clearChangePasswordForm();
  errorDiv.innerHTML =
    "<b>Error:</b> Incorrect <em>old</em> password, or <em>new</em> passwords don't match.";
}

function changePasswordSuccess() {
  /**
   * Alert user as to success of password change attempt
   */
  const errorDiv = document.getElementById("error-msg");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-success");
  clearChangePasswordForm();
  errorDiv.innerHTML = "Password Changed";
}
