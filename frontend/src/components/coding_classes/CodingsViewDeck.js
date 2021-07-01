import React, { useState, useEffect } from "react";
import CodingCard from "./CodingCard";
import { getAllClass } from "../../scripts/coding-classes-queries";

function CodingsViewDeck(props) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function getSetCodings() {
      const response = await getAllClass();
      setCards(response);
    }
    getSetCodings();
  }, []);

  if (cards.length > 0) {
    return (
      <div>
        {cards.map((card, i) => {
          return (
            <CodingCard
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
          Coding schema empty... <br /> No coding classes have been added by the
          administrator.
        </em>
      </p>
    );
  }
}

export default CodingsViewDeck;
