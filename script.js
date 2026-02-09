const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("gameStatus");
const playerXLabel = document.getElementById("playerX");
const playerOLabel = document.getElementById("playerO");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const computerBtn = document.getElementById("computerBtn");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let gameMode = "TWO_PLAYER";

const winningPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleCellClick));

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive) return;

  makeMove(index, currentPlayer);
  if (checkResult()) return;

  switchPlayer();

  if (gameMode === "COMPUTER" && currentPlayer === "O") {
    gameStatus.textContent = "Computer is thinking...";
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add("disabled");
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function updateStatus() {
  if (gameMode === "TWO_PLAYER") {
    gameStatus.textContent =
      currentPlayer === "X"
        ? "User A's turn (X)"
        : "User B's turn (O)";
  } else {
    gameStatus.textContent =
      currentPlayer === "X"
        ? "Player's turn (X)"
        : "Computer's turn (O)";
  }
}

function checkResult() {
  for (let [a,b,c] of winningPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      gameStatus.textContent =
        gameMode === "TWO_PLAYER"
          ? board[a] === "X" ? "User A Wins!" : "User B Wins!"
          : board[a] === "X" ? "Player Wins!" : "Computer Wins!";
      return true;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    gameStatus.textContent = "It's a Draw!";
    return true;
  }
  return false;
}

function computerMove() {
  if (!gameActive) return;

  // 1. Try to win
  let move = findBestMove("O");
  if (move !== null) {
    makeMove(move, "O");
    if (!checkResult()) switchPlayer();
    return;
  }

  // 2. Block player
  move = findBestMove("X");
  if (move !== null) {
    makeMove(move, "O");
    if (!checkResult()) switchPlayer();
    return;
  }

  // 3. Take center
  if (board[4] === "") {
    makeMove(4, "O");
    if (!checkResult()) switchPlayer();
    return;
  }

  // 4. Take corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === "");
  if (corners.length > 0) {
    makeMove(corners[Math.floor(Math.random() * corners.length)], "O");
    if (!checkResult()) switchPlayer();
    return;
  }

  // 5. Take sides
  const sides = [1, 3, 5, 7].filter(i => board[i] === "");
  if (sides.length > 0) {
    makeMove(sides[Math.floor(Math.random() * sides.length)], "O");
    if (!checkResult()) switchPlayer();
  }
}
function findBestMove(player) {
  for (let pattern of winningPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];

    if (
      values.filter(v => v === player).length === 2 &&
      values.includes("")
    ) {
      return [a, b, c][values.indexOf("")];
    }
  }
  return null;
}


twoPlayerBtn.onclick = () => {
  gameMode = "TWO_PLAYER";
  resetGame();
  twoPlayerBtn.classList.add("active");
  computerBtn.classList.remove("active");
  playerXLabel.textContent = "X → User A";
  playerOLabel.textContent = "O → User B";
};

computerBtn.onclick = () => {
  gameMode = "COMPUTER";
  resetGame();
  computerBtn.classList.add("active");
  twoPlayerBtn.classList.remove("active");
  playerXLabel.textContent = "X → Player";
  playerOLabel.textContent = "O → Computer";
};

function resetGame() {
  board.fill("");
  gameActive = true;
  currentPlayer = "X";
  cells.forEach(c => {
    c.textContent = "";
    c.classList.remove("disabled");
  });
  updateStatus();
}

resetBtn.onclick = resetGame;
