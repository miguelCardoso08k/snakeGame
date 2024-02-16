const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreContainer = document.querySelector(".score");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play ");

const audio = new Audio("./audio.mp3");
const size = 30;
const startPosition = { x: 270, y: 240 };

let snake = [startPosition];

const randomNumber = (max, min) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const num = randomNumber(canvas.width - size, 0);

  return Math.round(num / 30) * 30;
};

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: "red",
};

let direction, loopId;
let countScore = 0;

const setScore = () => {
  countScore += 1;

  score.textContent = countScore;
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = "#fff";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const moveSnake = () => {
  if (!direction) {
    return;
  }
  const head = snake[snake.length - 1];

  if (direction === "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction === "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction === "up") {
    snake.push({ x: head.x, y: head.y - size });
  }
  if (direction === "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  snake.shift();
};

const checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === food.x && head.y === food.y) {
    snake.push(head);
    audio.play();
    setScore();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x === x && position.y === y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
  }
};

const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.textContent = countScore;
  canvas.style.filter = "blur(4px)";
  scoreContainer.style.display = "none";
};

const checkCollison = () => {
  const head = snake[snake.length - 1];
  const neckIndex = snake.length - 2;
  const canvasLimit = canvas.width - size;

  const wallColision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfColision = snake.find((position, index) => {
    return index < neckIndex && position.x === head.x && position.y === head.y;
  });

  if (wallColision || selfColision) {
    gameOver();
  }
};

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);

  checkCollison();
  drawGrid();
  drawSnake();
  drawFood();
  moveSnake();
  checkEat();

  loopId = setInterval(() => {
    gameLoop();
  }, 300);
};

gameLoop();

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if ((key === "arrowright" || key == "d") && direction !== "left") {
    direction = "right";
  }
  if ((key === "arrowleft" || key == "a") && direction !== "right") {
    direction = "left";
  }
  if ((key === "arrowup" || key == "w") && direction !== "down") {
    direction = "up";
  }
  if ((key === "arrowdown" || key == "s") && direction !== "up") {
    direction = "down";
  }
});

buttonPlay.addEventListener("click", () => {
  scoreContainer.style.display = "flex";
  score.textContent = "0";
  menu.style.display = "none";
  canvas.style.filter = "none";
  countScore = 0;

  snake = [startPosition];
  drawFood();
});
