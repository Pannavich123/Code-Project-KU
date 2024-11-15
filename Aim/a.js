const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

let targetX = Math.random() * canvas.width;
let targetY = Math.random() * canvas.height;
let targetRadius = 50; // ขนาดเป้าหมาย
let score = 0;
let timeLeft = 60; // เวลาหนึ่งนาที
let gameInterval;
let timerInterval;

function startGame() {
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time: ${timeLeft}s`;

    // เริ่มการเรียกเกมลูป
    gameInterval = requestAnimationFrame(gameLoop);

    // เริ่มการจับเวลา
    timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time: ${timeLeft}s`;
    targetX = Math.random() * canvas.width;
    targetY = Math.random() * canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateTimer() {
    timeLeft--;
    timerElement.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval); // หยุดการจับเวลา
        cancelAnimationFrame(gameInterval); // หยุดการเล่นเกม
        alert('Game Over! Your score: ' + score);
    }
}

function generateTarget() {
    // สุ่มตำแหน่งของเป้าใหม่ โดยให้ห่างจากขอบแคนวาส 50px
    targetX = Math.random() * (canvas.width - 2 * targetRadius) + targetRadius;
    targetY = Math.random() * (canvas.height - 2 * targetRadius) + targetRadius;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // แสดงคะแนน
    scoreElement.textContent = `Score: ${score}`;

    // วาดเป้าหมาย
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // ตรวจจับการคลิกบนเป้า
    canvas.addEventListener('click', function(event) {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;

        const dist = Math.sqrt(Math.pow(mouseX - targetX, 2) + Math.pow(mouseY - targetY, 2));
        if (dist < targetRadius) {
            score++;
            generateTarget(); // สุ่มตำแหน่งของเป้าใหม่
        }
    });

    // วนลูปเกม
    gameInterval = requestAnimationFrame(gameLoop);
}
