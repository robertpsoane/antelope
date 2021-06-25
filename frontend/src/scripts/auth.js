// JS Functions for authentication
import Cookies from "universal-cookie";
import { loginRedirect, homeRedirect } from "./redirects";

// Handles login attempt
export async function handleLogin() {
  const cookies = new Cookies();
  console.log("Login Attempted");
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
  const errorDiv = document.getElementById("login-error");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-danger");
  document.getElementById("formPassword").value = "";
  errorDiv.innerHTML = "<b>Error:</b> Unmatched username and password.";
}

// Handles logout
export function handleLogout() {
  console.log("Logout Attempted");
  fetch("/api/auth_logout/");
  loginRedirect();
}

export async function getLoginStatus() {
  const response = await fetch("/api/auth_check/").then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}
