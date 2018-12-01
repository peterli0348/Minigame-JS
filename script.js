// stores buttons clicked in grid to array
let clickHistory;
// shows completion status
let progressBarStatus;
let xSize;
let ySize;

function setVariables() {
	xSize = 8;
	ySize = 8;
	resetClickHistory();
}

// initialize game
function setup() { 
	setVariables();
	fillFunctionButtons();
	fillStatusText();
	fillProgressBar();
	fillGrid();
	setStatusText("Loaded succesfully!", "text-bold");
}

function fillFunctionButtons() {
	let headDiv = document.getElementById("head");
	let functionButtonRow = createRow();
	// createButton(buttonText, styleClass, functionName);
	functionButtonRow.appendChild(createButton(
			"All Mid All Random", "btn btn-primary btn-sm m-3", "f1()"));
	functionButtonRow.appendChild(createButton(
			"Drop the beat", "btn btn-warning btn-sm m-3", "f2()"));
	functionButtonRow.appendChild(createButton(
			"Defile", "btn btn-dark btn-sm m-3", "f3()"));
	functionButtonRow.appendChild(createButton(
			"Puuurrrge!", "btn btn-light m-3", "f4()"));
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
	for (x = 0; x < xSize; x++) {
		// justify-content-md-center sets spacing to middle center
		let buttonRow = createRow("justify-content-md-center");
		for (y = 0; y < ySize; y++) {
			buttonRow.appendChild(createDefaultButton(x, y));
		}
		grid.appendChild(buttonRow);
	}
}

function fillAllRandom() {
	for (x = 0; x < xSize; x++) {
		for (y = 0; y < ySize; y++) {
			setButtonColor(x, y, getRandomColor());
			setButtonText(x, y, getRandomNumber(1, 10));
		}
	}
}

function dropRow() {
	// shifts button colors down one row
	for (x = xSize - 1; x > 0; x--) {
		for (y = 0; y < ySize; y++) {
			setButtonColor(x, y, getButtonColor(x - 1, y));
			setButtonText(x, y, getButtonText(x - 1, y));
		}
	}
	// sets new button colors for first row
	for (y = 0; y < ySize; y++) {
		setButtonColor(x, y, getRandomColor());
		setButtonText(x, y, getRandomNumber(1, 10));
	}
}

// sets random buttons from grid to black
function destroy(amount) {
	// base-case
	if (amount < 0)
		return;
	for (destroyed = 0; destroyed < amount; destroyed++) {
		// if all buttons are already destroyed
		if (allDestroyed()) break;
		setTimeout(function() {
			// gets coordinates to random button
			let randomx = getRandomNumber(0, 7);
			let randomy = getRandomNumber(0, 7);
			// while button is already destroyed
			while (getButtonColor(randomx, randomy) === "black") {
				// gets coordinates to another random button
				randomx = getRandomNumber(0, 7);
				randomy = getRandomNumber(0, 7);
				if (allDestroyed()) break;
			}
			setButtonColor(randomx, randomy, "black");
			setButtonText(randomx, randomy, "");
			// lowers progressBarStatus by one when button destroyed
			setProgressBar("bar", "bg-danger", decreaseProgress());
		// algorithm for animation speed
		}, (amount + destroyed) * (amount - destroyed +1));
	}
}

// true if grid all black
function allDestroyed() {
	for (x = 0; x < xSize; x++) {
		for (y = 0; y < ySize; y++) {
			if (getButtonColor(x, y) != "black") {
				return false;
			}
		}
	}
	return true;
}

// resets grid
function purge() { 
	for (x = 0; x < xSize; x++) {
		for (y = 0; y < ySize; y++) {
			setButtonColor(x, y, "white");
			setButtonText(x, y, "");
		}
	}
	clickHistory = [];
	setProgressBar("bar", "bg-success", resetProgress());
}

function f1() {
	setStatusText("Fill with random colors");
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

function f4() {
	setStatusText("Reset EVERYTHING");
	purge();
}

function createRow(className) {
	let rowDiv = document.createElement("div");
	if (className == null) {
		rowDiv.className = "row";
	} else {
		rowDiv.className = "row " + className;
	}
	return rowDiv;
}

// create functions

// creates a white button with no text
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

// set functions

function setButtonColor(x, y, color) {
	let button = document.getElementById("img_" + x + "_" + y);
	button.setAttribute("src", "images/" + color + ".jpg");
	button.setAttribute("alt", color);
}

function setButtonText(x, y, text) {
	let button = document.getElementById("text_" + x + "_" + y);
	button.innerHTML = text;
}

function setProgressBar(id, color, value) {
	let progressBar = document.getElementById(id);
	progressBar.className = "progress-bar " + color;
	progressBar.setAttribute("style", "width: " + value + "%");
	progressBar.innerHTML = value + "%";
}

function increaseProgress(amount) {
	if (amount == null)
		return ++progressBarStatus;
	else return progressBarStatus += amount;
}

function decreaseProgress(amount) {
	if (amount == null)
		return --progressBarStatus;
	else return progressBarStatus -= amount;
}

function resetProgress() {
	return progressBarStatus = 0;
}

function resetClickHistory() {
	clickHistory = [];
}

// get functions

function getButtonColor(x, y) {
	let img = document.getElementById("img_" + x + "_" + y);
	return img.getAttribute("alt");
}

function getButtonText(x, y) {
	let text = document.getElementById("text_" + x + "_" + y);
	return text.innerHTML;
}

function getRandomColor() {
	let colorChoice = getRandomNumber(0, 3);
	if (colorChoice < 1)
		return "red";
	else if (colorChoice < 2)
		return "yellow";
	else if (colorChoice < 3)
		return "green";
	else 
		return "turquoise";
}

function getRandomNumber(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

// console interaction functions

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

// runs when button in grid is clicked
function buttonClicked(x, y) {
	setStatusText("Button (" + x + ", " + y + ") pressed");
	// divide 8 to get x value
	// modulus 8 to get y value
	clickHistory.push(x * 8 + y);

	setButtonColor(x, y, getRandomColor());
	let currentText = getButtonText(x, y);
	let textValue = 0;
	if (currentText != "") {
		// makes sure textValue is base10
		textValue = parseInt(currentText);
	}
	setButtonText(x, y, textValue + 1);
	setProgressBar("bar", "bg-success", increaseProgress(textValue));
}
