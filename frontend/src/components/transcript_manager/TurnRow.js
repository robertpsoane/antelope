import React, { useState } from "react";

function TurnRow(props) {
  const turnId = props.turnId;
  const turn = props.turn;
  const speaker = turn.speaker;
  const speech = turn.speech;
  const code = turn.code;

  return (
    <tr id={"turn-" + turnId}>
      <td id={"speaker-" + turnId}>{speaker}</td>
      <td id={"speech-" + turnId}>{speech}</td>
      <td>{getCodeString(code)}</td>
    </tr>
  );
}

function getCodeString(code) {
  if (code == null) {
    return "";
  } else {
    return code.class + ", " + code.level;
  }
}

export default TurnRow;
