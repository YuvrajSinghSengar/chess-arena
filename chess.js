// chess.js
// Simple playable chess vs a basic robot (random legal moves).
// This is a custom lightweight engine: not full FIDE rules, but good enough for a mini-project demo.

let userId = localStorage.getItem("userId");
if (!userId) window.location.href = "auth.html";

let chessUserData = null;

// Load user + rating
async function loadChessUser() {
    const doc = await db.collection("users").doc(userId).get();
    if (!doc.exists) {
        alert("User not found. Please log in again.");
        localStorage.clear();
        window.location.href = "auth.html";
        return;
    }
    chessUserData = doc.data();
    updateChessHeader();
}
function updateChessHeader() {
    if (!chessUserData) return;
    document.getElementById("chessUser").innerText =
        `${chessUserData.fullName} (@${chessUserData.username}) • Rating: ${chessUserData.rating || 1000}`;
}
loadChessUser();

const boardEl = document.getElementById("board");

// Board representation: 8x8 array of strings or null
// wP, wR, wN, wB, wQ, wK, same for black (bP, ...)

let board = [];
let currentTurn = "w"; // w = white (user), b = black (robot)
let selectedSquare = null;
let gameOver = false;

function initBoard() {
    board = [
        ["bR","bN","bB","bQ","bK","bB","bN","bR"],
        ["bP","bP","bP","bP","bP","bP","bP","bP"],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ["wP","wP","wP","wP","wP","wP","wP","wP"],
        ["wR","wN","wB","wQ","wK","wB","wN","wR"]
    ];
    currentTurn = "w";
    selectedSquare = null;
    gameOver = false;
}

function drawBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement("div");
            sq.classList.add("square");
            const isLight = (r + c) % 2 === 0;
            sq.classList.add(isLight ? "light" : "dark");
            sq.dataset.row = r;
            sq.dataset.col = c;

            const piece = board[r][c];
            if (piece) {
                sq.textContent = pieceToChar(piece);
            }

            sq.addEventListener("click", onSquareClick);
            boardEl.appendChild(sq);
        }
    }
}

function pieceToChar(piece) {
    const map = {
        "wP":"♙","wR":"♖","wN":"♘","wB":"♗","wQ":"♕","wK":"♔",
        "bP":"♟","bR":"♜","bN":"♞","bB":"♝","bQ":"♛","bK":"♚"
    };
    return map[piece] || "";
}

function onSquareClick(e) {
    if (gameOver || currentTurn !== "w") return;

    const r = parseInt(e.currentTarget.dataset.row);
    const c = parseInt(e.currentTarget.dataset.col);
    const piece = board[r][c];

    if (selectedSquare === null) {
        if (!piece || piece[0] !== "w") return;
        selectedSquare = {r, c};
        highlightMoves(r, c);
    } else {
        clearHighlights();
        const from = selectedSquare;
        const to = {r, c};
        if (tryMove(from, to)) {
            selectedSquare = null;
            drawBoard();
            checkGameOver();
            if (!gameOver) {
                currentTurn = "b";
                setTimeout(robotMove, 400);
            }
        } else {
            selectedSquare = null;
        }
    }
}

function highlightMoves(r, c) {
    const moves = getLegalMoves(r, c, "w");
    moves.forEach(m => {
        const sel = document.querySelector(`.square[data-row="${m.r}"][data-col="${m.c}"]`);
        if (sel) sel.classList.add("target");
    });
}

function clearHighlights() {
    document.querySelectorAll(".square").forEach(sq => {
        sq.classList.remove("target");
    });
}

