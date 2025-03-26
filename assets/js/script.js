const gridSize = 4;
let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false; // to prevent multiple clicks
let activeCell = null; // to store the active cell

// Create grid dynamically
const gameGrid = document.getElementById('game-grid');
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    gameGrid.appendChild(cell);
}

// Starting the game
function startGame() {
    if (awaitingAnswer) return; // Not possible to start a new game while waiting for the answer

    const cells = document.querySelectorAll('#game-grid div');
    let randomIndex = Math.floor(Math.random() * cells.length);
    activeCell = cells[randomIndex];

    // Highlight the active cell for 500ms
    activeCell.classList.add('active');
    awaitingAnswer = true;

    setTimeout(() => {
        activeCell.classList.remove('active');
    }, 500);

        // Only allow one click per round
        cells.forEach(cell => {
            cell.onclick = handleCellClick;
        });
    }
    
    //Handling the cell clicks
    function handleCellClick(event) {
        const cell = event.target;
        if (!awaitingAnswer || !activeCell) return; // Ignore the click if the game is not active
    
        if (cell === activeCell) {
            correctScore++;
        } else {
            incorrectScore++;
        }
        updateScores();
        awaitingAnswer = false; // Allow the game to continue
        activeCell = null; // Reset active cell
        setTimeout(startGame, 1000); // Start a new round after 1s
}

// Update the scores on the screen
function updateScores() {
    document.getElementById('score').textContent = correctScore;
    document.getElementById('incorrect').textContent = incorrectScore;
}

// Start the game when the page loads
startGame();
