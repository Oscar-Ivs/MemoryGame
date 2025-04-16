// animation.js

// Insert letters into #animated-title with span wrappers
const titleText = "Memory Game";
const titleContainer = document.getElementById("animated-title");
titleText.split("").forEach(char => {
  const span = document.createElement("span");
  span.textContent = char === " " ? "\u00A0" : char;
  titleContainer.appendChild(span);
});

const ball = document.getElementById("ball");
const letters = document.querySelectorAll("#animated-title span");

const animateBall = async () => {
  while (true) {
    for (const letter of letters) {
      const rect = letter.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollLeft = window.scrollX || window.pageXOffset;

      const ballX = rect.left + scrollLeft + rect.width / 2 - 10;
      const ballY = rect.top + scrollTop - 30;

      await anime({
        targets: ball,
        left: ballX + "px",
        top: ballY + "px",
        duration: 500,
        easing: "easeOutBounce"
      }).finished;

      await anime({
        targets: ball,
        translateY: [
          { value: -20, duration: 250, easing: "easeOutCubic" },
          { value: 0, duration: 250, easing: "easeInCubic" }
        ]
      }).finished;
    }
  }
};

animateBall();
