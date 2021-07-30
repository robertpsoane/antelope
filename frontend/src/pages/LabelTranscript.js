import React, { useEffect, useState } from "react";

import { getTranscriptBatch, postLabelledBatch } from "../scripts/labelling";
import TurnCard from "../components/turn_labelling/TurnCard";
import AdjacentCard from "../components/turn_labelling/AdjacentCard";
import TranscriptTitleCard from "../components/turn_labelling/TranscriptTitleCard";
import { Spinner } from "react-bootstrap";
import TranscriptProcesssingCard from "../components/turn_labelling/TranscriptProcessingCard";

function LabelTranscript(props) {
  const t_id = props.transcript_id;
  const [batch, setBatch] = useState({});
  const [turnNumber, setTurnNumber] = useState(null);

  async function getBatch() {
    const response = await getTranscriptBatch(t_id);
    if (response.NTurns == response.NextLabelling) {
      finishedTranscript();
    }
    return response;
  }

  function setTurnBatch(response) {
    setTurnNumber(response.start);
    setBatch(response);
  }

  async function getSetBatch() {
    const response = await getBatch();
    setTurnBatch(response);
  }

  useEffect(() => {
    getSetBatch();
  }, []);

  async function incrementTurn() {
    if (turnNumber == batch.end) {
      // Batch finished
      const response = await postLabelledBatch(batch);
      getSetBatch();
    } else {
      setTurnNumber(turnNumber + 1);
    }
  }

  function decrementTurn() {
    if (turnNumber > 0) {
      setTurnNumber(turnNumber - 1);
    }
  }

  function finishedTranscript() {
    window.location.href = "/view/" + t_id + "/";
  }

  if (t_id == null) {
    window.location.pathname = "";
  } else if (batch.TranscriptName == null) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else if (batch.processed) {
    return (
      <div>
        <div id="title">
          <TranscriptTitleCard batch={batch} turnNumber={turnNumber} />
        </div>
        <div id="body">
          <AdjacentCard
            turnNumber={turnNumber - 1}
            batch={batch}
            decrementTurn={decrementTurn}
          />
          <TurnCard
            batch={batch}
            turnNumber={turnNumber}
            incrementTurn={incrementTurn}
          />
          <AdjacentCard turnNumber={turnNumber + 1} batch={batch} />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div id="title">
          <TranscriptTitleCard batch={batch} />
        </div>
        <div id="body">
          <TranscriptProcesssingCard
            batch={batch}
            getBatch={getBatch}
            setBatch={(res) => setTurnBatch(res)}
          />
        </div>
      </div>
    );
  }
}

export default LabelTranscript;
