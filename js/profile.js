import { auth, db } from "../firebase/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { courses } from "../data/courses.js";

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProfile(user);
  } else {
    window.location.href = "index.html";
  }
});

async function loadProfile(user) {
  // Show user email
  document.getElementById("user-email").textContent = user.email;

  try {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Show name
      document.getElementById("user-name").textContent = userData.name || "Student";

      // Show favorites
      showFavorites(userData.favorites || []);

      // Show watch later
      showWatchLater(userData.watchLater || []);
    }

    // Get quiz results
    const quizDoc = await getDoc(doc(db, "quizResults", user.uid));

    if (quizDoc.exists()) {
      showQuizResults(quizDoc.data().results || {});
    } else {
      document.getElementById("quiz-list").innerHTML = "<p>No quizzes attempted yet.</p>";
    }

  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Something went wrong. Please try again.");
  }
}

function showFavorites(favorites) {
  const container = document.getElementById("favorites-list");

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites added yet.</p>";
    return;
  }

  container.innerHTML = "";

  favorites.forEach((courseId) => {
    // Find course by id
    const course = courses.find((c) => c.id === courseId);

    if (course) {
      const item = document.createElement("div");
      item.className = "course-item";
      item.innerHTML = `
        <span>${course.title}</span>
        <a href="course.html?id=${course.id}">View Course</a>
      `;
      container.appendChild(item);
    }
  });
}

function showWatchLater(watchLater) {
  const container = document.getElementById("watchlater-list");

  if (watchLater.length === 0) {
    container.innerHTML = "<p>No watch later items added yet.</p>";
    return;
  }

  container.innerHTML = "";

  watchLater.forEach((courseId) => {
    const course = courses.find((c) => c.id === courseId);

    if (course) {
      const item = document.createElement("div");
      item.className = "course-item";
      item.innerHTML = `
        <span>${course.title}</span>
        <a href="course.html?id=${course.id}">View Course</a>
      `;
      container.appendChild(item);
    }
  });
}

function showQuizResults(results) {
  const container = document.getElementById("quiz-list");

  // results is an object like { courseId: { score, total, attemptedAt } }
  const keys = Object.keys(results);

  if (keys.length === 0) {
    container.innerHTML = "<p>No quizzes attempted yet.</p>";
    return;
  }

  container.innerHTML = "";

  keys.forEach((courseId) => {
    const result = results[courseId];
    const course = courses.find((c) => c.id === courseId);
    const courseName = course ? course.title : courseId;

    // Format the date
    const date = result.attemptedAt
      ? new Date(result.attemptedAt.seconds * 1000).toLocaleDateString()
      : "N/A";

    const item = document.createElement("div");
    item.className = "quiz-item";
    item.innerHTML = `
      <strong>${courseName}</strong>
      <p>Score: ${result.score} / ${result.total}</p>
      <p>Date: ${date}</p>
    `;
    container.appendChild(item);
  });
}

// Logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});