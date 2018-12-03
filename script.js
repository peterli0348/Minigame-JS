// stores buttons clicked in grid to array
let clickHistory;
// shows completion status
let progressBarStatus;
// helps determine if button can be swapped with another
let swappable;
let xSize;
let ySize;

function setVariables() {
	xSize = 8;
	ySize = 8;
	swappable = true;
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
	fillAllRandom();
}

// fills grid with random colors from top to bottom and left to right
function fillAllRandom() {
	swappable = true;
	for (x = 0; x < xSize; x++) {
		for (y = 0; y < ySize; y++) {
			setButtonColor(x, y, getRandomColor());
			// sets another color if button makes combo
			if (fillAllRandomCombo(x, y)) {
				y--;
			}
		}
	}
}

// true if 3 buttons with same color line up when filling grid
// only checks to the left and top of button(x, y)
function fillAllRandomCombo(x ,y) {
	let sameColor = getButtonColor(x, y);
	// if combo in same row
	if (y > 0 // y > 1
		&& getButtonColor(x, y - 1) == sameColor
		// change "y > 0" to "y > 1" if including next line
//		&& getButtonColor(x, y - 2) == sameColor
	) {
		return true;
	}
	// if combo in same column
	if (x > 0 // x > 1
		&& getButtonColor(x - 1, y) == sameColor
		// change "x > 0" to "x > 1" if including next line
//		&& getButtonColor(x - 2, y) == sameColor
	) {
		return true;
	}
	return false;
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
		// sets another color if button makes combo
		if(dropRowCreateCombo(x, y)) {
			y--;
		}
	}
}

// checks if 3 buttons with same color line up when dropping row
// only checks left and below button(x, y)
function dropRowCreateCombo(x, y) {
	let sameColor = getButtonColor(x, y);
	if (y > 0
		&& getButtonColor(x, y - 1) == sameColor
		// change "y > 0" to "y > 1" if including next line
//		&& getButtonColor(x, y - 2) == sameColor
	) {
		return true;
	}
	if (getButtonColor(x + 1, y) == sameColor
//		&& getButtonColor(x + 2, y) == sameColor
	) {
		return true;
	}
	return false;
}

// sets random buttons from grid to black
function destroy(amount) {
	// base-case
	if (amount < 0) return;
	for (destroyed = 0; destroyed < amount; destroyed++) {
		// if all buttons are already destroyed
		if (allDestroyed()) 
			break;
		setTimeout(destroyButton(), (amount + destroyed) * (amount - destroyed +1));
	}
}

// sets a random non-destroyed button to destroyed
function destroyButton() {
	// gets coordinates to random button
	let randomx = getRandomNumber(0, 7);
	let randomy = getRandomNumber(0, 7);
	// while button is already destroyed
	while (getButtonColor(randomx, randomy) == "black") {
		// gets coordinates to another random button
		randomx = getRandomNumber(0, 7);
		randomy = getRandomNumber(0, 7);
		if (allDestroyed()) {
			break;
		}
	}
	setButtonColor(randomx, randomy, "black");
	setButtonText(randomx, randomy, "");
	// lowers progressBarStatus by one when button destroyed
	setProgressBar("bar", "bg-danger", decreaseProgress());
}

// helper function: true if grid all black
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

//create functions

function createRow(className) {
	let rowDiv = document.createElement("div");
	if (className == null) {
		rowDiv.className = "row";
	} else {
		rowDiv.className = "row " + className;
	}
	return rowDiv;
}

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

// setter functions

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
	if (amount == null) {
		return ++progressBarStatus;
	} else {
		return progressBarStatus += amount;
	}
}

function decreaseProgress(amount) {
	if (amount == null) {
		return --progressBarStatus;
	} else {
		return progressBarStatus -= amount;
	}
}

function resetProgress() {
	return progressBarStatus = 0;
}

function resetClickHistory() {
	clickHistory = [];
}

// getter functions

function getButtonColor(x, y) {
	let img = document.getElementById("img_" + x + "_" + y);
	return img.getAttribute("alt");
}

function getButtonText(x, y) {
	let text = document.getElementById("text_" + x + "_" + y);
	return text.innerHTML;
}

function getLastClicked() {
	if (clickHistory.length == 0) { 
		return null;
	} else {
		return clickHistory[clickHistory.length - 1];
	}
}

