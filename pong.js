const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 90;
const paddleMargin = 20;
const ballRadius = 10;
const paddleColor = "#fff";
const ballColor = "#0ff";
const aiColor = "#f00";
const netColor = "#888";

// Paddle state
let leftPaddle = {
    x: paddleMargin,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: paddleColor
};

let rightPaddle = {
    x: canvas.width - paddleMargin - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: aiColor
};

// Ball state
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1),
    radius: ballRadius,
    color: ballColor
};

// Mouse movement for player paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;

    // Clamp paddle inside canvas
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height)
        leftPaddle.y = canvas.height - leftPaddle.height;
});

// Draw net
function drawNet() {
    const segmentLen = 20, gap = 15;
    for (let y = 0; y < canvas.height; y += segmentLen + gap) {
        ctx.fillStyle = netColor;
        ctx.fillRect(canvas.width / 2 - 2, y, 4, segmentLen);
    }
}

// Draw paddle
function drawPaddle(p) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
}

// Draw ball
function drawBall(b) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.closePath();
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Basic AI for right paddle
function moveAIPaddle() {
    let center = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y < center - 10) {
        rightPaddle.y -= 4;
    } else if (ball.y > center + 10) {
        rightPaddle.y += 4;
    }
    // Clamp AI paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height)
        rightPaddle.y = canvas.height - rightPaddle.height;
}

// Check collision between ball and a paddle
function collide(ball, paddle) {
    return (
        ball.x + ball.radius > paddle.x &&
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.vy *= -1;
    }

    // Paddle collision
    if (collide(ball, leftPaddle)) {
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
        ball.vx *= -1;
        // Add some 'spin'
        let impact = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
        ball.vy += impact * 3;
    }
    if (collide(ball, rightPaddle)) {
        ball.x = rightPaddle.x - ball.radius;
        ball.vx *= -1;
        let impact = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
        ball.vy += impact * 3;
    }

    // Score check: if ball goes out of bounds
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
        resetBall();
    }

    // AI movement
    moveAIPaddle();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall(ball);
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();