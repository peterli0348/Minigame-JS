//var clickHistory = [];
//var progress;

// initialize game
function setup() { 
	setVariables();
	fillFunctionButtons();
	fillStatusText();
	fillProgressBar();
	fillGrid();
	setStatusText("Loaded succesfully!", "text-bold");
	let checkForCleared = setInterval(dropCleared, interval);
	let checkForMatch = setInterval(checkGridMatch, interval);
	let checkForWinCondition = setInterval(checkWinCondition, interval);
}

function fillFunctionButtons() {
	let headDiv = document.getElementById("head");
	let functionButtonRow = createRow();
	// createButton(buttonText, styleClass, functionName);
	functionButtonRow.appendChild(createButton(
			"Reset Level", "btn btn-primary btn-sm m-3", "f1()"));
//	functionButtonRow.appendChild(createButton(
//			"New Row", "btn btn-warning btn-sm m-3", "f2()"));
	functionButtonRow.appendChild(createButton(
			"Increase Difficulty", "btn btn-light m-3", "f4()"));
	headDiv.appendChild(functionButtonRow);
}

function fillStatusText() {
	let headDiv = document.getElementById("head");
	// ml-3 sets left margin to 3 spacing
	let statusRow = createRow("ml-3"); 
	// sets id for later access
	statusRow.id = "statusText";
	headDiv.appendChild(statusRow);
}

function setStatusText(text, style) {
	let textDiv = document.getElementById("statusText");
	let newText = document.createElement("p");
	if (style != null) {
		newText.className = style;
	}
	newText.appendChild(document.createTextNode(text));
	// removes old text
	textDiv.innerHTML = "";
	textDiv.appendChild(newText);
}

function fillProgressBar() {
	let headDiv = document.getElementById("head");
	let progessRow = createRow("progress");
	// bg-success sets background to green
	let pogressBar = createProgressBar("bar", "bg-success", resetProgress());
	progessRow.appendChild(pogressBar);
	headDiv.appendChild(progessRow);
}

function fillGrid() {
let grid = document.getElementById("grid");
for (x = 0 ; x < xSize ; x++) {
	// justify-content-md-center sets spacing to middle center
	let buttonRow = createRow("justify-content-md-center");
	for (y = 0 ; y < ySize ; y++) {
		buttonRow.appendChild(createDefaultButton(x, y));
	}
	grid.appendChild(buttonRow);
}
fillAllRandom();
}

//fills grid with random colors from top to bottom and left to right
function fillAllRandom() {
	swappable = true;
	for (x = 0 ; x < xSize ; x++) {
		for (y = 0 ; y < ySize ; y++) {
			setButtonColor(x, y, getRandomColor());
			setButtonText(x, y, "");
			// sets another color if button makes a match-3
			if (fillAllRandomCreatesMatch(x, y)) {
				y--;
			}
		}
	}
	resetProgress();
}

function dropRow() {
	// shifts button colors down one row
	for (x = xSize - 1 ; x > 0 ; x--) {
		for (y = 0 ; y < ySize ; y++) {
			setButtonColor(x, y, getButtonColor(x - 1, y));
			setButtonText(x, y, getButtonText(x - 1, y));
		}
	}
	// sets new button colors for first row
	for (y = 0 ; y < ySize ; y++) {
		setButtonColor(x, y, getRandomColor());
		setButtonText(x, y, "");
		// sets another color if button makes match
		if(dropRowCreatesMatch(x, y)) {
			y--;
		}
	}
}

//sets random buttons from grid to clearedButtonColor
function destroy(amount) {
	// base-case
	if (amount < 0) return;
	for (destroyed = 0 ; destroyed < amount ; destroyed++) {
		// if all buttons are already destroyed
		if (allDestroyed()) {
			break;
		}
		setTimeout(destroyButton(), (amount + destroyed) * (amount - destroyed +1));
	}
}

