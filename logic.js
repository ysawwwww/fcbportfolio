//variables - are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// variables for touch input
let startX = 0;
let startY = 0;

// create function to set the game board
function setGame(){
	// initiliazes the 4x4 game board with all the tiles set to 0
	board = [
				[0, 0, 0, 0],
	        	[0, 0, 0, 0],
	        	[0, 0, 0, 0],
	        	[0, 0, 0, 0]
			];

	// losing board
	// board = [
	// 	        [32, 8, 4, 0],
	// 	        [4, 128, 64, 256],
	// 	        [8, 32, 16, 2],
	// 	        [16, 2, 256, 1024]
	//     	];

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			// create tile through creating div elements
			let tile = document.createElement("div");

			// each tile will have an id based on its row position and column position
			tile.id = r.toString() + "-" + c.toString();

			// get the number of a tile from a backend board
			let num = board[r][c];

			// use the number to update the tile's appearance through updateTile() function
			updateTile(tile, num);

			// add the created tile with id to the frontend game board container
			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}

// this is to update the appearance of the tile based on its number
function updateTile(tile, num){
	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		// this will display the number of the tile
		tile.innerText = num.toString();

		if (num <= 4096){
			tile.classList.add("x" + num.toString());
		}
		else{
			// if the num value is greater than 4096, it will use class x8192 to color the tile
			tile.classList.add("x8192")
		}
	}
}


window.onload = function(){
	setGame();
}


function handleSlide(e){ //e = event
	console.log(e.code); //prints out the key being pressed

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if (e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		checkWin();
	}, 1000);

	if(hasLost() == true){
		setTimeout(() => {
			alert("Game over! Game will restart");
			restartGame();
			alert("Click any arrow key to restart");
		}, 100)
		// setTimeout delays the execution of code inside the arrow function
	}
}

document.addEventListener("keydown", handleSlide); //event is keydown

// removes the zeroes from the row/ col
function filterZero(row){
	return row.filter(num => num != 0);
}

// merges the adjacent tiles
function slide(row) {
	row = filterZero(row);

	for (let i = 0; i < row.length - 1; i++){
		if(row[i] == row[i + 1]){ // checks if tiles are the same for merging
			row[i] *= 2; //merge - doubles the first tile to merge
			row[i + 1] = 0; //tile next to it will be set 0

			// updates score
			score += row[i];
		}
	}

	row = filterZero(row);

	// add zeroes on the back after merging
	while(row.length < columns){
		row.push(0); 
	}

	return row; //submits the updated row/ column
}

// slide left
function slideLeft(){
	for(let r = 0; r < rows; r++){
		let row = board[r];

		// for animation
		let originalRow = row.slice();

		row = slide(row); //uses the slide function to merge adjacent tiles
		board[r] = row;

		// after the merge, position and value of tile is updated, hence changing the tile id, color and tile itself
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s"; 	
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}

// slide right
function slideRight(){
	for(let r = 0; r < rows; r++){
		let row = board[r];

		// for animation (documents orig. position of tile before slide)
		let originalRow = row.slice();

		row.reverse();
		row = slide(row); //uses the slide function to merge adjacent tiles
		row.reverse();

		board[r] = row;

		// after the merge, position and value of tile is updated, hence changing the tile id, color and tile itself
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s"; 	
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
			updateTile(tile, num);
		}
	}
}


// slide up
function slideUp(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// for animation
		let originalCol = col.slice();

		col = slide(col); //uses the slide function to merge adjacent tiles

		let changedIndices = [];

		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndices.push(r);
			}
		}

		// after the merge, position and value of tile is updated, hence changing the tile id, color and tile itself
		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// animation
			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s"; 	
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
			updateTile(tile, num);
		}
	}
}

// slide down
function slideDown(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// for animation
		let originalCol = col.slice();

		col.reverse();
		col = slide(col); //uses the slide function to merge adjacent tiles
		col.reverse();

		let changedIndices = [];

		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndices.push(r);
			}
		}

		// after the merge, position and value of tile is updated, hence changing the tile id, color and tile itself
		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// animation
			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s"; 	
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){
	if(hasEmptyTile() == false){
		return
	}
	// generates random tiles
	let found = false;

	while (found == false){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if (board[r][c] == 0){
			//generate new tile
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function checkWin(){
	for(let r = 0; r < rows; r++){
		for (let c = 0; c < columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192!");
				is8192Exist = true;
			}
		}
	}
}

function hasLost(){

	// another method
	// if(hasEmptyTile() == true){

	for(let r = 0; r<rows; r++){
		for (let c = 0; c < columns; c++){
			//checks if there is an empty tile
			if(board[r][c] === 0){
				return false;
			}

			const currentTile = board[r][c];

			if(
				r > 0 && board[r-1][c] === currentTile ||
				r < rows - 1 && board[r + 1][c] === currentTile ||

				c > 0 && board[r][c-1] === currentTile ||
				c < columns - 1 && board[r][c+1] === currentTile
				){

				// if we found a adjacent tile with the same value as the current tile, false, the use has not lost
				return false;
			}
		}
	}

	// no empty tile & no possible moves left
	return true;
}

function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c] = 0; 
		}
	}

	score = 0;	
	setTwo();

}

// when screen is touched, the coordinates x and y of the event is assigned
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY; 
});

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	// disables scrolling pictures
	e.preventDefault();
}, {passive: false}); //ensures preventDefault() method will work

// js is not strict with ; 

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// checks if the horizontal swipe is greater in magnitude than the vertical swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
	    // Horizontal swipe
	    if (diffX > 0) {
	        slideLeft(); // Call a function for sliding left
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideRight(); // Call a function for sliding right
	        setTwo(); // Call a function named "setTwo"
	    }
	} else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}

})