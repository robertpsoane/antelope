import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import SchemaModal from "./SchemaModal";
import TitleCardFooter from "./TitleCardFooter";

function TranscriptTitleCard(props) {
  /**
   * Title card for labelling transcript. Shows metadata,
   * progress bars and an option to view the schema label.
   */
  const [modalShow, setModalShow] = useState(false);

  const title = props.batch.TranscriptName;
  const notes = props.batch.Notes;

  function BatchTurnCounter() {
    if (props.turnNumber != null) {
      return (
        <TitleCardFooter turnNumber={props.turnNumber} batch={props.batch} />
      );
    } else {
      return <div></div>;
    }
  }

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
      <BatchTurnCounter />
      <SchemaModal onHide={() => setModalShow(false)} show={modalShow} />
    </Card>
  );
}

export default TranscriptTitleCard;
