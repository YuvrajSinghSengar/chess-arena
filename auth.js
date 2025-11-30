
// auth.js – signup/login + location dropdown data

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

// static location + institute data (can be extended any time)
const locationData = {
  "India": {
    states: {
      "Uttar Pradesh": {
        cities: {
          "Kanpur": {
            localities: [
              "Kakadeo",
              "Kalyanpur",
              "Swaroop Nagar",
              "Barra",
              "Govind Nagar",
              "Kidwai Nagar",
              "Ratan Lal Nagar",
              "Shastri Nagar",
              "Sisamau"
            ],
            institutes: [
              "PSIT Kanpur",
              "HBTU Kanpur",
              "IIT Kanpur",
              "Allenhouse Institute",
              "Rama University",
              "Axis Institute",
              "Dr. Virendra Swarup",
              "Kendriya Vidyalaya",
              "Delhi Public School Kanpur"
            ]
          },
          "Lucknow": {
            localities: ["Hazratganj","Aliganj","Indira Nagar","Gomti Nagar"],
            institutes: ["IIM Lucknow","Integral University","Lucknow University"]
          },
          "Varanasi": {
            localities: ["Lanka","Sigra","Bhelupur"],
            institutes: ["BHU","Sunbeam School"]
          },
          "Noida": {
            localities: ["Sector 62","Sector 18","Sector 15"],
            institutes: ["Amity University","JSS Noida"]
          }
        }
      },
      "Maharashtra": {
        cities: {
          "Mumbai": {
            localities: ["Andheri","Bandra","Dadar"],
            institutes: ["IIT Bombay","NMIMS","St. Xavier's"]
          },
          "Pune": {
            localities: ["Kothrud","Hinjewadi","Viman Nagar"],
            institutes: ["COEP","Pune University"]
          }
        }
      },
      "Delhi": {
        cities: {
          "New Delhi": {
            localities: ["CP","South Ex","Dwarka"],
            institutes: ["DU","NSIT","DTU"]
          }
        }
      },
      "Karnataka": {
        cities: {
          "Bengaluru": {
            localities: ["Whitefield","Koramangala","HSR Layout"],
            institutes: ["IISc","RV College","Christ University"]
          }
        }
      },
      "Tamil Nadu": {
        cities: {
          "Chennai": {
            localities: ["Adyar","T Nagar","Velachery"],
            institutes: ["IIT Madras","Anna University"]
          }
        }
      },
      "Gujarat": {
        cities: {
          "Ahmedabad": {
            localities: ["Navrangpura","Maninagar"],
            institutes: ["IIM Ahmedabad","Nirma University"]
          }
        }
      }
    }
  },
  "United States": {
    states: {
      "California": {
        cities: {
          "San Francisco": {
            localities: ["Downtown","SoMa"],
            institutes: ["UC Berkeley","Stanford University"]
          }
        }
      },
      "New York": {
        cities: {
          "New York City": {
            localities: ["Manhattan","Brooklyn"],
            institutes: ["NYU","Columbia University"]
          }
        }
      }
    }
  },
  "United Kingdom": {
    states: {
      "England": {
        cities: {
          "London": {
            localities: ["City","Canary Wharf"],
            institutes: ["UCL","Imperial College"]
          }
        }
      }
    }
  },
  "Canada": {
    states: {
      "Ontario": {
        cities: {
          "Toronto": {
            localities: ["Downtown","Scarborough"],
            institutes: ["University of Toronto","Ryerson University"]
          }
        }
      }
    }
  },
  "Australia": {
    states: {
      "New South Wales": {
        cities: {
          "Sydney": {
            localities: ["CBD","Parramatta"],
            institutes: ["UNSW","University of Sydney"]
          }
        }
      }
    }
  }
};

const countrySel = document.getElementById("country");
const stateSel = document.getElementById("state");
const citySel = document.getElementById("city");
const localitySel = document.getElementById("locality");
const instituteSel = document.getElementById("institute");

function populateCountries() {
  countrySel.innerHTML = "<option value=''>Select country</option>";
  Object.keys(locationData).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countrySel.appendChild(opt);
  });
  stateSel.innerHTML = "<option value=''>Select state</option>";
  citySel.innerHTML = "<option value=''>Select city/district</option>";
  localitySel.innerHTML = "<option value=''>Select locality</option>";
  instituteSel.innerHTML = "<option value=''>Select institute</option>";
}

countrySel && countrySel.addEventListener("change", () => {
  const c = countrySel.value;
  stateSel.innerHTML = "<option value=''>Select state</option>";
  citySel.innerHTML = "<option value=''>Select city/district</option>";
  localitySel.innerHTML = "<option value=''>Select locality</option>";
  instituteSel.innerHTML = "<option value=''>Select institute</option>";
  if (!c || !locationData[c]) return;
  Object.keys(locationData[c].states).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    stateSel.appendChild(opt);
  });
});

stateSel && stateSel.addEventListener("change", () => {
  const c = countrySel.value;
  const s = stateSel.value;
  citySel.innerHTML = "<option value=''>Select city/district</option>";
  localitySel.innerHTML = "<option value=''>Select locality</option>";
  instituteSel.innerHTML = "<option value=''>Select institute</option>";
  if (!c || !s || !locationData[c].states[s]) return;
  Object.keys(locationData[c].states[s].cities).forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySel.appendChild(opt);
  });
});

citySel && citySel.addEventListener("change", () => {
  const c = countrySel.value;
  const s = stateSel.value;
  const city = citySel.value;
  localitySel.innerHTML = "<option value=''>Select locality</option>";
  instituteSel.innerHTML = "<option value=''>Select institute</option>";
  if (!c || !s || !city) return;
  const cityObj = locationData[c].states[s].cities[city];
  cityObj.localities.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    localitySel.appendChild(opt);
  });
  cityObj.institutes.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    instituteSel.appendChild(opt);
  });
});

populateCountries();

// SIGNUP / LOGIN

async function signup() {
  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const country = countrySel.value;
  const state = stateSel.value;
  const city = citySel.value;
  const locality = localitySel.value;
  const eduType = document.getElementById("eduType").value;
  const institute = instituteSel.value;

  if (!fullName || !username || !password) {
    alert("Full name, username and password are required.");
    return;
  }

  const existing = await db.collection("users")
    .where("username","==",username).get();
  if (!existing.empty) {
    alert("This username is already taken. Choose another.");
    return;
  }

  const userRef = await db.collection("users").add({
    fullName,
    username,
    password, // demo only (not secure)
    phone,
    country,
    state,
    city,
    locality,
    eduType,
    institute,
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
