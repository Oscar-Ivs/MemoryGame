const gridSize = 4;
let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false; // to prevent multiple clicks
let activeCell = null; // to store the active cell

// Create a grid
const gameGrid = document.getElementById('game-grid');
for (let i =0; i <gridSize * gridSize; i++) {
const cell = document.createElement('div');
cell.dataset.index = i;
gameGrid.appendChild(cell);
}

//Starting the game
function startGame() {
    if (awaitingAnswer) return; // Not possible to start a new game while waiting for the answer

    const cells = document.querySelectorAll('#game-grid div');
    let.randomIndex = Math.floor(Math.random() * cells.length);
    activeCell = cells[randomIndex];

    //Highlight the active cell for 500ms
    activeCell.classList.add('active');
    awaitingAnswer = true;

    setTimeout(() => {
        activeCell.classList.remove('active');
    } , 500);

    //Only allow one click per round
    cells.forEach(cell => {
        cell.onClick = handleCellClick;
    });
}

