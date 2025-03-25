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
