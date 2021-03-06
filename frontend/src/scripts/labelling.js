import Cookies from "universal-cookie";

export const COLOURS = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "dark",
];

export async function getTranscriptBatch(transcript_id) {
  /**
   * Fetches the next batch of the transcript with the input
   * id to label
   */
  const url = "/api/label_transcript/" + transcript_id + "/";
  const response = await fetch(url).then((result) => result.json());
  return response;
}

export async function postLabelledBatch(batch) {
  /**
   *  Returns a labelled batch to the server
   */
  const cookies = new Cookies();
  const response = await fetch("/api/label_transcript_put_labels/", {
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
