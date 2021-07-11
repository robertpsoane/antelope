import React from "react";
import Button from "react-bootstrap/Button";

function AdminSettingsLink(props) {
  if (props.show) {
    return (
      <div>
        <hr />
        <h3>Admin Settings</h3>
        <p>
          The following buttons are only available to admin users. The Admin
          Panel can be used to add new users, and Modify Labelling Schema can be
          used to update the schema.
        </p>
        <Button
          className="btn-secondary"
          href="/admin"
          style={{ marginRight: "5px" }}
        >
          Admin Panel
        </Button>
        <Button
          className="btn-secondary"
          href="/modify_schema/"
          style={{ marginRight: "5px", marginLeft: "5px" }}
        >
          Modify Labels
        </Button>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default AdminSettingsLink;
