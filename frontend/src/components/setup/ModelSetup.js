import React, { useState } from "react";

import { Form } from "react-bootstrap";
import FormInput from "./FormInput";

function ModelSetup(props) {
  const options = props.modelFor;
  const modelName = props.modelForName;
  const current = props.current;
  const classifiers = options.classifiers;
  const [classifier, setClassifier] = useState(current.classifier);
  const id = modelName + "_choose_model";

  function changeClassifier(classifierName) {
    setClassifier(classifierName);
  }
  return (
    <div>
      <Form.Group
        controlId={"label" + modelName + "ModelSelect"}
        style={{ margin: "10px" }}
      >
        <Form.Label>
          <h3>{modelName} Model</h3>
        </Form.Label>
        <select
          id={id}
          className="form-select"
          defaultValue={current.classifier}
          onChange={(e) => {
            changeClassifier(e.target.value);
          }}
        >
          {Object.keys(classifiers).map((classifier, _) => {
            return (
              <option key={modelName + classifier} value={classifier}>
                {classifier}
              </option>
            );
          })}
        </select>
      </Form.Group>
      {Object.keys(classifiers[classifier]).map((param, idx) => {
        var paramType = classifiers[classifier][param].type;

        if (classifier == current.classifier) {
          var paramDefault = current.params[param];
        } else {
          var paramDefault = classifiers[classifier][param].default;
        }

        var paramRange = classifiers[classifier][param].range;
        var key = modelName + "_" + param;

        return (
          <FormInput
            key={key}
            id={key}
            param={param}
            type={paramType}
            default={paramDefault}
            range={paramRange}
          />
        );
      })}
    </div>
  );
}

export default ModelSetup;
