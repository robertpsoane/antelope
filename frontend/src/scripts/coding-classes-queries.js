// Duplicated function - one which requires admin permissions.
// The reason for this is, that despite little tangible difference
// between the two function calls, this prevents a non-admin user from
// seeing anything useful should they navigate to the modify_schema
// page.
//
// While any function call to modify coding information require the user
// to be logged in as admin, by preventing any of the page from loading
// it should avoid potential confusion

import Cookies from "universal-cookie";
export async function getAllClass() {
  const schema = await fetch("/api/coding_schema_with_levels/").then((result) =>
    result.json()
  );
  return schema;
}

export async function getAllClassAdmin() {
  const schema = await fetch("/api/coding_schema_with_levels_admin/").then(
    (result) => result.json()
  );
  return schema;
}

export const POSSIBLE_LEVELS = [-3, -2, -1, 0, 1, 2, 3];

export function getDataFromModalForm() {
  /* 
  Function to get all data from modal form for new/edit class.  Handles 
  errors or returns json of data
  */
  // Get values of form components
  const codingName = document.getElementById("codingName").value;
  const codingDescription = document.getElementById("codingDescription").value;
  const codingShort = document.getElementById("codingShort").value;

  // Extract levels from fomr
  const levels = [];
  POSSIBLE_LEVELS.forEach((l, i) => {
    if (document.getElementById("level" + l).checked) {
      levels.push(l);
    }
  });

  if (codingName == "") {
    postClassError("class name");
    return "error";
  } else if (codingShort == "") {
    postClassError("acronym");
    return "error";
  } else if (codingDescription == "") {
    postClassError("description");
    return "error";
  } else if (levels.length === 0) {
    postClassError("levels");
    return "error";
  } else {
    return {
      name: codingName,
      description: codingDescription,
      short: codingShort,
      levels: levels,
    };
  }
}

