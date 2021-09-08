import React from "react";
import { Card } from "react-bootstrap";
import LabellingCardButtons from "./LabellingCardButtons";

function LabellingCard(props) {
  /**
   * Card to display labelling class, and description in the view
   * and edit transcript decks.
   *
   * If required, provides an edit button to load the edit modal
   */
  return (
    <Card id={"card-" + props.id} className="m-3">
      <Card.Header>
        <div className="row">
          <div className="col-8">
            {props.classname} ({props.short})
          </div>
          <div className="col-4">
            <LabellingCardButtons
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

export default LabellingCard;
