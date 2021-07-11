import React from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";
import { deleteClass } from "../../scripts/labelling-classes-queries";

function DeleteModal(props) {
  //const [show, setShow] = useState(false);
  var { id, classname, short, reloadCards, ...otherProps } = props;

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

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
          Delete <em>{classname}</em>?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        You are about to delete labelling class {short}. This is irreversible,
        and will remove labellings of any dialogue turns coded as {short} for
        all users. <br /> If you wish to modify {short} you can use the edit
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
