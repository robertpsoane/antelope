import React from "react";
import { Card, Spinner } from "react-bootstrap";

function TranscriptProcesssingCard(props) {
  /**
   * Card to tell user transcript is being processed.
   *
   * This is used when the transcript has just been uploaded and the
   * embeddings haven't been generated yet.  It re-queries the server
   * every 5 seconds to check if the transcript has been processed yet
   */

  async function refresh() {
    const response = await props.getBatch();
    if (response.processed) {
      props.setBatch(response);
    } else {
      setTimeout(refresh, 5000);
    }
  }

  refresh();

  return (
    <Card style={{ margin: "10px" }}>
      <Card.Header>
        <Card.Title id="processing-title">Processing Transcript...</Card.Title>
      </Card.Header>
      <Card.Body id="processing-body">
        <div className="alert alert-warning">
          The server is currently processing the transcript for labelling.
          Please try again later...
        </div>
      </Card.Body>
    </Card>
  );
}

export default TranscriptProcesssingCard;
