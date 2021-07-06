import React from "react";
import { Table } from "react-bootstrap";
import TurnRow from "./TurnRow";
import { getOrderedPointers } from "../../scripts/transcripts";

function TranscriptAsTable(props) {
  const fullTranscript = { ...props.transcript };
  const turns = fullTranscript.Transcript;

  const keys = getOrderedPointers(turns);

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
        {keys.map((key, _) => {
          return <TurnRow key={key} turnId={key} turns={turns} />;
        })}
      </tbody>
    </Table>
  );
}
export default TranscriptAsTable;
