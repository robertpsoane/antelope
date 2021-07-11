import React, { useState } from "react";

import { ButtonGroup, Button } from "react-bootstrap";

import NewLabellingModal from "./NewLabellingModal";
import { autoLoadCICS } from "../../scripts/labelling-classes-queries";

function NewLabellingButton(props) {
  const [modalShow, setModalShow] = useState(false);

  async function handleCICSButton() {
    await autoLoadCICS();
    props.reloadCards();
  }

  return (
    <div>
      <ButtonGroup className="float-end">
        <Button onClick={() => setModalShow(true)}>New Class</Button>
        <Button className="btn-secondary" onClick={handleCICSButton}>
          Load CICS
        </Button>
      </ButtonGroup>
      <NewLabellingModal
        onHide={() => setModalShow(false)}
        show={modalShow}
        reloadCards={() => {
          props.reloadCards();
          setModalShow(false);
        }}
      />
    </div>
  );
}

export default NewLabellingButton;
