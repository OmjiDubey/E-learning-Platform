import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, firestore as db } from "../firebase/config.js";

/* ============================================================
   Scholarly — Course Details JS
   course.js
   ============================================================ */

// ── COURSE DATA ─────────────────────────────────────────────
const COURSE = {
  id          : "frontend-dev-mastery",
  title       : "Frontend Development Mastery",
  category    : "WEB DEVELOPMENT",
  instructor  : "Scholarly Instructor",
  lastUpdated : "Last updated Oct 2023",
  description : `In this comprehensive guide, we start from the very basics of the web to explore how
    <strong>HTML semantics</strong>, <strong>CSS layouts</strong>, and <strong>JavaScript logic</strong>
    combine to create modern web applications.`,
  descriptionSub : `We will build multiple projects throughout this course to understand how browsers render content
    and communicate over HTTP. Pay special attention to the
    segment on 'JavaScript DOM Manipulation', as it forms the basis for the practical
    assignment at the end of this module.`,
  episodes : [
    {
      id        : 1,
      title     : "1. How the Web Works & HTTP",
      duration  : "12:15",
      completed : false,
      active    : true,
      youtubeId : "PANUQGHgxCI"
    },
    {
      id        : 2,
      title     : "2. HTML5- Tags & Elements",
      duration  : "18:30",
      completed : false,
      youtubeId : "HcOc7P5BMi4"
    },
    {
      id        : 3,
      title     : "3. CSS Flexbox & Grid",
      duration  : "24:45",
      completed : false,
      youtubeId : "ESnrn1kAD4E"
    },
    {
      id        : 4,
      title     : "4. JavaScript Fundamentals",
      duration  : "35:20",
      completed : false,
      youtubeId : "TioxU0wdMQg"
    },
    {
      id        : 5,
      title     : "5. DOM Manipulation & Events",
      duration  : "28:10",
      completed : false,
      youtubeId : "fYR3i0mcE5c"
    },
    {
      id        : 6,
      title     : "6. Building a Frontend App",
      duration  : "42:00",
      completed : false,
      youtubeId : "Lt0iZi50Vpw"
    }
  ]
};

// ── STATE ────────────────────────────────────────────────────
let currentEpisodeIndex = COURSE.episodes.findIndex(ep => ep.active) ?? 0;
let isFavorite    = false;
let isWatchLater  = false;
let currentUser   = null;

// ── DOM REFS ─────────────────────────────────────────────────
const ytPlayer              = document.getElementById("yt-player");
const episodeListEl         = document.getElementById("episode-list");
const sidebarProgressFill   = document.getElementById("sidebar-progress-fill");
const sidebarProgressPct    = document.getElementById("sidebar-progress-pct");
const episodeCountEl        = document.getElementById("episode-count");
const totalDurationEl       = document.getElementById("total-duration");
const courseTitle           = document.getElementById("course-title");
const courseCategory        = document.getElementById("course-category-pill");
const instructorName        = document.getElementById("instructor-name");
const instructorAvatar      = document.getElementById("instructor-avatar");
const lastUpdated           = document.getElementById("last-updated");
const courseDesc            = document.getElementById("course-description");
const courseDescSub         = document.getElementById("course-description-sub");
const btnFav                = document.getElementById("btn-fav");
const btnWatchLater         = document.getElementById("btn-watch-later");
const quizBtn               = document.getElementById("quiz-btn");

// ── RENDER COURSE META ────────────────────────────────────────
function renderMeta() {
  if (courseTitle)    courseTitle.innerHTML     = COURSE.title;
  if (courseCategory) courseCategory.textContent = COURSE.category;
  if (instructorName) instructorName.textContent = COURSE.instructor;
  if (lastUpdated)    lastUpdated.textContent    = COURSE.lastUpdated;
  if (courseDesc)     courseDesc.innerHTML       = COURSE.description;
  if (courseDescSub)  courseDescSub.textContent  = COURSE.descriptionSub;

  // Instructor avatar initial
  if (instructorAvatar) {
    instructorAvatar.textContent = COURSE.instructor.charAt(0).toUpperCase();
  }

  // Episode count + total duration
  const count = COURSE.episodes.length;
  if (episodeCountEl) episodeCountEl.textContent = `${count} Episode${count !== 1 ? "s" : ""}`;
  if (totalDurationEl) totalDurationEl.textContent = "3h 45m total";
}

