import React from "react";
import { Card } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

function AdjacentLabel(props) {
  /**
   * Card to show label (if it exists) on a transcript card other
   * than that which is the transcript currently being labelled
   */
  const label = props.label;
  const schema = props.schema;
  if (label == null) {
    return <div></div>;
  } else {
    var acronym = schema[label.class].ClassShort;
    var label_str = acronym + ", " + label.level;
    return (
      <div>
        {label_str} {/*<Pencil onClick={props.decrement} />*/}
      </div>
    );
  }
}

function AdjacentCard(props) {
  /**
   * Card to show the adjacent turn of a transcript (if one exists) to
   * the current turn being labelled.  Used to show context to labeller
   * such that they can see the turns either side of the turn they
   * are labelling
   */
  const turnNumber = props.turnNumber;
  const batch = props.batch;
  const schema = props.batch.schema;

  // Extract correct turn
  if (turnNumber < batch.start) {
    var turn = batch.previous;
  } else if (turnNumber > batch.end) {
    var turn = batch.next;
  } else {
    var turn = batch.batch[turnNumber - batch.start];
  }

  if (turn == null) {
    // Empty card for edge turns
    return <Card style={{ opacity: ".5", margin: "10px" }}></Card>;
  }

  return (
    <Card style={{ opacity: ".5", margin: "10px" }}>
      <Card.Header>
        <div className="row">
          <div className="col-8">
            <Card.Title id="adjacent-turn-speaker">{turn.speaker}</Card.Title>
          </div>
          <div className="col-4">
            <div style={{ float: "right" }}>
              <AdjacentLabel
                label={turn.code}
                schema={schema}
                decrement={props.decrementTurn}
              />
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body id="adjacent-turn-speech">{turn.speech}</Card.Body>
    </Card>
  );
}

export default AdjacentCard;
