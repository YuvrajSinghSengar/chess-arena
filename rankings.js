
// rankings.js

const bodyEl = document.getElementById("rankingBody");
const userIdRank = localStorage.getItem("userId");
if (!userIdRank) window.location.href = "auth.html";

async function loadRankings() {
  bodyEl.innerHTML = "";
  const scope = document.getElementById("scopeSelect").value;
  const value = document.getElementById("scopeValue").value.trim();

  let query = db.collection("users");

  if (scope === "country" && value) {
    query = query.where("country","==",value);
  } else if (scope === "state" && value) {
    query = query.where("state","==",value);
  } else if (scope === "city" && value) {
    query = query.where("city","==",value);
  } else if (scope === "institute" && value) {
    query = query.where("institute","==",value);
  }

  query = query.orderBy("rating","desc").limit(50);

  const snap = await query.get();
  let rank = 1;
  snap.forEach(doc => {
    const u = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${rank}</td>
      <td>${u.fullName} (@${u.username})</td>
      <td>${u.city || ""}, ${u.state || ""}, ${u.country || ""}</td>
      <td>${u.institute || ""}</td>
      <td>${u.rating || 1000}</td>
    `;
    bodyEl.appendChild(tr);
    rank++;
  });
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

loadRankings();
