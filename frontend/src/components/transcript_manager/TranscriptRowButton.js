import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Eye, Collection, XCircle, Download } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DeleteTranscriptModal from "./DeleteTranscriptModal";
import { downloadTranscript } from "../../scripts/transcripts";

function TranscriptRowButton(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const transcript_id = props.transcript_id;
  const view_url = "/view/" + transcript_id + "/";
  const label_url = "/label/" + transcript_id + "/";
  return (
    <div className="d-flex justify-content-center">
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
          <Button href={view_url}>
            <Eye />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Label</Tooltip>}>
          <Button className="btn-success" href={label_url}>
            <Collection />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Download</Tooltip>}>
          <Button
            className="btn-secondary"
            onClick={() => {
              downloadTranscript(transcript_id);
            }}
          >
            <Download />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
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
      <DeleteTranscriptModal
        transcript_id={transcript_id}
        onHide={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        name={props.name}
        reloadTranscripts={() => {
          props.reloadTranscripts();
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}

export default TranscriptRowButton;
