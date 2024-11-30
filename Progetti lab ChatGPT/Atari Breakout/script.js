const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let paddleHeight = 20;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

let brickRowCount = 5;
let brickColumnCount = 8;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;
let level = 1;

let animationId; // Aggiungi questa variabile per fermare l'animazione

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#09f";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillText("Level: " + level, canvas.width / 2 - 25, 20);
}

function draw() {
    if (lives <= 0) return;  // Se il gioco è finito, non fare nulla

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();

    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvas.height - paddleHeight - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            let hitPosition = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            let angle = hitPosition * Math.PI / 4;
            ballSpeedX = 5 * Math.sin(angle);
            ballSpeedY = -5 * Math.cos(angle);
        } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
            lives--;
            if (!lives) {
                showGameOverPopup();
                cancelAnimationFrame(animationId); // Fermiamo l'animazione
            } else {
                resetBall();
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    animationId = requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 4 * level;  // Aumenta la velocità in base al livello
    ballSpeedY = -4 * level; // Aumenta la velocità in base al livello
    paddleX = (canvas.width - paddleWidth) / 2;
}

function collisionDetection() {
    let blocksDestroyed = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                const brickLeft = b.x;
                const brickRight = b.x + brickWidth;
                const brickTop = b.y;
                const brickBottom = b.y + brickHeight;
                const ballLeft = ballX - ballRadius;
                const ballRight = ballX + ballRadius;
                const ballTop = ballY - ballRadius;
                const ballBottom = ballY + ballRadius;

                if (
                    ballRight > brickLeft &&
                    ballLeft < brickRight &&
                    ballBottom > brickTop &&
                    ballTop < brickBottom
                ) {
                    if (ballX > brickLeft && ballX < brickRight) {
                        ballSpeedY = -ballSpeedY;
                    } else {
                        ballSpeedX = -ballSpeedX;
                    }

                    b.status = 0;
                    score++;
                }
            }
        }
    }

    if (score === brickRowCount * brickColumnCount * level) {
        level++;
        ballSpeedX *= 1.1;
        ballSpeedY *= 1.1;
        resetBricks();
        resetBall();
    }
}

function resetBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

function showGameOverPopup() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const popup = document.createElement('div');
    popup.style.width = '350px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#fff';
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';

    // Aggiungi il messaggio Game Over con punteggio e livello
    const message = document.createElement('p');
    message.innerHTML = `<strong>Game Over!</strong><br><br>Score: ${score}<br>Level: ${level}`;
    popup.appendChild(message);

    const retryButton = document.createElement('button');
    retryButton.innerText = 'Play Again';
    retryButton.onclick = () => {
        document.location.reload();
    };
    popup.appendChild(retryButton);

    const exitButton = document.createElement('button');
    exitButton.innerText = 'Exit';
    exitButton.onclick = () => {
        window.close();  // Chiude la finestra
    };
    exitButton.style.marginLeft = '10px';
    popup.appendChild(exitButton);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

draw(); // Avvia il gioco
function showGameOverPopup() {
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay'); // Applica la classe overlay

    const popup = document.createElement('div');
    popup.classList.add('game-over-popup'); // Applica la classe popup

    // Aggiungi il messaggio Game Over con punteggio e livello
    const message = document.createElement('h2');
    message.innerHTML = "Game Over!";
    popup.appendChild(message);

    const scoreText = document.createElement('p');
    scoreText.innerHTML = `Score: ${score}<br>Level: ${level}`;
    popup.appendChild(scoreText);

    const retryButton = document.createElement('button');
    retryButton.innerText = 'Play Again';
    retryButton.onclick = () => {
        document.location.reload();
    };
    popup.appendChild(retryButton);

    const exitButton = document.createElement('button');
    exitButton.innerText = 'Exit';
    exitButton.onclick = () => {
        window.close();  // Chiude la finestra
    };
    exitButton.style.marginTop = '10px';
    popup.appendChild(exitButton);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}
