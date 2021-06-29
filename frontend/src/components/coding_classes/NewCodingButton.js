import React, { useState } from "react";

import { Button } from "react-bootstrap";

import NewCodingModal from "./NewCodingModal";

function NewCodingButton(props) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <Button className="float-end" onClick={() => setModalShow(true)}>
        New Coding Class
      </Button>
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
