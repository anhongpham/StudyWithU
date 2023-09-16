//! Config firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// Get data from json file
const firebaseConfig = await fetch("firebase.json").then((res) => res.json());

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const videoElement = document.getElementById("local-stream");
const audioElement = document.getElementById("local-audio");
const micBtn = document.getElementById("mic-btn");
const cameraBtn = document.getElementById("camera-btn");

let enableVideo = false;
let enableAudio = false;
let stream = null;

const setStream = async (enableVideo, enableAudio) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: enableVideo,
      audio: enableAudio,
    });
    return stream;
  } catch (error) {
    console.error("Error opening video camera.", error);

    return null;
  }
};

// Record video into record.mp4 every 5 seconds
const videoRecording = async (stream) => {
  try {
    const options = { mimeType: "video/webm; codecs=vp9" };
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener("dataavailable", function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    });

    mediaRecorder.addEventListener("stop", async function () {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      // Upload the recorded video to Firebase Cloud Storage
      const storage = getStorage(app);
      const storageRef = ref(storage, "record.mp4");

      await uploadBytes(storageRef, blob);
      console.log("Upload video successfully!");
    });

    mediaRecorder.start(5000);
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  } catch (error) {
    console.error("Error recording video.", error);
  }
};

const videoRendering = async (enableVideo, enableAudio) => {
  try {
    const stream = await setStream(enableVideo, enableAudio);

    // render the video to the local stream
    videoElement.srcObject = stream;

    if (enableVideo) {
      // remove class hidden-video
      videoElement.classList.remove("hidden-video");
    } else {
      // add class hidden-video
      videoElement.classList.add("hidden-video");
    }
  } catch (error) {
    console.error("Error accessing camera and microphone:", error);
  }
};

const toggleMic = async (event) => {
  event.preventDefault();
  enableAudio = !enableAudio;
  await videoRendering(enableVideo, enableAudio);
};

const toggleCamera = async (event) => {
  event.preventDefault();
  enableVideo = !enableVideo;
  await videoRendering(enableVideo, enableAudio);
};

// Record video every 5 seconds
let recorder = setInterval(() => {
    videoRecording(stream);
  }, 5000);

document.addEventListener("DOMContentLoaded", async () => {
  micBtn.addEventListener("click", toggleMic);
  cameraBtn.addEventListener("click", toggleCamera);

  stream = await setStream(enableVideo, enableAudio);
  await videoRendering(stream);

});
