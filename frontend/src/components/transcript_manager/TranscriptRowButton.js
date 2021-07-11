import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Eye, Collection, XCircle, Download } from "react-bootstrap-icons";
import DeleteTranscriptModal from "./DeleteTranscriptModal";
import { downloadTranscript } from "../../scripts/transcripts";

function TranscriptRowButton(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const transcript_id = props.transcript_id;
  const view_url = "/view/" + transcript_id + "/";
  const label_url = "/label/" + transcript_id + "/";
  return (
    <div>
      <ButtonGroup>
        <Button href={view_url}>
          <Eye />
        </Button>
        <Button className="btn-success" href={label_url}>
          <Collection />
        </Button>
        <Button
          className="btn-secondary"
          onClick={() => {
            downloadTranscript(transcript_id);
          }}
        >
          <Download />
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
