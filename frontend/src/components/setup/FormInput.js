import React from "react";

import StringInput from "./StringInput";
import FloatInput from "./FloatInput";

function FormInput(props) {
  const param = props.param;
  const type = props.type;
  const defaultVal = props.default;
  const range = props.range;
  const id = props.id;

  if (type == "string") {
    return (
      <StringInput
        param={param}
        defaultVal={defaultVal}
        range={range}
        id={id}
      />
    );
  } else if (type == "float") {
    return (
      <FloatInput param={param} defaultVal={defaultVal} range={range} id={id} />
    );
  }
}

export default FormInput;
