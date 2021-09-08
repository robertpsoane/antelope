import React from "react";
import { ProgressBar } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function TranscriptProgressBar(props) {
  /**
   * Component which provides a progress bar showing transcript
   * labelling progress
   *
   * Includes a tooltip to show the labelling progress numerically
   */
  if (props.string.length > 0) {
    var string = props.string + " ";
  } else {
    var string = props.string;
  }
  if (props.variant == null) {
    var variant = "success";
  } else {
    var variant = props.variant;
  }
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          {string}
          {props.now}/{props.max}
        </Tooltip>
      }
    >
      <ProgressBar
        variant={variant}
        now={props.now}
        min="0"
        max={props.max}
        height="100%"
      />
    </OverlayTrigger>
  );
}

export default TranscriptProgressBar;
