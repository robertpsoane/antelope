import React from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";

function DeleteTranscriptModal(props) {
  var { transcript_id, name, ...otherProps } = props;

  async function handleDelete() {}
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
