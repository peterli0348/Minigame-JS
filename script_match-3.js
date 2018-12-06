// stores buttons clicked in grid to array
let clickHistory;
// shows completion status
let progressBarStatus;
// total number of colors
let maxColors;
//number of colors
let colorAmount;
// size of grid
let xSize;
let ySize;
// number same color buttons to create a match
let matchCondition;
// interval for checking cleared buttons
let interval;
// helps determine if button can be swapped with another
let swappable;
// status of dropping action
let dropping;
// status of checking action
let checkingMatch;
// color of cleared button
let clearedButtonColor;



function setVariables() {
	matchCondition = 3;
	xSize = 8;
	ySize = 8;
	// needs to have more than 1 color and less than maxColors
	startColorAmount = 4;
	// amount of colors in grid
	colorAmount = startColorAmount;
	// win condition MAX = 8
	maxColors = 8;
	clearedButtonColor = "black";
	interval = 200;
	swappable = true;
	dropping = false;
	checkingMatch = false;
	resetClickHistory();
}

//// initialize game
//function setup() { 
//	setVariables();
//	fillFunctionButtons();
//	fillStatusText();
//	fillProgressBar();
//	fillGrid();
//	setStatusText("Loaded succesfully!", "text-bold");
//	let checkForCleared = setInterval(dropCleared, interval);
//	let checkForMatch = setInterval(checkGridMatch, interval);
//	let checkForWinCondition = setInterval(checkWinCondition, interval);
//}

//// fills grid with random colors from top to bottom and left to right
//function fillAllRandom() {
//	swappable = true;
//	for (x = 0 ; x < xSize ; x++) {
//		for (y = 0 ; y < ySize ; y++) {
//			setButtonColor(x, y, getRandomColor());
//			setButtonText(x, y, "");
//			// sets another color if button makes a match-3
//			if (fillAllRandomCreatesMatch(x, y)) {
//				y--;
//			}
//		}
//	}
//	resetProgress();
//}

// true if 3 buttons with same color line up when filling grid
// only checks to the left and top of button(x, y)
function fillAllRandomCreatesMatch(x ,y) {
	let sameColor = getButtonColor(x, y);
	// if match in same row
	if (y > 1 // y > 1
		&& getButtonColor(x, y - 1) == sameColor
		// change "y > 0" to "y > 1" if including next line
		&& getButtonColor(x, y - 2) == sameColor
	) {
		return true;
	}
	// if match in same column
	if (x > 1 // x > 1
		&& getButtonColor(x - 1, y) == sameColor
		// change "x > 0" to "x > 1" if including next line
		&& getButtonColor(x - 2, y) == sameColor
	) {
		return true;
	}
	return false;
}

//function dropRow() {
//	// shifts button colors down one row
//	for (x = xSize - 1 ; x > 0 ; x--) {
//		for (y = 0 ; y < ySize ; y++) {
//			setButtonColor(x, y, getButtonColor(x - 1, y));
//			setButtonText(x, y, getButtonText(x - 1, y));
//		}
//	}
//	// sets new button colors for first row
//	for (y = 0 ; y < ySize ; y++) {
//		setButtonColor(x, y, getRandomColor());
//		setButtonText(x, y, "");
//		// sets another color if button makes match
//		if(dropRowCreatesMatch(x, y)) {
//			y--;
//		}
//	}
//}

// checks if 3 buttons with same color line up when dropping row
// only checks left and below button(x, y)
function dropRowCreatesMatch(x, y) {
	let sameColor = getButtonColor(x, y);
	if (y > 1 // y > 1
		&& getButtonColor(x, y - 1) == sameColor
		// change "y > 0" to "y > 1" if including next line
		&& getButtonColor(x, y - 2) == sameColor
	) {
		return true;
	}
	if (getButtonColor(x + 1, y) == sameColor
		&& getButtonColor(x + 2, y) == sameColor
	) {
		return true;
	}
	return false;
}

//// sets random buttons from grid to clearedButtonColor
//function destroy(amount) {
//	// base-case
//	if (amount < 0) return;
//	for (destroyed = 0 ; destroyed < amount ; destroyed++) {
//		// if all buttons are already destroyed
//		if (allDestroyed()) {
//			break;
//		}
//		setTimeout(destroyButton(), (amount + destroyed) * (amount - destroyed +1));
//	}
//}

