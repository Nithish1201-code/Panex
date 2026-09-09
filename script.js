var topIndex = 10;

function updateClock() {
  var clock = document.getElementById("clockText");
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function bringToFront(el) {
  topIndex++;
  el.style.zIndex = topIndex;
}

var dragEl = null;
var mouseX = 0;
var mouseY = 0;

function headerMouseDown(e) {
  if (e.target.closest(".winbtn")) return;

  dragEl = e.currentTarget.parentElement;
  mouseX = e.clientX;
  mouseY = e.clientY;

  bringToFront(dragEl);
}

function dragMouseMove(e) {
  if (!dragEl) return;

  var dx = mouseX - e.clientX;
  var dy = mouseY - e.clientY;

  mouseX = e.clientX;
  mouseY = e.clientY;

  dragEl.style.top = (dragEl.offsetTop - dy) + "px";
  dragEl.style.left = (dragEl.offsetLeft - dx) + "px";
}

function dragMouseUp() {
  dragEl = null;
}

function dragElement(el) {
  var header = document.getElementById(el.id + "header") || el;
  header.addEventListener("mousedown", headerMouseDown);
}

document.addEventListener("mousemove", dragMouseMove);
document.addEventListener("mouseup", dragMouseUp);

function addTaskbarBtn(id, label, iconSrc) {
  if (document.getElementById("taskbtn-" + id)) return;

  var apps = document.getElementById("taskbarApps");

  apps.insertAdjacentHTML(
    "beforeend",
    '<div class="taskappbtn" id="taskbtn-' + id + '">' +
      '<img src="' + iconSrc + '">' +
      '<span>' + label + '</span>' +
    '</div>'
  );

  var btn = document.getElementById("taskbtn-" + id);

  btn.addEventListener("click", function() {
    openWindow(document.getElementById(id));
  });
}

function removeTaskbarBtn(id) {
  var btn = document.getElementById("taskbtn-" + id);

  if (btn) {
    btn.remove();
  }
}

function openWindow(el) {
  if (!el) return;

  el.style.display = "flex";
  bringToFront(el);

  var icon = el.querySelector(".windowheader img");
  var title = el.querySelector(".windowheader span");

  addTaskbarBtn(
    el.id,
    title ? title.textContent : el.id,
    icon ? icon.getAttribute("src") : ""
  );
}

function closeWindow(el) {
  if (!el) return;

  el.style.display = "none";
  removeTaskbarBtn(el.id);
}

function minimizeWindow(el) {
  if (!el) return;

  el.style.display = "none";
}

function initWindow(id) {
  var el = document.getElementById(id);
  if (!el) return;

  dragElement(el);

  el.addEventListener("mousedown", function() {
    bringToFront(el);
  });

  var closeBtn = document.getElementById(id + "close");
  var minBtn = document.getElementById(id + "min");

  if (closeBtn) {
    closeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      closeWindow(el);
    });
  }

  if (minBtn) {
    minBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      minimizeWindow(el);
    });
  }
}

async function loadWeather() {
  var weatherText = document.getElementById("weatherText");

  if (!navigator.geolocation) {
    weatherText.textContent = "N/A";
    return;
  }

  try {
    var pos = await new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    var cached = localStorage.getItem("weatherCache");

    if (cached) {
      var weather = JSON.parse(cached);

      if (Date.now() - weather.time < 600000) {
        weatherText.textContent = Math.round(weather.temp) + "°C";
        return;
      }
    }

    var weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      pos.coords.latitude +
      "&longitude=" +
      pos.coords.longitude +
      "&current=temperature_2m"
    );

    var data = await weatherRes.json();

    if (
      data &&
      data.current &&
      typeof data.current.temperature_2m === "number"
    ) {
      var tempC = data.current.temperature_2m;

      weatherText.textContent = Math.round(tempC) + "°C";

      localStorage.setItem("weatherCache", JSON.stringify({
        temp: tempC,
        time: Date.now()
      }));
    }
  } catch (err) {
    weatherText.textContent = "N/A";
  }
}

var notesArea = document.getElementById("notesArea");

if (notesArea) {
  notesArea.value = localStorage.getItem("panex_notes") || "";

  notesArea.addEventListener("input", function() {
    localStorage.setItem("panex_notes", notesArea.value);
  });
}

var startBtn = document.getElementById("startBtn");
var startMenu = document.getElementById("startMenu");

startBtn.addEventListener("click", function(e) {
  e.stopPropagation();

  startMenu.style.display =
    startMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function(e) {
  if (!startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.style.display = "none";
  }
});

document.querySelectorAll(".startitem").forEach(function(item) {
  item.addEventListener("click", function() {
    var id = item.getAttribute("data-window");
    var el = document.getElementById(id);

    openWindow(el);
    startMenu.style.display = "none";
  });
});

var binIsFull = false;
var binIcon = document.getElementById("binIcon");
var binIconImg = document.getElementById("binIconImg");

binIcon.addEventListener("click", function() {
  binIsFull = !binIsFull;

  binIconImg.src = binIsFull
    ? "icons/binfull.png"
    : "icons/binempty.png";
});

initWindow("notes");
initWindow("weather");
initWindow("mycomputer");
loadWeather();
updateClock();
setInterval(updateClock, 1000);
const wallpapers = [
  'wallpapers/default.png',
  'wallpapers/custom.png',
  'wallpapers/classic.jpeg'
];

let currentIndex = 0;

function changeWallpaper() {
  var desktop = document.getElementById("desktop");
  var logo = document.getElementById("panexLogo");

  var wallpaper = wallpapers[currentIndex];

  desktop.style.backgroundImage = `url("${wallpaper}")`;

  logo.style.display =
    wallpaper === 'wallpapers/default.png'
      ? 'block'
      : 'none';

  currentIndex = (currentIndex + 1) % wallpapers.length;
}

changeWallpaper();
setInterval(changeWallpaper, 5000);

