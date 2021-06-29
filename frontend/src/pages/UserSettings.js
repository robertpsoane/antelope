import React, { useState } from "react";
import { changePassword } from "../scripts/auth";
import AdminSettingsLink from "../components/settings/AdminSettingsLink";
import PasswordReset from "../components/settings/PasswordReset";
import { getLoginStatus } from "../scripts/auth";

function UserSettings(props) {
  const [showAdmin, setShowAdmin] = useState(false);

  async function checkShowAdmin() {
    // Async function to check if logged in - if not logged in, redirect
    // to login page
    const response = await getLoginStatus();
    if (response.admin) {
      // Redirect to login page
      setShowAdmin(true);
    }
  }
  checkShowAdmin();

  return (
    <div className="f-center">
      <PasswordReset />
      <AdminSettingsLink show={showAdmin} />
    </div>
  );
}

export default UserSettings;