// sets a random non-destroyed button to destroyed
function destroyButton() {
	// gets coordinates to random button
	let randomx = getRandomNumber(0, 7);
	let randomy = getRandomNumber(0, 7);
	// while button is already destroyed
	while (getButtonColor(randomx, randomy) == clearedButtonColor) {
		// gets coordinates to another random button
		randomx = getRandomNumber(0, 7);
		randomy = getRandomNumber(0, 7);
		if (allDestroyed()) {
			break;
		}
	}
	setButtonColor(randomx, randomy, clearedButtonColor);
	setButtonText(randomx, randomy, "");
	// lowers progressBarStatus by one when button destroyed
	setProgressBar("bar", "bg-danger", decreaseProgress());
}

// helper function: true if grid all is clearedButtonColor
function allDestroyed() {
	for (x = 0 ; x < xSize ; x++) {
		for (y = 0 ; y < ySize ; y++) {
			if (getButtonColor(x, y) != clearedButtonColor) {
				return false;
			}
		}
	}
	return true;
}

//// resets grid
//function purge() { 
//	for (x = 0 ; x < xSize ; x++) {
//		for (y = 0 ; y < ySize ; y++) {
//			setButtonColor(x, y, "white");
//			setButtonText(x, y, "");
//		}
//	}
//	clickHistory = [];
//	setProgressBar("bar", "bg-success", resetProgress());
//}

//function f1() {
//	setStatusText("Level Reset");
//	fillAllRandom();
//}

//function f2() {
//	setStatusText("Drop everything by 1 row");
//	dropRow();
//}

//function f3() {
//	setStatusText("BAM! BAM! BAM!");
//	destroy(16);
//}

// skips a level
function f4() {
	colorAmount++;
	if (colorAmount > maxColors) {
		colorAmount = startColorAmount;
		win();
	} else {
		fillAllRandom();
		setStatusText("Difficulty Increased");
	}
	fillAllRandom();
}

//create functions

//function createRow(className) {
//	let rowDiv = document.createElement("div");
//	if (className == null) {
//		rowDiv.className = "row";
//	} else {
//		rowDiv.className = "row " + className;
//	}
//	return rowDiv;
//}

// setter functions

function setButtonSelected(x, y) {
	let button = document.getElementById("img_" + x + "_" + y);
	button.setAttribute("src", "images/" + getButtonColor(x, y) + "_selected" + ".jpg");
}

