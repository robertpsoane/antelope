import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { Pencil, XCircle } from "react-bootstrap-icons";
import EditLabellingModal from "./EditLabellingModal";

function LabellingCardButtons(props) {
  /**
   * Edit button to modify labelling class - brings up EditLabellingModal
   * modal
   */
  const [showEditModal, setShowEditModal] = useState(false);

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
        </ButtonGroup>
        <EditLabellingModal
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
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default LabellingCardButtons;
