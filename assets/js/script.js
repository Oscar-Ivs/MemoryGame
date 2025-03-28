let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCell = null;
let highlightTimeout = null;
let newRoundTimeout = null;

// DOM elements
const slider = document.getElementById('grid-slider');
const grid = document.getElementById('game-grid');

// Function to update the grid layout dynamically
function updateGrid() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    const numColumns = slider.value;
    grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
    grid.innerHTML = '';

    const totalCells = numColumns * numColumns;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.dataset.index = i;
        grid.appendChild(cell);
    }

    // Reset scores and game state
    correctScore = 0;
    incorrectScore = 0;
    awaitingAnswer = false; // Explicitly reset
    updateScores();

    // Only start the game if there are cells
    if (totalCells > 0) {
        startGame();
    }
}

// Function to start a new game round
function startGame() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    if (awaitingAnswer) return;

    const cells = document.querySelectorAll('#game-grid div');
    if (cells.length === 0) return;

    // Remove previous event listeners
    cells.forEach(cell => {
        cell.onclick = null;
    });

    activeCell = cells[Math.floor(Math.random() * cells.length)];
    activeCell.classList.add('active');
    awaitingAnswer = true;

    highlightTimeout = setTimeout(() => {
        activeCell.classList.remove('active');
    }, 500);

    cells.forEach(cell => {
        cell.onclick = handleCellClick;
    });
}

// Function handling cell clicks
function handleCellClick(event) {
    if (!awaitingAnswer) return;

    const cell = event.target;
    awaitingAnswer = false;

    // Disable all cell clicks immediately
    document.querySelectorAll('#game-grid div').forEach(c => c.onclick = null);

    clearTimeout(highlightTimeout);
    if (activeCell) activeCell.classList.remove('active');

    if (cell === activeCell) {
        correctScore++;
    } else {
        incorrectScore++;
    }

    updateScores();
    activeCell = null;

    // Start next round
    newRoundTimeout = setTimeout(startGame, 1000);
}

// Function to update scores
function updateScores() {
    document.getElementById('score').textContent = correctScore;
    document.getElementById('incorrect').textContent = incorrectScore;
}

// Initialize grid and event listeners
updateGrid();
slider.addEventListener('input', updateGrid);

// Time Slider logic
let highlightDuration = 1000; // Default duration of 1s

const timeSlider = document.getElementById('time-slider');

timeSlider.Slider.addEventListener('input', () => {
    const sliderValue = parseInt(timeSlider.value);
    document.getElementById('time-value').textContent = sliderValue;
});