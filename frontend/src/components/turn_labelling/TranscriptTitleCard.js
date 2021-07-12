import React, { useState } from "react";
import { Card, ProgressBar, Button } from "react-bootstrap";
import SchemaModal from "./SchemaModal";

function TranscriptTitleCard(props) {
  const [modalShow, setModalShow] = useState(false);

  const title = props.batch.TranscriptName;
  const notes = props.batch.Notes;
  const currentTurn = props.turnNumber + 1;
  const nTurns = props.batch.NTurns;
  const batchStart = props.batch.start;
  const batchEnd = props.batch.end;
  const batchPosition = currentTurn - batchStart;
  const batchSize = batchEnd - batchStart + 1;

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
      <Card.Footer>
        <div className="row">
          <div id="whole-transcript-stats" className="col-6">
            <h6>Transcript</h6>
            Turn: {currentTurn}/{nTurns}
            <ProgressBar now={currentTurn - 1} min="0" max={nTurns} />
          </div>
          <div id="batch-stats" className="col-6">
            <h6>Batch</h6>
            Turn: {batchPosition}/{batchSize}
            <ProgressBar
              now={currentTurn}
              min={batchStart}
              max={batchEnd + 1}
            />
          </div>
        </div>
      </Card.Footer>
      <SchemaModal onHide={() => setModalShow(false)} show={modalShow} />
    </Card>
  );
}

export default TranscriptTitleCard;