function getRandomColor() {
	let colorChoice = getRandomNumber(0, 3);
	if (colorChoice < 1) {
		return "red";
	} else if (colorChoice < 2) {
		return "yellow";
	} else if (colorChoice < 3) {
		return "green";
	} else {
		return "turquoise";
	}
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
	setStatusText("Button (" + x + ", " + y + ") clicked");
	if (clickHistory.length > 0) {		
		let lastx = Math.floor(getLastClicked() / 8);
		let lasty = (getLastClicked() % 8);		
		let lastColor = getButtonColor(lastx, lasty);
		let currentColor = getButtonColor(x, y);
		if (canSwap(x, y, lastx, lasty)) {
			swap(x, y, lastx, lasty, currentColor, lastColor);
		}
//			console.log("Button (" + lastx + ", " + lasty + ") " + "<-> " + "Button (" + x + ", " + y + ")\t" + lastColor + " <-> " + currentColor);
	}
	if (!swappable) {
		swappable = true;
	}
	// divide 8 to get x value
	// modulus 8 to get y value
	clickHistory.push(x * 8 + y);	
	setProgressBar("bar", "bg-success", increaseProgress());
}

// swaps the color of two buttons
function swap(x, y, lastx, lasty, currentColor, lastColor) {
	// sets swappable to false after functions are done running
	// which prevents a switch if next button clicked is next to (x, y)
	setTimeout(function() { swappable = false; }, 1);
	setButtonColor(x, y, lastColor);
	setButtonColor(lastx, lasty, currentColor);
}

// checks if two buttons meet all requirements to swap
function canSwap(x ,y, lastx, lasty) {
	if (swappable 
		&& swappablePosition(x, y, lastx, lasty)
		&& (makesCombo(x, y, lastx, lasty) > 2 || makesCombo(lastx, lasty, x, y) > 2)
	) {
		return true;
	}
	return false;
}

// helper function: checks if two buttons are in valid positions to swap
function swappablePosition(x, y, lastx, lasty) {
	if (// (lastx, lasty) is not the same as (x, y)
		(lastx != x || lasty != y)
		// lastx is 1 row away from x
		&& Math.abs(lastx - x) < 2 
		// lasty is 1 column away from y
		&& Math.abs(lasty - y) < 2 
		// (lastx, lasty) is not diagonal to (x, y)
		&& Math.abs(lastx - x) + Math.abs(lasty - y) < 2
	) {
		return true;
	}
	return false;
}

// returns combo if greater or equal to 3
function makesCombo(x, y, lastx, lasty) {
	let combo = 0;
	let color = getButtonColor(lastx, lasty);
	let verticalCount = checkVertical(x, y, lastx, color);
	let horizontalCount = checkHorizontal(x, y, lasty, color);
	if (verticalCount > 2) {
		combo += verticalCount;
	}
	if (horizontalCount > 2) {
		combo += horizontalCount;
	}
	return combo;
}

// helper function: returns vertical combo
function checkVertical(x, y, lastx, color) {
	let verticalCount = 1;
	// if x is not top row and swap direction is not down 
	if (x > 0 && x <= lastx) {
		verticalCount += checkAbove(x, y, color);
	}
	// if x is not bottom row and swap direction is not up 
	if (x < xSize - 1 && x >= lastx) {
		verticalCount += checkBelow(x, y, color);
	}
	return verticalCount;
}

// helper function: returns horizontal combo
function checkHorizontal(x, y, lasty, color) {
	let horizontalCount = 1;
	// if y is not leftmost row and swap direction is not right
	if (y > 0 && y <= lasty) {
		horizontalCount += checkLeft(x, y, color);
	}
	// if y is not rightmost row and swap direction is not left 
	if (y < ySize - 1 && y >= lasty) {
		horizontalCount += checkRight(x, y, color);
	}
	return horizontalCount;
}

// helper function: returns amount of same-color buttons above button(x, y)
function checkAbove(x, y, color) {
	let aboveCount = 0;
	for (i = x ; i > 0; i--) {
		if (getButtonColor(i - 1, y) == color) {
			aboveCount++;
		} else break;
	}
	return aboveCount;
}

// helper function: returns amount of same-color buttons below button(x, y)
function checkBelow(x, y, color) {
	let belowCount = 0;
	for (i = x ; i < xSize - 1; i++) {
		if (getButtonColor(i + 1, y) == color) {
			belowCount++;
		} else break;
	}
	return belowCount;
}

// helper function: returns amount of same-color buttons left of button(x, y)
function checkLeft(x, y, color) {
	let leftCount = 0;
	for (i = y; i > 0; i--) {
		if (getButtonColor(x, i - 1) == color) {
			leftCount++;
		} else break;
	}
	return leftCount;
}

// helper function: returns amount of same-color buttons right of button(x, y)
function checkRight(x, y, color) {
	let rightCount = 0;
	for (i = y; i < ySize - 1; i++) {
		if (getButtonColor(x, i + 1) == color) {
			rightCount++;
		} else break;
	}
	return rightCount;
}