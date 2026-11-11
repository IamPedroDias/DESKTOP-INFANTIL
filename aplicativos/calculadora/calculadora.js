const calculatorDisplay = document.querySelector("#calculator-display");
const calculatorTape = document.querySelector("#tape");
const calculatorButtons = document.querySelector(".calculator-buttons");

let expression = [];
let justCalculated = false;

// ==================== UTILITÁRIOS ====================

const isOperator = (t) => ["+", "-", "*", "/", "^"].includes(t);
const isNumber = (t) => t && !isOperator(t) && !["(", ")", "√", "²", "%"].includes(t) && Number.isFinite(Number(t));
const isValue = (t) => isNumber(t) || [")", "²", "%"].includes(t);
const formatNumber = (v) => String(v).replace(".", ",");
const getLast = () => expression.at(-1);

function formatExpression(tokens) {
    return tokens.map((token, i) => {
        if (token === "*") return " × ";
        if (token === "/") return " ÷ ";
        if (isOperator(token) && token !== "^") return ` ${token} `;
        if (token === "^") return "";
        if (tokens[i - 1] === "^") return String(token).split("").map(c => ({ "-": "⁻", ",": "˒" }[c] || String.fromCharCode(c.charCodeAt(0) + (c >= "0" && c <= "9" ? 8256 : 0)))).join("");
        return isNumber(token) ? formatNumber(token) : token;
    }).join("").trim();
}

function updateCalculator() {
    const formatted = formatExpression(expression);
    calculatorDisplay.textContent = expression.length ? formatted : "0";
    calculatorTape.textContent = formatted;
}

const showMessage = (msg) => { calculatorTape.textContent = msg; };

// ==================== AVALIADOR MATEMÁTICO ====================

function evaluateExpression(tokens) {
    let expr = tokens.map(t => ({ "√": "Math.sqrt(", "²": "**2", "^": "**", "%": "/100" }[t] || t)).join("");
    expr += ")".repeat((expr.match(/Math\.sqrt\(/g) || []).length);

    try {
        const result = new Function(`"use strict"; return (${expr})`)();
        if (!Number.isFinite(result)) throw new Error("Erro de cálculo.");
        return result;
    } catch {
        throw new Error("Expressão inválida.");
    }
}

// ==================== AÇÕES E ENTRADAS ====================

function addNumber(num) {
    if (justCalculated) { expression = []; justCalculated = false; }
    const last = getLast();

    if (isNumber(last)) expression[expression.length - 1] += num;
    else if (!last || isOperator(last) || ["(", "√"].includes(last)) expression.push(num);
    else showMessage("Use × antes de outro número.");

    updateCalculator();
}

function addOperation(op) {
    if (!expression.length) return;
    if (isOperator(getLast())) expression[expression.length - 1] = op;
    else if (isValue(getLast())) expression.push(op);
    else return;

    justCalculated = false;
    updateCalculator();
}

function addPostfixOrPower(symbol) {
    if (!isValue(getLast())) return;
    expression.push(symbol);
    justCalculated = false;
    updateCalculator();
}

function addParenthesis(type) {
    const last = getLast();
    if (type === "(") {
        if (last && !isOperator(last) && !["(", "√"].includes(last)) return showMessage("Use × antes de ( para multiplicar.");
        expression.push("(");
    } else {
        const balance = expression.filter(t => t === "(").length - expression.filter(t => t === ")").length;
        if (balance <= 0 || !isValue(last)) return;
        expression.push(")");
    }
    justCalculated = false;
    updateCalculator();
}

function addSquareRoot() {
    const last = getLast();
    if (justCalculated && isNumber(last)) { expression = ["√", last]; justCalculated = false; }
    else if (last && isValue(last)) return showMessage("Use × antes de √.");
    else expression.push("√");

    justCalculated = false;
    updateCalculator();
}

function addDecimal() {
    if (justCalculated) { expression = []; justCalculated = false; }
    const last = getLast();

    if (isNumber(last) && !last.includes(".")) expression[expression.length - 1] += ".";
    else if (!last || isOperator(last) || ["(", "√"].includes(last)) expression.push("0.");

    updateCalculator();
}

function changeSign() {
    const last = getLast();
    if (isNumber(last)) {
        expression[expression.length - 1] = last.startsWith("-") ? last.slice(1) : "-" + last;
        updateCalculator();
    }
}

function backspace() {
    if (!expression.length) return;
    const last = getLast();
    if (isNumber(last) && last.length > 1 && last !== "-") {
        expression[expression.length - 1] = last.slice(0, -1);
    } else {
        expression.pop();
    }
    updateCalculator();
}

function clearCalculator() {
    expression = [];
    justCalculated = false;
    calculatorDisplay.textContent = "0";
    calculatorTape.textContent = "";
}

function calculateResult() {
    if (!expression.length) return;
    const last = getLast();
    if (isOperator(last) || ["(", "√"].includes(last)) return showMessage("Complete a expressão antes de calcular.");

    const opens = expression.filter(t => t === "(").length;
    const closes = expression.filter(t => t === ")").length;
    if (opens !== closes) return showMessage("Verifique os parênteses.");

    const originalExpr = formatExpression(expression);
    try {
        const result = evaluateExpression(expression);
        calculatorDisplay.textContent = formatNumber(result);
        calculatorTape.textContent = `${originalExpr} = ${formatNumber(result)}`;
        expression = [String(result)];
        justCalculated = true;
    } catch (error) {
        calculatorDisplay.textContent = "Erro";
        calculatorTape.textContent = error.message;
    }
}

// ==================== EVENTOS (CLIQUES E TECLADO) ====================

const actionMap = {
    clear: clearCalculator, backspace, percent: () => addPostfixOrPower("%"),
    sign: changeSign, decimal: addDecimal, equals: calculateResult,
    "open-parenthesis": () => addParenthesis("("), "close-parenthesis": () => addParenthesis(")"),
    square: () => addPostfixOrPower("²"), power: () => addPostfixOrPower("^"), "square-root": addSquareRoot
};

calculatorButtons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const { number, operation, action } = btn.dataset;

    if (number !== undefined) addNumber(number);
    else if (operation !== undefined) addOperation(operation);
    else if (actionMap[action]) actionMap[action]();
});

const keyMap = {
    "+": () => addOperation("+"), "-": () => addOperation("-"), "*": () => addOperation("*"), "×": () => addOperation("*"),
    "/": () => addOperation("/"), "÷": () => addOperation("/"), "^": () => addPostfixOrPower("^"), "²": () => addPostfixOrPower("²"),
    "(": () => addParenthesis("("), ")": () => addParenthesis(")"), ",": addDecimal, ".": addDecimal, "%": () => addPostfixOrPower("%"),
    Enter: calculateResult, "=": calculateResult, Backspace: backspace, Escape: clearCalculator
};

document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") addNumber(e.key);
    else if (keyMap[e.key]) {
        if (["+", "-", "*", "/", "÷", "Enter", "="].includes(e.key)) e.preventDefault();
        keyMap[e.key]();
    }
});