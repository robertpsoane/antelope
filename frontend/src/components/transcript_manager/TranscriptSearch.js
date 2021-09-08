import React from "react";
import { Form } from "react-bootstrap";

function TranscriptSearch(props) {
  /**
   * Transcript search box.
   * All transcripts metadata is shown - the search box simply filters
   * by text matching in the name and description
   */
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
