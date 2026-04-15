// learn.js — Learning page interactivity

const lessons = {
  'what-is-ai': { title: 'What is Artificial Intelligence?', category: 'Foundations', time: '8 min', xp: 50 },
  'ml-types': { title: 'Types of Machine Learning', category: 'Foundations', time: '10 min', xp: 50 },
  'math-for-ml': { title: 'Math for ML: Linear Algebra', category: 'Foundations', time: '15 min', xp: 75 },
  'stats-probability': { title: 'Statistics & Probability', category: 'Foundations', time: '12 min', xp: 75 },
  'python-ai': { title: 'Python for AI Basics', category: 'Foundations', time: '20 min', xp: 100 },
  'supervised-learning': { title: 'Supervised Learning', category: 'Machine Learning', time: '15 min', xp: 100 },
  'unsupervised': { title: 'Unsupervised Learning', category: 'Machine Learning', time: '12 min', xp: 100 },
  'decision-trees': { title: 'Decision Trees & Random Forests', category: 'Machine Learning', time: '18 min', xp: 125 },
  'neural-networks': { title: 'Neural Networks Fundamentals', category: 'Deep Learning', time: '20 min', xp: 150 },
};

const COMPLETED_KEY = 'neurolearn_completed';
function getCompleted() { return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'); }
function markCompleted(lessonId) {
  const comp = getCompleted();
  if (!comp.includes(lessonId)) { comp.push(lessonId); localStorage.setItem(COMPLETED_KEY, JSON.stringify(comp)); }
}
function isCompleted(lessonId) { return getCompleted().includes(lessonId); }

function loadLesson(lessonId) {
  // Update sidebar active state
  document.querySelectorAll('.lesson-item').forEach(item => {
    item.classList.toggle('active', item.dataset.lesson === lessonId);
  });

  const lesson = lessons[lessonId];
  if (!lesson) return;

  // Update lesson header
  const title = document.querySelector('.lesson-title');
  const time = document.querySelector('.lh-time');
  if (title) title.textContent = lesson.title;
  if (time) time.textContent = `⏱ ${lesson.time} read`;

  // Update complete button state
  const btn = document.getElementById('completeBtn');
  if (btn) {
    if (isCompleted(lessonId)) {
      btn.textContent = '✅ Lesson Completed!';
      btn.classList.add('completed');
      btn.disabled = true;
    } else {
      btn.textContent = '✅ Mark as Complete & Earn XP';
      btn.classList.remove('completed');
      btn.disabled = false;
      btn.onclick = () => completeLesson(lessonId, lesson.xp);
    }
  }

  // Animate progress bar
  const prog = document.getElementById('lessonProgress');
  if (prog) {
    setTimeout(() => { prog.style.width = isCompleted(lessonId) ? '100%' : '0%'; }, 100);
  }

  // Store current lesson
  window.currentLesson = lessonId;
  showToast(`📖 Loading: ${lesson.title}`, 'info');

  // Scroll to top of content
  const content = document.querySelector('.lesson-content');
  if (content) content.scrollTop = 0;
}

function completeLesson(lessonId, xp) {
  lessonId = lessonId || window.currentLesson || 'what-is-ai';
  xp = xp || 50;
  if (isCompleted(lessonId)) return;
  
  markCompleted(lessonId);
  addXP(xp);
  showToast(`🎉 Lesson complete! +${xp} XP earned!`, 'success');

  const btn = document.getElementById('completeBtn');
  if (btn) {
    btn.textContent = '✅ Lesson Completed!';
    btn.classList.add('completed');
    btn.disabled = true;
  }

  // Update progress
  const prog = document.getElementById('lessonProgress');
  if (prog) prog.style.width = '100%';

  // Update sidebar status
  const item = document.querySelector(`[data-lesson="${lessonId}"] .li-status`);
  if (item) { item.textContent = '✓'; item.classList.add('done'); }
}

function checkIQ(btn, isCorrect) {
  const allBtns = document.querySelectorAll('.iq-btn');
  allBtns.forEach(b => b.disabled = true);
  
  if (isCorrect) {
    btn.classList.add('correct');
    btn.textContent += ' ✓ Correct!';
    addXP(10);
    showToast('🎯 Correct! +10 XP', 'success');
  } else {
    btn.classList.add('wrong');
    btn.textContent += ' ✗ Wrong';
    allBtns.forEach(b => {
      if (b.onclick?.toString().includes('true')) b.classList.add('correct');
    });
    showToast('❌ Not quite! Try again next time.', 'error');
  }
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    
    document.querySelectorAll('.lesson-list').forEach(list => {
      const cat = list.dataset.category;
      const section = list.closest('.sidebar-section');
      if (filter === 'all' || cat === filter) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });
});

// Search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.lesson-item').forEach(item => {
      const title = item.querySelector('.li-title').textContent.toLowerCase();
      item.style.display = title.includes(query) ? 'flex' : 'none';
    });
  });
}

// Initialize
window.currentLesson = 'what-is-ai';
document.addEventListener('DOMContentLoaded', () => {
  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const track = params.get('track');
  if (track) {
    const trackMap = { beginner: 'what-is-ai', intermediate: 'supervised-learning', advanced: 'neural-networks' };
    if (trackMap[track]) loadLesson(trackMap[track]);
  }
  
  // Mark already completed lessons in sidebar
  getCompleted().forEach(lessonId => {
    const item = document.querySelector(`[data-lesson="${lessonId}"] .li-status`);
    if (item) { item.textContent = '✓'; item.classList.add('done'); }
  });
});
