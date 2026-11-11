const startButton=document.querySelector("#start-button");

const startMenu = document.querySelector("#start-menu");

const desktopFilesButton = document.querySelector("#desktop-files");

const filesWindow=document.querySelector("#files-window");

const openFilesButton=document.querySelector("#open-files");

const closeFilesButton=document.querySelector("#close-files");

const minimizeFilesButton=document.querySelector("#minimize-files");

const clockTime = document.querySelector('#clock-time');

const clockDate = document.querySelector('#clock-date');

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');

    const minutes = String(now.getMinutes()).padStart(2, '0');

    const date = now.toLocaleDateString("pt-br");

    clockTime.textContent = `${hours}:${minutes}`;

    clockDate.textContent = date;

}

updateClock();

setInterval(updateClock, 1000);

startButton.addEventListener("click", function(){

    startMenu.classList.toggle("hidden");

});

function openFilesWindow(){

    filesWindow.classList.remove("hidden");

}

function closeFilesWindow(){
    filesWindow.classList.add("hidden");

}

function minimizeFilesWindow() {
    filesWindow.classList.add("hidden");

}

openFilesButton.addEventListener("click", function(){

    openFilesWindow();

    startMenu.classList.add("hidden");

});

desktopFilesButton.addEventListener("dblclick", function(){

    openFilesWindow()
});

closeFilesButton.addEventListener("click",closeFilesWindow);

minimizeFilesButton.addEventListener("click", minimizeFilesWindow);
