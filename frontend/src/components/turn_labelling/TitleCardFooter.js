import React from "react";

import { Card, ProgressBar } from "react-bootstrap";

function TitleCardFooter(props) {
  /**
   * Footer of the title card when labelling.  Displays progress
   * bars to show how far in labelling both the transcript
   * and the current batch the labeller is.
   *
   * If batch size is 1, only shows progress in transcript.
   */
  const currentTurn = props.turnNumber + 1;
  const nTurns = props.batch.NTurns;
  const batchStart = props.batch.start;
  const batchEnd = props.batch.end;
  const batchPosition = currentTurn - batchStart;
  const batchSize = batchEnd - batchStart + 1;

  if (batchSize > 1) {
    return (
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
    );
  } else {
    return (
      <Card.Footer>
        <div className="row">
          <div id="whole-transcript-stats" className="col-12">
            <h6>Transcript</h6>
            Turn: {currentTurn}/{nTurns}
            <ProgressBar now={currentTurn - 1} min="0" max={nTurns} />
          </div>
        </div>
      </Card.Footer>
    );
  }
}

export default TitleCardFooter;
