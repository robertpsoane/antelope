import React from "react";
import { ProgressBar } from "react-bootstrap";
import TranscriptProgressBar from "./TranscriptProgressBar";
import { COLOURS } from "../../scripts/labelling";

function TranscriptStats(props) {
  /**
   * Transcript Stats component
   * Shows a summary of the transcript.  If not yet labelled, then just
   * a progress bar of labelling progress
   * If finished, provides a summary of how turns have been labelled.
   */
  const transcript_meta = props.transcript;
  const transcript = transcript_meta.Transcript;
  const schema = transcript_meta.schema;
  console.log(transcript_meta);

  if (transcript_meta.NextLabelling == transcript_meta.NTurns) {
    // Count number of instances of each theme
    Object.keys(schema).map((key, _) => {
      schema[key].count = 0;
    });
    transcript.map((val, _) => {
      // For each instance of theme, add 1 to count
      // Can incorporate levels at a later date
      schema[val.code.class].count += 1;
    });

    return (
      <div>
        {Object.keys(schema).map((key, idx) => {
          // For each label, add a line
          return (
            <div key={"label" + key} className="row">
              <div className="col-3">{schema[key].ClassName}</div>
              <div className="col-9">
                <TranscriptProgressBar
                  now={schema[key].count}
                  max={transcript_meta.NTurns}
                  string={schema[key].ClassShort + ":"}
                  variant={COLOURS[idx]}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
        <TranscriptProgressBar
          now={transcript_meta.NextLabelling}
          max={transcript_meta.NTurns}
          string="Turns Labelled:"
        />
      </div>
    );
  }
}

export default TranscriptStats;
