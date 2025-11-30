// rankings.js

function backDashboard() {
    window.location.href = "dashboard.html";
}

async function loadRankings() {
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

    const snap = await query.orderBy("rating","desc").limit(100).get();

    const tbody = document.getElementById("rankingBody");
    tbody.innerHTML = "";

    let rank = 1;
    snap.forEach(doc => {
        const u = doc.data();
        const tr = document.createElement("tr");

        const loc = `${u.city || ""}, ${u.state || ""}, ${u.country || ""}`.replace(/(^, |, ,)/g,"");
        const inst = u.institute || "";

        tr.innerHTML = `
            <td>${rank}</td>
            <td>${u.fullName} (@${u.username})</td>
            <td>${loc}</td>
            <td>${inst}</td>
            <td>${u.rating || 1000}</td>
        `;
        tbody.appendChild(tr);
        rank++;
    });
}

loadRankings();
