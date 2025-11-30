
// chess.js – official-like chess rules vs simple robot, rating auto-update

const boardEl = document.getElementById("board");
const userIdChess = localStorage.getItem("userId");
if (!userIdChess) window.location.href = "auth.html";

const PIECES = {
  "r":"♜","n":"♞","b":"♝","q":"♛","k":"♚","p":"♟",
  "R":"♖","N":"♘","B":"♗","Q":"♕","K":"♔","P":"♙"
};

let board, turn, selected, currentRating = 1000, gameOver = false;

function startPosition() {
  board = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
  ];
  turn = "w"; // white starts (user)
  selected = null;
  gameOver = false;
}

function drawBoard() {
  boardEl.innerHTML = "";
  for (let r=0;r<8;r++) {
    for (let c=0;c<8;c++) {
      const sq = document.createElement("div");
      sq.className = "square " + ((r+c)%2===0 ? "light" : "dark");
      const piece = board[r][c];
      if (piece) {
        const span = document.createElement("span");
        span.className = "piece";
        span.textContent = PIECES[piece];
        sq.appendChild(span);
      }
      sq.onclick = () => onSquareClick(r,c);
      boardEl.appendChild(sq);
    }
  }
}

function onSquareClick(r,c) {
  if (gameOver) return;
  if (turn !== "w") return; // wait for robot
  const piece = board[r][c];

  if (!selected) {
    if (piece && isWhite(piece)) {
      selected = {r,c};
      highlight(r,c);
    }
    return;
  } else {
    const from = selected;
    const legal = legalMovesFor(from.r, from.c, "w");
    const destKey = r + "," + c;
    if (legal.some(m => m.r === r && m.c === c)) {
      // make move
      makeMove(from.r, from.c, r, c);
      selected = null;
      drawBoard();
      checkGameState().then(asyncResult => {
        if (!gameOver) {
          setTimeout(robotMove, 400);
        }
      });
    } else {
      selected = null;
      drawBoard();
    }
  }
}

function highlight(r,c) {
  drawBoard();
  const idx = r*8 + c;
  boardEl.children[idx].classList.add("selected");
}

function isWhite(p){ return p && p === p.toUpperCase(); }
function isBlack(p){ return p && p === p.toLowerCase(); }

function makeMove(fr,fc,tr,tc) {
  const piece = board[fr][fc];
  board[tr][tc] = piece;
  board[fr][fc] = "";
  // simple pawn promotion to queen when reaching last rank
  if (piece === "P" && tr === 0) board[tr][tc] = "Q";
  if (piece === "p" && tr === 7) board[tr][tc] = "q";
  turn = (turn === "w" ? "b" : "w");
}

function inside(r,c){ return r>=0 && r<8 && c>=0 && c<8; }

function legalMovesFor(r,c,side) {
  const piece = board[r][c];
  if (!piece) return [];
  const isW = isWhite(piece);
  if (side === "w" && !isW) return [];
  if (side === "b" && isW) return [];

  const moves = [];
  const dir = isW ? -1 : 1;
  const enemyCheck = isW ? isBlack : isWhite;

  switch (piece.toLowerCase()) {
    case "p":
      // one step forward
      const nr1 = r + dir;
      if (inside(nr1,c) && !board[nr1][c]) {
        moves.push({r:nr1,c});
        // two steps from base rank
        const startRank = isW ? 6 : 1;
        const nr2 = r + 2*dir;
        if (r === startRank && !board[nr2][c]) {
          moves.push({r:nr2,c});
        }
      }
      // captures
      [-1,1].forEach(dc => {
        const nr = r + dir;
        const nc = c + dc;
        if (inside(nr,nc) && board[nr][nc] && enemyCheck(board[nr][nc])) {
          moves.push({r:nr,c:nc});
        }
      });
      break;

    case "n":
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
        const nr = r+dr, nc=c+dc;
        if (!inside(nr,nc)) return;
        const target = board[nr][nc];
        if (!target || enemyCheck(target)) moves.push({r:nr,c:nc});
      });
      break;

    case "b":
    case "r":
    case "q":
      const dirs = [];
      if (piece.toLowerCase() !== "r") {
        dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); // diagonals
      }
      if (piece.toLowerCase() !== "b") {
        dirs.push([-1,0],[1,0],[0,-1],[0,1]); // straight
      }
      dirs.forEach(([dr,dc])=>{
        let nr=r+dr, nc=c+dc;
        while (inside(nr,nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({r:nr,c:nc});
          } else {
            if (enemyCheck(target)) moves.push({r:nr,c:nc});
            break;
          }
          nr+=dr; nc+=dc;
        }
      });
      break;

    case "k":
      for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) {
          if (!dr && !dc) continue;
          const nr=r+dr, nc=c+dc;
          if (!inside(nr,nc)) continue;
          const t = board[nr][nc];
          if (!t || enemyCheck(t)) moves.push({r:nr,c:nc});
        }
      }
      break;
  }
  return moves;
}

