const videoElement = document.getElementById("local-stream");
const deviceBtn = document.getElementById("device-btn");
const micBtn = document.getElementById("mic-btn");

// When the micBtn is clicked, change the background color to red, and change the text to "Stop Recording". When the micBtn is clicked again, change the background color to green, and change the text to "Start Recording".
micBtn.addEventListener("click", () => {
  if (micBtn.style.backgroundColor === "red") {
    micBtn.style.backgroundColor = "rgb(99, 99, 99,0.3)";
    micBtn.innerText = "Talk to Neko";
  } else {
    micBtn.style.backgroundColor = "red";
    micBtn.innerText = "Stop Recording";
  }
});

let stream = null;
let enable_video = false;
let enable_audio = false;
let mediaRecorder = null;
let recordedChunks = [];

faceapi.nets.tinyFaceDetector.loadFromUri("./models");
faceapi.nets.faceLandmark68Net.loadFromUri("./models");
faceapi.nets.faceExpressionNet.loadFromUri("./models");

// if (enable_video && enable_audio) {
//   micBtn.style.pointerEvents = "auto";
// } else {
//   micBtn.style.pointerEvents = "none";
// }

const setStream = async (enableVideo, enableAudio) => {
  try {
    let innerStream = await navigator.mediaDevices.getUserMedia({
      video: enableVideo,
      audio: enableAudio,
    });

    return innerStream;
  } catch (error) {
    console.error("Error opening video camera.", error);
    return null;
  }
};

const videoRendering = async () => {
  try {
    // render the video to the video element
    videoElement.srcObject = stream;
  } catch (error) {
    console.error("Error accessing camera", error);
  }
};

const toggleDevice = async (event) => {
  event.preventDefault();
  enable_video = !enable_video;
  enable_audio = !enable_audio;
  stream = await setStream(enable_video, enable_audio);
  await videoRendering();
};

document.addEventListener("DOMContentLoaded", async () => {
  stream = await setStream(enable_video, enable_audio);
  deviceBtn.addEventListener("click", toggleDevice);
  micBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  });
  await videoRendering();
});

// run face detection every 2 seconds
videoElement.addEventListener("play", () => {
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    let expressions = null;
    if (detections.length > 0) {
      expressions = detections[0].expressions;
    }

    if (expressions) {
      const sortedExpressions = Object.entries(expressions).sort(
        (a, b) => expressions[b] - expressions[a]
      );
      const top3Expressions = sortedExpressions.slice(0, 3);

      localStorage.setItem("top3Expressions", JSON.stringify(top3Expressions));
    }
  }, 2000);
});

//! Implement speech emotion recognition
async function sendDataToServer(blob) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: blob,
      }
    );

    if (!response.ok) {
      throw new Error(`There are some HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (result) {
      const sortedEmotionSpeech = Object.entries(result).sort(
        (a, b) => result[b] - result[a]
      );

      const top3EmotionSpeech = sortedEmotionSpeech.slice(0, 3);

      localStorage.setItem("top3EmotionSpeech", JSON.stringify(top3EmotionSpeech));
    }

  } catch (error) {
    console.error("Error sending data to server:", error);
  }
}

const toggleMic = async (event) => {
  event.preventDefault();
  enable_audio = !enable_audio;
  stream = await setStream(enable_video, enable_audio);
};

const startRecording = () => {
  console.log("Start recording");
  recordedChunks = [];

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (typeof event.data === "undefined") return;
    if (event.data.size === 0) return;

    recordedChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", async () => {
    const blob = new Blob(recordedChunks, {
      type: "audio/mpeg-3",
    });

    await sendDataToServer(blob);
  });

  mediaRecorder.start();
};

const stopRecording = () => {
  mediaRecorder.stop();
  console.log("Stop recording");
};
