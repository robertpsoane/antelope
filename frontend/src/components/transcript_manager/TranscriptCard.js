import React, { useState } from "react";
import { Card, Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import { updateTranscriptMetadata } from "../../scripts/transcripts";

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
  // Cloning transcript
  const transcript_meta = { ...props.transcript };
  const label_url = "/label/" + transcript_meta.id + "/";
  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-8">
            <Card.Title>Transcript: {transcript_meta.SessionName}</Card.Title>
          </div>
          <div className="col-4">
            <div style={{ float: "right" }}>
              <ButtonGroup>
                <Button href={label_url}>Label</Button>
                <Button
                  className="btn-secondary"
                  onClick={() => setShowModal(true)}
                >
                  Edit Metadata
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
    </Card>
  );
}
export default TranscriptCard;
