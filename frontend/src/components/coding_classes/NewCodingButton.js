import React, { useState } from "react";

import { ButtonGroup, Button } from "react-bootstrap";

import NewCodingModal from "./NewCodingModal";
import { autoLoadCICS } from "../../scripts/coding-classes-queries";

function NewCodingButton(props) {
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
      <NewCodingModal
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

export default NewCodingButton;