// ── RENDER SIDEBAR PROGRESS ───────────────────────────────────
function renderSidebarProgress() {
  const completed = COURSE.episodes.filter(ep => ep.completed).length;
  const pct = Math.round((completed / COURSE.episodes.length) * 100);
  if (sidebarProgressFill) sidebarProgressFill.style.width = pct + "%";
  if (sidebarProgressPct)  sidebarProgressPct.textContent  = pct + "%";
}

// ── RENDER EPISODE LIST ──────────────────────────────────────
function renderEpisodeList() {
  if (!episodeListEl) return;

  episodeListEl.innerHTML = COURSE.episodes.map((ep, idx) => {
    const isActive    = idx === currentEpisodeIndex;
    const isCompleted = ep.completed && !isActive;

    // Icon
    let iconSvg = "";
    if (isCompleted) {
      iconSvg = `<svg class="ep-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>`;
    } else if (isActive) {
      iconSvg = `<svg class="ep-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="var(--primary)"/></svg>`;
    } else {
      iconSvg = `<svg class="ep-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
    }

    const nowPlayingBadge = isActive
      ? `<span class="ep-now-playing">Now Playing</span>` : "";

    return `
      <li
        class="episode-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}"
        data-index="${idx}"
        role="button"
        tabindex="0"
        aria-label="Play episode ${ep.id}: ${ep.title}"
      >
        ${iconSvg}
        <div class="ep-body">
          <div class="ep-title">${ep.title}</div>
          <div class="ep-meta">
            <span class="ep-duration">
              <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="opacity:0.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              ${ep.duration}
            </span>
            ${nowPlayingBadge}
          </div>
        </div>
      </li>
    `;
  }).join("");

  // Attach click handlers
  episodeListEl.querySelectorAll(".episode-item").forEach(item => {
    item.addEventListener("click",   () => switchEpisode(parseInt(item.dataset.index)));
    item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") switchEpisode(parseInt(item.dataset.index)); });
  });
}

// ── SWITCH EPISODE ────────────────────────────────────────────
function switchEpisode(idx) {
  if (idx === currentEpisodeIndex) return;

  // Mark previous as completed
  COURSE.episodes[currentEpisodeIndex].completed = true;
  COURSE.episodes[currentEpisodeIndex].active    = false;

  currentEpisodeIndex = idx;
  COURSE.episodes[idx].active = true;

  loadEpisode(idx, true);   // autoplay = true on manual switch
  renderEpisodeList();
  renderSidebarProgress();
  syncProgressToDB();
}

async function syncProgressToDB() {
  if (!currentUser) return;
  const completed = COURSE.episodes.filter(ep => ep.completed).length;
  const pct = Math.round((completed / COURSE.episodes.length) * 100);

  if (pct > 0) {
    const courseObj = {
      id: COURSE.id,
      title: COURSE.title,
      category: COURSE.category,
      desc: COURSE.description.substring(0, 80).replace(/<[^>]+>/g, '') + "...",
      progress: pct,
      completedCount: completed,
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
    };

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      let activeCourses = userSnap.exists() ? (userSnap.data().activeCourses || []) : [];
      
      const existingIdx = activeCourses.findIndex(c => c.id === COURSE.id);
      if (existingIdx !== -1) {
        activeCourses[existingIdx].progress = pct;
        activeCourses[existingIdx].completedCount = completed;
        activeCourses[existingIdx].img = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80";
      } else {
        activeCourses.push(courseObj);
      }
      
      await setDoc(userRef, { activeCourses }, { merge: true });
    } catch (e) {
      console.error("Error syncing progress:", e);
    }
  }
}

// ── LOAD EPISODE INTO YOUTUBE PLAYER ─────────────────────────
function loadEpisode(idx, autoplay = false) {
  const ep = COURSE.episodes[idx];
  if (!ytPlayer || !ep.youtubeId) return;

  const play  = autoplay ? 1 : 0;
  const params = `?enablejsapi=1&rel=0&modestbranding=1&color=white&autoplay=${play}`;
  ytPlayer.src = `https://www.youtube.com/embed/${ep.youtubeId}${params}`;

  // Update page title
  document.title = `${ep.title} — Scholarly`;
}

// ── FAVORITES & WATCH LATER ───────────────────────────────────
function initToggles() {
  if (btnFav) {
    btnFav.addEventListener("click", async () => {
      isFavorite = !isFavorite;
      btnFav.classList.toggle("active", isFavorite);
      btnFav.querySelector("svg").style.fill = isFavorite ? "var(--primary)" : "none";

      if (currentUser) {
        const courseObj = {
          id: COURSE.id,
          title: COURSE.title,
          category: COURSE.category,
          desc: COURSE.description.substring(0, 80).replace(/<[^>]+>/g, '') + "...",
          instructor: COURSE.instructor,
          progress: 0,
          status: "start",
          thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80"
        };
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          let favs = userSnap.exists() ? (userSnap.data().favorites || []) : [];
          
          if (isFavorite) {
            if (!favs.some(f => f.id === COURSE.id)) favs.push(courseObj);
          } else {
            favs = favs.filter(f => f.id !== COURSE.id);
          }
          await setDoc(userRef, { favorites: favs }, { merge: true });
        } catch (e) { console.error(e); }
      }
    });
  }

  if (btnWatchLater) {
    btnWatchLater.addEventListener("click", async () => {
      isWatchLater = !isWatchLater;
      btnWatchLater.classList.toggle("active", isWatchLater);

      if (currentUser) {
        const ep = COURSE.episodes[currentEpisodeIndex];
        const wlObj = {
          id: COURSE.id + "_ep" + ep.id,
          title: ep.title,
          module: COURSE.title,
          duration: ep.duration,
          thumb: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=80&q=80"
        };
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          let wl = userSnap.exists() ? (userSnap.data().watchLater || []) : [];
          
          if (isWatchLater) {
            if (!wl.some(w => w.id === wlObj.id)) wl.push(wlObj);
          } else {
            wl = wl.filter(w => w.id !== wlObj.id);
          }
          await setDoc(userRef, { watchLater: wl }, { merge: true });
        } catch (e) { console.error(e); }
      }
    });
  }
}

// ── QUIZ BUTTON ───────────────────────────────────────────────
function initQuizBtn() {
  if (!quizBtn) return;
  quizBtn.addEventListener("click", () => {
    window.location.href = `quiz.html?course=${COURSE.id}&ep=${currentEpisodeIndex + 1}`;
  });
}

// ── NAV AVATAR (guest fallback) ───────────────────────────────
function initNavAvatar() {
  const navAvatar = document.getElementById("nav-avatar");
  if (navAvatar && !navAvatar.textContent.trim()) {
    navAvatar.textContent = "S";
  }
}

// ── LOGOUT ────────────────────────────────────────────────────
function initLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async e => {
      e.preventDefault();
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (err) {
        console.error(err);
      }
    });
  }
}

