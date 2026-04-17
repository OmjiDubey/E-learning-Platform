/* ============================================================
   Scholarly — Profile Page  |  js/profile.js
   ============================================================ */

// ── MOCK DATA ─────────────────────────────────────────────────
const USER = {
  name: "Alex Mercer",
  email: "alex.mercer@example.com",
  bio: "Passionate about cinema, visual design, and continuous learning.",
  enrolledCount: 4,
  avgCompletion: 64,
  totalHours: 18,
  quizzesTaken: 12,
  streak: 7
};

const FAVORITES = [
  {
    id: "f1",
    title: "Advanced CSS Architecture & Systems",
    category: "FRONTEND",
    desc: "Master scalable styling methodologies for modern web applications.",
    instructor: "Si. Kim",
    progress: 72,
    status: "continue",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "f2",
    title: "Editorial Typography Principles",
    category: "DESIGN",
    desc: "Learn how to pair fonts and create strong visual hierarchies.",
    instructor: "Si. Kim",
    progress: 0,
    status: "start",
    thumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80"
  }
];

const WATCH_LATER = [
  {
    id: "wl1",
    title: "Understanding React Server Components",
    module: "Module 3 · Advanced Web Development",
    duration: "41 min",
    thumb: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: "wl2",
    title: "Color Theory in Practice",
    module: "Module 1 · UI/UX Fundamentals",
    duration: "28 min",
    thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=80&q=80"
  }
];

const QUIZ_RESULTS = [
  { id: "q1", title: "CSS Grid Mastery Check", course: "Advanced CSS", date: "Oct 12, 2023", score: 82 },
  { id: "q2", title: "Typography Basics Quiz", course: "UI/UX Fundamentals", date: "Oct 21, 2023", score: 95 },
  { id: "q3", title: "JavaScript Closures", course: "JS Deep Dive", date: "Sep 20, 2023", score: 64 }
];

// ── DOM REFS ──────────────────────────────────────────────────
const profileNameEl = document.getElementById("profile-name");
const profileEmailEl = document.getElementById("profile-email");
const profileAvatarEl = document.getElementById("profile-avatar");
const navAvatarEl = document.getElementById("nav-avatar");
const enrolledCountEl = document.getElementById("enrolled-count");
const progressFillEl = document.getElementById("profile-progress-fill");
const progressLabelEl = document.getElementById("profile-progress-label");
const favContainer = document.getElementById("favorites-container");
const wlContainer = document.getElementById("watch-later-container");
const quizContainer = document.getElementById("quiz-results-container");

// Modal
const editBtn = document.getElementById("edit-profile-btn");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const modalSave = document.getElementById("modal-save");
const modalMsg = document.getElementById("modal-msg");
const editNameEl = document.getElementById("edit-name");
const editEmailEl = document.getElementById("edit-email");
const editBioEl = document.getElementById("edit-bio");
const logoutBtn = document.getElementById("logout-btn");

// ── RENDER: HERO ──────────────────────────────────────────────
function renderHero() {
  const initial = USER.name.charAt(0).toUpperCase();
  if (profileNameEl) profileNameEl.textContent = USER.name;
  if (profileEmailEl) profileEmailEl.textContent = USER.email;
  if (profileAvatarEl) profileAvatarEl.textContent = initial;
  if (navAvatarEl) navAvatarEl.textContent = initial;
  if (enrolledCountEl) enrolledCountEl.textContent = `${USER.enrolledCount} Courses`;
  if (progressFillEl) progressFillEl.style.width = USER.avgCompletion + "%";
  if (progressLabelEl) progressLabelEl.textContent = `${USER.avgCompletion}% avg. completion`;
}

// ── RENDER: FAVORITES ─────────────────────────────────────────
function renderFavorites() {
  if (!favContainer) return;

  if (!FAVORITES.length) {
    favContainer.innerHTML = `
      <div class="empty-state" style="min-width:100%">
        <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 12 5.09 5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
        </svg>
        <p>No favorites yet. Bookmark courses to find them here.</p>
      </div>`;
    return;
  }

  favContainer.innerHTML = FAVORITES.map(c => `
    <div class="course-card fav-card" data-id="${c.id}">
      <div class="course-card-thumb">
        <img src="${c.thumb}" alt="${c.title}" loading="lazy"/>
        <button class="fav-remove-btn" data-id="${c.id}" title="Remove" aria-label="Remove from favorites">
          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 12 5.09 5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
          </svg>
        </button>
        <span class="fav-category-pill">${c.category}</span>
      </div>
      <div class="course-card-body">
        <h3 class="course-card-title">${c.title}</h3>
        <p class="course-card-desc">${c.desc}</p>
      </div>
      <div class="course-card-footer">
        <span class="fav-instructor">
          <div class="avatar" style="width:22px;height:22px;font-size:0.65rem">${c.instructor.charAt(0)}</div>
          <span>${c.instructor}</span>
        </span>
        <button class="btn-primary fav-action-btn" style="padding:6px 14px;font-size:0.78rem">
          ${c.status === "continue" ? "Continue" : "Start Course"}
        </button>
      </div>
    </div>
  `).join("");

  favContainer.querySelectorAll(".fav-remove-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const idx = FAVORITES.findIndex(f => f.id === btn.dataset.id);
      if (idx !== -1) { FAVORITES.splice(idx, 1); renderFavorites(); }
    })
  );
}

