// get background with class: bg-img
const bgImg = document.querySelector(".bg-img");
const meowText = document
  .querySelector(".speech-bubble")
  .getElementsByTagName("p")[0];

const sampleMeowText = [
  "Studying is hard, but you can do it!",
  "You're doing great!",
  "What's your favorite subject?",
  "Maths is my favorite subject!",
  "I'm bad at History! T.T",
  "Nothing is more important than your health!",
  "Don't forget to take a break!",
  "Keep up the good work!",
  "Staying positive is the key!",
  "Don't stay too long in front of the screen!",
  "I'm here to cheer you up!",
];

// set up a map for meow text every 30 seconds
let dict_queue = {};

let fileMap = new Map([
  ["images/raining-sky.png", "It's kinda cloudy now!"],
  ["images/sunny.gif", "It's sunny now!"],
]);

// loop through the map circularly

let i = 0;
setInterval(() => {
  bgImg.src = [...fileMap.keys()][i];

  // add new weather every 30 seconds
  dict_queue["weather"] = [...fileMap.values()][i] || null;

  i = (i + 1) % fileMap.size;
}, 30000);

// add speech emotion and face expression every second
setInterval(() => {
  const speechData = JSON.parse(localStorage.getItem("top3EmotionSpeech"));
  const finalSpeechData = [];

  if (speechData === null) {
    return;
  }

  for (let i = 0; i < speechData.length; i++) {
    finalSpeechData.push(speechData[i][1]);
  }

  dict_queue["speech-emotion"] = finalSpeechData || null;

  const faceData = JSON.parse(localStorage.getItem("top3Expressions"));

  // run through the map to get the emotion value
  dict_queue["face-expression"] = faceData || null;
}, 1000);

// set the meow text randomly every 10s
setInterval(() => {
  // check if the dict is empty
  if (Object.keys(dict_queue).length === 0) {
    meowText.innerHTML = "HI, I'M NEKO! ^.^ HOW ARE YOU TODAY?";
    return;
  }

  const random_num = Math.floor(Math.random() * Object.keys(dict_queue).length);
  const key = Object.keys(dict_queue)[random_num];

  if (key === "speech-emotion") {
    const emotion = dict_queue[key][0]['label'];

    if (emotion === "happy") {
      meowText.innerHTML = "Great! I love to hear that you're happy!";
    } else if (emotion === "sad") {
      meowText.innerHTML = "If you need someone to talk to, I'm here for you!";
    } else if (emotion === "angry") {
      meowText.innerHTML = "Don't be angry, meow!";
    } else {
        meowText.innerHTML = "I'm here for you!";
    }

  } else if (key === "face-expression") {
    const expression = dict_queue[key][0][0];

    if (expression === "happy") {
        meowText.innerHTML = "Great! I love seeing you happy!";
        }
    else if (expression === "sad") {
        meowText.innerHTML = "Don't be sad, I want to see you smile!";
        }
    else if (expression === "angry") {
        meowText.innerHTML = "Don't be angry, meow!";
    }
    else {
        meowText.innerHTML = "I'm here for you!";
    }
  }
  else if (key === "weather") {
    meowText.innerHTML = dict_queue[key];
  }
  else  {
    // let data = dict_queue[key];
    // //fetch data to API, then get result
    // const message = "Give me a quote for this mood: " + data;
    //  const body = JSON.stringify({
    //    message: message,
    //  });
    // const response = await fetch(
    //   "localhost:3000/chat
    //   {
    //     method: "POST",
    //     body: body,
    //   }
    // console.log(response);
    result = sampleMeowText[Math.floor(Math.random() * sampleMeowText.length)];
    meowText.innerHTML = result;
  }
  // remove the key from the dict
  delete dict_queue[key];
}, 1000);

// setInterval(() => {
//   console.log(dict_queue);
// }, 5000);
