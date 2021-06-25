/* 
Login Help Modal function -  manages help for login on press of help 
button
*/
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function LoginHelp(props) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Help</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          To use the Session Labelling tool you must login. If you don't have an
          account, or have forgotten your password please contact the system
          adminstrator.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default LoginHelp;
