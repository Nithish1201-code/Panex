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

function dragElement(el) {
  var x = 0;
  var y = 0;
  var handle = document.getElementById(el.id + "header") || el;

  handle.addEventListener("mousedown", function(e) {
    if (e.target.closest(".winbtn")) return;

    x = e.clientX;
    y = e.clientY;

    function move(ev) {
      var dx = x - ev.clientX;
      var dy = y - ev.clientY;

      x = ev.clientX;
      y = ev.clientY;

      el.style.top = (el.offsetTop - dy) + "px";
      el.style.left = (el.offsetLeft - dx) + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
    bringToFront(el);
  });
}

function addTaskbarBtn(id, label, iconSrc) {
  if (document.getElementById("taskbtn-" + id)) return;

  var btn = document.createElement("div");
  btn.className = "taskappbtn";
  btn.id = "taskbtn-" + id;

  var img = document.createElement("img");
  img.src = iconSrc;

  var text = document.createElement("span");
  text.textContent = label;

  btn.appendChild(img);
  btn.appendChild(text);

  btn.addEventListener("click", function() {
    openWindow(document.getElementById(id));
  });

  document.getElementById("taskbarApps").appendChild(btn);
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

function loadWeather() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      var url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        pos.coords.latitude +
        "&longitude=" +
        pos.coords.longitude +
        "&current=temperature_2m";

      fetch(url)
        .then(function(r) {
          return r.json();
        })
        .then(function(data) {
          if (
            data &&
            data.current &&
            typeof data.current.temperature_2m === "number"
          ) {
            document.getElementById("weatherText").textContent =
              Math.round(data.current.temperature_2m) + "°C";
          }
        })
        .catch(function() {});
    },
    function() {}
  );
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