import React, { useEffect, useState } from "react";

import { Table } from "react-bootstrap";

import UploadTranscriptButton from "../components/transcript_manager/UploadTranscriptButton";
import TranscriptRow from "../components/transcript_manager/TranscriptRow";
import TranscriptSearch from "../components/transcript_manager/TranscriptSearch";
import { getTranscripts } from "../scripts/transcripts";

function TranscriptManager(props) {
  /**
   * Transcript Manager Page
   *
   * Asynchronously gets list of transcripts.  Sets them to component
   * state, and iterates over them adding them to a table.
   */
  const [transcripts, setTranscripts] = useState([]);

  async function getSetTranscripts() {
    const response = await getTranscripts();
    setTranscripts(response);
  }

  useEffect(() => {
    getSetTranscripts();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-10">
          <h1>Transcripts</h1>
        </div>
        <div className="col-2">
          <div style={{ float: "right" }}>
            <UploadTranscriptButton reloadTranscripts={getSetTranscripts} />
          </div>
        </div>
      </div>
      <div className="row" style={{ height: "20px" }}></div>
      <TranscriptSearch
        transcripts={transcripts}
        setTranscripts={setTranscripts}
      />
      <div className="row" style={{ height: "20px" }}></div>
      <div className="row">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="col-3">Transcript</th>
              <th className="col-4">Notes</th>
              <th className="col-1">Progress</th>
              <th className="col-2">Date</th>
              <th className="col-2"></th>
            </tr>
          </thead>
          <tbody>
            {transcripts.map((transcript, i) => {
              if (transcript.show == null) {
                transcript.show = true;
              }
              if (transcript.show) {
                return (
                  <TranscriptRow
                    key={transcript.id}
                    transcript_id={transcript.id}
                    name={transcript.TranscriptName}
                    notes={transcript.Notes}
                    date={transcript.UploadDate}
                    nturns={transcript.NTurns}
                    next={transcript.NextLabelling}
                    reloadTranscripts={getSetTranscripts}
                  />
                );
              }
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TranscriptManager;
