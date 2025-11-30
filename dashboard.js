// dashboard.js

let currentUserId = localStorage.getItem("userId");
if (!currentUserId) {
    window.location.href = "auth.html";
}

let currentUserData = null;

async function loadUser() {
    const doc = await db.collection("users").doc(currentUserId).get();
    if (!doc.exists) {
        alert("User not found. Please log in again.");
        localStorage.clear();
        window.location.href = "auth.html";
        return;
    }
    const data = doc.data();
    currentUserData = data;
    document.getElementById("welcomeUser").innerText =
        Welcome, ${data.fullName} (@${data.username});
    document.getElementById("ratingChip").innerText =
        Rating: ${data.rating || 1000};
}
loadUser();

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// NOW each feature opens a real page

function openLearn() {
    window.location.href = "learn.html";
}

function openOnlinePlay() {
    window.location.href = "online.html";
}

function openFriends() {
    window.location.href = "friends.html";
}

function openAIGuide() {
    window.location.href = "ai-guide.html";
}

function openRobot() {
    window.location.href = "chess.html";
}

function openRankings() {
    window.location.href = "rankings.html";
}

function openInvite() {
    window.location.href = "invite.html";
}
