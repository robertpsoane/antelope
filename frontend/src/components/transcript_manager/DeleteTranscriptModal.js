import React from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";
import { deleteTranscript } from "../../scripts/transcripts";

function DeleteTranscriptModal(props) {
  /**
   * Confirmatory modal to handle deleting of transcripts.
   * If user confirms their wish to delete the transcript, this
   * component calls the delete function and reloads that transcripts
   * to show the transcript has been deleted
   */
  var { transcript_id, name, reloadTranscripts, ...otherProps } = props;

  async function handleDelete() {
    const response = await deleteTranscript(transcript_id);
    reloadTranscripts();
  }
  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Delete {name}?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you wish to delete {name}? This is irrelversible.
      </Modal.Body>

      <Modal.Footer>
        <ButtonGroup>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
          <Button variant="success" onClick={props.onHide}>
            Cancel
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteTranscriptModal;
