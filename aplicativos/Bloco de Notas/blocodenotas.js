const notepadText = document.querySelector("#notepad-text");
const btnClear = document.querySelector("#btn-clear");
const btnSave = document.querySelector("#btn-save");

// Carrega texto salvo anteriormente no navegador (LocalStorage)
const savedText = localStorage.getItem("child_desktop_notepad");
if (savedText) {
    notepadText.value = savedText;
}

// Salva automaticamente ao digitar
notepadText.addEventListener("input", () => {
    localStorage.setItem("child_desktop_notepad", notepadText.value);
});

// Botão Limpar
btnClear.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todo o texto?")) {
        notepadText.value = "";
        localStorage.removeItem("child_desktop_notepad");
    }
});

// Botão Salvar
btnSave.addEventListener("click", () => {
    localStorage.setItem("child_desktop_notepad", notepadText.value);
    alert("Texto salvo com sucesso!");
});
