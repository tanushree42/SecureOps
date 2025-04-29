// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyChl0Yptr0Fw7o7lBMOZTg3yjPRD6nfEZs",
  authDomain: "ops-e4746.firebaseapp.com",
  databaseURL: "https://ops-e4746-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ops-e4746",
  storageBucket: "ops-e4746.appspot.com",
  messagingSenderId: "89910517768",
  appId: "1:89910517768:web:2aee9ce76ae442813071bd"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth instance for use in your pages
export { auth };