function setButtonDeselected(x, y) {
	let button = document.getElementById("img_" + x + "_" + y);
	button.setAttribute("src", "images/" + getButtonColor(x, y) + ".jpg");
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

function getLastClicked() {
	if (clickHistory.length == 0) { 
		return null;
	} else {
		return clickHistory[clickHistory.length - 1];
	}
}

//// color options
//function getRandomColor() {
//	let colorChoice = getRandomNumber(0, colorAmount - 1);
//	if (colorChoice < 1) {
//		return "red";
//	} else if (colorChoice < 2) {
//		return "orange";
//	} else if (colorChoice < 3) {
//		return "yellow";
//	} else if (colorChoice < 4) {
//		return "green";
//	} else if (colorChoice < 5) {
//		return "turquoise";
//	} else if (colorChoice < 6) {
//		return "indigo";
//	} else if (colorChoice < 7) {
//		return "purple";
//	} else {
//		return "gray";
//	}
//}

// runs when button in grid is clicked
function buttonClicked(x, y) {
	setStatusText("Button (" + x + ", " + y + ") clicked");
	setButtonSelected(x,y);
	if (clickHistory.length > 0) {
		// gets coordinates of last button pressed
		let lastx = Math.floor(getLastClicked() / 8);
		let lasty = (getLastClicked() % 8);	
		let lastColor = getButtonColor(lastx, lasty);
		let currentColor = getButtonColor(x, y);
		setButtonDeselected(lastx, lasty);
		// if button 
		if (canSwap(x, y, lastx, lasty)) {
			swap(x, y, lastx, lasty, currentColor, lastColor);
		}
	}
	if (!swappable) {
		swappable = true;
	}
	// divide 8 to get x value
	// modulus 8 to get y value
	clickHistory.push(x * 8 + y);
}

// checks progress
function checkWinCondition() {
	if (progressBarStatus > 99) {
		colorAmount++;
		if (colorAmount > maxColors) {
			colorAmount = startColorAmount;
			win();
		} else {
			fillAllRandom();
			setStatusText("Difficulty Increased");
		}
	}
}

// unlocks harder version
function win() {
	if (matchCondition < 6) {
		++matchCondition;
		fillAllRandom();
		setStatusText("New Mode: Match-" + matchCondition);
	} else {
		setStatusText("YOU BEAT THE GAME CHEATER!");
	}
}

// swaps the color of two buttons
function swap(x, y, lastx, lasty, currentColor, lastColor) {
	setButtonColor(x, y, lastColor);
	setButtonColor(lastx, lasty, currentColor);
	// sets swappable to false after functions are done running
	// which prevents a switch if next button clicked is next to (x, y)
	setTimeout(function() { 
		swappable = false; 
		clearMatch(x, y, lastx, lasty, lastColor);
		clearMatch(lastx, lasty, x, y, currentColor);
		}, 1);	
}

// checks if two buttons meet all requirements to swap
function canSwap(x ,y, lastx, lasty) {
	// if previous button pressed was not swapped and is not currently dropping
	if (swappable && !dropping
		&& swappablePosition(x, y, lastx, lasty)
		&& (checkMatch(x, y, lastx, lasty) > 2 
			|| checkMatch(lastx, lasty, x, y) > 2)
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

// checks for matches in grid
function checkGridMatch() {
	// only runs if cleared buttons are all dropped
	if (checkForCleared() == xSize + 1 && !checkingMatch) {
		checkingMatch = true;
		for (x = 0 ; x < xSize ; x++) {
			for (y = 0 ; y < ySize ; y++) {
				let color = getButtonColor(x, y);
				// clearMatch(x, y, lastx, lasty, color)
				// lastx and lasty set to -1 since no button being swapped
				clearMatch(x, y, -1, -1, color);
			}
		}
		checkingMatch = false;
	}
}

// shifts down any cleared buttons
function dropCleared(row) {
	// if row is not given find a row
	if (row == null) {
		// finds first row with cleared button
		row = checkForCleared();
	}
	// while row is in grid drop cleared buttons
	if (row < xSize) {
		// still dropping cleared buttons
		dropping = true;
		// drop cleared buttons in row before going to next row
		setTimeout(function() {
			// if clear button was dropped check next row
			if (dropClearedRow(row)) {
				row++;
				dropCleared(row);
			// else stop dropping
			} else {
				dropping = false;
				checkWinCondition();
			}
		}, interval/4);
	// else no longer dropping cleared buttons
	} else {
		dropping = false;
	}
}

// helper function: finds row with cleared button
function checkForCleared() {
	// only runs if a drop isn't alreay occuring
	if (!dropping) {
		for (x = 0 ; x < xSize ; x++) {
			for (y = 0 ; y < ySize ; y++) {
				if (getButtonColor(x, y) == clearedButtonColor) {
					// returns the row with cleared button
					return x;
				}
			}
		}
		// returns row outside of grid if no cleared buttons found
		return xSize + 1;
	}
}

// helper function: checks row for cleared buttons to shift down
function dropClearedRow(row) {
	let clearButtonDropped = false;
	// loops through all buttons in row
	for (y = 0 ; y < ySize ; y++) {
		// if button is cleared
		if (getButtonColor(row, y) == clearedButtonColor) {
			// shift down
			for (x = row ; x > 0 ; x--) {
				setButtonColor(x, y, getButtonColor(x - 1, y));
				setButtonText(x, y, getButtonText(x - 1, y));	
			}
			setButtonColor(0, y, getRandomColor());
			setButtonText(0, y, "")
			clearButtonDropped = true;
		}
	}
	return clearButtonDropped;
}

// helper functions: returns amount of same-color buttons

function checkMatch(x, y, lastx, lasty) {
	let match = 0;
	// gets color being swapped to (x, y)
	let color = getButtonColor(lastx, lasty);
	let verticalCount = checkVertical(x, y, lastx, color);
	let horizontalCount = checkHorizontal(x, y, lasty, color);
	// if vertical meets match condition
	if (verticalCount >= matchCondition) {
		match += verticalCount;
	}
	// if horizontal meets match condition
	if (horizontalCount >= matchCondition) {
		match += horizontalCount;
	}
	if (match >= matchCondition) {
		return match;
	}
	return 0;
}

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

function checkAbove(x, y, color) {
	let aboveCount = 0;
	// while buttons above are same color
	for (i = x ; i > 0 ; i--) {
		if (getButtonColor(i - 1, y) == color
			|| getButtonText(i - 1, y) == color
		) {
			aboveCount++;
		} else break;
	}
	return aboveCount;
}

function checkBelow(x, y, color) {
	let belowCount = 0;
	// while buttons below are same color
	for (i = x ; i < xSize - 1 ; i++) {
		if (getButtonColor(i + 1, y) == color
			|| getButtonText(i + 1, y) == color
		) {
			belowCount++;
		} else break;
	}
	return belowCount;
}

function checkLeft(x, y, color) {
	let leftCount = 0;
	// while buttons to left are same color
	for (i = y ; i > 0 ; i--) {
		if (getButtonColor(x, i - 1) == color
			|| getButtonText(x, i - 1) == color
		) {
			leftCount++;
		} else break;
	}
	return leftCount;
}

function checkRight(x, y, color) {
	let rightCount = 0;
	// while buttons to right are same color
	for (i = y ; i < ySize - 1 ; i++) {
		if (getButtonColor(x, i + 1) == color
			|| getButtonText(x, i + 1) == color
		) {
			rightCount++;
		} else break;
	}
	return rightCount;
}

// helper functions: sets button color to clearedButtonColor

function clearMatch(x, y, lastx, lasty, color) {
	let clearVertical = false;
	let clearHorizontal = false;
	if (checkVertical(x, y, lastx, color) >= matchCondition) {
		clearVertical = true;
	}
	if (checkHorizontal(x, y, lasty, color) >= matchCondition) {
		clearHorizontal = true;
	}
	if (clearVertical) {
		setTimeout(clearVerticalMatch(x, y, lastx, color), 1);
		setButtonColor(x, y, clearedButtonColor);
		setButtonText(x, y, color);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
	if (clearHorizontal) {
		setTimeout(clearHorizontalMatch(x, y, lasty, color), 1);
		setButtonColor(x, y, clearedButtonColor);
		setButtonText(x, y, color);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
}

function clearVerticalMatch(x, y, lastx, color) {
	// if x is not top row and swap direction is not down 
	if (x > 0 && x <= lastx) {
		clearAbove(x, y, color);
	}
	// if x is not bottom row and swap direction is not up 
	if (x < xSize - 1 && x >= lastx) {
		clearBelow(x, y, color);
	}
}

function clearHorizontalMatch(x, y, lasty, color) {
	// if y is not leftmost row and swap direction is not right
	if (y > 0 && y <= lasty) {
		clearLeft(x, y, color);
	}
	// if y is not rightmost row and swap direction is not left 
	if (y < ySize - 1 && y >= lasty) {
		clearRight(x, y, color);
	}
}

function clearAbove(x, y, color) {
	let clearAmount = checkAbove(x, y, color);
	for (i = 1 ; i <= clearAmount ; i++) {
		setButtonText(x - i, y, color);
		setButtonColor(x - i, y, clearedButtonColor);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
}

function clearBelow(x, y, color) {
	let clearAmount = checkBelow(x, y, color);
	for (i = 1 ; i <= clearAmount ; i++) {
		setButtonText(x + i, y, color);
		setButtonColor(x + i, y, clearedButtonColor);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
}

function clearLeft(x, y, color) {
	let clearAmount = checkLeft(x, y, color);
	for (i = 1 ; i <= clearAmount ; i++) {
		setButtonText(x, y - i, color);
		setButtonColor(x, y - i, clearedButtonColor);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
}

function clearRight(x, y, color) {
	let clearAmount = checkRight(x, y, color);
	for (i = 1 ; i <= clearAmount ; i++) {
		setButtonText(x, y + i, color);
		setButtonColor(x, y + i, clearedButtonColor);
		setProgressBar("bar", "bg-success", increaseProgress());
	}
}