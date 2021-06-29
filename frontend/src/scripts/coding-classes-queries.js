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
  console.log(response);
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
