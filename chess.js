// ------------------------------------------
//  Basic Professional Chess Engine (Simplified)
// ------------------------------------------

const boardEl = document.getElementById("board");

const pieces = {
    "r": "♜", "n": "♞", "b": "♝", "q": "♛", "k": "♚", "p": "♟",
    "R": "♖", "N": "♘", "B": "♗", "Q": "♕", "K": "♔", "P": "♙"
};

// STARTING BOARD
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

// Render board
function drawBoard() {
    boardEl.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = square ${(row + col) % 2 === 0 ? "light" : "dark"};

            const piece = board[row][col];
            if (piece) {
                const span = document.createElement("span");
                span.className = "piece";
                span.textContent = pieces[piece];
                square.appendChild(span);
            }

            square.onclick = () => handleClick(row, col);
            boardEl.appendChild(square);
        }
    }
}

function handleClick(r, c) {
    const piece = board[r][c];

    // Select white piece
    if (!selected && piece && piece === piece.toUpperCase()) {
        selected = { r, c };
        highlight(r, c);
        return;
    }

    // Move selected → r,c
    if (selected) {
        movePiece(selected.r, selected.c, r, c);
        selected = null;
        drawBoard();
        setTimeout(robotMove, 400);
    }
}

// Highlight selected square
function highlight(r, c) {
    drawBoard();
    const index = r * 8 + c;
    boardEl.children[index].classList.add("selected");
}

function movePiece(sr, sc, tr, tc) {
    board[tr][tc] = board[sr][sc];
    board[sr][sc] = "";
}

// Simple random robot move
function robotMove() {
    let moves = [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let p = board[r][c];
            if (p && p === p.toLowerCase()) {
                // robot moves piece randomly
                let dirs = [
                    [1,0], [1,1], [1,-1],
                    [0,1], [0,-1],
                    [-1,0], [-1,1], [-1,-1]
                ];

                dirs.forEach(([dr, dc]) => {
                    let nr = r + dr;
                    let nc = c + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        if (!board[nr][nc] || board[nr][nc] === board[nr][nc].toUpperCase()) {
                            moves.push({ sr: r, sc: c, tr: nr, tc: nc });
                        }
                    }
                });
            }
        }
    }

    if (moves.length === 0) return;

    const mv = moves[Math.floor(Math.random() * moves.length)];
    movePiece(mv.sr, mv.sc, mv.tr, mv.tc);
    drawBoard();
}

function resetBoard() {
    location.reload();
}

// Load user rating for display
async function loadUserInfo() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const docSnap = await db.collection("users").doc(userId).get();
    if (docSnap.exists) {
        const u = docSnap.data();
        document.getElementById("robotUser").innerText =
            ${u.fullName} (@${u.username}) • Rating: ${u.rating};
    }
}

function backDashboard() {
    window.location.href = "dashboard.html";
}

loadUserInfo();
drawBoard();
