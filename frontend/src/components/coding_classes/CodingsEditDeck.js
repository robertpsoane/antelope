import React, { useEffect, useState } from "react";
import CodingCard from "./CodingCard";
import { getAllClassAdmin } from "../../scripts/coding-classes-queries";
import NewCodingButton from "./NewCodingButton";

function CodingsEditDeck(props) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function getSetCodings() {
      const response = await getAllClassAdmin();
      setCards(response);
    }
    getSetCodings();
  }, []);

  function reloadNewCards() {
    async function getSetCodings() {
      const response = await getAllClassAdmin();
      setCards(response);
    }

    getSetCodings();
  }

  return (
    <div>
      <div className="row">
        <div className="col-10">
          <h1>Modify Coding Schema</h1>
        </div>
        <div className="col-2">
          <NewCodingButton
            reloadCards={() => {
              reloadNewCards();
            }}
          />
        </div>
      </div>
      {cards.map((card, i) => {
        return (
          <CodingCard
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

export default CodingsEditDeck;
