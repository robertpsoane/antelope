import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import UploadTranscriptModal from "./UploadTranscriptModal";

function UploadTranscriptButton(props) {
  /**
   * Button to control modal to upload a transcript.
   */
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Upload Transcript</Tooltip>}
      >
        <Button
          onClick={() => {
            setShowUploadModal(true);
          }}
        >
          <Upload />
        </Button>
      </OverlayTrigger>
      <UploadTranscriptModal
        onHide={() => setShowUploadModal(false)}
        show={showUploadModal}
        reloadTranscripts={() => {
          props.reloadTranscripts();
          setShowUploadModal(false);
        }}
      />
    </div>
  );
}
export default UploadTranscriptButton;
