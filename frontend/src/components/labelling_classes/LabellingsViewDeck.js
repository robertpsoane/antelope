import React, { useState, useEffect } from "react";
import LabellingCard from "./LabellingCard";
import { getAllClass } from "../../scripts/labelling-classes-queries";

function LabellingsViewDeck(props) {
  /**
   * Labelling View Deck
   *
   * Deck to view the labelling classes - no capacity to edit
   */
  const [cards, setCards] = useState([]);

  async function getSetLabellings() {
    const response = await getAllClass();
    setCards(response);
  }

  useEffect(() => {
    getSetLabellings();
  }, []);

  if (cards.length > 0) {
    return (
      <div>
        {cards.map((card, i) => {
          return (
            <LabellingCard
              key={card.id}
              id={card.id}
              classname={card.ClassName}
              short={card.ClassShort}
              description={card.ClassDescription}
              levels={card.levels}
            />
          );
        })}
      </div>
    );
  } else {
    return (
      <p className="text-center">
        <em>
          Labelling schema empty... <br /> No labelling classes have been added
          by the administrator.
        </em>
      </p>
    );
  }
}

export default LabellingsViewDeck;
