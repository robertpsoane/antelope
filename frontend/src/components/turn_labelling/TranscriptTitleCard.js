import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

function TranscriptTitleCard(props) {
  const title = props.batch.SessionName;
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
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body>{notes}</Card.Body>
      <Card.Footer>
        <div className="row">
          <div id="whole-session-stats" className="col-6">
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
    </Card>
  );
}

export default TranscriptTitleCard;
