# Memory Game
## Project Overview
This Memory Game project offers players an engaging and customizable memory challenge designed to test and enhance cognitive skills through interactive gameplay. Players can dynamically adjust the game's complexity through intuitive controls, tailoring their experience to their individual skill levels.

### Key Features:

Dynamic Grid Size: Adjust the grid size from a simple 4x4 layout up to a challenging 15x15 grid.

Highlighting Speed Control: Personalize reaction challenges by setting how long each cell remains highlighted, ranging from 100ms to 1 second.

Multiple Highlighted Cells: Increase complexity by selecting up to four cells highlighted per round.

Expert Mode: For advanced players, activate sequential highlights, requiring memorization of both cell locations and the order in which they're highlighted.

Score Tracking: Clearly monitor your correct and incorrect responses to gauge your improvement.

Responsive Design: Enjoy smooth gameplay across devices (desktop, tablet, mobile) thanks to intuitive, Bootstrap-powered responsive design.

Game Instructions: Easily accessible, clear instructions guide new players through gameplay and customization options.

This Memory Game combines simplicity with flexibility, ensuring it’s accessible for beginners while still providing challenging gameplay for advanced players.
# User Stories

## User Story 1: Dynamic Grid Size Adjustment (Must-Have)
**As a Player, I want to dynamically adjust the game grid size from 4x4 to 20x20, enabling me to customize the complexity based on my preference and skill level.**

### Acceptance Criteria
- The default grid size is 4x4.
- Players can adjust grid size using a clear slider control.
- Grid adjusts immediately and smoothly upon changing slider values.

### Tasks
- Implement a responsive grid using JavaScript and CSS.
- Integrate an interactive slider component to control grid dimensions.
- Ensure grid dynamically regenerates based on the slider input.

---

## User Story 2: Adjustable Highlighting Speed (Should-Have)
**As a Player, I want to control how long each cell remains highlighted, ranging from 100ms to 1 second, to personalize the game's difficulty and my reaction challenge.**

### Acceptance Criteria
- Default highlighting duration is 500ms.
- Highlight duration adjustable via slider clearly labelled with values.
- Highlight changes take immediate effect when slider adjustments are made.

### Tasks
- Implement slider input to control highlight duration.
- Connect slider value directly to JavaScript highlighting logic.
- Ensure smooth transition and immediate feedback.

---

## User Story 3: Number of Highlighted Cells Control (Must-Have)
**As a Player, I want the ability to select how many cells (1 to 4) are highlighted per round, increasing the complexity and enhancing replayability.**

### Acceptance Criteria
- Default highlighted cell number is 1.
- Player can increase highlighted cells up to 4 using a slider.
- Selected number of highlighted cells accurately reflects in-game.

### Tasks
- Implement slider component to select highlighted cell count.
- Update game logic to highlight the selected number of cells each round.

---

## User Story 4: Expert Mode with Sequential Highlights (Could-Have)
**As an Advanced Player, I want to activate an "Expert Mode," where highlighted cells appear sequentially (rather than simultaneously), challenging me to memorize not just the cells but also the order of highlights.**

### Acceptance Criteria
- "Expert Mode" option becomes available when multiple highlighted cells are selected.
- Highlighted cells appear sequentially with clear timing intervals.
- Players must correctly recall both cells and highlight order.

### Tasks
- Design and implement "Expert Mode" toggle switch in UI.
- Update highlighting logic for sequential highlighting.
- Create input mechanism to check both cell and order accuracy.

---

## User Story 5: Score Tracking (Must-Have)
**As a Player, I want my correct and incorrect responses clearly tracked and displayed, so I can monitor my progress and performance during the game.**

### Acceptance Criteria
- Correct and incorrect scores displayed prominently.
- Scores update accurately and immediately after each interaction.

### Tasks
- Implement score tracking variables in JavaScript.
- Display scores dynamically on the game interface.

---

## User Story 6: Intuitive and Responsive Interface (Must-Have)
**As a New Player, I need a clean, intuitive, and responsive interface, ensuring smooth gameplay on various devices (desktop, tablet, mobile).**

### Acceptance Criteria
- Interface uses Bootstrap for responsiveness.
- Clearly labelled sliders and toggle switches.
- Interface adapts seamlessly to various screen sizes.

### Tasks
- Design UI layout with Bootstrap.
- Optimize responsiveness and usability across devices.

---

## User Story 7: Game Instructions and Help Section (Could-Have)
**As a New Player, I want easy access to clear instructions or a help section, guiding me on how to play and adjust the game's settings effectively.**

### Acceptance Criteria
- Instructions clearly outline gameplay rules and control adjustments.
- Easily accessible help button or section in the UI.

### Tasks
- Write clear and concise game instructions.
- Integrate help/instructions section into the game interface.

---

## 🐞 Bug Fix: Preventing Multiple Clicks and Timer Overlaps

## Issue 1
### When quickly clicking multiple cells, timers controlling cell highlighting and game rounds overlapped, causing multiple cells to highlight simultaneously and eventually freezing the game.

### 🔍 Testing & Findings
- Identified two independent `setTimeout` calls (highlight timer and new-round timer) causing timing conflicts.
- Rapid clicks triggered multiple timers, leading to overlapping highlights and inconsistent gameplay.

### ✅ Implemented Fixes
- **Managed Timers Explicitly:**  
  Introduced dedicated variables (`highlightTimeout`, `newRoundTimeout`) to clearly track and manage each timer individually.
  
- **Cleared Previous Timers:**  
  Used `clearTimeout()` before initiating new rounds or highlighting actions to eliminate conflicts from previously running timers.
  
- **Immediate Click Disabling:**  
  Disabled additional clicks immediately after the player's first interaction each round, preventing unintended behaviors until the next round properly initiates.

###  Result
The game now runs smoothly without overlapping highlights or freezes, providing a stable and consistent gameplay experience.

## Issue 2
### Game grid starts as 4x8 instead of 4x4
### ✅ Implemented Fixes
Removed
> const gridSize = 4;

Added to
>function()
  >clearTimeout(highlightTimeout);
  >clearTimeout(newRoundTimeout);

  Removed
  
  > // Update the grid whenever the slider changes
> slider.addEventListener('input', updateGrid);

Added & Updated

>  if (totalCells > 0) {
>        startGame();
>    }

#