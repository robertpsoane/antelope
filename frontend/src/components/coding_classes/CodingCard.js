import React from "react";
import { Card } from "react-bootstrap";
import CodingCardButtons from "./CodingCardButtons";

function CodingCard(props) {
  return (
    <Card id={"card-" + props.id} className="m-3">
      <Card.Header>
        <div className="row">
          <div className="col-8">
            {props.classname} ({props.short})
          </div>
          <div className="col-4">
            <CodingCardButtons
              modify={props.modify}
              id={props.id}
              classname={props.classname}
              short={props.short}
              description={props.description}
              levels={props.levels}
              reloadCards={() => {
                props.reloadCards();
              }}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Text className="p-2">{props.description}</Card.Text>
      <Card.Footer>
        Levels:{" "}
        {props.levels.map((level, i) => {
          if (i < props.levels.length - 1) {
            return level + ", ";
          } else {
            return level;
          }
        })}
      </Card.Footer>
    </Card>
  );
}

export default CodingCard;
