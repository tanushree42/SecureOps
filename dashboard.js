// dashboard.js

// 1️⃣ Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 2️⃣ Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChl0Yptr0Fw7o7lBMOZTg3yjPRD6nfEZs",
    authDomain: "ops-e4746.firebaseapp.com",
    projectId: "ops-e4746"
};

// 3️⃣ Initialize Firebase, Auth, and Firestore
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// 4️⃣ Define the dashboard initializer
function loadDashboard() {
    console.log("🚀 loadDashboard() running: rendering main dashboard content");
    // TODO: fetch Firestore collections, render tasks, charts, etc.
}

// 5️⃣ Profile sidebar toggle & field references
const profileBtn = document.getElementById("profile-btn");
const profileSidebar = document.getElementById("profile-sidebar");
const closeProfileBtn = document.getElementById("close-profile");
const pfFirst = document.getElementById("pf-first");
const pfLast = document.getElementById("pf-last");
const pfEmail = document.getElementById("pf-email");
const pfPhone = document.getElementById("pf-phone");
const saveProfileBtn = document.getElementById("save-profile");

profileBtn.addEventListener("click", () => profileSidebar.classList.add("open"));
closeProfileBtn.addEventListener("click", () => profileSidebar.classList.remove("open"));

// 6️⃣ Protect dashboard & populate UI on auth state changes
onAuthStateChanged(auth, async user => {
    if (!user) {
        return window.location.href = "login.html";
    }

    await user.reload();

    // Block unverified users
    if (!user.emailVerified) {
        const warning = document.createElement("div");
        warning.className = "verify-banner";
        warning.innerHTML = `
      <p>Your email isn’t verified yet.</p>
      <button id="resend">Resend Verification</button>
    `;
        document.body.prepend(warning);
        document.getElementById("resend").addEventListener("click", async () => {
            await sendEmailVerification(user);
            alert("Verification link resent! Check your inbox.");
        });
        await signOut(auth);
        return;
    }

    // Inject welcome message
    const welcomeEl = document.getElementById("welcome-text");
    const nameToShow = user.displayName?.trim() || user.email;
    welcomeEl.textContent = `Welcome, ${nameToShow}!`;

    // Populate profile sidebar fields
    const nameParts = (user.displayName || "").split(" ");
    pfFirst.value = nameParts[0] || "";
    pfLast.value = nameParts.slice(1).join(" ") || "";
    pfEmail.value = user.email || "";

    // Load phone from Firestore if exists
    const snap = await getDoc(doc(db, "users", user.uid));
    pfPhone.value = snap.exists() ? (snap.data().phone || "") : "";

    // Now render dashboard content
    loadDashboard();
});

// 7️⃣ Save profile updates back to Firebase
saveProfileBtn.addEventListener("click", async () => {
    const first = pfFirst.value.trim();
    const last = pfLast.value.trim();
    const phone = pfPhone.value.trim();
    const fullName = [first, last].filter(Boolean).join(" ");

    try {
        // Update Auth displayName
        await updateProfile(auth.currentUser, { displayName: fullName });
        // Persist phone in Firestore
        await setDoc(
            doc(db, "users", auth.currentUser.uid),
            { phone, updatedAt: new Date() },
            { merge: true }
        );
        // Update navbar welcome
        document.getElementById("welcome-text").textContent = `Welcome, ${fullName}!`;
        // Close sidebar & confirm
        profileSidebar.classList.remove("open");
        alert("Profile saved successfully!");
    } catch (err) {
        console.error(err);
        alert("Error saving profile: " + err.message);
    }
});
