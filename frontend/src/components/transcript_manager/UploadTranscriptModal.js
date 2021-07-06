import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { uploadTranscript } from "../../scripts/transcripts.js";

function UploadTranscriptModal(props) {
  var { reloadTranscripts, ...otherProps } = props;
  async function handleKeyPress() {
    const response = await uploadTranscript();
    reloadTranscripts();
  }

  function getFile() {
    // Function to process file and add text to a hidden input field
    const file = document.getElementById("sessionFile").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("sessionTextData").value = e.target.result;
    };
    const rf = reader.readAsText(file);
  }
  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>New Transcript</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-6">
              <Form.Group controlId="sessionName">
                <Form.Label>Session Name</Form.Label>
                <Form.Control type="text" placeholder="Session name" />
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group controlId="sessionFile">
                <Form.Label>Upload transcript file</Form.Label>
                <Form.File
                  accept=".csv"
                  onChange={() => {
                    getFile();
                  }}
                />
              </Form.Group>
              <Form.Group controlId="sessionTextData">
                <Form.Control type="text" hidden></Form.Control>
              </Form.Group>
            </div>
          </div>

          <Form.Group controlId="sessionNotes">
            <Form.Label>Session Notes/Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Description" />
          </Form.Group>

          <Form.Group controlId="sessionUpload">
            <Button
              onClick={() => {
                handleKeyPress();
              }}
              variant="primary"
              style={{ marginTop: "10px" }}
            >
              Upload
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UploadTranscriptModal;
