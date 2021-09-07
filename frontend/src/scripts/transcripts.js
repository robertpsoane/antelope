import Cookies from "universal-cookie";
import download from "downloadjs";

export async function postTranscript(data) {
  /**
   * Manages the posting of new transcript to the server
   */
  const cookies = new Cookies();
  const response = await fetch("/api/new_transcript/", {
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

export async function getTranscripts() {
  /**
   * Gets all transcripts owned by the logged in usr
   */
  const transcripts = await fetch("/api/transcripts/").then((result) =>
    result.json()
  );
  return transcripts;
}

export async function getTranscriptByID(id) {
  /**
   * Gets the text of the id'd transcript, along with the metadata
   */
  const url = "/api/transcripts/" + id + "/";
  const transcript = await fetch(url).then(async (result) => {
    const status = result.status;
    const response = await result.json();
    response["status"] = status;
    return response;
  });
  return transcript;
}

function uploadError(missingField) {
  /**
   * Adds error message to the upload modal when there are missing fields.
   */
  const errorDiv = document.getElementById("error-div");
  errorDiv.classList.add("alert");
  errorDiv.classList.add("alert-danger");
  errorDiv.innerHTML = "<b>Error:</b> Please provide " + missingField;
}

export async function uploadTranscript() {
  /**
   * Handles the upload of a transcript
   * Extracts all data from the form and posts the transcript.
   */

  const transcriptName = document.getElementById("transcriptName").value;
  const transcriptNotes = document.getElementById("transcriptNotes").value;
  const transcriptText = document.getElementById("transcriptTextData").value;

  if (transcriptName == "") {
    uploadError("Transcript Name");
    return false;
  } else if (transcriptNotes == "") {
    uploadError("Transcript Notes");
    return false;
  } else if (transcriptText == "") {
    uploadError("Transcript File");
    return false;
  } else {
    const fileName = document.getElementById("transcriptFile").files[0].name;

    const data = {
      name: transcriptName,
      notes: transcriptNotes,
      text: transcriptText,
      file_name: fileName,
    };

    const response = await postTranscript(data);
  }
  return true;
}

export async function updateTranscriptMetadata() {
  /**
   * Gets all data from the metadata update form, and sends to server
   */
  const transcriptName = document.getElementById("transcriptName").value;
  const transcriptNotes = document.getElementById("transcriptNotes").value;

  if (transcriptName == "") {
    uploadError("Transcript Name");
    return false;
  } else if (transcriptNotes == "") {
    uploadError("Transcript Notes");
    return false;
  } else {
    const data = {
      transcript_id: document.getElementById("transcriptId").value,
      transcript_name: transcriptName,
      transcript_notes: transcriptNotes,
    };

    const cookies = new Cookies();

    const response = await fetch("/api/update_transcript_metadata/", {
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
    return true;
  }
}

export async function deleteTranscript(transcript_id) {
  /**
   * Sends request to delete the transcript with the given id
   */
  const url = "/api/transcripts/" + transcript_id + "/";
  const cookies = new Cookies();
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  return response;
}

export async function downloadTranscript(transcript_id) {
  /**
   * Requests the transcript as a CSV and saves to computer
   */
  const url = "/api/download_transcript/" + transcript_id + "/";
  const cookies = new Cookies();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    credentials: "same-origin",
  }).then(
    // Converting AJAX response to json
    (response) => response.json()
  );
  download(response.file, response.name);
}
