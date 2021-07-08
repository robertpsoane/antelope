import Cookies from "universal-cookie";

export async function postTranscript(data) {
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
  const transcripts = await fetch("/api/sessions/").then((result) =>
    result.json()
  );
  return transcripts;
}

export async function getTranscriptByID(id) {
  const url = "/api/sessions/" + id + "/";
  const transcript = await fetch(url).then((result) => result.json());
  return transcript;
}

export async function uploadTranscript() {
  const sessionName = document.getElementById("sessionName").value;
  const sessionNotes = document.getElementById("sessionNotes").value;
  const sessionText = document.getElementById("sessionTextData").value;
  const fileName = document.getElementById("sessionFile").files[0].name;

  const data = {
    name: sessionName,
    notes: sessionNotes,
    text: sessionText,
    file_name: fileName,
  };
  const response = await postTranscript(data);
}

export async function updateTranscriptMetadata() {
  const data = {
    transcript_id: document.getElementById("transcriptId").value,
    transcript_name: document.getElementById("sessionName").value,
    transcript_notes: document.getElementById("sessionNotes").value,
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
  return response;
}
