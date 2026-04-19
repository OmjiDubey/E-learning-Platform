import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, firestore as db } from "../firebase/config.js";

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let currentUser = null;

const questionBody = document.getElementById("question-body");
const btnNext = document.getElementById("btn-next");
const quizContainer = document.getElementById("quiz-container");
const quizResult = document.getElementById("quiz-result");
const finalScoreEl = document.getElementById("final-score");

async function loadQuestions() {
  try {
    const res = await fetch("js/questions.json");
    questions = await res.json();
    renderQuestion();
  } catch(e) {
    console.error("Error loading questions", e);
  }
}

function renderQuestion() {
  if (questions.length === 0) return;
  const q = questions[currentQuestionIndex];
  
  let html = `
    <h2 class="question-text">${q.question}</h2>
    <p class="question-hint">${q.hint}</p>
    <div class="options-list">
  `;
  
  q.options.forEach(opt => {
    const isSelected = userAnswers[currentQuestionIndex] === opt.id;
    html += `
      <label class="quiz-option-custom ${isSelected ? 'selected' : ''}">
        <input type="radio" name="q${currentQuestionIndex}" value="${opt.id}" class="radio-input" ${isSelected ? 'checked' : ''}>
        <span class="custom-radio"></span>
        <div class="option-content">
          <span class="option-title">${opt.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
          <span class="option-desc">${opt.desc}</span>
        </div>
      </label>
    `;
  });
  
  html += `</div>`;
  questionBody.innerHTML = html;
  
  // Attach click listeners to options
  const options = document.querySelectorAll('.quiz-option-custom');
  options.forEach(option => {
    option.addEventListener('click', function() {
      options.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
      userAnswers[currentQuestionIndex] = radio.value;
    });
  });

  if (currentQuestionIndex === questions.length - 1) {
    btnNext.textContent = "Submit Quiz";
  } else {
    btnNext.textContent = "Next Question";
  }
}

btnNext.addEventListener('click', async () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    submitQuiz();
  }
});

async function submitQuiz() {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) {
      score++;
    }
  });
  
  const percentage = Math.round((score / questions.length) * 100);
  
  if (currentUser) {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      let results = userSnap.exists() ? (userSnap.data().quizResults || []) : [];
      
      const newResult = {
        id: "quiz_" + Date.now(),
        title: "Frontend Fundamentals Quiz",
        course: "Frontend Dev",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: percentage
      };
      
      results.push(newResult);
      await setDoc(userRef, { quizResults: results }, { merge: true });
    } catch(e) {
      console.error(e);
    }
  }
  
  quizContainer.style.display = "none";
  finalScoreEl.textContent = percentage + "%";
  quizResult.style.display = "block";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    
    // Update avatar
    let firstName = "User";
    if (user.displayName) {
      firstName = user.displayName.split(" ")[0];
    } else {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().name) {
          firstName = userDoc.data().name.split(" ")[0];
        }
      } catch(e) {}
    }
    const navAvatar = document.getElementById("nav-avatar");
    if (navAvatar) navAvatar.textContent = firstName.charAt(0).toUpperCase();
  } else {
    // Redirect if not logged in
    window.location.href = "index.html";
  }
});

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

document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
});
