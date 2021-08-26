import React from "react";

import { Modal, Button, Form } from "react-bootstrap";
import {
  verifySchema,
  schemaJsonError,
  uploadJsonSchema,
} from "../../scripts/labelling-classes-queries";

function UploadSchemaModal(props) {
  var { reloadCards, ...otherProps } = props;

  const templateJson = {
    schema: [
      {
        name: "Class One's name",
        short: "C1N",
        description:
          "The name goes in the name field, an acronym of 3 letters in the acronym, and the description here.  Put the levels in the levels field as below.",
        levels: [-1, 0, 1],
      },
      {
        name: "Put as many as you like!",
        short: "PAL",
        description:
          "Put as many of these structures as you like, one for each class",
        levels: [-1, 0, 1],
      },
    ],
  };

  function getFile() {
    // Function to process file and add text to a hidden input field
    const file = document.getElementById("schemaFile").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("schemaFileHidden").value = e.target.result;
    };
    const rf = reader.readAsText(file);
  }

  async function uploadSchema() {
    // Parse to JSON
    const schema = JSON.parse(
      document.getElementById("schemaFileHidden").value
    ).schema;

    if (verifySchema(schema)) {
      await uploadJsonSchema(schema);
      reloadCards();
    } else {
      schemaJsonError();
    }
  }

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Upload Coding Schema</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          Upload entire coding schema in a JSON file. Please upload the schema
          in a <code>JSON</code> in the following format:
          <pre>
            <code>{JSON.stringify(templateJson, null, 2)}</code>
          </pre>
          Only allow levels between <code>-3</code> and <code>3</code>.
        </div>

        <div id="error-div" style={{ marginTop: "10px" }}></div>

        <Form.Group controlId="schemaFile">
          <Form.File
            accept=".json"
            onChange={() => {
              getFile();
            }}
          />
        </Form.Group>

        <Form.Group controlId="schemaFileHidden">
          <Form.Control type="text" hidden></Form.Control>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Form.Group controlId="uploadButton">
          <Button
            onClick={() => {
              uploadSchema();
            }}
            variant="primary"
            style={{ marginTop: "10px" }}
          >
            Upload
          </Button>
        </Form.Group>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadSchemaModal;
