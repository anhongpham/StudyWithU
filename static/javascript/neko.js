// get background with class: bg-img
const bgImg = document.querySelector(".bg-img");
const meowText = document.querySelector(".speech-bubble").getElementsByTagName("p")[0];

// set up a map for meow text every 30 seconds
let dict_queue = {}
let queue = [];
let fileMap = new Map([
  ["images/raining-sky.png", "It's kinda cloudy now!"],
  ["images/sunny.gif", "It's sunny now!"],
]);

// loop through the map circularly

let i = 0;
setInterval(() => {
    bgImg.src = [...fileMap.keys()][i];

    // add new weather every 30 seconds
    dict_queue["weather"] = [...fileMap.values()][i];

    i = (i + 1) % fileMap.size;
    }, 30000);


// add speech emotion and face expression every second
setInterval(() => {
    const speechData = JSON.parse(localStorage.getItem("top3EmotionSpeech"));
    const finalSpeechData = [];

    for (let i = 0; i < speechData.length; i++) {
        finalSpeechData.push(speechData[i][1]);
        
    }

    dict_queue["speech-emotion"] = finalSpeechData;

    const faceData = JSON.parse(localStorage.getItem("top3Expressions"));

    // run through the map to get the emotion value
    dict_queue["face-expression"] = faceData;
}, 1000);


// log map every 15 seconds
setInterval(() => {
    console.log(dict_queue);
}, 15000);


// set the meow text by the latest value in queue