function inBounds(r,c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// Returns array of {r,c} legal target squares for piece at (r,c)
function getLegalMoves(r, c, side) {
    const piece = board[r][c];
    if (!piece || piece[0] !== side) return [];
    const type = piece[1];
    const moves = [];

    const dir = side === "w" ? -1 : 1;

    if (type === "P") {
        const nr = r + dir;
        if (inBounds(nr, c) && board[nr][c] === null) {
            moves.push({r:nr,c});
        }
        // captures
        for (let dc of [-1,1]) {
            const cr = r + dir;
            const cc = c + dc;
            if (inBounds(cr,cc) && board[cr][cc] && board[cr][cc][0] !== side) {
                moves.push({r:cr,c:cc});
            }
        }
    }

    if (type === "R" || type === "Q") {
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        for (let [dr,dc] of dirs) {
            let nr = r + dr, nc = c + dc;
            while (inBounds(nr,nc)) {
                if (board[nr][nc] === null) {
                    moves.push({r:nr,c:nc});
                } else {
                    if (board[nr][nc][0] !== side) moves.push({r:nr,c:nc});
                    break;
                }
                nr += dr; nc += dc;
            }
        }
    }

    if (type === "B" || type === "Q") {
        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
        for (let [dr,dc] of dirs) {
            let nr = r + dr, nc = c + dc;
            while (inBounds(nr,nc)) {
                if (board[nr][nc] === null) {
                    moves.push({r:nr,c:nc});
                } else {
                    if (board[nr][nc][0] !== side) moves.push({r:nr,c:nc});
                    break;
                }
                nr += dr; nc += dc;
            }
        }
    }

    if (type === "N") {
        const jumps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        for (let [dr,dc] of jumps) {
            const nr = r + dr, nc = c + dc;
            if (!inBounds(nr,nc)) continue;
            if (!board[nr][nc] || board[nr][nc][0] !== side) moves.push({r:nr,c:nc});
        }
    }

    if (type === "K") {
        for (let dr=-1;dr<=1;dr++) {
            for (let dc=-1;dc<=1;dc++) {
                if (dr===0 && dc===0) continue;
                const nr=r+dr, nc=c+dc;
                if (!inBounds(nr,nc)) continue;
                if (!board[nr][nc] || board[nr][nc][0] !== side) moves.push({r:nr,c:nc});
            }
        }
    }

    return moves;
}

function tryMove(from, to) {
    const piece = board[from.r][from.c];
    if (!piece || piece[0] !== "w") return false;

    const legal = getLegalMoves(from.r, from.c, "w");
    if (!legal.some(m => m.r === to.r && m.c === to.c)) return false;

    const target = board[to.r][to.c];
    board[to.r][to.c] = piece;
    board[from.r][from.c] = null;

    // simple promotion: if white pawn reaches last rank, make it queen
    if (piece === "wP" && to.r === 0) board[to.r][to.c] = "wQ";

    return true;
}

function robotMove() {
    if (gameOver) return;

    // collect all legal black moves
    const moves = [];
    for (let r=0;r<8;r++) {
        for (let c=0;c<8;c++) {
            const p = board[r][c];
            if (p && p[0] === "b") {
                const ms = getLegalMoves(r,c,"b");
                ms.forEach(m => moves.push({from:{r,c},to:m}));
            }
        }
    }
    if (moves.length === 0) {
        // no moves: treat as draw or loss
        endGame("draw");
        return;
    }
    const choice = moves[Math.floor(Math.random()*moves.length)];
    const piece = board[choice.from.r][choice.from.c];
    const target = board[choice.to.r][choice.to.c];

    board[choice.to.r][choice.to.c] = piece;
    board[choice.from.r][choice.from.c] = null;

    // promotion for black pawn
    if (piece === "bP" && choice.to.r === 7) board[choice.to.r][choice.to.c] = "bQ";

    drawBoard();
    checkGameOver();
    if (!gameOver) currentTurn = "w";
}

function checkGameOver() {
    let whiteKing = false, blackKing = false;
    for (let r=0;r<8;r++) {
        for (let c=0;c<8;c++) {
            if (board[r][c] === "wK") whiteKing = true;
            if (board[r][c] === "bK") blackKing = true;
        }
    }
    if (!whiteKing || !blackKing) {
        if (!whiteKing && !blackKing) {
            endGame("draw");
        } else if (!blackKing) {
            endGame("win");
        } else if (!whiteKing) {
            endGame("lose");
        }
    }
}

async function endGame(result) {
    gameOver = true;
    let rating = chessUserData ? (chessUserData.rating || 1000) : 1000;
    let change = 0;
    if (result === "win") change = 20;
    else if (result === "lose") change = -20;
    else if (result === "draw") change = 5;

    rating = Math.max(100, rating + change);

    if (userId) {
        await db.collection("users").doc(userId).update({ rating });
        chessUserData.rating = rating;
        updateChessHeader();
    }

    alert(`Game result: ${result.toUpperCase()} • Rating change: ${change}`);
}

function resetGame() {
    initBoard();
    drawBoard();
    gameOver = false;
    currentTurn = "w";
}

function backDashboard() {
    window.location.href = "dashboard.html";
}

// init
initBoard();
drawBoard();
