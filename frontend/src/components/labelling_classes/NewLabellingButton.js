import React, { useState } from "react";

import { ButtonGroup, Button } from "react-bootstrap";

import NewLabellingModal from "./NewLabellingModal";
import UploadSchemaModal from "./UploadSchemaModal";

function NewLabellingButton(props) {
  /**
   * Button to bring up modals for New Class and Upload Schema
   */
  const [newLabelModalShow, setNewLabelModalShow] = useState(false);
  const [uploadSchemaModalShow, setUploadSchemaModalShow] = useState(false);

  return (
    <div>
      <ButtonGroup className="float-end">
        <Button onClick={() => setNewLabelModalShow(true)}>New Class</Button>
        <Button
          className="btn-secondary"
          onClick={() => setUploadSchemaModalShow(true)}
        >
          Upload Schema
        </Button>
      </ButtonGroup>
      <NewLabellingModal
        onHide={() => setNewLabelModalShow(false)}
        show={newLabelModalShow}
        reloadCards={() => {
          props.reloadCards();
          setNewLabelModalShow(false);
        }}
      />
      <UploadSchemaModal
        onHide={() => setUploadSchemaModalShow(false)}
        show={uploadSchemaModalShow}
        reloadCards={() => {
          props.reloadCards();
          setUploadSchemaModalShow(false);
        }}
      />
    </div>
  );
}

export default NewLabellingButton;
