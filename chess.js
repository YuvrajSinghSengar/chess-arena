// chess.js – simplified professional looking board + rating update

const boardEl = document.getElementById("board");

const pieces = {
    "r": "♜", "n": "♞", "b": "♝", "q": "♛", "k": "♚", "p": "♟",
    "R": "♖", "N": "♘", "B": "♗", "Q": "♕", "K": "♔", "P": "♙"
};

let board = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
];

let selected = null;
let currentRating = 1000;
let userIdChess = localStorage.getItem("userId");

function drawBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement("div");
            sq.className = `square ${(r + c) % 2 === 0 ? "light" : "dark"}`;

            const piece = board[r][c];
            if (piece) {
                const span = document.createElement("span");
                span.className = "piece";
                span.textContent = pieces[piece];
                sq.appendChild(span);
            }

            sq.onclick = () => handleClick(r, c);
            boardEl.appendChild(sq);
        }
    }
}

function handleClick(r, c) {
    const piece = board[r][c];

    if (!selected && piece && piece === piece.toUpperCase()) {
        selected = { r, c };
        highlight(r, c);
        return;
    }

    if (selected) {
        movePiece(selected.r, selected.c, r, c);
        selected = null;
        drawBoard();
        setTimeout(robotMove, 400);
    }
}

function highlight(r, c) {
    drawBoard();
    const idx = r * 8 + c;
    boardEl.children[idx].classList.add("selected");
}

function movePiece(sr, sc, tr, tc) {
    board[tr][tc] = board[sr][sc];
    board[sr][sc] = "";
}

function robotMove() {
    let moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let p = board[r][c];
            if (p && p === p.toLowerCase()) {
                const dirs = [
                    [1,0],[1,1],[1,-1],
                    [0,1],[0,-1],
                    [-1,0],[-1,1],[-1,-1]
                ];
                dirs.forEach(([dr,dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        if (!board[nr][nc] || board[nr][nc] === board[nr][nc].toUpperCase()) {
                            moves.push({sr:r, sc:c, tr:nr, tc:nc});
                        }
                    }
                });
            }
        }
    }
    if (moves.length === 0) return;
    const mv = moves[Math.floor(Math.random()*moves.length)];
    movePiece(mv.sr, mv.sc, mv.tr, mv.tc);
    drawBoard();
}

function resetBoard() {
    window.location.reload();
}

async function loadUserChess() {
    if (!userIdChess) return;
    const doc = await db.collection("users").doc(userIdChess).get();
    if (doc.exists) {
        const u = doc.data();
        currentRating = u.rating || 1000;
        document.getElementById("robotUser").innerText =
            `${u.fullName} (@${u.username}) • Rating: ${currentRating}`;
    }
}

async function reportResult(result) {
    if (!userIdChess) {
        alert("Please log in again.");
        return;
    }
    let delta = 0;
    if (result === "win") delta = 20;
    else if (result === "lose") delta = -20;
    else if (result === "draw") delta = 5;

    const newRating = Math.max(100, currentRating + delta);
    await db.collection("users").doc(userIdChess).update({rating: newRating});
    currentRating = newRating;
    document.getElementById("robotUser").innerText =
        `Rating updated: ${currentRating}`;
    alert(`Result saved. New rating: ${currentRating}`);
}

function backDashboard() {
    window.location.href = "dashboard.html";
}

loadUserChess();
drawBoard();
