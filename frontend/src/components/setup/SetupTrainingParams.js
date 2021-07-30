import React from "react";

import FormInput from "./FormInput";
function SetupTrainingParams(props) {
  const params = props.params;
  const current = props.current;
  const keyRoot = "training_params_";
  return (
    <div>
      <h3>Training Parameters</h3>
      {Object.keys(params).map((param, _) => {
        var paramType = params[param].type;
        var paramDefault = current[param];
        var paramRange = params[param].range;
        var key = keyRoot + param;

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

export default SetupTrainingParams;
