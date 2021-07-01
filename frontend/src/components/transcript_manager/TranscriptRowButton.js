import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Eye, Pencil, XCircle } from "react-bootstrap-icons";

function TranscriptRowButton(props) {
  const view_url = "/view/" + props.transcript_id + "/";
  return (
    <ButtonGroup>
      <Button href={view_url}>
        <Eye />
      </Button>
      <Button className="btn-success">
        <Pencil />
      </Button>
      <Button className="btn-danger">
        <XCircle />
      </Button>
    </ButtonGroup>
  );
}

export default TranscriptRowButton;
