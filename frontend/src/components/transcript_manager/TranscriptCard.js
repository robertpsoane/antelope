import React, { useState } from "react";
import { Card, Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import { Collection, Download, XCircle, Pencil } from "react-bootstrap-icons";
import {
  updateTranscriptMetadata,
  downloadTranscript,
} from "../../scripts/transcripts";
import DeleteTranscriptModal from "./DeleteTranscriptModal";

function MetadataModal(props) {
  var {
    transcriptId,
    sessionName,
    sessionNotes,
    reloadTranscript,
    ...otherProps
  } = props;
  async function handleSubmit() {
    const response = await updateTranscriptMetadata();
    reloadTranscript();
  }

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Edit Transcript Metadata</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="transcriptId">
            <Form.Control
              type="text"
              value={transcriptId}
              hidden
              readOnly
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="sessionName">
            <Form.Label>Session Name</Form.Label>
            <Form.Control type="text" defaultValue={sessionName} />
          </Form.Group>

          <Form.Group controlId="sessionNotes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              defaultValue={sessionNotes}
            />
          </Form.Group>

          <Form.Group controlId="formSubmit">
            <Button
              onClick={() => {
                handleSubmit();
              }}
              variant="primary"
              style={{ marginTop: "10px" }}
            >
              Save
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function TranscriptCard(props) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cloning transcript
  const transcript_meta = { ...props.transcript };
  const name = transcript_meta.SessionName;
  const transcript_id = transcript_meta.id;
  const label_url = "/label/" + transcript_id + "/";
  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-8">
            <Card.Title>Transcript: {name}</Card.Title>
          </div>
          <div className="col-4">
            <div style={{ float: "right" }}>
              <ButtonGroup>
                <Button variant="success" href={label_url}>
                  <Collection />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    downloadTranscript(transcript_id);
                  }}
                >
                  <Download />
                </Button>
                <Button variant="warning" onClick={() => setShowModal(true)}>
                  <Pencil />
                </Button>
                <Button
                  className="btn-danger"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  <XCircle />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{transcript_meta.Notes}</Card.Body>
      <Card.Footer>
        Uploaded on {transcript_meta.UploadDate} at{" "}
        {transcript_meta.UploadTime.split(".")[0]}
      </Card.Footer>
      <MetadataModal
        onHide={() => setShowModal(false)}
        show={showModal}
        sessionName={transcript_meta.SessionName}
        sessionNotes={transcript_meta.Notes}
        transcriptId={transcript_meta.id}
        reloadTranscript={() => {
          props.reloadTranscript();
          setShowModal(false);
        }}
      />
      <DeleteTranscriptModal
        transcript_id={transcript_id}
        onHide={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        name={name}
        reloadTranscripts={() => {
          setShowDeleteModal(false);
          window.location.href = "/";
        }}
      />
    </Card>
  );
}
export default TranscriptCard;
