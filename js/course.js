/* ============================================================
   Scholarly — Course Details JS
   course.js
   ============================================================ */

// ── COURSE DATA ─────────────────────────────────────────────
const COURSE = {
  id          : "adv-cinematic-comp",
  title       : "Advanced Cinematic Composition Techniques",
  category    : "CINEMATOGRAPHY",
  instructor  : "Dr. Dana Rostova",
  lastUpdated : "Last updated Oct 2023",
  description : `In this comprehensive breakdown, we move beyond the rule of thirds to explore how
    <strong>spatial dynamics</strong>, <strong>leading lines</strong>, and <strong>intentional framing</strong>
    can dictate the emotional resonance of a scene.`,
  descriptionSub : `We will analyze key sequences from modern cinema to understand how directors manipulate
    depth of field and perspective to guide the viewer's eye. Pay special attention to the
    segment on 'Negative Space as an Active Element', as it forms the basis for the practical
    assignment at the end of this module.`,
  episodes : [
    {
      id        : 1,
      title     : "1. Introduction to Visual Syntax",
      duration  : "32:22",
      completed : true,
      youtubeId : "_OoIDDpHFG0"   // replace with real video IDs
    },
    {
      id        : 2,
      title     : "2. The Role of Thirds Examined",
      duration  : "38:00",
      completed : true,
      youtubeId : "LWPFhD-IF2Q"
    },
    {
      id        : 3,
      title     : "3. Advanced Cinematic Composition Techniques",
      duration  : "46:15",
      completed : false,
      active    : true,
      youtubeId : "SnEMqPBFBiM"
    },
    {
      id        : 4,
      title     : "4. Depth of Field as Narrative Tool",
      duration  : "31:00",
      completed : false,
      youtubeId : "2AKtp7EktdA"
    },
    {
      id        : 5,
      title     : "5. Lighting for Emotional Impact",
      duration  : "40:08",
      completed : false,
      youtubeId : "V7z7BAZdt2M"
    },
    {
      id        : 6,
      title     : "6. Case Study: The Noir Aesthetic",
      duration  : "37:00",
      completed : false,
      youtubeId : "wCiYkW5MVDI"
    }
  ]
};

// ── STATE ────────────────────────────────────────────────────
let currentEpisodeIndex = COURSE.episodes.findIndex(ep => ep.active) ?? 0;
let isFavorite    = false;
let isWatchLater  = false;

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
    btnFav.addEventListener("click", () => {
      isFavorite = !isFavorite;
      btnFav.classList.toggle("active", isFavorite);
      btnFav.querySelector("svg").style.fill = isFavorite ? "var(--primary)" : "none";
    });
  }

  if (btnWatchLater) {
    btnWatchLater.addEventListener("click", () => {
      isWatchLater = !isWatchLater;
      btnWatchLater.classList.toggle("active", isWatchLater);
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
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }
}

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
