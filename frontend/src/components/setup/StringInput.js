import React from "react";
import { Form } from "react-bootstrap";

function StringInput(props) {
  /**
   * Input field for string data type in model setup form
   */
  return (
    <Form.Group
      controlId={props.id}
      style={{
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <div className="row">
        <div className="col-2">
          <Form.Label>{props.param}</Form.Label>
        </div>
        <div className="col-10">
          <select id={props.id} className="form-select">
            {props.range.map((val) => {
              if (val == null) {
                var valText = "None";
              } else {
                var valText = val;
              }
              return (
                <option
                  key={props.id + val}
                  value={val}
                  selected={val == props.defaultVal}
                >
                  {valText}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </Form.Group>
  );
}

export default StringInput;
