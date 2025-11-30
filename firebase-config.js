// firebase-config.js
// Replace these values with your real Firebase config from the Firebase console.

const firebaseConfig = {
  apiKey: "AIzaSyA0wJjHhcfRIrAjCkIbGPwPKjHeRqY1ihs",
  authDomain: "chess-arena-yuvraj.firebaseapp.com",
  projectId: "chess-arena-yuvraj",
  storageBucket: "chess-arena-yuvraj.firebasestorage.app",
  messagingSenderId: "422414082924",
  appId: "1:422414082924:web:869c451dbc8884bd864949",
  measurementId: "G-TVW0C2BNR6"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
