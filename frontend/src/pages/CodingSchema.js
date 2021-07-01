import React from "react";
import CodingsViewDeck from "../components/coding_classes/CodingsViewDeck";

function CodingSchema(props) {
  return (
    <div>
      <h1>Coding Schema</h1>
      <p>
        The following coding schema has been setup by the administrator. Each
        class has a name, an acronym and a description. There are also a number
        of levels of intensity possible for each class. Use the descriptions
        here for reference when labelling transcripts.
      </p>
      <CodingsViewDeck />
      <p>
        These codings, descriptions and levels can be modified by an
        adminstrator via the settings page. While technically possible, it is
        not recommended that codings are removed as labelled turns will be
        effected.
      </p>
    </div>
  );
}

export default CodingSchema;
