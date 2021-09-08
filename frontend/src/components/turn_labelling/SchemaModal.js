import React from "react";
import { Modal, Button } from "react-bootstrap";
import LabellingsViewDeck from "../labelling_classes/LabellingsViewDeck";

function SchemaModal(props) {
  /**
   * Modal to show the labellings during labellnig.
   */
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Labelling Schema
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LabellingsViewDeck />
      </Modal.Body>
    </Modal>
  );
}

export default SchemaModal;
