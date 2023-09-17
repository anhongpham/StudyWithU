var timer = 0;
var timerInterval;

// var ms = document.getElementById('ms');
var second = document.getElementById('second');
var minute = document.getElementById('minute');
var hour = document.getElementById('hour');

function start() {
  stop();

  timerInterval = setInterval(function() {
    timer += 1/60;
    // msVal = Math.floor((timer - Math.floor(timer))*100);
    secondVal = Math.floor(timer) - Math.floor(timer/60) * 60;
    minuteVal = Math.floor(timer/60);
    hourVal = Math.floor(timer/3600);


// ms.innerHTML = msVal < 10 ? "0" + msVal.toString() : msVal;
second.innerHTML = secondVal < 10 ? "0" + secondVal.toString() : secondVal;
minute.innerHTML = minuteVal < 10 ? "0" + minuteVal.toString() : minuteVal;
hour.innerHTML = hourVal < 10 ? "0" + hourVal.toString() : hourVal;
  }, 1000/60);
}
function stop() {
  clearInterval(timerInterval);
}

function reset() {
  timer = 0;
  // ms.innerHTML = "00";
  second.innerHTML = "00";
  minute.innerHTML = "00";
  hour.innerHTML = "00";
}
