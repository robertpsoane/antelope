import React from "react";
import { Card, Spinner } from "react-bootstrap";
import LabelControls from "./LabelControls";

function TurnCard(props) {
  /**
   * Turn Card
   * Shows the current turn of the transcript and controls for the user
   * to label the transcript.
   */
  const turnNumber = props.turnNumber;
  if (
    turnNumber == null ||
    props.batch.batch[turnNumber - props.batch.start] == null
  ) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  const batch = props.batch;
  const turn = batch.batch[turnNumber - batch.start];
  const schema = batch.schema;
  return (
    <Card style={{ margin: "10px" }}>
      <Card.Header>
        <Card.Title id="turn-speaker">{turn.speaker}</Card.Title>
      </Card.Header>
      <Card.Body id="turn-speech">{turn.speech}</Card.Body>
      <Card.Footer id="turn-labelling-controls">
        <LabelControls
          incrementTurn={props.incrementTurn}
          turn={turn}
          schema={schema}
        />
      </Card.Footer>
    </Card>
  );
}

export default TurnCard;
