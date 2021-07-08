import Cookies from "universal-cookie";

export async function getTranscriptBatch(transcript_id) {
  const url = "/api/label_session/" + transcript_id + "/";
  const response = await fetch(url).then((result) => result.json());
  return response;
}

export async function postLabelledBatch(batch) {
  const cookies = new Cookies();
  const response = await fetch("/api/label_session_put_labels/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
    body: JSON.stringify(batch),
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}
