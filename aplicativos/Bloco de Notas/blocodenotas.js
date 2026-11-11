import { Editor, Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";

const STORAGE_KEY = "desktop-infantil:notepad-content:v1";

const editorElement = document.querySelector("#text-editor");
const toolbar = document.querySelector(".toolbar");
const fontSelector = document.querySelector("#font-family");
const sizeSelector = document.querySelector("#font-size");
const paragraphStyleSelector = document.querySelector("#paragraph-style");
const fontColorInput = document.querySelector("#font-color");
const applyCustomColorBtn = document.querySelector("#apply-custom-color");
const openColorPickerBtn = document.querySelector("#open-color-picker");
const customColorSwatch = document.querySelector("#custom-color-swatch");

function updateCustomSwatch(color) {
    if (customColorSwatch) {
        customColorSwatch.style.setProperty("--swatch-color", color);
    }
}

const ParagraphStyle = Extension.create({
    name: "paragraphStyle",

    addGlobalAttributes() {
        return [{
            types: ["paragraph"],
            attributes: {
                documentStyle: {
                    default: null,
                    parseHTML: element => element.getAttribute("data-document-style"),
                    renderHTML: attributes => (
                        attributes.documentStyle
                            ? { "data-document-style": attributes.documentStyle }
                            : {}
                    )
                }
            }
        }];
    },

    addCommands() {
        return {
            setDocumentStyle: style => ({ commands }) => (
                commands.updateAttributes("paragraph", { documentStyle: style })
            )
        };
    }
});

function loadSavedContent() {
    try {
        const content = localStorage.getItem(STORAGE_KEY);
        return content ? JSON.parse(content) : "<p></p>";
    } catch {
        return "<p></p>";
    }
}

function saveContent(currentEditor) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEditor.getJSON()));
    } catch {
        // O editor continua funcionando mesmo que o navegador não permita salvar localmente.
    }
}

const editor = new Editor({
    element: editorElement,
    extensions: [
        StarterKit,
        TextStyleKit,
        TextAlign.configure({
            types: ["heading", "paragraph"],
            alignments: ["left", "center", "right", "justify"]
        }),
        ParagraphStyle
    ],
    content: loadSavedContent(),
    editorProps: {
        attributes: {
            class: "tiptap-content",
            spellcheck: "true"
        }
    },
    onCreate: ({ editor: currentEditor }) => updateToolbarState(currentEditor),
    onSelectionUpdate: ({ editor: currentEditor }) => updateToolbarState(currentEditor),
    onUpdate: ({ editor: currentEditor }) => {
        saveContent(currentEditor);
        updateToolbarState(currentEditor);
    }
});

function runCommand(command) {
    const actions = {
        bold: () => editor.chain().focus().toggleBold().run(),
        italic: () => editor.chain().focus().toggleItalic().run(),
        underline: () => editor.chain().focus().toggleUnderline().run(),
        strikeThrough: () => editor.chain().focus().toggleStrike().run(),
        justifyLeft: () => editor.chain().focus().setTextAlign("left").run(),
        justifyCenter: () => editor.chain().focus().setTextAlign("center").run(),
        justifyRight: () => editor.chain().focus().setTextAlign("right").run(),
        justifyFull: () => editor.chain().focus().setTextAlign("justify").run(),
        undo: () => editor.chain().focus().undo().run(),
        redo: () => editor.chain().focus().redo().run()
    };

    actions[command]?.();
}

function applyParagraphStyle(style) {
    const chain = editor.chain().focus();

    // Limpa atributos manuais conflitantes de tamanho de fonte e negrito ao trocar de estilo
    chain.unsetMark("textStyle").unsetMark("bold");

    if (style === "p") {
        chain.setParagraph().setDocumentStyle(null).run();
        return;
    }

    if (style === "h1" || style === "h2") {
        chain.setHeading({ level: Number(style.slice(1)) }).run();
        return;
    }

    chain.setParagraph().setDocumentStyle(style).run();
}

