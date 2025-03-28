const gridSize = 4;
let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCell = null;
let highlightTimeout = null;
let newRoundTimeout = null;

// Grid slider logic
const slider = document.getElementById('grid-slider');
const grid = document.getElementById('game-grid');

function updateGrid() {
    const numColumns = slider.value;
    grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`; // Dynamically updates the columns
    grid.innerHTML = ''; // Clear the existing cells

    // Calculate total number of cells (assume a square grid)
    const totalCells = numColumns * numColumns;

    // Generate grid cells
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        grid.appendChild(cell);
    }
}

// Initialize the grid
updateGrid();

// Update the grid whenever the slider changes
slider.addEventListener('input', updateGrid);


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
