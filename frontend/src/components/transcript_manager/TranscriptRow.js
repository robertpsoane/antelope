import React from "react";
import TranscriptRowButton from "./TranscriptRowButton";

function TranscriptRow(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.notes}</td>
      <td>{props.date}</td>
      <td>
        <TranscriptRowButton transcript_id={props.transcript_id} />
      </td>
    </tr>
  );
}
export default TranscriptRow;
