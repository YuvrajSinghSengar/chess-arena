// dashboard.js

let currentUserId = localStorage.getItem("userId");
if (!currentUserId) {
    window.location.href = "auth.html";
}

async function loadUser() {
    const doc = await db.collection("users").doc(currentUserId).get();
    if (!doc.exists) {
        alert("User not found. Please log in again.");
        localStorage.clear();
        window.location.href = "auth.html";
        return;
    }
    const data = doc.data();
    document.getElementById("welcomeUser").innerText =
        `Welcome, ${data.fullName} (@${data.username})`;
    document.getElementById("ratingChip").innerText =
        `Rating: ${data.rating || 1000}`;
}
loadUser();

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function openLearn() {
    alert("Learn module: You can implement lessons, puzzles, and videos here for your mini project.");
}

function openOnlinePlay() {
    alert("Online play matchmaking (real-time) can be added later using WebSockets or Firebase Realtime DB.");
}

function openFriends() {
    alert("Friends + chat system can be added as an advanced feature, not required for basic demo.");
}

function openAIGuide() {
    alert("AI guide: You can later integrate a chess engine to show best moves and blunders.");
}

function openRobot() {
    window.location.href = "chess.html";
}

function openRankings() {
    window.location.href = "rankings.html";
}

function openInvite() {
    alert("Invite match + chat can be implemented as future enhancement.");
}
