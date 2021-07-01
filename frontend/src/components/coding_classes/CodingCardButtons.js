import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Pencil, XCircle } from "react-bootstrap-icons";
import EditCodingModal from "./EditCodingModal";
import DeleteModal from "./DeleteModal";

function CodingCardButtons(props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (props.modify) {
    return (
      <div style={{ float: "right" }}>
        <ButtonGroup>
          <Button
            variant="warning"
            onClick={() => {
              setShowEditModal(true);
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            <XCircle />
          </Button>
        </ButtonGroup>
        <EditCodingModal
          onHide={() => setShowEditModal(false)}
          show={showEditModal}
          id={props.id}
          classname={props.classname}
          short={props.short}
          description={props.description}
          levels={props.levels}
          reloadCards={() => {
            props.reloadCards();
            setShowEditModal(false);
          }}
        />
        <DeleteModal
          onHide={() => setShowDeleteModal(false)}
          show={showDeleteModal}
          id={props.id}
          classname={props.classname}
          short={props.short}
          reloadCards={() => {
            props.reloadCards();
            setShowDeleteModal(false);
          }}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default CodingCardButtons;
