// scripts.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// SIGN UP handler
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pw    = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, pw)
      .then(() => window.location = "dashboard.html")
      .catch(err => alert(err.message));
  });
}

// LOGIN handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const pw    = document.getElementById("loginPassword").value;
    signInWithEmailAndPassword(auth, email, pw)
      .then(() => window.location = "dashboard.html")
      .catch(err => alert(err.message));
  });
}

// PROTECT dashboard
onAuthStateChanged(auth, user => {
  if (window.location.pathname.endsWith("dashboard.html") && !user) {
    window.location = "login.html";
  }
});

