import React from "react";
import { Table } from "react-bootstrap";
import TurnRow from "./TurnRow";
import { getOrderedPointers } from "../../scripts/transcripts";

function TranscriptAsTable(props) {
  const fullTranscript = { ...props.transcript };
  const turns = fullTranscript.Transcript;

  return (
    <Table
      style={{ borderRadius: "20px !important", borderCollapse: "collapsed" }}
      striped
      bordered
      hover
    >
      <thead>
        <tr>
          <th className="col-2">Speaker</th>
          <th className="col-9">Speech</th>
          <th className="col-1">Code</th>
        </tr>
      </thead>
      <tbody>
        {turns.map((turn, idx) => {
          return <TurnRow key={idx} turnId={idx} turn={turn} />;
        })}
      </tbody>
    </Table>
  );
}
export default TranscriptAsTable;
