let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCell = []; //Support for multiple active cells
let highlightTimeout = null;
let newRoundTimeout = null;
let cellCount = 1; // Default cell count

// Default highlight duration
let highlightDuration = 1000; // Starts at 1s

// DOM elements
const slider = document.getElementById('grid-slider');
const grid = document.getElementById('game-grid');
const timeSlider = document.getElementById('time-slider');

// Time Slider logic to update highlightDuration dynamically
timeSlider.addEventListener('input', () => {
    const sliderValue = parseInt(timeSlider.value); // Get the slider value
    document.getElementById('time-value').textContent = sliderValue; // Display the value

    // Reverse mapping: Max slider value - current slider value (e.g., 1 -> 1000ms, 10 -> 100ms)
    highlightDuration = 1100 - (sliderValue * 100); // Adjust to match desired range
});

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

    correctScore = 0;
    incorrectScore = 0;
    awaitingAnswer = false; // Explicitly reset
    updateScores();

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
    }, highlightDuration); // Use dynamic highlightDuration

    cells.forEach(cell => {
        cell.onclick = handleCellClick;
    });
}

// Function handling cell clicks
function handleCellClick(event) {
    if (!awaitingAnswer) return;

    const cell = event.target;
    awaitingAnswer = false;

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

    newRoundTimeout = setTimeout(startGame, highlightDuration); // Use dynamic highlightDuration
}

// Function to update scores
function updateScores() {
    document.getElementById('score').textContent = correctScore;
    document.getElementById('incorrect').textContent = incorrectScore;
}

// Initialize grid and event listeners
updateGrid();
slider.addEventListener('input', updateGrid);