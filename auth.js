// auth.js

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("signupTab").classList.remove("active");
}

function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("signupTab").classList.add("active");
}

function backHome() {
    window.location.href = "index.html";
}

// SIGN UP
async function signup() {
    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const phone    = document.getElementById("phone").value.trim();
    const region   = document.getElementById("region").value.trim();
    const country  = document.getElementById("country").value.trim();
    const state    = document.getElementById("state").value.trim();
    const city     = document.getElementById("city").value.trim();
    const area     = document.getElementById("area").value.trim();
    const eduType  = document.getElementById("eduType").value;
    const institute = document.getElementById("institute").value.trim();
    const instituteRank = document.getElementById("instituteRank").value.trim();

    if (!fullName || !username || !password) {
        alert("Name, username and password are required.");
        return;
    }

    // check unique username
    const snap = await db.collection("users").where("username","==",username).get();
    if (!snap.empty) {
        alert("Username already taken. Choose another one.");
        return;
    }

    const user = {
        fullName,
        username,
        password,       // NOTE: For real product, never store plain passwords
        phone,
        region,
        country,
        state,
        city,
        area,
        eduType,
        institute,
        instituteRank,
        rating: 1000,   // initial rating
        createdAt: new Date()
    };

    const docRef = await db.collection("users").add(user);
    localStorage.setItem("userId", docRef.id);
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
}

// LOGIN
async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Enter username and password.");
        return;
    }

    const snap = await db.collection("users").where("username","==",username).get();
    if (snap.empty) {
        alert("User not found.");
        return;
    }

    const doc = snap.docs[0];
    const data = doc.data();

    if (data.password !== password) {
        alert("Incorrect password.");
        return;
    }

    localStorage.setItem("userId", doc.id);
    localStorage.setItem("username", data.username);
    window.location.href = "dashboard.html";
}
