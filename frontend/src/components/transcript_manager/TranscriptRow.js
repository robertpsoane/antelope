import React from "react";
import TranscriptProgressBar from "./TranscriptProgressBar";

import TranscriptRowButton from "./TranscriptRowButton";

function TranscriptRow(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.notes}</td>
      <td>
        <TranscriptProgressBar now={props.next} max={props.nturns} string="" />
      </td>
      <td>{props.date}</td>
      <td>
        <TranscriptRowButton
          transcript_id={props.transcript_id}
          name={props.name}
          reloadTranscripts={props.reloadTranscripts}
        />
      </td>
    </tr>
  );
}
export default TranscriptRow;
