import React from "react";
import { ProgressBar } from "react-bootstrap";
import TranscriptRowButton from "./TranscriptRowButton";

function TranscriptRow(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.notes}</td>
      <td>
        <ProgressBar
          variant="success"
          now={props.next}
          min="0"
          max={props.nturns}
          height="100%"
        />
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
