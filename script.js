function updateClock() {
    document.querySelector("#clockText").innerHTML = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
setInterval(updateClock, 1000);
updateClock();

var topIndex = 1;

function dragElement(el) {
  var x = 0, y = 0;
  var handle = document.getElementById(el.id + "header") || el;
  handle.onmousedown = start;

  function start(e) {
    x = e.clientX; y = e.clientY;
    document.onmousemove = move;
    document.onmouseup = stop;
  }
  function move(e) {
    var dx = x - e.clientX, dy = y - e.clientY;
    x = e.clientX; y = e.clientY;
    el.style.top = (el.offsetTop - dy) + "px";
    el.style.left = (el.offsetLeft - dx) + "px";
  }
  function stop() { document.onmousemove = null; document.onmouseup = null; }
}

function openWindow(el)  { el.style.display = "flex"; bringToFront(el); }
function closeWindow(el) { el.style.display = "none"; }
function bringToFront(el){ topIndex++; el.style.zIndex = topIndex; }

function initWindow(id) {
  var el = document.getElementById(id);
  dragElement(el);
  el.onmousedown = function(){ bringToFront(el); };
  document.getElementById(id + "close").onclick = function(){ closeWindow(el); };
}
var notesArea = document.getElementById("notesArea");
notesArea.value = localStorage.getItem("panex_notes") || "";
notesArea.addEventListener("input", function() {
  localStorage.setItem("panex_notes", notesArea.value);
});

function loadWeather() {
  navigator.geolocation.getCurrentPosition(function(pos) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + pos.coords.latitude +
      "&longitude=" + pos.coords.longitude + "&current=temperature_2m";
    fetch(url).then(r => r.json()).then(function(data) {
      document.getElementById("weatherText").innerHTML = Math.round(data.current.temperature_2m) + "°C";
    });
  });
}
loadWeather();

initWindow("notes");
initWindow("weather");
document.getElementById("startBtn").onclick = function() {
  var m = document.getElementById("startMenu");
  m.style.display = m.style.display === "block" ? "none" : "block";
};
initWindow("mycomputer");