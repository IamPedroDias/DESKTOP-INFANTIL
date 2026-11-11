// ==================== CARREGAR NOME DO ALUNO ========================
// Lê o nome salvo na sessão (do login) ou usa "Estudante" como padrão
const studentName = sessionStorage.getItem("studentName") || "Estudante";
const desktopStudentName = document.querySelector("#desktop-student-name");

// Atualiza o nome na tela de boas-vindas do desktop
if (desktopStudentName) {
    desktopStudentName.textContent = studentName;
}

// ==================== ELEMENTOS DA INTERFACE ========================

// Menu Iniciar e sessão
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const logoutButton = document.getElementById("logout-button");

// Janelas dos aplicativos
const filesWindow = document.getElementById("files-window");
const calculatorWindow = document.getElementById("calculator-window");
const notepadWindow = document.getElementById("notepad-window");

// Botões dos aplicativos na barra de tarefas
const taskbarFilesButton = document.getElementById("taskbar-files");
const taskbarCalculatorButton = document.getElementById("taskbar-calculator");
const taskbarNotepadButton = document.getElementById("taskbar-notepad");

// Relógio da barra de tarefas
const clockTime = document.getElementById("clock-time");
const clockDate = document.getElementById("clock-date");

// Controle de sobreposição das janelas
const appWindows = document.querySelectorAll(".app-window");
let highestZIndex = 30;

// ==================== RELÓGIO ========================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const date = now.toLocaleDateString("pt-BR");

    clockTime.textContent = `${hours}:${minutes}`;
    clockDate.textContent = date;
}
updateClock();
setInterval(updateClock, 1000);

// ==================== FUNÇÕES GERAIS ========================
function closeAllWindows() {
    const windowsToClose = [
        { window: filesWindow, taskbarButton: taskbarFilesButton },
        { window: calculatorWindow, taskbarButton: taskbarCalculatorButton },
        { window: notepadWindow, taskbarButton: taskbarNotepadButton }
    ];

    windowsToClose.forEach(item => {
        if (item.window && !item.window.classList.contains("hidden")) {
            item.window.classList.add("hidden");
        }
        if (item.taskbarButton && !item.taskbarButton.classList.contains("hidden")) {
            item.taskbarButton.classList.add("hidden");
        }
    });
}

// ==================== FUNÇÕES DAS JANELAS ========================
function openWindow(windowElement, taskbarButton) {
    if (windowElement.classList.contains("hidden")) {
        windowElement.classList.remove("hidden");
    }

    if (taskbarButton.classList.contains("hidden")) {
        taskbarButton.classList.remove("hidden");
    }

    bringWindowToFront(windowElement);
}

function closeWindow(windowElement, taskbarButton) {
    if (!windowElement.classList.contains("hidden")) {
        windowElement.classList.add("hidden");
    }

    if (!taskbarButton.classList.contains("hidden")) {
        taskbarButton.classList.add("hidden");
    }
}

function minimizeWindow(windowElement) {
    if (!windowElement.classList.contains("hidden")) {
        windowElement.classList.add("hidden");
    }
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

        if (maximizeButton) {
            maximizeButton.textContent = "❐";
            maximizeButton.setAttribute("aria-label", "Restaurar");
        }
    } else {
        windowElement.classList.remove("maximized");

        windowElement.style.left = windowElement.dataset.previousLeft || "";
        windowElement.style.top = windowElement.dataset.previousTop || "";
        windowElement.style.transform = windowElement.dataset.previousTransform || "";

        if (maximizeButton) {
            maximizeButton.textContent = "□";
            maximizeButton.setAttribute("aria-label", "Maximizar");
        }
    }
}

function openNotepadWindow() {
    openWindow(notepadWindow, taskbarNotepadButton);

    if (!notepadWindow.classList.contains("maximized")) {
        maximizeWindow(
            notepadWindow,
            document.getElementById("maximize-notepad")
        );
    }
}

function bringWindowToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
}

// ==================== ARRASTO DE JANELAS ========================
function makeWindowDraggable(windowElement) {
    const windowHeader = windowElement.querySelector(".windows-header");

    if (!windowHeader) return;

    windowHeader.addEventListener("mousedown", function(event) {
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

        function moveWindow(e) {
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
        }

        function stopMovingWindow() {
            document.removeEventListener("mousemove", moveWindow);
            document.removeEventListener("mouseup", stopMovingWindow);
        }

        document.addEventListener("mousemove", moveWindow);
        document.addEventListener("mouseup", stopMovingWindow);
    });
}

