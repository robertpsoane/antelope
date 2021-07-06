import React, { useState } from "react";

function TurnRow(props) {
  const turns = props.turns;
  const turnId = props.turnId;
  const turn = turns[turnId];
  const speaker = turn["speaker"];
  const speech = turn["speech"];
  const code = turn["code"];

  return (
    <tr id={"turn-" + turnId}>
      <td id={"speaker-" + turnId}>{speaker}</td>
      <td id={"speech-" + turnId}>{speech}</td>
      <td>{code}</td>
    </tr>
  );
}
export default TurnRow;