export async function putUpdatedClass(data) {
  const cookies = new Cookies();

  const response = await fetch("/api/coding_schema_edit/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );

  return response;
}

export async function postNewClass(data) {
  const cookies = new Cookies();
  const response = await fetch("/api/coding_schema_new/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}

export function postClassError(missing) {
  const errorDiv = document.getElementById("error-div");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-danger");
  errorDiv.innerHTML = "<b>Error:</b> Missing " + missing;
}

export async function deleteClass(id) {
  const url = "/api/coding_schema_modify/" + id + "/";
  const cookies = new Cookies();
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
  });
  return response;
}

// Used for speed - TODO determine if needs to be killed
const CICS = [
  {
    name: "Action Planning and Idea Generation",
    short: "API",
    description:
      "Coded where either party suggests an action plan or potential problem solution idea linked to activities which might take place outside the session. The level coded is dependent on how the idea is developed or refined and the degree of observable engagement, particularly from the patient. The refinement of ideas may stray into what seems like a PCD theme, as the barriers to actions are discussed. This should be coded as PCD and return to API if further action planning is restarted. If the rationale for a particular action is given but no explicit suggestion is made that it could be done then this should be coded as IDI. For actions that are planned to be completed in the session use the STF theme.",
    levels: [-1, 0, 1],
  },
  {
    name: "Evaluation of Self or Therapy",
    short: "EST",
    description:
      "Code where there are interactions focused on evaluating therapy and/or related activities; self-supporting statements, or instances where completion of a therapeutic task is acknowledged as an accomplishment. This also includes statements of praise or support for the therapist or patient. The level coded is dependent upon who initiates the comment and level of patient engagement and agreement. This theme is often coded alongside NCO for specific evaluative phrases.",
    levels: [-1, 0, 1],
  },
  {
    name: "Information Discussion",
    short: "IDI",
    description:
      "Code where information is given or sought. The degree of relevance and reciprocity affects the level to be coded. Higher ratings demonstrate patient engagement with, and development of therapist information. Lower ratings demonstrate reluctance to engage with, or active rejection of therapist information. If information is provided by a therapist in the middle of a turn, but the patient does not directly respond to the information given then the relevant section of the therapist turn is coded as IDI, 0. This is differentiated from PAU because any information given is theoretical, abstract or general, as opposed to a personalised conceptualisation or explanation of a situation (see example 1). Key to this is the use of pronouns. Information using “we/you plural, “people” etc. would be coded as IDI. Whereas information using personal pronouns (you singular) would be coded as PAU. Segments coded as IDI contain information which could be delivered to an audience of several people and would not make sense if it was not delivered to the individual.",
    levels: [-1, 0, 1],
  },
  {
    name: "Problem Analysis and Understanding",
    short: "PAU",
    description:
      "Code where a new understanding is explained by either party. The level coded is dependent on the degree of reciprocity and development expressed. Higher ratings demonstrate new patient understandings, even if initiated by the therapist, that logically feed into interventions. Lower ratings demonstrate either clearly counterproductive understandings or oppositional responses to presentations of new understandings. Interactions would move from PCD ratings when questioning or descriptive interactions move to explanatory interactions. PAU is differentiated from IDI because any information given is personalised to the individual within a specific context, conceptualising an explanation of a situation.",
    levels: [-1, 0, 1],
  },
  {
    name: "Noticing Change or Otherwise",
    short: "NCO",
    description:
      "Code where positive change (or absence thereof) is noticed and explicitly commented upon by either party. This would be linked to the patient’s efforts and/or the therapist’s efforts. This typically includes changes since therapy began but can include other patient-initiated changes without external support/prompting. The level coded depends upon the degree to which the patient notices, develops and personally owns positive or negative changes. If the change is extended to a meta-evaluation of the therapy or of the patient themselves it would also be coded as Evaluation of Self or Therapy (EST).",
    levels: [-1, 0, 1],
  },
  {
    name: "Problem or Context Description",
    short: "PCD",
    description:
      "Coded for apparently neutral interactions where no other theme is appropriate to be applied. This will often constitute a problem description being given or sought. It includes general assessment interactions and descriptions of the problem context, but is not limited to these topics. Levels of coding are not applied to this theme – the theme is either present or absent. The PCD theme is only stopped where there is distinct movement to a different theme. When general discussions coded as PCD deviate off relevant topics for two turns or more STF -1/-2 is coded, as it is deemed a lack of focus. If interactions totally unrelated to therapy take place Other (OTH) is coded",
    levels: [-1, 0, 1],
  },
  {
    name: "Structuring and Task Focus",
    short: "STF",
    description:
      "Code where significant changes in session direction take place, initiated by either therapist or patient. Typically, the following six turns are tracked to see if the change in direction is maintained by both parties. This theme is also coded when working through a structured task and clear instructions are being given and followed – in this case as few as one following turn can be coded. The theme includes changes of direction initiated by drifting or deviating from a specified topic. This may be coded alongside another theme relevant to the content of the change in direction. It includes agenda mapping that may occur at the beginning and throughout the session. Higher ratings demonstrate maintenance of a strong focus on relevant topics, endorsed, followed and/or developed by both parties. Lower ratings demonstrate unaddressed changes in focus, moving away from or seeming to avoid relevant topics; if maintained (i.e. not corrected within two turns of speech) these passages are negatively coded for the duration of the deviation regardless of number of turns. A positive code is applied if a party draws the conversation back onto relevant topics after a deviation and this is maintained.",
    levels: [-1, 0, 1],
  },
  {
    name: "Other",
    short: "OTH",
    description:
      "There may be session segments that cannot appropriately be coded using the other themes identified. In such instances, this is coded “OTH” and a brief description is given of what is observed",
    levels: [0],
  },
];

export async function autoLoadCICS() {
  var res;
  for (const cics_key in CICS) {
    const data = CICS[cics_key];
    res = await postNewClass(data);
  }
  return { res };
}
