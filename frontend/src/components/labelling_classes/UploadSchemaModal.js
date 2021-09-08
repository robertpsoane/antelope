import React from "react";

import { Modal, Button, Form } from "react-bootstrap";
import {
  verifySchema,
  schemaJsonError,
  uploadJsonSchema,
} from "../../scripts/labelling-classes-queries";

function UploadSchemaModal(props) {
  /**
   * Modal to upload entire schema to the system
   */
  var { reloadCards, ...otherProps } = props;

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
          in a <code>JSON</code> in the format given in the{" "}
          <a href="https://github.com/robertpsoane/antelope/wiki/Administrator-Manual#schema-upload">
            Administrator Manual
          </a>
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
