var topIndex = 10;

function updateClock() {
  var clock = document.getElementById("clockText");
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function bringToFront(el) {
  topIndex++;
  el.style.zIndex = topIndex;
}


var dragEl = null;
var mx = 0;
var my = 0;

function headerMouseDown(e) {
  if (e.target.closest(".winbtn")) return;
  dragEl = e.currentTarget.parentElement;
  mx = e.clientX;
  my = e.clientY;
  bringToFront(dragEl);
}

function dragMouseMove(e) {
  if (!dragEl) return;
  var dx = mx - e.clientX;
  var dy = my - e.clientY;
  mx = e.clientX;
  my = e.clientY;
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
  apps.insertAdjacentHTML("beforeend",
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
  if (btn) btn.remove();
}

function openWindow(el) {
  if (!el) return;

  el.style.display = "flex";
  bringToFront(el);

  var icon = el.querySelector(".windowheader img");
  var title = el.querySelector(".windowheader span");

  addTaskbarBtn(el.id, title ? title.textContent : el.id, icon ? icon.getAttribute("src") : "");
}

function closeWindow(el) {
  if (!el) return;
  el.style.display = "none";
  removeTaskbarBtn(el.id);
}

function minimizeWindow(el) {
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

    var weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + pos.coords.latitude + "&longitude=" + pos.coords.longitude + "&current=temperature_2m");
    var data = await weatherRes.json();

    if (data && data.current && typeof data.current.temperature_2m === "number") {
      var tempC = data.current.temperature_2m;
      weatherText.textContent = Math.round(tempC) + "°C";
      localStorage.setItem("weatherCache", JSON.stringify({ temp: tempC, time: Date.now() }));
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
  startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function(e) {
  if (!startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.style.display = "none";
  }
});

document.querySelectorAll(".startitem").forEach(function(item) {
  item.addEventListener("click", function() {
    var id = item.getAttribute("data-window");
    openWindow(document.getElementById(id));
    startMenu.style.display = "none";
  });
});

var binIsFull = false;
var binIcon = document.getElementById("binIcon");
var binIconImg = document.getElementById("binIconImg");

binIcon.addEventListener("click", function() {
  binIsFull = !binIsFull;
  binIconImg.src = binIsFull ? "icons/binfull.png" : "icons/binempty.png";
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
  logo.style.display = wallpaper === 'wallpapers/default.png' ? 'block' : 'none';

  currentIndex = (currentIndex + 1) % wallpapers.length;
}

changeWallpaper();
setInterval(changeWallpaper, 5000);


var iconGrid = document.getElementById("iconGrid");
var desktop = document.getElementById("desktop");

var selectedIcon = null;
var draggingIcon = false;

var selStartX = 0;
var selStartY = 0;
var selectionBox = null;

var iconOffX = 0;
var iconOffY = 0;

document.querySelectorAll(".deskicon").forEach(function(icon) {
  icon.addEventListener("mousedown", function(e) {
    if (e.button !== 0) return;
    e.stopPropagation();

    var iconRect = icon.getBoundingClientRect();
    iconOffX = e.clientX - iconRect.left;
    iconOffY = e.clientY - iconRect.top;

    selectedIcon = icon;
    draggingIcon = true;

    document.querySelectorAll(".deskicon").forEach(function(other) {
      other.classList.remove("selected");
    });
    icon.classList.add("selected");
  });
});

document.addEventListener("mousemove", function(e) {
  if (!draggingIcon || !selectedIcon) return;

  var gridRect = iconGrid.getBoundingClientRect();
  var newLeft = e.clientX - gridRect.left - iconOffX;
  var newTop = e.clientY - gridRect.top - iconOffY;

  var maxLeft = gridRect.width - selectedIcon.offsetWidth;
  var maxTop = gridRect.height - selectedIcon.offsetHeight;

  newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  newTop = Math.max(0, Math.min(newTop, maxTop));

  selectedIcon.style.left = newLeft + "px";
  selectedIcon.style.top = newTop + "px";
});

document.addEventListener("mouseup", function() {
  draggingIcon = false;
  selectedIcon = null;
});


desktop.addEventListener("mousedown", function(e) {
  if (e.button !== 0) return;
  if (e.target.closest(".deskicon")) return;

  selStartX = e.clientX;
  selStartY = e.clientY;

  selectionBox = document.createElement("div");
  selectionBox.className = "selectionBox";
  desktop.appendChild(selectionBox);
});

document.addEventListener("mousemove", function(e) {
  if (!selectionBox) return;

  var deskRect = desktop.getBoundingClientRect();
  var left = Math.min(selStartX, e.clientX) - deskRect.left;
  var top = Math.min(selStartY, e.clientY) - deskRect.top;
  var w = Math.abs(e.clientX - selStartX);
  var h = Math.abs(e.clientY - selStartY);

  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = w + "px";
  selectionBox.style.height = h + "px";
});

document.addEventListener("mouseup", function(e) {
  if (!selectionBox) return;

  var boxRect = selectionBox.getBoundingClientRect();

  document.querySelectorAll(".deskicon").forEach(function(icon) {
    var r = icon.getBoundingClientRect();
    var hit = r.left < boxRect.right && r.right > boxRect.left && r.top < boxRect.bottom && r.bottom > boxRect.top;

    if (hit) {
      icon.classList.add("selected");
    } else {
      icon.classList.remove("selected");
    }
  });

  selectionBox.remove();
  selectionBox = null;
});

desktop.addEventListener("click", function(e) {
  if (e.target.closest(".deskicon")) return;
  if (e.target.closest(".panexLogo")) return;

  document.querySelectorAll(".deskicon").forEach(function(icon) {
    icon.classList.remove("selected");
  });
});