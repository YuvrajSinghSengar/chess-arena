// auth.js

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function showLogin() {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.style.display = "block";
    signupForm.style.display = "none";
}

function showSignup() {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.style.display = "block";
    loginForm.style.display = "none";
}

function backHome() {
    window.location.href = "index.html";
}

async function signup() {
    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const region = document.getElementById("region").value.trim();
    const country = document.getElementById("country").value.trim();
    const state = document.getElementById("state").value.trim();
    const city = document.getElementById("city").value.trim();
    const area = document.getElementById("area").value.trim();
    const eduType = document.getElementById("eduType").value;
    const institute = document.getElementById("institute").value.trim();
    const instituteRank = document.getElementById("instituteRank").value.trim();

    if (!fullName || !username || !password) {
        alert("Full name, username and password are required.");
        return;
    }

    const existing = await db.collection("users")
        .where("username","==",username).get();
    if (!existing.empty) {
        alert("This username is already taken. Please choose another.");
        return;
    }

    const userRef = await db.collection("users").add({
        fullName,
        username,
        password, // for demo only; not secure for real use
        phone,
        region,
        country,
        state,
        city,
        area,
        eduType,
        institute,
        instituteRank,
        rating: 1000,
        createdAt: new Date()
    });

    localStorage.setItem("userId", userRef.id);
    window.location.href = "dashboard.html";
}

async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        alert("Enter username and password.");
        return;
    }

    const snap = await db.collection("users")
        .where("username","==",username)
        .where("password","==",password)
        .get();

    if (snap.empty) {
        alert("Invalid username or password.");
        return;
    }

    const doc = snap.docs[0];
    localStorage.setItem("userId", doc.id);
    window.location.href = "dashboard.html";
}
