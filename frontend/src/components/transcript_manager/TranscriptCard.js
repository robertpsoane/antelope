import React, { useState } from "react";
import { Card, Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import { Collection, Download, XCircle, Pencil } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  updateTranscriptMetadata,
  downloadTranscript,
} from "../../scripts/transcripts";
import DeleteTranscriptModal from "./DeleteTranscriptModal";
import TranscriptStats from "./TranscriptStats";

function MetadataModal(props) {
  /**
   * Modal to provide form to edit transcript metadata
   */
  var {
    transcriptId,
    TranscriptName,
    transcriptNotes,
    reloadTranscript,
    ...otherProps
  } = props;
  async function handleSubmit() {
    const response = await updateTranscriptMetadata();
    if (response) {
      reloadTranscript();
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

          <Form.Group controlId="transcriptName">
            <Form.Label>Transcript Name</Form.Label>
            <Form.Control type="text" defaultValue={TranscriptName} />
          </Form.Group>

          <Form.Group controlId="transcriptNotes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              defaultValue={transcriptNotes}
            />
          </Form.Group>
          <div id="error-div" style={{ marginTop: "10px" }}></div>
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
  /**
   * Card to show transcript metadata in the view transcript
   * page
   */
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cloning transcript
  const transcript_meta = { ...props.transcript };
  const name = transcript_meta.TranscriptName;
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
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Label</Tooltip>}
                >
                  <Button variant="success" href={label_url}>
                    <Collection />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Download</Tooltip>}
                >
                  <Button
                    variant="secondary"
                    onClick={() => {
                      downloadTranscript(transcript_id);
                    }}
                  >
                    <Download />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <Button variant="warning" onClick={() => setShowModal(true)}>
                    <Pencil />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Delete</Tooltip>}
                >
                  <Button
                    className="btn-danger"
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                  >
                    <XCircle />
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {transcript_meta.Notes}
        <hr />
        <TranscriptStats transcript={transcript_meta} />
      </Card.Body>
      <Card.Footer>
        Uploaded on {transcript_meta.UploadDate} at{" "}
        {transcript_meta.UploadTime.split(".")[0]}
      </Card.Footer>
      <MetadataModal
        onHide={() => setShowModal(false)}
        show={showModal}
        TranscriptName={transcript_meta.TranscriptName}
        transcriptNotes={transcript_meta.Notes}
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
