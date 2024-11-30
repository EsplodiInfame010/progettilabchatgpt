const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Imposta le dimensioni a 300x300 per renderlo più piccolo
canvas.width = 300;
canvas.height = 300;

const boxSize = 20;
let snake = [{ x: boxSize * 5, y: boxSize * 5 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let gameOver = false;
let gameLoop;

document.addEventListener("keydown", changeDirection);

function drawGame() {
    if (gameOver) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#2337C6"; // Imposta il colore del serpente a blu
    snake.forEach(part => ctx.fillRect(part.x, part.y, boxSize, boxSize));

    // Move snake
    let head = { ...snake[0] };
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "UP") head.y -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;
    if (direction === "DOWN") head.y += boxSize;

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Check for game over conditions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
        endGame();
    }
}

// Resto del codice rimane uguale

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (keyPressed === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (keyPressed === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (keyPressed === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function checkCollision(head) {
    return snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y);
}

function endGame() {
    gameOver = true;
    document.getElementById("scoreDisplay").textContent = score;
    document.getElementById("gameOverScreen").classList.remove("hidden");
    clearInterval(gameLoop);
}

function resetGame() {
    snake = [{ x: boxSize * 5, y: boxSize * 5 }];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    gameOver = false;
    document.getElementById("gameOverScreen").classList.add("hidden");
    clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, 100);
}

// Start the game loop once at the beginning
gameLoop = setInterval(drawGame, 100);
