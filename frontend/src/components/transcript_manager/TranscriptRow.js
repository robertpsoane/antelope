import React from "react";
import TranscriptProgressBar from "./TranscriptProgressBar";

import TranscriptRowButton from "./TranscriptRowButton";

function TranscriptRow(props) {
  /**
   * Component to show a transcripts name, description, time, progress
   * and control buttons as a row of a table.  This is meant for the
   * table of transcripts in the home page
   */
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
