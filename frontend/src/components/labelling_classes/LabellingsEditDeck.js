import React, { useEffect, useState } from "react";
import LabellingCard from "./LabellingCard";
import { getAllClassAdmin } from "../../scripts/labelling-classes-queries";
import NewLabellingButton from "./NewLabellingButton";

function LabellingsEditDeck(props) {
  const [cards, setCards] = useState([]);

  async function reloadNewCards() {
    const response = await getAllClassAdmin();
    setCards(response);
  }

  useEffect(() => {
    reloadNewCards();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <h1>Modify Labelling Schema</h1>
        </div>
        <div className="col-4">
          <NewLabellingButton
            reloadCards={() => {
              reloadNewCards();
            }}
          />
        </div>
      </div>
      <div className="row">
        <p>Labelling classes can be added and modified on this page.</p>
      </div>
      {cards.map((card, i) => {
        return (
          <LabellingCard
            key={card.id}
            id={card.id}
            classname={card.ClassName}
            short={card.ClassShort}
            description={card.ClassDescription}
            levels={card.levels}
            modify={true}
            reloadCards={() => {
              reloadNewCards();
            }}
          />
        );
      })}
    </div>
  );
}

export default LabellingsEditDeck;
