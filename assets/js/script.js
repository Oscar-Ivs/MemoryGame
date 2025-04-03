let correctScore = 0;
let incorrectScore = 0;
let awaitingAnswer = false;
let activeCells = []; // Support for multiple active cells
let clickCount = 0; // Counter for player clicks in the current round
let highlightTimeout = null;
let newRoundTimeout = null;
let cellCount = 1; // Default cell count
let isExpertMode = false; // Advanced mode state
let highlightedOrder = []; // Stores the sequential order of highlighted cells

let highlightDuration = 1000; // Starts at 1s, default value for the time slider

// DOM elements
const slider = document.getElementById("grid-slider");
const grid = document.getElementById("game-grid");
const timeSlider = document.getElementById("time-slider");
const countSlider = document.getElementById("count-slider");
const expertCheckbox = document.getElementById("expert-mode");

// Time Slider logic to update highlightDuration dynamically
timeSlider.addEventListener("input", () => {
    const sliderValue = parseInt(timeSlider.value); // Get the slider value
    document.getElementById("time-value").textContent = sliderValue; // Display the value

    // Reverse mapping: Max slider value - current slider value (e.g., 1 -> 1000ms, 10 -> 100ms)
    highlightDuration = 1100 - sliderValue * 100;
});

// Cell Count Slider logic to update the number of highlighted cells
countSlider.addEventListener("input", () => {
    cellCount = parseInt(countSlider.value); // Update the cell count
    document.getElementById("theme-value").textContent = cellCount;

    // Enable or disable Advanced Mode checkbox based on cell count
    if (cellCount > 1) {
        expertCheckbox.disabled = false;
    } else {
        expertCheckbox.disabled = true;
        expertCheckbox.checked = false;
        isExpertMode = false;
    }
    resetGame(); // Restart the game when cell count changes
});

// Advanced Mode Checkbox Logic
expertCheckbox.addEventListener("change", () => {
    isExpertMode = expertCheckbox.checked;
    resetGame(); // Restart the game with Advanced Mode applied
});

// Function to update the grid layout dynamically
function updateGrid() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    const numColumns = slider.value;
    grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
    grid.innerHTML = "";

    const totalCells = numColumns * numColumns;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.dataset.index = i;
        grid.appendChild(cell);
    }

    awaitingAnswer = false; // Explicitly reset
    updateScores(); // Keep scores intact

    if (totalCells > 0) {
        resetGame(); // Restart the game when grid size changes
    }
}

// Function to reset the game state and start a new round
function resetGame() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    awaitingAnswer = false;
    activeCells = [];
    clickCount = 0; // Reset the click counter
    highlightedOrder = []; // Reset highlighted order for advanced mode
    const cells = document.querySelectorAll("#game-grid div");
    cells.forEach((cell) => {
        cell.onclick = null; // Remove event listeners
        cell.classList.remove("active"); // Ensure no stuck active state
    });
    startGame();
}

// Function to start a new game round
function startGame() {
    clearTimeout(highlightTimeout);
    clearTimeout(newRoundTimeout);

    if (awaitingAnswer) return;

    const cells = document.querySelectorAll("#game-grid div");
    if (cells.length === 0) return;

    // Remove previous event listeners
    cells.forEach((cell) => {
        cell.onclick = null; // Remove old event listeners
        cell.classList.remove("active"); // Ensure all cells are reset
    });

    activeCells = []; // Reset active cells array
    clickCount = 0; // Reset the click counter for the new round
    highlightedOrder = []; // Reset the highlighted order for advanced mode

    // Select the desired number of unique random cells to highlight
    while (activeCells.length < cellCount) {
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        if (!activeCells.includes(randomCell)) {
            activeCells.push(randomCell);
        }
    }
// Expert Mode: Highlight cells in a sequential order
    if (isExpertMode) {
        // Highlight cells one by one in sequence
        let index = 0;
        const highlightNextCell = () => {
            if (index < activeCells.length) {
                const cell = activeCells[index];
                highlightedOrder.push(cell); // Track the order
                cell.classList.add('active');
                setTimeout(() => cell.classList.remove('active'), highlightDuration); // Remove highlight after duration
                index++;
                setTimeout(highlightNextCell, highlightDuration); // Schedule the next cell highlight
            } else {
                // After highlighting, enable user interaction
                awaitingAnswer = true;
                cells.forEach(cell => {
                    cell.onclick = handleCellClick; // Attach event listeners for the current round
                });
            }
        };
        // Start highlighting cells in sequence
        highlightNextCell();
    } else {
        // Standard mode: Highlight all cells at once
        activeCells.forEach(cell => {
            cell.classList.add('active');
        });

        highlightTimeout = setTimeout(() => {
            activeCells.forEach(cell => cell.classList.remove('active'));
            awaitingAnswer = true;
            cells.forEach(cell => {
                cell.onclick = handleCellClick;
            });
        }, highlightDuration);
    }
}

// Function handling cell clicks
function handleCellClick(event) {
    if (!awaitingAnswer) return;

    const cell = event.target;

    // Ignore clicks beyond the required number
    if (clickCount >= cellCount) return;

    clickCount++; // Increment the click counter

    if (isExpertMode) {
        // Check if the clicked cell is in the correct order
        if (cell === highlightedOrder[clickCount - 1]) {
            correctScore++; // Increment score for correct click
        } else {
            incorrectScore++; // Increment score for incorrect click
        }
    } else {
        // Standard mode: Check if the clicked cell is correct
        if (activeCells.includes(cell)) {
            activeCells = activeCells.filter(activeCell => activeCell !== cell);
            correctScore++;
        } else {
            incorrectScore++;
        }
    }

    updateScores();

    // If all active cells have been clicked
    if (clickCount === cellCount) {
        awaitingAnswer = false; // Reset awaitingAnswer flag
        document.querySelectorAll("#game-grid div").forEach(c => c.onclick = null);

        clearTimeout(highlightTimeout); // Clear highlight timeout
        newRoundTimeout = setTimeout(startGame, highlightDuration); // Start a new round
    }
}

// Function to update scores
function updateScores() {
    document.getElementById("score").textContent = correctScore;
    document.getElementById("incorrect").textContent = incorrectScore;
}

// Initialize grid and event listeners
updateGrid();
slider.addEventListener("input", updateGrid);

// Set correct Expert Mode checkbox initial state
if (cellCount <= 1) {
    expertCheckbox.disabled = true;
    expertCheckbox.checked = false;
    isExpertMode = false;
} else {
    expertCheckbox.disabled = false;
}
