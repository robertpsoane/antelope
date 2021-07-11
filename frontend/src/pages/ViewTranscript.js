import React, { useState, useEffect } from "react";
import { getTranscriptByID } from "../scripts/transcripts";
import { Spinner } from "react-bootstrap";
import TranscriptCard from "../components/transcript_manager/TranscriptCard";
import TranscriptAsTable from "../components/transcript_manager/TranscriptAsTable";

function ViewTranscript(props) {
  const [transcript, setTranscript] = useState({});
  const t_id = props.transcript_id;

  useEffect(() => {
    async function getSetTranscript() {
      const response = await getTranscriptByID(t_id);
      setTranscript(response);
    }
    getSetTranscript();
  }, []);

  function reloadTranscript() {
    async function getSetTranscript() {
      const response = await getTranscriptByID(t_id);
      setTranscript(response);
    }
    getSetTranscript();
  }

  if (t_id == null) {
    window.location.pathname = "";
  } else if (transcript.TranscriptName == null) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <div>
        <div className="row">
          <TranscriptCard
            transcript={transcript}
            reloadTranscript={() => reloadTranscript()}
          />
        </div>
        <div style={{ marginTop: "10px" }}></div>
        <div className="row">
          <TranscriptAsTable transcript={transcript} />
        </div>
      </div>
    );
  }
}

export default ViewTranscript;
