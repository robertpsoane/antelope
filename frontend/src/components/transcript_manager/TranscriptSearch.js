import React from "react";
import { Form } from "react-bootstrap";

function TranscriptSearch(props) {
  const transcripts = [...props.transcripts];

  function handleChange(x) {
    const searchTerm = x.target.value.toLowerCase();

    transcripts.map((val, _) => {
      var transcriptName = val.TranscriptName.toLowerCase();
      var transcriptNotes = val.Notes.toLowerCase();
      val.show =
        transcriptName.includes(searchTerm) ||
        transcriptNotes.includes(searchTerm);
    });

    props.setTranscripts(transcripts);
  }

  return (
    <Form>
      <Form.Group controlId="searchBox">
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={handleChange}
        ></Form.Control>
      </Form.Group>
    </Form>
  );
}

export default TranscriptSearch;
