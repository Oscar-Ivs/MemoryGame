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
const expertSlider = document.getElementById("expert-slider");
const expertValue = document.getElementById("expert-value");

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

    // Enable or disable Expert Mode slider based on cell count
    if (cellCount > 1) {
        expertSlider.disabled = false; // Enable Expert Mode slider
    } else {
        expertSlider.disabled = true; // Disable Expert Mode slider
        expertSlider.value = "0"; // Reset Expert Mode slider to OFF
        updateExpertMode("0"); // Update display to OFF
    }

    resetGame(); // Restart the game when cell count changes
});

// Initialize Expert Mode slider state on load
if (cellCount <= 1) {
    expertSlider.disabled = true; // Ensure it starts disabled if cell count is 1
    expertSlider.value = "0";
    updateExpertMode("0");
}

// Expert Mode Slider logic
function updateExpertMode(value) {
    if (value === "1") {
        isExpertMode = true; // Enable Expert Mode
        expertValue.textContent = "ON"; // Update display
    } else {
        isExpertMode = false; // Disable Expert Mode
        expertValue.textContent = "OFF"; // Update display
    }
}

// Add listener to the expert mode slider (TOGGLE ON ANY CLICK)
expertSlider.addEventListener("click", () => {
    if (cellCount > 1) { // Only allow toggling when Cell Count > 1
        // Toggle between "0" and "1"
        expertSlider.value = expertSlider.value === "0" ? "1" : "0";
        updateExpertMode(expertSlider.value); // Update the expert mode status
    }
});

// Ensure slider starts at OFF when the game loads
expertSlider.value = "0";
updateExpertMode("0");

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

    // Enable clicks immediately
    awaitingAnswer = true;

    // Attach event listeners immediately to allow clicks during highlighting
    cells.forEach((cell) => {
        cell.onclick = handleCellClick; // Attach event listeners for the current round
    });

    // Expert Mode: Highlight cells in a sequential order
    if (isExpertMode && cellCount > 1) {
        let index = 0;
        const highlightCellsSequentially = () => {
            if (index < activeCells.length) {
                const cell = activeCells[index];
                highlightedOrder.push(cell); // Track the order
                cell.classList.add("active");
                setTimeout(() => cell.classList.remove("active"), highlightDuration); // Remove highlight after duration
                index++;
                setTimeout(highlightCellsSequentially, highlightDuration); // Schedule the next cell highlight
            }
        };
        highlightCellsSequentially();
    } else {
       // Standard mode: Highlight all cells at once
        activeCells.forEach((cell) => {
            cell.classList.add("active");
        });

        highlightTimeout = setTimeout(() => {
            activeCells.forEach((cell) => cell.classList.remove("active"));
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

// New game button logic
const newGameButton = document.getElementById("new-game-button");
newGameButton.addEventListener("click", () => {
    correctScore = 0;
    incorrectScore = 0;
    updateScores(); // Reset scores on new game
    resetGame(); // Start a new game
});

// Initialize grid and event listeners
updateGrid();
slider.addEventListener("input", updateGrid);
