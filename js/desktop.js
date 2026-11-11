const startButton=document.querySelector("#start-button");

const startMenu = document.querySelector("#start-menu");

const appWindows=document.querySelectorAll(".app-window");
let highestZIndex=30;
let previousWindowLeft="";
let previousWindowTop="";
let previousWindowTransform ="";

const desktopFilesButton = document.querySelector("#desktop-files");

const filesWindow=document.querySelector("#files-window");

const openFilesButton=document.querySelector("#open-files");

const closeFilesButton=document.querySelector("#close-files");

const minimizeFilesButton=document.querySelector("#minimize-files");

const maximizeFilesButton =
    document.querySelector("#maximize-files");

const taskbarFilesButton=document.querySelector("#taskbar-files");

const filesWindowHeader=filesWindow.querySelector(".windows-header");

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

    taskbarFilesButton.classList.remove("hidden");

    bringWindowToFront(filesWindow);

}

function closeFilesWindow(){
    filesWindow.classList.add("hidden");

    taskbarFilesButton.classList.add("hidden");

}

function minimizeFilesWindow() {
    filesWindow.classList.add("hidden");

}

function maximizeFilesWindow() {

    const isMaximized = filesWindow.classList.contains("maximized");

    if (!isMaximized) {

        previousWindowLeft = filesWindow.style.left;

        previousWindowTop = filesWindow.style.top;

        previousWindowTransform = filesWindow.style.transform;

        filesWindow.style.left = "";
        filesWindow.style.top = "";
        filesWindow.style.transform = "";

        filesWindow.classList.add("maximized");

        maximizeFilesButton.textContent = "❐";
        maximizeFilesButton.setAttribute("aria-label", "Restaurar");

    }else {

        filesWindow.classList.remove("maximized");

        filesWindow.style.left = previousWindowLeft;

        filesWindow.style.top = previousWindowTop;

        filesWindow.style.transform = previousWindowTransform;

        maximizeFilesButton.textContent="□"
        maximizeFilesButton.setAttribute("aria-label","Maximizar");
    }

}

function bringWindowToFront(windowElement){

    highestZIndex++;

    windowElement.style.zIndex = highestZIndex;

}

filesWindowHeader.addEventListener("mousedown", function(event){

    if (filesWindow.classList.contains("maximized")){
        return;
    }

    if (event.target.closest(".windows-controls")){
        return;
    }
    const windowPosition = filesWindow.getBoundingClientRect();

    const offsetX = event.clientX - windowPosition.left;
    const offsetY = event.clientY - windowPosition.top;

    filesWindow.style.transform = "none";

    filesWindow.style.left = `${windowPosition.left}px`;

    filesWindow.style.top = `${windowPosition.top}px`;

    function moveWindow(event){

        filesWindow.style.left=`${event.clientX - offsetX}px`;

        filesWindow.style.top=`${event.clientY - offsetY}px`;

    }

    function stopMovingWindow(){

        document.removeEventListener("mousemove", moveWindow);

        document.removeEventListener("mouseup", stopMovingWindow);

    }

    document.addEventListener("mousemove", moveWindow);

    document.addEventListener("mouseup", stopMovingWindow);

});

openFilesButton.addEventListener("click", function(){

    openFilesWindow();

    startMenu.classList.add("hidden");

});

desktopFilesButton.addEventListener("dblclick", function(){

    openFilesWindow()
});

closeFilesButton.addEventListener("click",closeFilesWindow);

minimizeFilesButton.addEventListener("click", minimizeFilesWindow);

maximizeFilesButton.addEventListener(
    "click",
    maximizeFilesWindow
);

taskbarFilesButton.addEventListener("click", function () {

    filesWindow.classList.toggle("hidden");

});

appWindows.forEach(function(windowElement){

    windowElement.addEventListener("mousedown", function(){

        bringWindowToFront(windowElement);

    })
})