// ── AUTH LISTENER ──────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    
    // Check if favorited or watch later
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const favs = data.favorites || [];
        const wl = data.watchLater || [];
        
        if (favs.some(f => f.id === COURSE.id)) {
          isFavorite = true;
          if (btnFav) {
            btnFav.classList.add("active");
            btnFav.querySelector("svg").style.fill = "var(--primary)";
          }
        }
        
        const ep = COURSE.episodes[currentEpisodeIndex];
        if (wl.some(w => w.id === COURSE.id + "_ep" + ep.id)) {
          isWatchLater = true;
          if (btnWatchLater) btnWatchLater.classList.add("active");
        }

        // Restore active course progress
        const activeC = data.activeCourses || [];
        const currentActive = activeC.find(c => c.id === COURSE.id);
        if (currentActive && (currentActive.completedCount > 0 || currentActive.progress > 0)) {
          const cCount = currentActive.completedCount || Math.round((currentActive.progress / 100) * COURSE.episodes.length);
          COURSE.episodes.forEach(ep => { ep.completed = false; ep.active = false; });
          for (let i = 0; i < cCount; i++) {
            if (COURSE.episodes[i]) COURSE.episodes[i].completed = true;
          }
          currentEpisodeIndex = Math.min(cCount, COURSE.episodes.length - 1);
          COURSE.episodes[currentEpisodeIndex].active = true;
          
          renderEpisodeList();
          renderSidebarProgress();
          loadEpisode(currentEpisodeIndex, false);
        }

        // Update avatar
        let firstName = "User";
        if (user.displayName) {
          firstName = user.displayName.split(" ")[0];
        } else if (data.name) {
          firstName = data.name.split(" ")[0];
        }
        const navAvatar = document.getElementById("nav-avatar");
        if (navAvatar) navAvatar.textContent = firstName.charAt(0).toUpperCase();
      }
    } catch(e) { console.error(e); }
  }
});

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderMeta();
  renderEpisodeList();
  renderSidebarProgress();
  loadEpisode(currentEpisodeIndex, false);
  initToggles();
  initQuizBtn();
  initNavAvatar();
  initLogout();
});
