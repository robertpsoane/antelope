import React from "react";
import LabellingsViewDeck from "../components/labelling_classes/LabellingsViewDeck";

function LabellingSchema(props) {
  return (
    <div>
      <h1>Labelling Schema</h1>
      <p>
        The following labels have been setup by the administrator. Each class
        has a name, an acronym and a description. There are also a number of
        levels of intensity possible for each class. Use the descriptions here
        for reference when labelling transcripts.
      </p>
      <LabellingsViewDeck />
      <p>
        These labels, descriptions and levels can be modified by an adminstrator
        via the settings page. While technically possible, it is not recommended
        that labels are removed as labelled turns will be effected.
      </p>
    </div>
  );
}

export default LabellingSchema;
