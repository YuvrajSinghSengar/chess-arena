
// tournament.js – organiser host + players register (no rating change)

const userIdT = localStorage.getItem("userId");
if (!userIdT) window.location.href = "auth.html";

let meT = null;
let currentMatchId = null;

async function loadTournamentUser() {
  const doc = await db.collection("users").doc(userIdT).get();
  if (doc.exists) {
    meT = doc.data();
    document.getElementById("tournamentUser").innerText =
      `${meT.fullName} (@${meT.username}) • Rating: ${meT.rating || 1000}`;
  }
}
loadTournamentUser();

function backDashboard() {
  window.location.href = "dashboard.html";
}

function generateCode() {
  return Math.floor(100000 + Math.random()*900000).toString();
}

async function hostTournament() {
  if (!meT) return;
  const code = generateCode();
  const docRef = await db.collection("tournamentMatches").add({
    code,
    hostId: userIdT,
    hostName: meT.fullName,
    hostUsername: meT.username,
    white: null,
    black: null,
    createdAt: new Date()
  });
  currentMatchId = docRef.id;
  document.getElementById("tCode").innerText =
    `Match code: ${code}. Share this with players.`;

  // live updates
  db.collection("tournamentMatches").doc(currentMatchId)
    .onSnapshot(renderPlayers);
}

function renderPlayers(doc) {
  if (!doc.exists) return;
  const data = doc.data();
  const tbody = document.getElementById("tPlayers");
  tbody.innerHTML = "";

  function row(role, player) {
    const tr = document.createElement("tr");
    if (!player) {
      tr.innerHTML = `<td>${role}</td><td>—</td><td>—</td>`;
    } else {
      tr.innerHTML = `<td>${role}</td><td>${player.fullName} (@${player.username})</td><td>${player.rating || 1000}</td>`;
    }
    tbody.appendChild(tr);
  }

  if (data.whiteUser) row("White", data.whiteUser);
  else row("White", null);

  if (data.blackUser) row("Black", data.blackUser);
  else row("Black", null);
}

async function joinTournament() {
  const code = document.getElementById("tJoinCode").value.trim();
  const side = document.getElementById("tSide").value;
  if (!code) {
    alert("Enter a code.");
    return;
  }
  const snap = await db.collection("tournamentMatches")
    .where("code","==",code).limit(1).get();
  if (snap.empty) {
    alert("Match not found.");
    return;
  }
  const doc = snap.docs[0];
  const data = doc.data();
  const userDoc = await db.collection("users").doc(userIdT).get();
  const u = userDoc.data();

  if (side === "white" && data.whiteUser) {
    alert("White already taken.");
    return;
  }
  if (side === "black" && data.blackUser) {
    alert("Black already taken.");
    return;
  }

  const update = {};
  update[side + "User"] = {
    id: userIdT,
    fullName: u.fullName,
    username: u.username,
    rating: u.rating || 1000
  };

  await db.collection("tournamentMatches").doc(doc.id).update(update);

  currentMatchId = doc.id;
  db.collection("tournamentMatches").doc(currentMatchId)
    .onSnapshot(renderPlayers);

  document.getElementById("tCode").innerText =
    `Joined match with code ${code}.`;
}
