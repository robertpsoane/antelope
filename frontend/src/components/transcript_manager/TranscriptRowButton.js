import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Eye, Collection, XCircle } from "react-bootstrap-icons";
import DeleteTranscriptModal from "./DeleteTranscriptModal";

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
      />
    </div>
  );
}

export default TranscriptRowButton;
