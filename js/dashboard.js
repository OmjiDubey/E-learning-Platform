import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, firestore as db } from "../firebase/config.js";

// Dashboard Data
let activeCourses = [];

const allCourses = [
  {
    id: "frontend-dev-mastery",
    title: "Frontend Development Mastery",
    category: "WEB DEVELOPMENT",
    desc: "A comprehensive guide to modern frontend development, covering HTML, CSS, JavaScript, and HTTP fundamentals.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    title: "Predictive Modeling Basics",
    category: "DATA ANALYTICS",
    desc: "Foundational techniques for forecasting trends using large datasets.",
    available: false
  },
  {
    title: "Predictive Modeling Basics",
    category: "DATA ANALYTICS",
    desc: "Foundational techniques for forecasting trends using large datasets."
  },
  {
    title: "Neural Network Topologies",
    category: "ARTIFICIAL INTELLIGENCE",
    desc: "Structural overview of modern deep learning architectures."
  },
  {
    title: "Distributed Systems",
    category: "INFRASTRUCTURE",
    desc: "Managing consistency and latency in global cloud applications."
  },
  {
    title: "Ethics In Algorithmic Decision Making",
    category: "PHILOSOPHY",
    desc: "Addressing bias and fairness in automated systems."
  },
  {
    title: "Advanced Network Protocols",
    category: "COMMUNICATIONS",
    desc: "Deep dive into TCP/IP optimization and next-gen routing."
  }
];

// Render functions
function renderActiveCourses() {
  const container = document.getElementById("active-courses-container");
  const section = document.getElementById("active-courses-section");
  if (!container) return;

  if (activeCourses.length === 0) {
    if (section) section.style.display = "none";
    return;
  }

  if (section) section.style.display = "block";

  container.innerHTML = activeCourses.map((course, index) => `
    <div class="course-card">
      <div class="course-card-thumb">
        <img src="${course.img || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'}" alt="${course.title}" />
        <div style="position: absolute; top: 12px; right: 12px;">
          <span class="badge badge-active">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:currentColor; margin-right:4px;"></span>
            In Progress
          </span>
        </div>
      </div>
      <div class="course-card-body">
        <div style="font-size:0.65rem; font-weight:700; color:#ea580c; letter-spacing:0.06em; margin-bottom:8px; text-transform:uppercase; background:#fff7ed; border:1px solid #ffedd5; display:inline-block; padding:3px 8px; border-radius:4px;">
          ${course.category}
        </div>
        <h3 class="course-card-title" style="font-size:1.05rem; margin-bottom:4px;">${course.title}</h3>
        
        <div style="margin-top: 16px;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text); margin-bottom:6px;">
            <span>Progress</span>
            <span style="font-weight:600;">${course.progress}%</span>
          </div>
          <div style="height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${course.progress}%; background:var(--primary); border-radius:3px;"></div>
          </div>
        </div>
      </div>
      <div class="course-card-footer" style="padding: 16px;">
        <button class="btn-primary full-width" onclick="window.location.href='course.html'">Continue Learning</button>
      </div>
    </div>
  `).join("");
}

function renderAllCourses() {
  const container = document.getElementById("all-courses-container");
  if (!container) return;

  container.innerHTML = allCourses.map(course => {
    if (course.available) {
      return `
      <div class="course-card">
        <div class="course-card-thumb">
          ${course.img 
            ? `<img src="${course.img}" alt="${course.title}" style="width:100%; height:100%; object-fit:cover;" />` 
            : `<div style="width:100%; height:100%; background:var(--primary); display:flex; align-items:center; justify-content:center;"><svg width="48" height="48" fill="none" stroke="white" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>`
          }
        </div>
        <div class="course-card-body">
          <div style="font-size:0.65rem; font-weight:700; color:var(--primary); letter-spacing:0.06em; margin-bottom:8px; text-transform:uppercase; border:1px solid var(--primary); display:inline-block; padding:3px 8px; border-radius:4px; background:var(--card);">
            ${course.category}
          </div>
          <h3 class="course-card-title">${course.title}</h3>
          <p class="course-card-desc">${course.desc}</p>
        </div>
        <div class="course-card-footer" style="padding: 16px;">
          <button class="btn-primary full-width" onclick="window.location.href='course.html'">Start Course</button>
        </div>
      </div>
      `;
    } else {
      return `
      <div class="course-card placeholder">
        <div class="course-card-thumb" style="background:#e2e8f0; display:flex; align-items:center; justify-content:center;">
          <svg width="48" height="48" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <div style="position: absolute; top: 12px; right: 12px;">
            <span class="badge badge-soon">Coming Soon</span>
          </div>
        </div>
        <div class="course-card-body">
          <div style="font-size:0.65rem; font-weight:700; color:var(--muted); letter-spacing:0.06em; margin-bottom:8px; text-transform:uppercase; border:1px solid var(--border); display:inline-block; padding:3px 8px; border-radius:4px; background:var(--card);">
            ${course.category}
          </div>
          <h3 class="course-card-title">${course.title}</h3>
          <p class="course-card-desc">${course.desc}</p>
        </div>
        <div class="course-card-footer" style="padding: 16px;">
          <button class="btn-primary full-width btn-disabled" disabled style="background:#f1f5f9; color:var(--muted); border:none; box-shadow:none;">Not Available Yet</button>
        </div>
      </div>
      `;
    }
  }).join("");
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderActiveCourses();
  renderAllCourses();
});

// Authentication state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const welcomeMessage = document.getElementById("welcome-message");
    const navAvatar = document.getElementById("nav-avatar");

    let firstName = "User";

    if (user.displayName) {
      firstName = user.displayName.split(" ")[0];
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const fullName = data.name;
        if (!user.displayName && fullName) {
          firstName = fullName.split(" ")[0];
        }
        
        if (data.activeCourses) {
          activeCourses = data.activeCourses.filter(c => allCourses.some(ac => ac.id === c.id));
          renderActiveCourses();
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }

    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome back, ${firstName}.`;
    }

    if (navAvatar) {
      navAvatar.textContent = firstName.charAt(0).toUpperCase();
    }
  } else {
    // If we want to strictly protect this page, redirect to index
    // window.location.href = "index.html";
  }
});

// Logout handling
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });
}