// basic robot: choose random legal move for black
function robotMove() {
  if (gameOver) return;
  turn = "b";
  const moves = [];
  for (let r=0;r<8;r++) {
    for (let c=0;c<8;c++) {
      const p = board[r][c];
      if (p && isBlack(p)) {
        const ms = legalMovesFor(r,c,"b");
        ms.forEach(m => moves.push({fr:r,fc:c,tr:m.r,tc:m.c}));
      }
    }
  }
  if (moves.length === 0) {
    // no moves: treat as loss for black, win for user
    endGame("win");
    return;
  }
  const mv = moves[Math.floor(Math.random()*moves.length)];
  makeMove(mv.fr,mv.fc,mv.tr,mv.tc);
  drawBoard();
  checkGameState();
}

async function checkGameState() {
  // simple: if a king is missing, game over
  let whiteKing=false, blackKing=false;
  for (let r=0;r<8;r++) {
    for (let c=0;c<8;c++) {
      if (board[r][c]==="K") whiteKing=true;
      if (board[r][c]==="k") blackKing=true;
    }
  }
  if (!whiteKing && !blackKing) {
    await endGame("draw");
  } else if (!whiteKing) {
    await endGame("lose");
  } else if (!blackKing) {
    await endGame("win");
  } else {
    turn = "w";
  }
}

async function endGame(result) {
  if (gameOver) return;
  gameOver = true;
  let delta = 0;
  if (result === "win") delta = 20;
  else if (result === "lose") delta = -20;
  else if (result === "draw") delta = 5;

  const newRating = Math.max(100, currentRating + delta);
  try {
    await db.collection("users").doc(userIdChess).update({rating:newRating});
    currentRating = newRating;
    document.getElementById("status").innerText =
      `Game over: ${result.toUpperCase()}. Rating now ${currentRating}.`;
  } catch (e) {
    console.error(e);
  }
}

async function quitGame() {
  if (gameOver) return;
  const newRating = Math.max(100, currentRating - 15);
  try {
    await db.collection("users").doc(userIdChess).update({rating:newRating});
    currentRating = newRating;
    document.getElementById("status").innerText =
      `You quit the game. -15 rating penalty. Rating now ${currentRating}.`;
    gameOver = true;
  } catch (e) {
    console.error(e);
  }
}

function newGame() {
  startPosition();
  document.getElementById("status").innerText =
    "New game started. You play White.";
  drawBoard();
}

async function loadUserChess() {
  const doc = await db.collection("users").doc(userIdChess).get();
  if (doc.exists) {
    const u = doc.data();
    currentRating = u.rating || 1000;
    document.getElementById("robotUser").innerText =
      `${u.fullName} (@${u.username}) • Rating: ${currentRating}`;
  }
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

startPosition();
drawBoard();
loadUserChess();
