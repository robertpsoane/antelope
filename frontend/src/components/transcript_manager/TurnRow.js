import React, { useState } from "react";

function TurnRow(props) {
  /**
   * Component to show a turn of conversation and its corresponding label
   * as a row of a table
   */
  const turnId = props.turnId;
  const turn = props.turn;
  const speaker = turn.speaker;
  const speech = turn.speech;
  const label = props.turnLabel;

  return (
    <tr id={"turn-" + turnId}>
      <td id={"speaker-" + turnId}>{speaker}</td>
      <td id={"speech-" + turnId}>{speech}</td>
      <td>{label}</td>
    </tr>
  );
}

export default TurnRow;
