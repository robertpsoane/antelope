import React, { useState } from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";
import { deleteClass } from "../../scripts/coding-classes-queries";

function DeleteModal(props) {
  const [show, setShow] = useState(false);
  var { id, classname, reloadCards, ...otherProps } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleDelete() {
    const response = await deleteClass(id);
    reloadCards();
  }

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          Delete Coding <b>{classname}</b>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        You are about to delete coding class {classname}. This is irreversible,
        and will remove codings of any dialogue turns coded as {classname} for
        all users. <br /> If you wish to modify {classname} you can use the edit
        function.
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

export default DeleteModal;
