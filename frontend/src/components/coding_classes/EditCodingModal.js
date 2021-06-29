import React, { useState } from "react";

import { Modal, Button, Form } from "react-bootstrap";
import {
  getDataFromModalForm,
  putUpdatedClass,
  POSSIBLE_LEVELS,
} from "../../scripts/coding-classes-queries";

function EditCodingModal(props) {
  const [show, setShow] = useState(false);
  var {
    id,
    classname,
    short,
    description,
    levels,
    reloadCards,
    ...otherProps
  } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleKeyPress() {
    const data = getDataFromModalForm();

    if (data != "error") {
      data.id = id;
      console.log(data);
      const response = await putUpdatedClass(data);
      // Reload cards and hide modal
      reloadCards();
    }
  }

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Edit Coding Class</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-8">
              <Form.Group controlId="codingName">
                <Form.Label>Class Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Class name"
                  defaultValue={classname}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group controlId="codingShort">
                <Form.Label>Class Acronym</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter acronym"
                  defaultValue={short}
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group controlId="codingDescription">
            <Form.Label>Class Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              defaultValue={description}
            />
          </Form.Group>

          <Form.Label>Levels</Form.Label>
          <Form.Group controlId="codingLevels">
            {POSSIBLE_LEVELS.map((l, i) => {
              if (levels.includes(l)) {
                return (
                  <Form.Check
                    key={"level" + l}
                    inline
                    label={l}
                    name={l}
                    id={"level" + l}
                    defaultChecked
                  />
                );
              } else {
                return (
                  <Form.Check
                    key={"level" + l}
                    inline
                    label={l}
                    name={l}
                    id={"level" + l}
                  />
                );
              }
            })}
          </Form.Group>

          <div id="error-div"></div>

          <Form.Group controlId="formSubmit">
            <Button
              onClick={() => {
                handleKeyPress();
              }}
              variant="primary"
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditCodingModal;
