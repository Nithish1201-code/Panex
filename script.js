function updateClock() {
    document.querySelector("#clockText").innerHTML = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
setInterval(updateClock, 1000);
updateClock();