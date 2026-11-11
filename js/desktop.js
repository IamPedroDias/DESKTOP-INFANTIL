const startButton=document.querySelector("#start-button");

const startMenu = document.querySelector("#start-menu");

const appWindows=document.querySelectorAll(".app-window");
let highestZIndex=30;

const desktopFilesButton = document.querySelector("#desktop-files");

const filesWindow=document.querySelector("#files-window");

const openFilesButton=document.querySelector("#open-files");

const openCalculatorButton=document.querySelector("#open-calculator");

const calculatorWindow=document.querySelector("#calculator-window");

const closeFilesButton=document.querySelector("#close-files");

const closeCalculatorButton=document.querySelector("#close-calculator");

const minimizeFilesButton=document.querySelector("#minimize-files");

const minimizeCalculatorButton=document.querySelector("#minimize-calculator");

const maximizeFilesButton =
    document.querySelector("#maximize-files");

const maximizeCalculatorButton=document.querySelector("#maximize-calculator");

const taskbarFilesButton=document.querySelector("#taskbar-files");

const taskbarCalculatorButton=document.querySelector("#taskbar-calculator");

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

function openWindow(windowElement, taskbarButton){

    windowElement.classList.remove("hidden");

    taskbarButton.classList.remove("hidden");

    bringWindowToFront(windowElement);

}

function closeWindow(windowElement, taskbarButton){
    windowElement.classList.add("hidden");

    taskbarButton.classList.add("hidden");

}

function minimizeWindow(windowElement) {
    windowElement.classList.add("hidden");

}

function maximizeWindow(windowElement, maximizeButton) {

    const isMaximized = windowElement.classList.contains("maximized");

    if (!isMaximized) {

        windowElement.dataset.previousLeft = windowElement.style.left;

        windowElement.dataset.previousTop = windowElement.style.top;

        windowElement.dataset.previousTransform = windowElement.style.transform;

        windowElement.style.left = "";
        windowElement.style.top = "";
        windowElement.style.transform = "";

        windowElement.classList.add("maximized");

        maximizeButton.textContent = "❐";
        maximizeButton.setAttribute("aria-label", "Restaurar");

    }else {

        windowElement.classList.remove("maximized");

        windowElement.style.left = windowElement.dataset.previousLeft || "";
        windowElement.style.top = windowElement.dataset.previousTop || "";
        windowElement.style.transform = windowElement.dataset.previousTransform || "";

        maximizeButton.textContent="□"
        maximizeButton.setAttribute("aria-label","Maximizar");
    }

}

function bringWindowToFront(windowElement){

    highestZIndex++;

    windowElement.style.zIndex = highestZIndex;

}

function makeWindowDraggable(windowElement) {

    const windowHeader = windowElement.querySelector(".windows-header")

    windowHeader.addEventListener("mousedown", function (event) {

        if (windowElement.classList.contains("maximized")) {
            return;
        }

        if (event.target.closest(".windows-controls")) {
            return;
        }

        const windowPosition = windowElement.getBoundingClientRect();

        const offsetX = event.clientX - windowPosition.left;
        const offsetY = event.clientY - windowPosition.top;

        windowElement.style.transform = "none";

        windowElement.style.left = `${windowPosition.left}px`;

        windowElement.style.top = `${windowPosition.top}px`;

        function moveWindow(event) {

            windowElement.style.left = `${event.clientX - offsetX}px`;

            windowElement.style.top = `${event.clientY - offsetY}px`;

        }

        function stopMovingWindow() {

            document.removeEventListener("mousemove", moveWindow);

            document.removeEventListener("mouseup", stopMovingWindow);

        }

        document.addEventListener("mousemove", moveWindow);

        document.addEventListener("mouseup", stopMovingWindow);

    });

}

openFilesButton.addEventListener("click", function(){

    openWindow(filesWindow, taskbarFilesButton);

    startMenu.classList.add("hidden");

});

openCalculatorButton.addEventListener("click", function(){
    openWindow(calculatorWindow, taskbarCalculatorButton);
    startMenu.classList.add("hidden");
});

desktopFilesButton.addEventListener("dblclick", function(){

    openWindow(filesWindow, taskbarFilesButton);
});

closeFilesButton.addEventListener("click",function (){

    closeWindow(filesWindow, taskbarFilesButton);
});

closeCalculatorButton.addEventListener("click", function(){
    closeWindow(calculatorWindow, taskbarCalculatorButton);
});

minimizeFilesButton.addEventListener("click", function (){
    minimizeWindow(filesWindow);
});

minimizeCalculatorButton.addEventListener("click", function(){
    minimizeWindow(calculatorWindow);
});

maximizeFilesButton.addEventListener("click", function (){
    maximizeWindow(filesWindow, maximizeFilesButton);
});

maximizeCalculatorButton.addEventListener("click", function() {
    maximizeWindow(calculatorWindow, maximizeCalculatorButton);
});

taskbarFilesButton.addEventListener("click", function () {

    filesWindow.classList.toggle("hidden");

});

taskbarCalculatorButton.addEventListener("click", function () {
    calculatorWindow.classList.toggle("hidden");
});

appWindows.forEach(function(windowElement){

    makeWindowDraggable(windowElement);

    windowElement.addEventListener("mousedown", function(){

        bringWindowToFront(windowElement);

    });
});

