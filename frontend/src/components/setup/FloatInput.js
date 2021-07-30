import React from "react";
import { Form } from "react-bootstrap";
function FloatInput(props) {
  const range = props.range;
  const param = props.param;
  const defaultVal = props.defaultVal;
  const id = props.id;

  function enforceLimits(target) {
    const val = target.value;
    if (val > range[1]) {
      target.value = range[1];
    } else if (val < range[0]) {
      target.value = range[0];
    }
  }

  return (
    <Form.Group
      controlId={id}
      style={{
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <div className="row">
        <div className="col-2">
          <Form.Label>{param}</Form.Label>
        </div>
        <div className="col-10">
          <Form.Control
            defaultValue={defaultVal}
            type="number"
            onChange={(e) => {
              enforceLimits(e.target);
            }}
          />
        </div>
      </div>
    </Form.Group>
  );
}
export default FloatInput;