// ==================== EVENTOS GERAIS ========================
if (startButton && startMenu) {
    startButton.addEventListener("click", function() {
        if (startMenu.classList.contains("hidden")) {
            startMenu.classList.remove("hidden");
        } else {
            startMenu.classList.add("hidden");
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        closeAllWindows();
        sessionStorage.removeItem("studentName");
        window.location.href = "index.html";
    });
}

// ==================== EVENTOS DOS APLICATIVOS ========================
// Meus Arquivos
document.getElementById("open-files").addEventListener("click", function() {
    openWindow(filesWindow, taskbarFilesButton);
    if (startMenu) startMenu.classList.add("hidden");
});

document.getElementById("desktop-files")?.addEventListener("dblclick", function() {
    openWindow(filesWindow, taskbarFilesButton);
});

document.getElementById("close-files").addEventListener("click", function() {
    closeWindow(filesWindow, taskbarFilesButton);
});

document.getElementById("minimize-files").addEventListener("click", function() {
    minimizeWindow(filesWindow);
});

document.getElementById("maximize-files").addEventListener("click", function() {
    maximizeWindow(filesWindow, this);
});

// Clicar no botão da barra de tarefas alterna a visibilidade
if (taskbarFilesButton) {
    taskbarFilesButton.addEventListener("click", function() {
        if (filesWindow.classList.contains("hidden")) {
            openWindow(filesWindow, this);
        } else {
            closeWindow(filesWindow, this);
        }
    });
}

// Calculadora
document.getElementById("open-calculator").addEventListener("click", function() {
    openWindow(calculatorWindow, taskbarCalculatorButton);
    if (startMenu) startMenu.classList.add("hidden");
});

document.getElementById("desktop-calculator")?.addEventListener("dblclick", function() {
    openWindow(calculatorWindow, taskbarCalculatorButton);
});

document.getElementById("close-calculator").addEventListener("click", function() {
    closeWindow(calculatorWindow, taskbarCalculatorButton);
});

document.getElementById("minimize-calculator").addEventListener("click", function() {
    minimizeWindow(calculatorWindow);
});

// Bloco de Notas
document.getElementById("open-notepad").addEventListener("click", function() {
    openNotepadWindow();
    if (startMenu) startMenu.classList.add("hidden");
});

document.getElementById("desktop-notepad")?.addEventListener("dblclick", function() {
    openNotepadWindow();
});

document.getElementById("close-notepad").addEventListener("click", function() {
    closeWindow(notepadWindow, taskbarNotepadButton);
});

document.getElementById("minimize-notepad").addEventListener("click", function() {
    minimizeWindow(notepadWindow);
});

document.getElementById("maximize-notepad").addEventListener("click", function() {
    maximizeWindow(notepadWindow, this);
});

// Clicar no botão da barra de tarefas alterna a visibilidade
if (taskbarNotepadButton) {
    taskbarNotepadButton.addEventListener("click", function() {
        if (notepadWindow.classList.contains("hidden")) {
            openNotepadWindow();
        } else {
            closeWindow(notepadWindow, this);
        }
    });
}

// ==================== JANELAS COMEÇAM OCULTAS ========================
document.addEventListener("DOMContentLoaded", function() {
    if (filesWindow && !filesWindow.classList.contains("hidden")) {
        filesWindow.classList.add("hidden");
    }
    if (calculatorWindow && !calculatorWindow.classList.contains("hidden")) {
        calculatorWindow.classList.add("hidden");
    }
    if (notepadWindow && !notepadWindow.classList.contains("hidden")) {
        notepadWindow.classList.add("hidden");
    }

    if (taskbarFilesButton && !taskbarFilesButton.classList.contains("hidden")) {
        taskbarFilesButton.classList.add("hidden");
    }
    if (taskbarCalculatorButton && !taskbarCalculatorButton.classList.contains("hidden")) {
        taskbarCalculatorButton.classList.add("hidden");
    }
    if (taskbarNotepadButton && !taskbarNotepadButton.classList.contains("hidden")) {
        taskbarNotepadButton.classList.add("hidden");
    }

    // Esconde o menu iniciar caso esteja aberto por erro no HTML
    if (startMenu && !startMenu.classList.contains("hidden")) {
        startMenu.classList.add("hidden");
    }
});
