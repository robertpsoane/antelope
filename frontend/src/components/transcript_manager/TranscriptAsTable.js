import React from "react";
import { Table } from "react-bootstrap";
import TurnRow from "./TurnRow";
import { getOrderedPointers } from "../../scripts/transcripts";

function TranscriptAsTable(props) {
  const fullTranscript = { ...props.transcript };
  const transcriptTurns = fullTranscript.Transcript;

  const keys = getOrderedPointers(transcriptTurns);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Speaker</th>
          <th>Speech</th>
          <th>Code</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key, _) => {
          const turn = transcriptTurns[key];
          const speaker = turn["speaker"];
          const speech = turn["speech"];
          const code = turn["code"];
          return (
            <tr key={key}>
              <td>{speaker}</td>
              <td>{speech}</td>
              <td>{code}</td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
export default TranscriptAsTable;
