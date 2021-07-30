import React from "react";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function AdminSettingsLink(props) {
  if (props.show) {
    return (
      <div>
        <hr />
        <h3>Admin Settings</h3>
        <p>
          The following buttons are only available to admin users. The Admin
          Panel can be used to add new users, and Labels can be used to add to
          the schema.
        </p>
        <div className="d-flex justify-content-center">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Add and remove users</Tooltip>}
          >
            <Button
              className="btn-secondary"
              href="/admin"
              style={{ marginRight: "5px" }}
            >
              Admin Panel
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Modify Labels</Tooltip>}
          >
            <Button
              className="btn-secondary"
              href="/modify_schema/"
              style={{ marginRight: "5px", marginLeft: "5px" }}
            >
              Labels
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Set ML Model</Tooltip>}
          >
            <Button
              className="btn-secondary"
              href="/setup/"
              style={{ marginRight: "5px", marginLeft: "5px" }}
            >
              Model
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default AdminSettingsLink;
