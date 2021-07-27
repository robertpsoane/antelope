import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import SchemaModal from "./SchemaModal";
import TitleCardFooter from "./TitleCardFooter";

function TranscriptTitleCard(props) {
  const [modalShow, setModalShow] = useState(false);

  const title = props.batch.TranscriptName;
  const notes = props.batch.Notes;

  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-8">
            <Card.Title>{title}</Card.Title>
          </div>
          <div className="col-4">
            <div style={{ float: "right" }}>
              <Button
                onClick={() => {
                  setModalShow(true);
                }}
              >
                Schema
              </Button>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{notes}</Card.Body>
      <TitleCardFooter turnNumber={props.turnNumber} batch={props.batch} />
      <SchemaModal onHide={() => setModalShow(false)} show={modalShow} />
    </Card>
  );
}

export default TranscriptTitleCard;
