const gridSize = 4;
let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCell = null;
let highlightTimeout = null;
let newRoundTimeout = null;

// Create grid dynamically
const gameGrid = document.getElementById('game-grid');
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    gameGrid.appendChild(cell);
}

// Function to start a new game round
function startGame() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    if (awaitingAnswer) return;

    const cells = document.querySelectorAll('#game-grid div');
    activeCell = cells[Math.floor(Math.random() * cells.length)];
    activeCell.classList.add('active');
    awaitingAnswer = true;

    highlightTimeout = setTimeout(() => {
        activeCell.classList.remove('active');
        activeCell = null; // deactivate cell after highlight ends
    }, 500);

    // set onclick events
    cells.forEach(cell => {
        cell.onclick = handleCellClick;
    });
}

// Function handling cell clicks
function handleCellClick(event) {
    if (!awaitingAnswer) return;

    const cell = event.target;
    awaitingAnswer = false; // prevent additional clicks

    // Immediately disable further clicks
    document.querySelectorAll('#game-grid div').forEach(c => c.onclick = null);

    clearTimeout(highlightTimeout); // Ensure highlight ends immediately after click
    if (activeCell) activeCell.classList.remove('active');

    if (cell === activeCell) {
        correctScore++;
    } else {
        incorrectScore++;
    }

    updateScores();
    activeCell = null;

    // Set next round after a short break, clearly managed timeout
    newRoundTimeout = setTimeout(startGame, 1000);
}

// Function to update scores displayed
function updateScores() {
    document.getElementById('score').textContent = correctScore;
    document.getElementById('incorrect').textContent = incorrectScore;
}

// Start the first game when page loads
startGame();
