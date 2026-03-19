const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");

const tileSize = 20;
const tilesCount = canvas.width / tileSize;

let snake;
let direction;
let nextDirection;
let food;
let score;
let gameLoopId;
let speedMs;

function resetGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = "right";
  nextDirection = "right";
  score = 0;
  speedMs = 140;
  scoreEl.textContent = score.toString();
  placeFood();

  if (gameLoopId) {
    clearInterval(gameLoopId);
  }
  gameLoopId = setInterval(tick, speedMs);
}

function placeFood() {
  while (true) {
    const x = Math.floor(Math.random() * tilesCount);
    const y = Math.floor(Math.random() * tilesCount);
    const onSnake = snake.some((part) => part.x === x && part.y === y);
    if (!onSnake) {
      food = { x, y };
      break;
    }
  }
}

function tick() {
  direction = nextDirection;

  const head = { ...snake[0] };
  if (direction === "right") head.x += 1;
  if (direction === "left") head.x -= 1;
  if (direction === "up") head.y -= 1;
  if (direction === "down") head.y += 1;

  if (
    head.x < 0 ||
    head.x >= tilesCount ||
    head.y < 0 ||
    head.y >= tilesCount
  ) {
    endGame();
    return;
  }

  if (snake.some((part) => part.x === head.x && part.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = score.toString();

    if (speedMs > 70 && score % 3 === 0) {
      speedMs -= 10;
      clearInterval(gameLoopId);
      gameLoopId = setInterval(tick, speedMs);
    }

    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(
    food.x * tileSize,
    food.y * tileSize,
    tileSize,
    tileSize
  );

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(
      snake[i].x * tileSize,
      snake[i].y * tileSize,
      tileSize - 1,
      tileSize - 1
    );
  }
}

function endGame() {
  clearInterval(gameLoopId);
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Игра окончена", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `Счёт: ${score}. Нажмите «Играть снова».`,
    canvas.width / 2,
    canvas.height / 2 + 20
  );
}

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "ArrowUp" && direction !== "down") nextDirection = "up";
  if (key === "ArrowDown" && direction !== "up") nextDirection = "down";
  if (key === "ArrowLeft" && direction !== "right") nextDirection = "left";
  if (key === "ArrowRight" && direction !== "left") nextDirection = "right";
});

restartBtn.addEventListener("click", resetGame);

resetGame();

