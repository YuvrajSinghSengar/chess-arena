
// ai-guide.js – rating-based advice + sample positions and hints

const userIdAI = localStorage.getItem("userId");
if (!userIdAI) window.location.href = "auth.html";

let aiRating = 1000;
let aiUser = null;

async function loadUserAI() {
  const doc = await db.collection("users").doc(userIdAI).get();
  if (doc.exists) {
    aiUser = doc.data();
    aiRating = aiUser.rating || 1000;
    document.getElementById("aiUser").innerText =
      `${aiUser.fullName} (@${aiUser.username}) • Rating: ${aiRating}`;
  }
}
loadUserAI();

function generateAdvice() {
  let text = "";
  if (aiRating < 1100) {
    text = `
      • Focus on piece safety – do not leave pieces undefended.<br>
      • Before every move, ask: "What did my opponent just attack?"<br>
      • Play slow games and write down your blunders.<br>
      • Repeat the Basics and Tactics lessons in the Learn section.`;
  } else if (aiRating < 1400) {
    text = `
      • Fight for the centre with pawns and minor pieces.<br>
      • Develop all pieces before starting attacks.<br>
      • Analyse every lost game and find the turning point.<br>
      • Solve 10–15 tactical puzzles per day.`;
  } else if (aiRating < 1700) {
    text = `
      • Build a simple opening repertoire with both colours.<br>
      • Study essential rook and pawn endgames.<br>
      • Calculate 2–3 moves deep instead of playing by habit.<br>
      • Mix classical games with rapid games.`;
  } else {
    text = `
      • Deepen opening understanding with model games.<br>
      • Maintain a notebook of typical mistakes and patterns.<br>
      • Train calculation without moving pieces on the board.<br>
      • Balance tactics, strategy and endgames in your study schedule.`;
  }
  document.getElementById("advice").innerHTML = text;
}

// simple board + hint positions
const aiBoardEl = document.getElementById("aiBoard");

const aiPositions = [
  {
    fen: [
      ["r","n","b","q","k","b","n","r"],
      ["p","p","p","p","","p","p","p"],
      ["","","","","p","","",""],
      ["","","","P","P","","",""],
      ["","","","","","N","",""],
      ["","","","","","","",""],
      ["P","P","P","","","P","P","P"],
      ["R","N","B","Q","K","B","","R"]
    ],
    side: "w",
    hint: "White should capture on e5 with dxe5, opening the centre."
  },
  {
    fen: [
      ["r","n","b","q","k","","n","r"],
      ["p","p","p","p","","p","p","p"],
      ["","","","","p","","",""],
      ["","","","P","P","","",""],
      ["","","","N","","N","",""],
      ["","","","","","","",""],
      ["P","P","P","","","P","P","P"],
      ["R","","B","Q","K","B","","R"]
    ],
    side: "b",
    hint: "Black can play ... Qxd1+ to exchange queens and simplify."
  }
];

let currentAiPosIndex = 0;

function drawAiBoard() {
  const pos = aiPositions[currentAiPosIndex];
  aiBoardEl.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement("div");
      sq.className = "square " + ((r+c)%2===0 ? "light" : "dark");
      const piece = pos.fen[r][c];
      if (piece) {
        const span = document.createElement("span");
        span.className = "piece";
        span.textContent = pieceSymbol(piece);
        sq.appendChild(span);
      }
      aiBoardEl.appendChild(sq);
    }
  }
  document.getElementById("hintText").innerText = "";
}

function newPosition() {
  currentAiPosIndex = (currentAiPosIndex + 1) % aiPositions.length;
  drawAiBoard();
}

function showHint() {
  const pos = aiPositions[currentAiPosIndex];
  document.getElementById("hintText").innerText = pos.hint;
}

function pieceSymbol(p) {
  const map = {
    "r":"♜","n":"♞","b":"♝","q":"♛","k":"♚","p":"♟",
    "R":"♖","N":"♘","B":"♗","Q":"♕","K":"♔","P":"♙"
  };
  return map[p] || "";
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

drawAiBoard();
