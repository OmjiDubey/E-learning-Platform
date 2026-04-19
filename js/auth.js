import { auth, firestore } from '../firebase/config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let isAuthActionInProgress = false;

// If user is already logged in, go to dashboard
auth.onAuthStateChanged(function(user) {
  if (user && !isAuthActionInProgress) {
    window.location.href = "dashboard.html";
  }
});

// Login
window.handleLogin = async function() {
  const email    = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorEl  = document.getElementById("login-msg");

  errorEl.textContent = "";

  try {
    isAuthActionInProgress = true;
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    isAuthActionInProgress = false;
    errorEl.textContent = getErrorMessage(error.code);
  }
};

// Signup
window.handleSignup = async function() {
  const name     = document.getElementById("signup-name").value;
  const email    = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const errorEl  = document.getElementById("signup-msg");

  errorEl.textContent = "";

  try {
    isAuthActionInProgress = true;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save display name to Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Save user data to Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      name       : name,
      email      : email,
      createdAt  : serverTimestamp(),
      favorites  : [],
      watchLater : []
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    isAuthActionInProgress = false;
    errorEl.textContent = getErrorMessage(error.code);
  }
};

// Google Login
window.handleGoogleLogin = async function() {
  const provider = new GoogleAuthProvider();
  try {
    isAuthActionInProgress = true;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create user doc if it doesn't exist
    const userDocRef = doc(firestore, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        name       : user.displayName || "User",
        email      : user.email,
        createdAt  : serverTimestamp(),
        favorites  : [],
        watchLater : []
      });
    }
    
    window.location.href = "dashboard.html";
  } catch (error) {
    isAuthActionInProgress = false;
    console.error("Google Auth Error:", error);
    
    let errorEl = null;
    if (document.getElementById('form-login').classList.contains('active')) {
      errorEl = document.getElementById("login-msg");
    } else {
      errorEl = document.getElementById("signup-msg");
    }
    
    if (errorEl) {
      errorEl.textContent = "Request is invalid. Please configure Google Auth in Firebase.";
    }
  }
};

// Convert Firebase error codes to readable messages
function getErrorMessage(code) {
  if (code === "auth/user-not-found")        return "No account found with this email.";
  if (code === "auth/wrong-password")        return "Incorrect password.";
  if (code === "auth/invalid-email")         return "Please enter a valid email.";
  if (code === "auth/email-already-in-use")  return "This email is already registered.";
  if (code === "auth/weak-password")         return "Password must be at least 6 characters.";
  if (code === "auth/invalid-credential")    return "Invalid email or password.";
  if (code === "auth/too-many-requests")     return "Too many attempts. Try again later.";
  return "Something went wrong. Please try again.";
}

// Show/Hide Tabs
window.switchTab = function(tab) {
  if (tab === 'login') {
    document.getElementById('form-login').classList.add('active');
    document.getElementById('form-signup').classList.remove('active');
    document.getElementById('tab-login').classList.add('active');
    document.getElementById('tab-signup').classList.remove('active');
  } else if (tab === 'signup') {
    document.getElementById('form-signup').classList.add('active');
    document.getElementById('form-login').classList.remove('active');
    document.getElementById('tab-signup').classList.add('active');
    document.getElementById('tab-login').classList.remove('active');
  }
};

// Toggle password visibility
window.togglePw = function(inputId, toggleEl) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
};
