
// friends.js – host/join friend games with codes (metadata only, board separate)

const userIdFriends = localStorage.getItem("userId");
if (!userIdFriends) window.location.href = "auth.html";

let meFriends = null;

async function loadFriendsUser() {
  const doc = await db.collection("users").doc(userIdFriends).get();
  if (doc.exists) {
    meFriends = doc.data();
    document.getElementById("friendsUser").innerText =
      `${meFriends.fullName} (@${meFriends.username}) • Rating: ${meFriends.rating || 1000}`;
  }

  db.collection("friendRooms")
    .where("players","array-contains",userIdFriends)
    .onSnapshot(renderRooms);
}

function renderRooms(snap) {
  const tbody = document.getElementById("roomsBody");
  tbody.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    const role = r.hostId === userIdFriends ? "Host" : "Guest";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.code}</td>
      <td>${r.mode}</td>
      <td>${role}</td>
      <td>${r.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function generateCode() {
  return Math.floor(100000 + Math.random()*900000).toString();
}

async function hostGame() {
  if (!meFriends) return;
  const mode = document.getElementById("hostMode").value;
  const code = generateCode();

  await db.collection("friendRooms").add({
    code,
    mode,
    hostId: userIdFriends,
    hostName: meFriends.fullName,
    hostUsername: meFriends.username,
    players: [userIdFriends],
    status: "waiting",
    createdAt: new Date()
  });

  document.getElementById("hostInfo").innerText =
    `Share this code with your friend: ${code}`;
}

async function joinGame() {
  if (!meFriends) return;
  const code = document.getElementById("joinCode").value.trim();
  if (!code) {
    alert("Enter a code.");
    return;
  }

  const snap = await db.collection("friendRooms")
    .where("code","==",code).limit(1).get();
  if (snap.empty) {
    document.getElementById("joinInfo").innerText = "Room not found.";
    return;
  }
  const doc = snap.docs[0];
  const room = doc.data();
  if (room.players.includes(userIdFriends)) {
    document.getElementById("joinInfo").innerText =
      "You are already in this room.";
    return;
  }
  if (room.players.length >= 2) {
    document.getElementById("joinInfo").innerText =
      "Room already has two players.";
    return;
  }

  await db.collection("friendRooms").doc(doc.id).update({
    players: [...room.players, userIdFriends],
    guestId: userIdFriends,
    guestName: meFriends.fullName,
    guestUsername: meFriends.username,
    status: "ready"
  });

  document.getElementById("joinInfo").innerText =
    `Joined room ${code}. Use the Play vs Robot board or any chess board to play your game.`;
}

function backDashboard() {
  window.location.href = "dashboard.html";
}

loadFriendsUser();
