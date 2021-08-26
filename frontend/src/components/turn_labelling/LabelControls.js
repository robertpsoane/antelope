import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { COLOURS } from "../../scripts/labelling";

function LabelControls(props) {
  const schema = props.schema;
  const turn = props.turn;
  const prediction = turn.prediction;
  console.log(prediction);
  const schemaKeys = Object.keys(schema);

  var date = new Date();
  const loadTime = date.getTime();

  function handleLabelling(turnClass, level) {
    console.log(turnClass, level);
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
          {schemaKeys.map((labelKey, idx) => {
            var schemaClass = schema[labelKey];

            var levels = schemaClass.levels;
            var acronym = schemaClass.ClassShort;
            var name = schemaClass.ClassName;
            var variant = COLOURS[idx];
            acronym_colour[acronym] = variant;

            // console.log(key);
            return (
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>{name}</Tooltip>}
              >
                <DropdownButton
                  key={labelKey}
                  id={labelKey}
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
                        onClick={() => handleLabelling(parseInt(labelKey), val)}
                      >
                        {dropdown}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
              </OverlayTrigger>
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