function updateToolbarState(currentEditor) {
    const isH1 = currentEditor.isActive("heading", { level: 1 });
    const isH2 = currentEditor.isActive("heading", { level: 2 });
    const docStyle = currentEditor.getAttributes("paragraph").documentStyle;
    const isFigureStyle = docStyle === "figure-title" || docStyle === "figure-caption";

    const commandStates = {
        bold: currentEditor.isActive("bold") || isH1,
        italic: currentEditor.isActive("italic"),
        underline: currentEditor.isActive("underline"),
        strikeThrough: currentEditor.isActive("strike"),
        justifyLeft: currentEditor.isActive({ textAlign: "left" }),
        justifyCenter: currentEditor.isActive({ textAlign: "center" }),
        justifyRight: currentEditor.isActive({ textAlign: "right" }),
        justifyFull: currentEditor.isActive({ textAlign: "justify" })
    };

    toolbar.querySelectorAll("[data-command]").forEach(button => {
        const command = button.dataset.command;
        const isActive = commandStates[command] ?? false;

        button.classList.toggle("active", isActive);

        if (command === "undo") {
            button.disabled = !currentEditor.can().undo();
        } else if (command === "redo") {
            button.disabled = !currentEditor.can().redo();
        } else {
            button.setAttribute("aria-pressed", String(isActive));
        }
    });

    const { fontFamily, fontSize, color } = currentEditor.getAttributes("textStyle");

    fontSelector.value = (
        fontFamily && [...fontSelector.options].some(option => option.value === fontFamily)
    ) ? fontFamily : "Arial";

    const sizeInPoints = fontSize?.replace("pt", "");
    if (sizeInPoints) {
        sizeSelector.value = [...sizeSelector.options].some(option => option.value === sizeInPoints) ? sizeInPoints : "12";
    } else {
        sizeSelector.value = isFigureStyle ? "10" : "12";
    }

    if (/^#[0-9a-f]{6}$/i.test(color || "")) {
        fontColorInput.value = color;
        updateCustomSwatch(color);
    }

    if (isH1) {
        paragraphStyleSelector.value = "h1";
    } else if (isH2) {
        paragraphStyleSelector.value = "h2";
    } else {
        paragraphStyleSelector.value = docStyle || "p";
    }
}

editorElement.addEventListener("click", event => {
    if (editor && !editor.isFocused) {
        editor.chain().focus().run();
    }
});

toolbar.addEventListener("mousedown", event => {
    if (event.target.closest("button")) {
        event.preventDefault();
    }
});

toolbar.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;

    if (button.dataset.command) {
        runCommand(button.dataset.command);
    }

    if (button.dataset.color) {
        const color = button.dataset.color;
        fontColorInput.value = color;
        updateCustomSwatch(color);
        editor.chain().focus().setColor(color).run();
    }
});

applyCustomColorBtn.addEventListener("click", () => {
    const color = fontColorInput.value;
    updateCustomSwatch(color);
    editor.chain().focus().setColor(color).run();
});

openColorPickerBtn.addEventListener("click", () => {
    fontColorInput.click();
});

fontSelector.addEventListener("change", event => {
    editor.chain().focus().setFontFamily(event.target.value).run();
});

sizeSelector.addEventListener("change", event => {
    editor.chain().focus().setFontSize(`${event.target.value}pt`).run();
});

paragraphStyleSelector.addEventListener("change", event => {
    applyParagraphStyle(event.target.value);
});

const newSheetBtn = document.querySelector("#new-sheet-btn");

function resetEditor() {
    editor.commands.clearContent(true);
    editor.commands.setParagraph();
    localStorage.removeItem(STORAGE_KEY);
    editor.chain().focus().run();
}

newSheetBtn.addEventListener("click", () => {
    if (!editor.getText().trim()) {
        resetEditor();
        return;
    }

    if (confirm("Vamos fazer de novo? Isso vai apagar o texto atual para começar uma folha em branco.")) {
        resetEditor();
    }
});

