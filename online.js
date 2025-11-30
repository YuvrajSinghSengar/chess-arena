
// online.js – simple rating-near pairing

const userIdOnline = localStorage.getItem("userId");
if (!userIdOnline) window.location.href = "auth.html";

let meOnline = null;

async function loadOnline() {
  const doc = await db.collection("users").doc(userIdOnline).get();
  if (doc.exists) {
    meOnline = doc.data();
    document.getElementById("onlineUser").innerText =
      `${meOnline.fullName} (@${meOnline.username}) • Rating: ${meOnline.rating || 1000}`;
  }

  const snap = await db.collection("users").orderBy("rating","desc").limit(20).get();
  const tbody = document.getElementById("onlineTable");
  tbody.innerHTML = "";
  let rank = 1;
  snap.forEach(d => {
    const u = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${rank}</td>
      <td>${u.fullName} (@${u.username})</td>
      <td>${u.rating || 1000}</td>
      <td>${u.city || ""}</td>
    `;
    tbody.appendChild(tr);
    rank++;
  });
}

async function findOpponent() {
  if (!meOnline) return;
  const myRating = meOnline.rating || 1000;
  const min = myRating - 200;
  const max = myRating + 200;

  let q = db.collection("users")
    .where("rating", ">=", min)
    .where("rating", "<=", max);

  const snap = await q.get();
  const candidates = [];
  snap.forEach(d => {
    if (d.id !== userIdOnline) candidates.push({id:d.id, ...d.data()});
  });

  const resultEl = document.getElementById("matchResult");

  if (candidates.length === 0) {
    resultEl.innerText = "No suitable opponent found right now. Ask a friend to sign up and try again.";
    return;
  }
  const opp = candidates[Math.floor(Math.random()*candidates.length)];
  resultEl.innerText =
    `Matched with ${opp.fullName} (@${opp.username}) • Rating ${opp.rating || 1000}.
Start a game on the Play vs Robot board or any board, then record the result manually.`;
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

loadOnline();
