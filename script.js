/*
  Sirpelz Calculator
  ------------------
  This file controls the calculator logic:
  - storing the numbers the user enters
  - handling operators like +, -, *, and /
  - updating the display after every click or keyboard press
*/

// Display elements
var screen     = document.getElementById("screen");
var expression = document.getElementById("expression");

// Calculator memory
var firstNumber     = "";
var operator        = "";
var currentInput    = "0";
var justCalculated  = false;

// Keeps the main display in sync with the current input.
function updateScreen() {
  screen.textContent = currentInput;
}

// Handles number and decimal button presses.
function pressNumber(num) {

  // After showing an answer, typing a number starts a new calculation.
  if (justCalculated) {
    currentInput   = "";
    justCalculated = false;
  }

  // A number should only have one decimal point.
  if (num === "." && currentInput.includes(".")) {
    return;
  }

  // Replace the starting 0 instead of creating numbers like 05.
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput = currentInput + num;
  }

  updateScreen();
}

// Stores the selected operator and prepares the screen for the next number.
function pressOperator(op) {

  // Supports chained calculations, like 3 + 5 * 2.
  if (firstNumber !== "" && operator !== "" && !justCalculated) {
    calculate();
  }

  firstNumber    = currentInput;
  operator       = op;
  justCalculated = false;

  expression.textContent = firstNumber + " " + getOperatorSymbol(op);

  // Start the second number fresh after choosing an operator.
  currentInput = "0";
  updateScreen();
}

// Runs the math when the equals button is pressed.
function calculate() {

  if (firstNumber === "" || operator === "") {
    return;
  }

  var num1   = parseFloat(firstNumber);
  var num2   = parseFloat(currentInput);
  var result = 0;

  expression.textContent = firstNumber + " " + getOperatorSymbol(operator) + " " + currentInput + " =";

  if (operator === "+") {
    result = num1 + num2;

  } else if (operator === "-") {
    result = num1 - num2;

  } else if (operator === "*") {
    result = num1 * num2;

  } else if (operator === "/") {

    // Keep division by zero from breaking the calculator.
    if (num2 === 0) {
      currentInput   = "Error";
      justCalculated = true;
      operator       = "";
      firstNumber    = "";
      updateScreen();
      return;
    }

    result = num1 / num2;
  }

  // Clean up floating-point results like 0.30000000004.
  result = parseFloat(result.toFixed(10));

  currentInput   = String(result);
  operator       = "";
  firstNumber    = "";
  justCalculated = true;

  updateScreen();
}

// Resets everything back to the starting state.
function clearAll() {
  firstNumber    = "";
  operator       = "";
  currentInput   = "0";
  justCalculated = false;

  expression.textContent = "";
  updateScreen();
}

// Switches the current number between positive and negative.
function toggleSign() {
  if (currentInput === "0" || currentInput === "") return;

  if (currentInput.startsWith("-")) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = "-" + currentInput;
  }

  updateScreen();
}

// Converts the current number into a percentage.
function pressPercent() {
  var num = parseFloat(currentInput);
  currentInput = String(num / 100);
  updateScreen();
}

// Gives each operator a cleaner display symbol.
function getOperatorSymbol(op) {
  if (op === "+") return "+";
  if (op === "-") return "\u2212";
  if (op === "*") return "\u00d7";
  if (op === "/") return "\u00f7";
  return op;
}

// Button support
var allButtons = document.querySelectorAll(".btn");

allButtons.forEach(function(button) {

  button.addEventListener("click", function() {
    var value = button.getAttribute("data-value");

    if (value === "C") {
      clearAll();

    } else if (value === "+/-") {
      toggleSign();

    } else if (value === "%") {
      pressPercent();

    } else if (value === "=") {
      calculate();

    } else if (value === "+" || value === "-" || value === "*" || value === "/") {
      pressOperator(value);

    } else {
      pressNumber(value);
    }
  });
});

// Keyboard support
window.addEventListener("keydown", function(event) {

  var key = event.key;

  if (key >= "0" && key <= "9") {
    pressNumber(key);

  } else if (key === ".") {
    pressNumber(".");

  } else if (key === "+") {
    pressOperator("+");

  } else if (key === "-") {
    pressOperator("-");

  } else if (key === "*") {
    pressOperator("*");

  } else if (key === "/") {
    event.preventDefault();
    pressOperator("/");

  } else if (key === "Enter" || key === "=") {
    calculate();

  } else if (key === "Escape" || key === "c" || key === "C") {
    clearAll();

  } else if (key === "%") {
    pressPercent();
  }
});
