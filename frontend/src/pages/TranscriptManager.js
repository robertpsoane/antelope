import React, { useEffect, useState } from "react";

import { Table } from "react-bootstrap";

import UploadTranscriptButton from "../components/transcript_manager/UploadTranscriptButton";
import TranscriptRow from "../components/transcript_manager/TranscriptRow";
import { getTranscripts } from "../scripts/transcripts";

function TranscriptManager(props) {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    async function getSetTranscripts() {
      const response = await getTranscripts();
      setTranscripts(response);
    }
    getSetTranscripts();
  }, []);

  function reloadTranscripts() {
    async function getSetTranscripts() {
      const response = await getTranscripts();
      setTranscripts(response);
    }
    getSetTranscripts();
  }

  return (
    <div>
      <div className="row">
        <div className="col-10">
          <h1>Transcripts</h1>
        </div>
        <div className="col-2">
          <div style={{ float: "right" }}>
            <UploadTranscriptButton
              reloadTranscripts={() => {
                reloadTranscripts();
              }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <p>
          On this page you can view, upload, modify and download your
          transcripts in a csv.
        </p>
      </div>
      <div className="row">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="col-3">Session</th>
              <th className="col-4">Notes</th>
              <th className="col-1">Progress</th>
              <th className="col-2">Date</th>
              <th className="col-2"></th>
            </tr>
          </thead>
          <tbody>
            {transcripts.map((transcript, i) => {
              return (
                <TranscriptRow
                  key={transcript.id}
                  transcript_id={transcript.id}
                  name={transcript.SessionName}
                  notes={transcript.Notes}
                  date={transcript.UploadDate}
                  nturns={transcript.NTurns}
                  next={transcript.NextCoding}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TranscriptManager;
