const studentNameInput = document.querySelector("#student-name");
const loginMessage = document.querySelector("#login-message");
const loginForm = document.querySelector("#login-form");
const loginScreen = document.querySelector("#login-screen");
const welcomeScreen = document.querySelector("#welcome-screen");
const welcomeName = document.querySelector("#welcome-name");

function handleLoginSubmit(event) {
    event.preventDefault();

    const studentName = studentNameInput.value.trim();

    if (studentName === "") {
        loginMessage.textContent = "Digite seu nome para continuar";
        loginMessage.classList.remove("message-success");
        loginMessage.classList.add("message-error");
        studentNameInput.focus();
        return;
    }

    // Salva o nome do aluno na sessão do navegador
    sessionStorage.setItem("studentName", studentName);

    loginMessage.textContent = `Bem-vindo, ${studentName}!`;
    loginMessage.classList.remove("message-error");
    loginMessage.classList.add("message-success");

    welcomeName.textContent = studentName;

    // Transição para a tela de boas-vindas e redirecionamento
    loginScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");

    setTimeout(function () {
        window.location.href = "desktop.html";
    }, 2500);
}

loginForm.addEventListener("submit", handleLoginSubmit);
