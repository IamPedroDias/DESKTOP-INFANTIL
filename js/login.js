const studentNameInput =
    document.querySelector("#student-name");

const loginMessage =
    document.querySelector("#login-message");

const loginForm = document.querySelector("#login-form");

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
}

loginForm.addEventListener(
    "submit",
    handleLoginSubmit

);

