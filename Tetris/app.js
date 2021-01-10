// let functionName = function (parameter) {content}
// functionName = (parameter) => {content}
// itemArray.forEach(item => item + 2)
// ^ callback function takes parameter item and returns item + 2
// .forEach() will take each item in itemArray as a parameter and apply the callback function
// here it adds 2 to each item in the array




document.addEventListener('DOMContentLoaded',() => {
	var i;
	for(i = 0; i < 200; i++){
		var block = document.createElement("div")
		document.getElementById("maingrid").appendChild(block)
	}
	for(i = 0; i < 10; i++){
		var block = document.createElement("div")
		block.className = 'taken'
		document.getElementById("maingrid").appendChild(block)
	}
	for(i = 0; i < 16; i++){
		var block = document.createElement("div")
		document.getElementById("minigrid").appendChild(block)
		console.log(i)
	}
	const grid = document.querySelector('.grid')
	let squares = Array.from(document.querySelectorAll('.grid div'))
	const width = 10
	const scoreDisplay = document.querySelector('#score')
	const gameEnd = document.querySelector('#gameend')
	const startButton = document.querySelector('#startButton')
	let timerId
	let score = 0


	// Tetrominoes
	const iTetro = [
	[1, width + 1, 2*width + 1, 3*width + 1],
	[width, width + 1, width + 2, width + 3],
	[1, width + 1, 2*width + 1, 3*width + 1],
	[width, width + 1, width + 2, width + 3]
	]

	const oTetro = [
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1]
	]

	const tTetro = [
	[width + 1, 2*width, 2*width + 1, 2*width + 2],
	[1, width + 1, width + 2, 2*width + 1],
	[width, width + 1, width + 2, 2*width + 1],
	[1, width + 1, width, 2*width + 1]
	]

	const jTetro = [
	[1, width + 1, 2*width, 2*width + 1],
	[width, 2*width, 2*width + 1, 2*width + 2],
	[1, 2, width + 1, 2*width + 1],
	[width, width + 1, width + 2, 2*width + 2]
	]

	const lTetro = [
	[1, width + 1, 2*width + 1, 2*width + 2],
	[width, width + 1, width + 2, 2*width],
	[0, 1, width + 1, 2*width + 1],
	[width + 2, 2*width, 2*width + 1, 2*width + 2]
	]

	const sTetro = [
	[1, 2, width, width + 1],
	[0, width, width + 1, 2*width + 1],
	[1, 2, width, width + 1],
	[0, width, width + 1, 2*width + 1]
	]

	const zTetro = [
	[0, 1, width + 1, width + 2],
	[1, width, width + 1, 2*width],
	[0, 1, width + 1, width + 2],
	[1, width, width + 1, 2*width]
	]

	const tetros = [iTetro, oTetro, tTetro, jTetro, lTetro, sTetro, zTetro]
	const colours = ['cyan','yellow','magenta','blue','orange','lime','red']

	// halfway
	let currentPosition = 4
	let currentRotation = 0

	let random = Math.floor(Math.random()*tetros.length)
	let nextRandom = Math.floor(Math.random()*tetros.length)
	let colour = colours[random]
	let nextColour = colours[nextRandom]
	// current is an array of indexes for each square in the tetromino
	let current = tetros[random][currentRotation]
	let display = false


	// console.log(tetros[0][0])
	// console.log(squares[5])

	function draw() {
		current.forEach(index=>{
			squares[currentPosition + index].classList.add('tetro')
			squares[currentPosition + index].classList.add(colour)
		})
	}

	function undraw() {
		current.forEach(index=>{
			squares[currentPosition + index].classList.remove('tetro')
			squares[currentPosition + index].classList.remove(colour)
		})
	}

	function freeze() {
		// .some() returns true if any arguments are true
		// checks if next row is the 'bottom' row
		if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
			current.forEach(index=>squares[currentPosition + index].classList.add('taken'))
			random = nextRandom
			nextRandom = Math.floor(Math.random()*tetros.length)
			current = tetros[random][currentRotation]
			currentPosition = 4
			colour = colours[random]
			miniDraw()
			draw()
			addScore()
			gameOver()
			
		}
	}

	function moveDown() {
		if (!display){
			miniDraw()
			display = true
		}
		undraw()
		currentPosition += width
		draw()
		freeze()
	}


	function moveLeft() {
		undraw()
		const atLeft = current.some(index => (currentPosition + index)%width === 0)
		if(!atLeft){
			// moves position left by 1 if not at left edge
			currentPosition -=1
		}
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			// moves position right by 1 if there is a tetromino already there
			currentPosition +=1
		}
		draw()
	}

	function moveRight() {
		undraw()
		const atRight = current.some(index => (currentPosition + index)%width === width - 1)
		if(!atRight){
			// moves position left by 1 if not at left edge
			currentPosition +=1
		}
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			// moves position right by 1 if there is a tetromino already there
			currentPosition -=1
		}
		draw()
	}

	function moveDown() {
		undraw()
		currentPosition += width
		draw()
		freeze()
	}

	function rotate() {
		undraw()
		currentRotation++
		if(currentRotation == current.length){
			currentRotation = 0
		}
		// currentRotation = (currentRotation + 1)%(current.length)
		current = tetros[random][currentRotation]
		draw()
	}


	function control(arrow){
		// left
		if(arrow.keyCode === 37 || arrow.keyCode === 65){
			moveLeft()
		}
		else if(arrow.keyCode === 39 || arrow.keyCode === 68){
			moveRight()
		}
		else if(arrow.keyCode === 38 || arrow.keyCode === 87){
			rotate()
		}
		// else if(arrow.keyCode === 32){
			
		// }
		else if(arrow.keyCode === 40 || arrow.keyCode === 83){
			moveDown()
		}
	}
	// passes function 'control' to event listener on a keypress
	document.addEventListener('keyup',control)

	// timerID = setInterval(moveDown,100)


	// Mini Grid
	const mwidth = 4
	const miTetro = [1, mwidth + 1, 2*mwidth + 1, 3*mwidth + 1]
	const moTetro = [0, 1, mwidth, mwidth + 1]
	const mtTetro = [mwidth + 1, 2*mwidth, 2*mwidth + 1, 2*mwidth + 2]
	const mjTetro = [1, mwidth + 1, 2*mwidth, 2*mwidth + 1]
	const mlTetro = [1, mwidth + 1, 2*mwidth + 1, 2*mwidth + 2]
	const msTetro = [1, 2, mwidth, mwidth + 1]
	const mzTetro = [0, 1, mwidth + 1, mwidth + 2]
	const mtetros = [miTetro, moTetro, mtTetro, mjTetro, mlTetro, msTetro, mzTetro]
	const miniGrid = document.querySelector('.minigrid')
	let miniSquares = Array.from(document.querySelectorAll('.minigrid div'))
	let next = mtetros[nextRandom]
	function miniDraw() {
		next.forEach(index=>{
			miniSquares[index].classList.remove('mtetro')
			miniSquares[index].classList.remove(nextColour)
		})
		next = mtetros[nextRandom]
		nextColour = colours[nextRandom]
		next.forEach(index=>{
			miniSquares[index].classList.add('mtetro')
			miniSquares[index].classList.add(nextColour)
		})
	}

	startButton.addEventListener('click', () =>{
		// console.log('click')
		if(timerId){
			clearInterval(timerId)
			timerId = null
		}
		else {
			timerId = setInterval(moveDown,300)
			nextRandom = Math.floor(Math.random()*tetros.length)
			miniDraw()
			draw()
		}
	})



	function addScore() {
		var i
		var j
		for (i = 0; i < 199; i+=width) {
			const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
			if(row.every(index => squares[index].classList.contains('taken'))){
				score +=10
				scoreDisplay.innerHTML = score
				row.forEach(index => {
					squares[index].classList.remove('taken')
					squares[index].classList.remove('tetro')
					for (j = 0; j<colours.length; j++){
						squares[index].classList.remove(colours[j])
					}
				})
				// removes row from squares and saves it in squaresRemoved
				const squaresRemoved = squares.splice(i, width)
				// appends squares to the bottom of squaresRemoved
				squares = squaresRemoved.concat(squares)
				squares.forEach(cell => grid.appendChild(cell))

			}
		}
	}


	function gameOver() {
		if(current.some(index=> squares[currentPosition + index].classList.contains('taken'))){
			gameEnd.innerHTML = 'GAME OVER!!!'
			// scoreDisplay.innerHTML = ''
			clearInterval(timerId)
		}
	}

})



