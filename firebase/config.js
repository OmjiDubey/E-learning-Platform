// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQgWp9vg8RM688_yFMDUuZW6SWiYnwFMU",
  authDomain: "e-learning-platform-12.firebaseapp.com",
  projectId: "e-learning-platform-12",
  storageBucket: "e-learning-platform-12.firebasestorage.app",
  messagingSenderId: "697719521905",
  appId: "1:697719521905:web:13eceb3328defe3b9851d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);