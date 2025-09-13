// ---- CONFIG ----

// Replace with your Google Drive OAuth client ID
const GOOGLE_CLIENT_ID = "188401826622-d9p6jfig2ik5se8igod5o36lc4j3fgej.apps.googleusercontent.com";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAaxU10m2NHhGbciOMiUfhSrHeks8QujXg",
  authDomain: "bobloxauth2.firebaseapp.com",
  databaseURL: "https://bobloxauth2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bobloxauth2",
  storageBucket: "bobloxauth2.appspot.com",
  messagingSenderId: "302659528234",
  appId: "1:302659528234:web:ce6b02d848a991fc0c0553"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let gapiInited = false;
let tokenClient;

// Load Google API
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: "", // not needed for Drive upload
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  });
  gapiInited = true;
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: "", // defined later
  });
}

// Handle login
document.getElementById("loginBtn").addEventListener("click", () => {
  tokenClient.callback = (resp) => {
    if (resp.error !== undefined) throw resp;
    alert("Google login successful!");
  };
  tokenClient.requestAccessToken({ prompt: "consent" });
});

// Upload form
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageFile = document.getElementById("image").files[0];
  const gameFile = document.getElementById("gameFile").files[0];

  if (!name || !description || !imageFile || !gameFile) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Upload image to Drive
    const imageUrl = await uploadToDrive(imageFile);
    const gameUrl = await uploadToDrive(gameFile);

    // Save to Firebase DB
    const gameId = Date.now();
    await db.ref("games/" + gameId).set({
      id: gameId,
      name,
      description,
      icon: imageUrl,
      file: gameUrl,
    });

    alert("Game uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("Upload failed. Check console.");
  }
});

// Helper: Upload file to Google Drive
async function uploadToDrive(file) {
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const accessToken = gapi.client.getToken().access_token;
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    }
  );
  const data = await res.json();
  return `https://drive.google.com/uc?id=${data.id}`;
}

// Load Google Identity Services
(function loadGIS() {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = gisLoaded;
  document.body.appendChild(script);
})();

// Load Google API client
(function loadGapi() {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = gapiLoaded;
  document.body.appendChild(script);
})();
