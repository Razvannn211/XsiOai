const difSelect = document.getElementById("dificulty");
const startBtn = document.getElementById("startBtn");
const mesaj = document.getElementById("mesaj");
const cells = document.querySelectorAll("button[data-cell]");

let gameStarted = false;
let player = "X";
let ai = "O";
let turn = 0;
let board = Array(9).fill("");
let dif = 0;

// 🔹 start joc
startBtn.addEventListener("click", () => {
  const difStr = difSelect.value;
  switch (difStr) {
    case "greu":
      dif = 100;
      break;
    case "mediu":
      dif = 10;
      break;
    case "usor":
      dif = 3;
      break;
    default:
      mesaj.style.color = "red";
      mesaj.textContent = "Alege o dificultate!";
      return;
  }

  gameStarted = true;
  turn = 0;
  board.fill("");
  cells.forEach(c => (c.textContent = ""));
  mesaj.style.color = "white";
  mesaj.textContent = "Jocul a început!";
});

// 🔹 mutarea jucătorului
cells.forEach(cell => {
  cell.addEventListener("click", e => {
    if (!gameStarted) return;
    const idx = e.target.dataset.cell;
    if (board[idx] !== "") return;

    board[idx] = player;
    e.target.textContent = player;
    e.target.style.color = "#aa3636";
    if (checkWin(player)) {
      mesaj.style.color = "green";
      mesaj.textContent = "Ai câștigat! ";
      gameStarted = false;
      return;
    }

    if (isFull()) {
      mesaj.style.color = "white";
      mesaj.textContent = "Remiză!";
      gameStarted = false;
      return;
    }

    // mutarea AI
    setTimeout(aiMove, 300);
  });
});

// 🔹 funcții joc
function aiMove() {
  const randomWeak = Math.floor(Math.random() * dif);
  let move;
  if (randomWeak !== 0) {
    move = bestMove(); // AI inteligent
  } else {
    move = randomMove(); // AI slab
  }

  board[move] = ai;
  cells[move].textContent = ai;
  cells[move].style.color = "#3672aa";

  if (checkWin(ai)) {
    mesaj.style.color = "red";
    mesaj.textContent = "AI a câștigat! ";
    gameStarted = false;
    return;
  }

  if (isFull()) {
    mesaj.style.color = "white";
    mesaj.textContent = "Remiză!";
    gameStarted = false;
  }
}

// 🔹 mutare aleatorie (mod slab)
function randomMove() {
  const available = board
    .map((v, i) => (v === "" ? i : null))
    .filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

// 🔹 AI cu Minimax
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMax) {
  if (checkWin(ai)) return 10 - depth;
  if (checkWin(player)) return depth - 10;
  if (isFull()) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = player;
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

// 🔹 funcții auxiliare
function checkWin(sym) {
  const w = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return w.some(([a, b, c]) => board[a] === sym && board[b] === sym && board[c] === sym);
}

function isFull() {
  return board.every(cell => cell !== "");
}
