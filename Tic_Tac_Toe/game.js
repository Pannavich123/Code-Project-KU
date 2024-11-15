const boardElement = document.getElementById('board');
const winnerElement = document.getElementById('winner');
const resetButton = document.getElementById('reset');
const playerModeButton = document.getElementById('playerMode');
const aiModeButton = document.getElementById('aiMode');
const scoreElement = document.getElementById('score');
const board = Array(9).fill(null);

let currentPlayer = 'X';
let gameOver = false;
let isVsAI = false;
let score = { X: 0, O: 0 };

// เสียงตอบสนอง
const clickSound = new Audio('click-sound.mp3');
const winSound = new Audio('win-sound.mp3');
const drawSound = new Audio('draw-sound.mp3');

// แสดงกระดาน
function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.textContent = cell;

    if (cell) {
      cellElement.classList.add('clicked');
    }

    cellElement.addEventListener('click', () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

// การคลิกที่ช่องกระดาน
function handleCellClick(index) {
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  clickSound.play(); // เล่นเสียงเมื่อคลิก

  if (checkWinner()) {
    winnerElement.textContent = `Player ${currentPlayer} Wins!`;
    score[currentPlayer] += 1;
    scoreElement.textContent = `Player X: ${score.X} | Player O: ${score.O}`;
    winSound.play(); // เล่นเสียงเมื่อผู้เล่นชนะ

    renderBoard(); // เพิ่มบรรทัดนี้เพื่ออัปเดต
    highlightWinningCells(getWinningCombination()); // ไฮไลท์ช่องที่ชนะ
    gameOver = true;
    
    return;
  }
  

  if (board.every(cell => cell)) {
    winnerElement.textContent = "It's a draw!";
    drawSound.play(); // เล่นเสียงเมื่อเสมอ
    gameOver = true;
    return;
  }

  if (isVsAI && currentPlayer === 'X') {
    currentPlayer = 'O';
    renderBoard();
    setTimeout(aiMove, 500); // AI moves after 1 second
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  renderBoard();
}

// การเดินหมากของ AI
function aiMove() {
  if (gameOver) return;

  const bestMove = findBestMove();
  board[bestMove] = 'O';

  if (checkWinner()) {
    winnerElement.textContent = "AI Wins!";
    score.O += 1;
    scoreElement.textContent = `Player X: ${score.X} | Player O: ${score.O}`;
    winSound.play(); // เล่นเสียงเมื่อ AI ชนะ
    renderBoard();
    highlightWinningCells(getWinningCombination()); // ไฮไลท์ช่องที่ชนะ
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    winnerElement.textContent = "It's a draw!";
    drawSound.play(); // เล่นเสียงเมื่อเสมอ
    gameOver = true;
    return;
  }

  currentPlayer = 'X';
  renderBoard();
}

// หา Best Move
function findBestMove() {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);
  
  // AI picks the first available move (simple AI)
  return availableMoves[0];
}

// ตรวจสอบผู้ชนะ
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.find(combination => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

// คำนวณตำแหน่งการชนะ
function getWinningCombination() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.find(combination => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

// ไฮไลท์ช่องที่ชนะ
function highlightWinningCells(combination) {
  combination.forEach(index => {
    const cells = document.querySelectorAll('.cell');
    const winningCell = cells[index];
    winningCell.classList.add('winning-cell');
  });
}

// รีเซ็ตเกม
function resetGame() {
  board.fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winnerElement.textContent = '';
  renderBoard();
}

// เลือกโหมดเล่น 2 คน
playerModeButton.addEventListener('click', () => {
  isVsAI = false;
  startGame();
});

// เลือกโหมดเล่นกับ AI
aiModeButton.addEventListener('click', () => {
  isVsAI = true;
  startGame();
});

// เริ่มเกม
function startGame() {
  board.fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winnerElement.textContent = '';
  scoreElement.textContent = `Player X: ${score.X} | Player O: ${score.O}`;
  boardElement.style.display = 'grid';
  resetButton.style.display = 'inline-block';
  renderBoard();
}

resetButton.addEventListener('click', resetGame);
