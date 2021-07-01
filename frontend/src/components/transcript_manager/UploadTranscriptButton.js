import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import UploadTranscriptModal from "./UploadTranscriptModal";

function UploadTranscriptButton(props) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setShowUploadModal(true);
        }}
      >
        <Upload />
      </Button>
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
