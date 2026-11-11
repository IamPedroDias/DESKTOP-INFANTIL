const studentNameInput =
    document.querySelector("#student-name");

const loginMessage =
    document.querySelector("#login-message");

const loginForm = document.querySelector("#login-form");

const loginScreen =
    document.querySelector("#login-screen");

const desktopScreen =
    document.querySelector("#desktop-screen");

const wellcomeScreen = document.querySelector("#wellcome-screen");

const wellcomeName=document.querySelector("#wellcome-name");

function handleLoginSubmit(event){
    event.preventDefault();

    const studentName = studentNameInput.value.trim();

    if (studentName === "") {/*=== significa comparação*/
        loginMessage.textContent = "Digite seu nome para continuar";

        loginMessage.classList.remove("message-success");
        loginMessage.classList.add("message-error");

        studentNameInput.focus(); /*quando erra ele foca na caixa de diálogo*/

        return;
    }
    loginMessage.textContent =
        `Bem-vindo, ${studentName}!`;
    loginMessage.classList.remove("message-error");
    loginMessage.classList.add("message-success");

    wellcomeName.textContent = studentName;

    setTimeout(function() {
        wellcomeScreen.classList.add("hidden");
        desktopScreen.classList.remove("hidden");
    },2500);

    loginScreen.classList.add("hidden");
    wellcomeScreen.classList.remove("hidden");
}

loginForm.addEventListener(
    "submit",
    handleLoginSubmit

);