// ── RENDER: WATCH LATER ───────────────────────────────────────
function renderWatchLater() {
  if (!wlContainer) return;

  if (!WATCH_LATER.length) {
    wlContainer.innerHTML = `
      <li class="empty-state">
        <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <p>No saved items yet.</p>
      </li>`;
    return;
  }

  wlContainer.innerHTML = WATCH_LATER.map(item => `
    <li class="wl-item" data-id="${item.id}">
      <div class="wl-thumb">
        <img src="${item.thumb}" alt="${item.title}" loading="lazy"/>
      </div>
      <div class="wl-body">
        <span class="wl-title">${item.title}</span>
        <span class="wl-module">${item.module}</span>
      </div>
      <span class="wl-duration">${item.duration}</span>
      <button class="wl-remove-btn" data-id="${item.id}" aria-label="Remove">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </li>
  `).join("");

  wlContainer.querySelectorAll(".wl-remove-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      const item = wlContainer.querySelector(`[data-id="${btn.dataset.id}"]`);
      if (!item) return;
      item.style.cssText += "transition:opacity .25s,transform .25s;opacity:0;transform:translateX(12px)";
      setTimeout(() => {
        const idx = WATCH_LATER.findIndex(w => w.id === btn.dataset.id);
        if (idx !== -1) { WATCH_LATER.splice(idx, 1); renderWatchLater(); }
      }, 270);
    })
  );
}

// ── RENDER: QUIZ RESULTS ──────────────────────────────────────
function renderQuizResults() {
  if (!quizContainer) return;

  quizContainer.innerHTML = QUIZ_RESULTS.map(q => {
    const color = q.score >= 80 ? "#16a34a" : q.score >= 60 ? "#d97706" : "#dc2626";
    const bg = q.score >= 80 ? "#dcfce7" : q.score >= 60 ? "#fef9c3" : "#fee2e2";
    return `
      <li class="qr-item">
        <div class="qr-info">
          <span class="qr-title">${q.title}</span>
          <span class="qr-sub">${q.course} · ${q.date}</span>
        </div>
        <div class="qr-score" style="background:${bg};color:${color}">${q.score}%</div>
      </li>`;
  }).join("");
}

// ── EDIT PROFILE MODAL ────────────────────────────────────────
function openModal() {
  if (editNameEl) editNameEl.value = USER.name;
  if (editEmailEl) editEmailEl.value = USER.email;
  if (editBioEl) editBioEl.value = USER.bio;
  if (modalMsg) { modalMsg.className = "msg"; modalMsg.textContent = ""; }
  modalBackdrop.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalBackdrop.classList.remove("visible");
  setTimeout(() => { document.body.style.overflow = ""; }, 220);
}

function saveProfile() {
  const name = editNameEl?.value.trim();
  const email = editEmailEl?.value.trim();
  const bio = editBioEl?.value.trim();

  if (!name || !email) {
    if (modalMsg) { modalMsg.className = "msg error"; modalMsg.textContent = "Name and email are required."; }
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (modalMsg) { modalMsg.className = "msg error"; modalMsg.textContent = "Please enter a valid email address."; }
    return;
  }

  USER.name = name;
  USER.email = email;
  USER.bio = bio ?? USER.bio;

  renderHero();
  if (modalMsg) { modalMsg.className = "msg success"; modalMsg.textContent = "Profile updated successfully!"; }
  setTimeout(closeModal, 900);
}

function initModal() {
  editBtn?.addEventListener("click", openModal);
  modalClose?.addEventListener("click", closeModal);
  modalCancel?.addEventListener("click", closeModal);
  modalSave?.addEventListener("click", saveProfile);
  modalBackdrop?.addEventListener("click", e => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modalBackdrop?.hidden) closeModal(); });
}

// ── LOGOUT ────────────────────────────────────────────────────
function initLogout() {
  logoutBtn?.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "index.html";
  });
}

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderFavorites();
  renderWatchLater();
  renderQuizResults();
  initModal();
  initLogout();
});
