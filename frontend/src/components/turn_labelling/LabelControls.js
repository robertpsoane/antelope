import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

const COLOURS = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];

function LabelControls(props) {
  const schema = props.schema;
  const turn = props.turn;
  const prediction = turn.prediction;

  const schemaKeys = Object.keys(schema);

  var date = new Date();
  const loadTime = date.getTime();

  function handleLabelling(turnClass, level) {
    var date = new Date();
    const labelTime = date.getTime() - loadTime;
    const label = {
      class: turnClass,
      level: level,
      time: labelTime,
    };
    turn.code = label;
    props.incrementTurn();
  }

  var acronym_colour = {};

  return (
    <div className="row">
      <div className="col-8">
        <ButtonGroup>
          {schemaKeys.map((key, idx) => {
            var schemaClass = schema[key];

            var levels = schemaClass.levels;
            var acronym = schemaClass.ClassShort;
            var variant = COLOURS[idx];
            acronym_colour[acronym] = variant;

            // console.log(key);
            return (
              <DropdownButton
                key={key}
                id={key}
                variant={variant}
                title={acronym}
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                {levels.map((val, _) => {
                  // console.log(val);
                  var dropdown = val;
                  if (val > 0) {
                    dropdown = "+" + dropdown;
                  }
                  return (
                    <Dropdown.Item
                      key={acronym + val}
                      onClick={() => handleLabelling(key, val)}
                    >
                      {dropdown}
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
            );
          })}
        </ButtonGroup>
      </div>
      <div className="col-4">
        <div style={{ float: "right" }}>
          Suggestion
          <Button
            style={{ marginLeft: "10px" }}
            variant={acronym_colour[schema[prediction.class].ClassShort]}
            onClick={() => {
              console.log(prediction.class);
              console.log(prediction.level);
              handleLabelling(prediction.class, prediction.level);
            }}
          >
            {schema[prediction.class].ClassShort}, {prediction.level}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LabelControls;