//resets grid
function purge() { 
	for (x = 0 ; x < xSize ; x++) {
		for (y = 0 ; y < ySize ; y++) {
			setButtonColor(x, y, "white");
			setButtonText(x, y, "");
		}
	}
	clickHistory = [];
	setProgressBar("bar", "bg-success", resetProgress());
}

function f1() {
	setStatusText("Level Reset");
	fillAllRandom();
}

function f2() {
	setStatusText("Drop everything by 1 row");
	dropRow();
}

function f3() {
	setStatusText("BAM! BAM! BAM!");
	destroy(16);
}

//function f4() {
//  setStatusText("Reset EVERYTHING");
//  purge();
//}

// helper functions below

function createRow(className) {
	let rowDiv = document.createElement("div");
	if (className == null) {
		rowDiv.className = "row";
	} else {
		rowDiv.className = "row " + className;
	}
	return rowDiv;
}

function createButton(buttonText, styleClass, functionName) {
	let button = document.createElement("button");
	button.className = styleClass;
	button.appendChild(document.createTextNode(buttonText));
	button.setAttribute("onclick", functionName);
	return button;
}

function createProgressBar(id, color, value) {
	let progressBar = document.createElement("div");
	progressBar.id = id;
	progressBar.className = "progress-bar " + color;
	progressBar.setAttribute("style", "width: " + value + "%");
	return progressBar;
}

function setProgressBar(id, color, value) {
	let progressBar = document.getElementById(id);
	progressBar.className = "progress-bar " + color;
	progressBar.setAttribute("style", "width: " + value + "%");
	progressBar.innerHTML = value + "%";
}

function createDefaultButton() {
	let defaultButton = document.createElement("div");
	defaultButton.className = "thumbnail";
	defaultButton.setAttribute("onclick", "buttonClicked(" + x + "," + y + ")");
	
	let img = document.createElement("img");
	img.id = "img_" + x + "_" + y;
	img.setAttribute("src", "images/white.jpg");
	img.setAttribute("alt", "white");
	img.setAttribute("class", "rounded-circle");
	img.setAttribute("width", "75");
	img.setAttribute("height", "75");
	
	let text = document.createElement("label");
	text.setAttribute("class", "caption unselectable");
	text.id = "text_" + x + "_" + y;

	defaultButton.appendChild(img);
	defaultButton.appendChild(text);
	return defaultButton;
}

function setButtonColor(x, y, color) {
	let button = document.getElementById("img_" + x + "_" + y);
	button.setAttribute("src", "images/" + color + ".jpg");
	button.setAttribute("alt", color);
}

function setButtonText(x, y, text) {
	let button = document.getElementById("text_" + x + "_" + y);
	button.innerHTML = text;
}

function getButtonColor(x, y) {
	let img = document.getElementById("img_" + x + "_" + y);
	return img.getAttribute("alt");
}

function getButtonText(x, y) {
	let text = document.getElementById("text_" + x + "_" + y);
	return text.innerHTML;
}

//color options
function getRandomColor() {
	let colorChoice = getRandomNumber(0, colorAmount - 1);
	if (colorChoice < 1) {
		return "red";
	} else if (colorChoice < 2) {
		return "orange";
	} else if (colorChoice < 3) {
		return "yellow";
	} else if (colorChoice < 4) {
		return "green";
	} else if (colorChoice < 5) {
		return "turquoise";
	} else if (colorChoice < 6) {
		return "indigo";
	} else if (colorChoice < 7) {
		return "purple";
	} else {
		return "gray";
	}
}

function getRandomNumber(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

//console interaction functions

function logAllHistory() {
  if (clickHistory.length == 0) {
    console.log("History is empty");
    return;
  }
  for (i = 0; i < clickHistory.length; i++) {
    console.log(clickHistory[i]);
  }
}

function logLastClicked() {
  if (clickHistory.length == 0) {
    console.log("History is empty");
  } else {
    console.log(clickHistory[clickHistory.length - 1]);
  }
}