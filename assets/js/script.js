let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCells = []; //Support for multiple active cells
let highlightTimeout = null;
let newRoundTimeout = null;
let cellCount = 1; // Default cell count

// Default highlight duration
let highlightDuration = 1000; // Starts at 1s

// DOM elements
const slider = document.getElementById('grid-slider');
const grid = document.getElementById('game-grid');
const timeSlider = document.getElementById('time-slider');
const countSlider = document.getElementById('count-slider');

// Time Slider logic to update highlightDuration dynamically
timeSlider.addEventListener('input', () => {
    const sliderValue = parseInt(timeSlider.value); // Get the slider value
    document.getElementById('time-value').textContent = sliderValue; // Display the value

    // Reverse mapping: Max slider value - current slider value (e.g., 1 -> 1000ms, 10 -> 100ms)
    highlightDuration = 1100 - (sliderValue * 100); // Adjust to match desired range
});

// Cell Count Slider logic to update the number of highlighted cells
countSlider.addEventListener('input', () => {
    cellCount = parseInt(countSlider.value); // Update the cell count
    document.getElementById('theme-value').textContent = cellCount;
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
    cells.forEach(cell => cell.onclick = null);

    activeCells = []; // Reset active cells array

    // Select the desired number of unique random cells to highlight
    while (activeCells.length < cellCount) {
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        if (!activeCells.includes(randomCell)) {
            activeCells.push(randomCell);
            randomCell.classList.add('active');
        }
    }

    awaitingAnswer = true;

    highlightTimeout = setTimeout(() => {
        activeCells.forEach(cell => cell.classList.remove('active'));
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
    activeCells.forEach(cell => cell.classList.remove('active'));

    if (activeCells.includes(cell)) {
        correctScore++;
    } else {
        incorrectScore++;
    }

    updateScores();
    activeCells = [];

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