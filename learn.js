
// learn.js – lessons list + per-user completion

const userIdLearn = localStorage.getItem("userId");
if (!userIdLearn) window.location.href = "auth.html";

const lessons = [
  {
    id: "basics",
    title: "Chess Basics",
    desc: "Board, pieces, setup and how each piece moves.",
    content: `
      <h3>Chess Basics</h3>
      <p>The board has 64 squares (8x8). Light and dark squares alternate.</p>
      <p>White pieces start on ranks 1 and 2, Black on ranks 7 and 8.</p>
      <p>Learn the legal moves of king, queen, rook, bishop, knight and pawns.</p>
    `
  },
  {
    id: "openings",
    title: "Opening Principles",
    desc: "Control the centre, develop pieces, king safety.",
    content: `
      <h3>Opening Principles</h3>
      <ul>
        <li>Fight for the centre with pawns and pieces.</li>
        <li>Develop knights and bishops early.</li>
        <li>Castle your king and connect rooks.</li>
      </ul>
    `
  },
  {
    id: "tactics",
    title: "Tactics & Patterns",
    desc: "Pins, forks, skewers, double attacks.",
    content: `
      <h3>Tactics & Patterns</h3>
      <p>Tactics are short-term combinations that win material or checkmate.</p>
      <p>Study forks, pins, skewers, discovered attacks and double checks.</p>
    `
  },
  {
    id: "endgames",
    title: "Endgames",
    desc: "King activity and basic pawn endings.",
    content: `
      <h3>Endgames</h3>
      <p>In endgames your king becomes a fighting piece.</p>
      <p>Learn king and pawn vs king, opposition, and simple rook endings.</p>
    `
  }
];

let progress = {};

async function loadUserAndProgress() {
  const doc = await db.collection("users").doc(userIdLearn).get();
  if (doc.exists) {
    const u = doc.data();
    document.getElementById("learnUser").innerText =
      `${u.fullName} (@${u.username}) • Rating: ${u.rating || 1000}`;
  }

  const snap = await db.collection("users").doc(userIdLearn)
    .collection("lessons").get();
  snap.forEach(d => {
    progress[d.id] = d.data().completed;
  });

  renderLessons();
}

function renderLessons() {
  const grid = document.getElementById("lessonGrid");
  grid.innerHTML = "";
  lessons.forEach(l => {
    const done = progress[l.id];
    const div = document.createElement("div");
    div.className = "feature-card";
    div.innerHTML = `
      <h3>${l.title}</h3>
      <p>${l.desc}</p>
      <p style="font-size:12px;margin-top:8px;">
        Status:
        <span style="color:${done ? "#7CFC00" : "#ffb000"};">
          ${done ? "Completed" : "Not completed"}
        </span>
      </p>
      <button class="secondary-btn" style="margin-top:10px;"
         onclick="openLesson('${l.id}')">Open lesson</button>
      <button class="secondary-btn" style="margin-top:10px;"
         onclick="toggleLesson('${l.id}')">
         ${done ? "Mark as not done" : "Mark as completed"}
      </button>
    `;
    grid.appendChild(div);
  });
}

function openLesson(id) {
  const l = lessons.find(x => x.id === id);
  if (!l) return;
  const win = window.open("", "_blank");
  win.document.write(`
    <html><head><title>${l.title}</title></head>
    <body style="font-family:sans-serif;padding:20px;background:#0b1020;color:#eee;">
    ${l.content}
    </body></html>
  `);
  win.document.close();
}

async function toggleLesson(id) {
  const done = !progress[id];
  progress[id] = done;
  await db.collection("users").doc(userIdLearn)
    .collection("lessons").doc(id)
    .set({completed: done, updatedAt: new Date()});
  renderLessons();
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

loadUserAndProgress();
