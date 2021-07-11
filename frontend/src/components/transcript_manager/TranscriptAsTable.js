import React from "react";
import { Table } from "react-bootstrap";
import TurnRow from "./TurnRow";

function TranscriptAsTable(props) {
  const fullTranscript = { ...props.transcript };
  const turns = fullTranscript.Transcript;
  console.log(fullTranscript);

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
          <th className="col-1">Label</th>
        </tr>
      </thead>
      <tbody>
        {turns.map((turn, idx) => {
          if (turn.code != null) {
            const codeName = fullTranscript.schema[turn.code.class].ClassShort;
            const codeLevel = turn.code.level;
            var label = codeName + ", " + codeLevel;
          } else {
            var label = "-";
          }
          return (
            <TurnRow key={idx} turnId={idx} turn={turn} turnLabel={label} />
          );
        })}
      </tbody>
    </Table>
  );
}
export default TranscriptAsTable;
