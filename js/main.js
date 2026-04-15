// ============================================
// NEUROLEARN — MAIN JS (Shared across all pages)
// ============================================

// XP System
const XP_KEY = 'neurolearn_xp';
const BADGES_KEY = 'neurolearn_badges';
const PROGRESS_KEY = 'neurolearn_progress';

function getXP() { return parseInt(localStorage.getItem(XP_KEY) || '0'); }
function addXP(amount) {
  const curr = getXP();
  localStorage.setItem(XP_KEY, curr + amount);
  updateXPDisplay();
  showXPToast(amount);
}
function updateXPDisplay() {
  const el = document.getElementById('xpCount');
  if (el) el.textContent = `${getXP()} XP`;
}

function showXPToast(amount) {
  const toast = document.createElement('div');
  toast.className = 'xp-toast';
  toast.innerHTML = `<span>⚡ +${amount} XP</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2000);
}

// Toast system
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
}

// Set active nav link based on page
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const navIds = { 'index.html': 'nav-home', 'learn.html': 'nav-learn', 'playground.html': 'nav-playground', 'games.html': 'nav-games', 'quiz.html': 'nav-quiz', 'simulate.html': 'nav-simulate' };
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeId = navIds[page];
  if (activeId) { const el = document.getElementById(activeId); if (el) el.classList.add('active'); }
}
setActiveNav();

// Counter animation
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Animate counters
      if (entry.target.classList.contains('stat-num')) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .path-card, .game-preview-card, .stat-num').forEach(el => {
  observer.observe(el);
});

// Neural network canvas visualization (hero page)
function drawNeuralNet() {
  const container = document.getElementById('neuralViz');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.width = 380;
  canvas.height = 380;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const layers = [[3, 0.2], [4, 0.5], [4, 0.5], [2, 0.8]];
  const neurons = [];
  const W = 380, H = 380;

  layers.forEach(([count], li) => {
    const x = (W / (layers.length + 1)) * (li + 1);
    const arr = [];
    for (let ni = 0; ni < count; ni++) {
      const y = (H / (count + 1)) * (ni + 1);
      arr.push({ x, y, val: Math.random() });
    }
    neurons.push(arr);
  });

  let phase = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    phase += 0.02;

    // Draw connections
    for (let li = 0; li < neurons.length - 1; li++) {
      neurons[li].forEach(n1 => {
        neurons[li + 1].forEach(n2 => {
          const pulse = (Math.sin(phase + n1.x * 0.01 + n2.y * 0.01) + 1) / 2;
          const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
          grad.addColorStop(0, `rgba(167,139,250,${0.05 + pulse * 0.2})`);
          grad.addColorStop(1, `rgba(56,189,248,${0.05 + pulse * 0.2})`);
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1 + pulse;
          ctx.stroke();
        });
      });
    }

    // Draw neurons
    neurons.forEach((layer, li) => {
      layer.forEach((n, ni) => {
        const pulse = (Math.sin(phase * 1.5 + li + ni) + 1) / 2;
        const r = 14 + pulse * 4;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2);
        const colors = ['rgba(167,139,250,', 'rgba(56,189,248,', 'rgba(244,114,182,', 'rgba(52,211,153,'];
        const c = colors[li % colors.length];
        grad.addColorStop(0, `${c}0.8)`);
        grad.addColorStop(1, `${c}0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r / 2, 0, Math.PI * 2);
        ctx.fillStyle = `${c}0.9)`;
        ctx.fill();
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// Toast CSS injection
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.xp-toast, .toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  z-index: 9999;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  font-family: 'Outfit', sans-serif;
  pointer-events: none;
}
.xp-toast { background: linear-gradient(135deg, #fbbf24, #f59e0b); box-shadow: 0 8px 24px rgba(251,191,36,0.4); }
.toast-success { background: linear-gradient(135deg, #34d399, #059669); box-shadow: 0 8px 24px rgba(52,211,153,0.4); }
.toast-error { background: linear-gradient(135deg, #f87171, #dc2626); box-shadow: 0 8px 24px rgba(248,113,113,0.4); }
.toast-info { background: linear-gradient(135deg, #a78bfa, #7c3aed); box-shadow: 0 8px 24px rgba(167,139,250,0.4); }
.xp-toast.show, .toast.show { transform: translateY(0); opacity: 1; }
`;
document.head.appendChild(toastStyles);

// Initialize (base)
document.addEventListener('DOMContentLoaded', () => {
  updateXPDisplay();
  drawNeuralNet();
});

// ============================================
// AUTH SYSTEM  (Req 3.1)
// ============================================
const USER_KEY = 'neurolearn_user';
const USERS_KEY = 'neurolearn_users';

function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
function setCurrentUser(u) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

function registerUser(name, email, password) {
  if (!name || !email || !password) return { error: 'All fields are required.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  const users = getUsers();
  if (users.find(u => u.email === email)) return { error: 'Email already registered!' };
  const user = {
    id: Date.now(), name, email,
    password: btoa(password),
    xp: 0, streak: 1,
    joinDate: new Date().toLocaleDateString()
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  return { user };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === btoa(password));
  if (!user) return { error: 'Invalid email or password. Please try again.' };
  setCurrentUser(user);
  return { user };
}

function logoutUser() {
  setCurrentUser(null);
  updateAuthUI();
  showToast('👋 Logged out. See you soon!', 'info');
}

function syncUserXP() {
  const user = getCurrentUser();
  if (!user) return;
  const xp = getXP();
  user.xp = xp;
  setCurrentUser(user);
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) { users[idx].xp = xp; saveUsers(users); }
}

// ============================================
// AUTH UI — Injected into all pages via JS
// ============================================
function injectAuthSystem() {
  // 1. Inject Login Modal into body
  if (!document.getElementById('authOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.className = 'auth-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-label="Authentication">
        <button class="auth-close" onclick="closeAuth()" aria-label="Close">✕</button>
        <div class="auth-logo">
          <span class="logo-text">Neuro<span class="logo-accent">Learn</span></span>
          <p>Your AI/ML Learning Journey Starts Here 🚀</p>
        </div>
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab active" id="loginTab" role="tab" onclick="switchAuthTab('login')">🔐 Login</button>
          <button class="auth-tab" id="registerTab" role="tab" onclick="switchAuthTab('register')">✨ Register</button>
        </div>
        <form class="auth-form" id="loginForm" onsubmit="handleLogin(event)">
          <div class="af-field">
            <label for="loginEmail">Email Address</label>
            <input type="email" id="loginEmail" placeholder="you@example.com" autocomplete="email" required />
          </div>
          <div class="af-field">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password" required />
          </div>
          <p class="af-error" id="loginError" role="alert"></p>
          <button type="submit" class="af-submit">Sign In →</button>
          <p class="af-switch">Don't have an account? <button type="button" onclick="switchAuthTab('register')">Register here</button></p>
        </form>
        <form class="auth-form" id="registerForm" style="display:none" onsubmit="handleRegister(event)">
          <div class="af-field">
            <label for="regName">Full Name</label>
            <input type="text" id="regName" placeholder="e.g. Aditya Kumar" autocomplete="name" required />
          </div>
          <div class="af-field">
            <label for="regEmail">Email Address</label>
            <input type="email" id="regEmail" placeholder="you@example.com" autocomplete="email" required />
          </div>
          <div class="af-field">
            <label for="regPassword">Password <span style="color:var(--text-muted);font-weight:400">(min 6 chars)</span></label>
            <input type="password" id="regPassword" placeholder="••••••••" autocomplete="new-password" required />
          </div>
          <p class="af-error" id="registerError" role="alert"></p>
          <button type="submit" class="af-submit">Create Account →</button>
          <p class="af-switch">Already have an account? <button type="button" onclick="switchAuthTab('login')">Login here</button></p>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeAuth(); });
  }

  // 2. Inject user profile + login button into .nav-actions
  const navActions = document.querySelector('.nav-actions');
  if (navActions && !document.getElementById('userNavProfile')) {
    const profileEl = document.createElement('div');
    profileEl.id = 'userNavProfile';
    profileEl.className = 'user-nav-profile';
    profileEl.style.display = 'none';
    profileEl.innerHTML = `
      <div class="unp-avatar" id="unpAvatar">A</div>
      <span class="unp-name" id="unpName">User</span>
      <button class="unp-logout" onclick="logoutUser()" title="Logout">↩</button>
    `;

    const loginBtn = document.createElement('button');
    loginBtn.id = 'loginNavBtn';
    loginBtn.className = 'btn-outline';
    loginBtn.innerHTML = '🔐 Login';
    loginBtn.onclick = () => openAuth('login');

    // Insert before hamburger (or at end)
    const hamburgerEl = navActions.querySelector('.hamburger');
    navActions.insertBefore(loginBtn, hamburgerEl || null);
    navActions.insertBefore(profileEl, loginBtn);
  }

  updateAuthUI();
}

function updateAuthUI() {
  const user = getCurrentUser();
  const profileEl = document.getElementById('userNavProfile');
  const loginBtn = document.getElementById('loginNavBtn');
  const avatarEl = document.getElementById('unpAvatar');
  const nameEl = document.getElementById('unpName');

  if (user) {
    if (profileEl) profileEl.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = user.name.split(' ')[0];
  } else {
    if (profileEl) profileEl.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'flex';
    // Show login prompt on leaderboard if not logged in
    const prompt = document.getElementById('lbLoginPrompt');
    if (prompt) prompt.style.display = 'block';
  }
  syncUserXP();
  updateXPDisplay();
}

function openAuth(tab = 'login') {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    switchAuthTab(tab);
    document.body.style.overflow = 'hidden';
    // Clear errors
    ['loginError', 'registerError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }
}

function closeAuth() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
}

function switchAuthTab(tab) {
  const lf = document.getElementById('loginForm');
  const rf = document.getElementById('registerForm');
  if (lf) lf.style.display = tab === 'login' ? 'flex' : 'none';
  if (rf) rf.style.display = tab === 'register' ? 'flex' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById(tab + 'Tab');
  if (activeTab) activeTab.classList.add('active');
}

function handleLogin(e) {
  e.preventDefault();
  const errEl = document.getElementById('loginError');
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const result = loginUser(email, password);
  if (result.error) { if (errEl) errEl.textContent = result.error; return; }
  closeAuth();
  updateAuthUI();
  renderLeaderboard();
  renderBadgeGrid();
  showToast(`🎉 Welcome back, ${result.user.name}!`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const errEl = document.getElementById('registerError');
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const result = registerUser(name, email, password);
  if (result.error) { if (errEl) errEl.textContent = result.error; return; }
  closeAuth();
  updateAuthUI();
  addXP(100); // Welcome bonus XP
  renderLeaderboard();
  renderBadgeGrid();
  showToast(`🚀 Welcome, ${name}! You earned +100 XP just for joining!`, 'success');
}

// ============================================
// BADGE SYSTEM  (Req 3.8)
// ============================================
const BADGES_DEF = [
  { id: 'ai-pioneer',    icon: '🏆', name: 'AI Pioneer',     desc: 'Joined NeuroLearn',      xpReq: 0    },
  { id: 'quick-learner', icon: '⚡', name: 'Quick Learner',  desc: 'Earned 100 XP',          xpReq: 100  },
  { id: 'bot-builder',   icon: '🤖', name: 'Bot Builder',    desc: 'Earned 200 XP',          xpReq: 200  },
  { id: 'streak-7',      icon: '🔥', name: '7-Day Streak',   desc: 'Earned 300 XP',          xpReq: 300  },
  { id: 'neuro-master',  icon: '🧠', name: 'Neuro Master',   desc: 'Earned 500 XP',          xpReq: 500  },
  { id: 'quiz-champ',    icon: '🎯', name: 'Quiz Champion',  desc: 'Earned 1000 XP',         xpReq: 1000 },
  { id: 'data-wizard',   icon: '🔮', name: 'Data Wizard',    desc: 'Earned 1500 XP',         xpReq: 1500 },
  { id: 'deep-diver',    icon: '🌊', name: 'Deep Diver',     desc: 'Earned 2000 XP',         xpReq: 2000 },
];

function getEarnedBadges() {
  const xp = getXP();
  return BADGES_DEF.filter(b => xp >= b.xpReq);
}

function renderBadgeGrid() {
  const grid = document.getElementById('badgeGrid');
  if (!grid) return;
  const xp = getXP();
  const earned = getEarnedBadges();

  grid.innerHTML = BADGES_DEF.map(b => {
    const isEarned = xp >= b.xpReq;
    return `
      <div class="bs-badge ${isEarned ? 'earned' : 'locked'}" title="${b.desc}${isEarned ? ' ✓' : ` — need ${b.xpReq} XP`}">
        <div class="bs-icon">${b.icon}</div>
        <div class="bs-name">${b.name}</div>
        <div class="bs-desc">${isEarned ? b.desc : `🔒 ${b.xpReq} XP`}</div>
      </div>
    `;
  }).join('');

  const infoEl = document.getElementById('bsXpInfo');
  if (infoEl) {
    const next = BADGES_DEF.find(b => xp < b.xpReq);
    infoEl.innerHTML = next
      ? `<div class="bs-next-badge">⚡ <strong>${xp} XP earned</strong> · ${next.xpReq - xp} XP to unlock <strong>${next.icon} ${next.name}</strong></div>`
      : `<div class="bs-next-badge" style="color:var(--green)">🏆 All badges unlocked! You're a NeuroLearn master!</div>`;
  }
}

// Auto-award badge notification when newly unlocked
function checkBadgeUnlocks(prevXP, newXP) {
  BADGES_DEF.forEach(b => {
    if (prevXP < b.xpReq && newXP >= b.xpReq) {
      setTimeout(() => showToast(`🎖️ Badge Unlocked: ${b.icon} ${b.name}!`, 'success'), 600);
    }
  });
}

// Patch addXP to also check badge unlocks
const _origAddXP = addXP;
window.addXP = function(amount) {
  const prev = getXP();
  _origAddXP(amount);
  checkBadgeUnlocks(prev, getXP());
  syncUserXP();
  renderBadgeGrid();
};

// ============================================
// LEADERBOARD  (Req 3.8)
// ============================================
const MOCK_LEADERBOARD = [
  { name: 'Aryan S.',   xp: 2450, streak: 12 },
  { name: 'Priya K.',   xp: 2210, streak: 8  },
  { name: 'Rohan M.',   xp: 1980, streak: 5  },
  { name: 'Aisha T.',   xp: 1750, streak: 7  },
  { name: 'Dev P.',     xp: 1520, streak: 3  },
  { name: 'Sneha R.',   xp: 1340, streak: 4  },
  { name: 'Karan B.',   xp: 1190, streak: 2  },
  { name: 'Meera J.',   xp: 980,  streak: 6  },
  { name: 'Vivek N.',   xp: 820,  streak: 1  },
  { name: 'Anjali D.',  xp: 650,  streak: 2  },
];

function renderLeaderboard() {
  const el = document.getElementById('leaderboardList');
  if (!el) return;

  const user = getCurrentUser();
  const myXP = getXP();
  const entries = [...MOCK_LEADERBOARD];

  // Inject real user into list
  if (user) {
    const existing = entries.findIndex(e => e.name.startsWith(user.name));
    const myEntry = { name: user.name, xp: Math.max(myXP, 1), streak: user.streak || 1, isMe: true };
    if (existing >= 0) entries.splice(existing, 1, myEntry);
    else entries.push(myEntry);

    const promptEl = document.getElementById('lbLoginPrompt');
    if (promptEl) promptEl.style.display = 'none';
  }

  entries.sort((a, b) => b.xp - a.xp);
  const top10 = entries.slice(0, 10);
  const rankEmoji = ['🥇', '🥈', '🥉'];

  el.innerHTML = top10.map((u, i) => {
    const rank = rankEmoji[i] || `<span style="font-size:0.85rem;color:var(--text-muted)">#${i + 1}</span>`;
    return `
      <div class="lb-row ${u.isMe ? 'lb-me' : ''}">
        <div class="lb-rank">${rank}</div>
        <div class="lb-avatar" style="${u.isMe ? 'background:var(--gradient-hot)' : ''}">${u.name.charAt(0).toUpperCase()}</div>
        <div class="lb-info">
          <div class="lb-name">${u.name}${u.isMe ? ' <span class="lb-you-tag">YOU</span>' : ''}</div>
          <div class="lb-streak">🔥 ${u.streak}-day streak</div>
        </div>
        <div class="lb-xp">
          <span class="lb-xp-val">⚡ ${u.xp.toLocaleString()}</span>
          <span class="lb-xp-label">XP</span>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// PROGRESS DASHBOARD UPDATE  (Req 3.7)
// ============================================
function updateDashboard() {
  const xp = getXP();
  const completed = JSON.parse(localStorage.getItem('neurolearn_completed') || '[]');
  const quizScores = JSON.parse(localStorage.getItem('neurolearn_quiz_scores') || '{}');
  const totalLessons = 16;
  const pct = Math.min(100, Math.round((completed.length / totalLessons) * 100));

  // Update circular progress
  const circle = document.querySelector('.ws-circle');
  if (circle) {
    const deg = Math.round(pct * 3.6);
    circle.style.background = `conic-gradient(#a78bfa ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)`;
    const span = circle.querySelector('span');
    if (span) span.textContent = `${pct}%`;
  }

  // Update badge items in existing dashboard widget
  const badgeItems = document.querySelectorAll('.ws-badges .badge-item');
  const earned = getEarnedBadges();
  if (badgeItems.length > 0) {
    BADGES_DEF.slice(0, badgeItems.length).forEach((b, i) => {
      if (i < badgeItems.length) {
        const isEarned = earned.find(e => e.id === b.id);
        badgeItems[i].className = `badge-item ${isEarned ? 'earned' : ''}`;
        badgeItems[i].textContent = `${b.icon} ${b.name}`;
        badgeItems[i].title = isEarned ? `Earned! ${b.desc}` : `Locked — need ${b.xpReq} XP`;
      }
    });
  }

  // Update progress bars in the feature card
  const fills = document.querySelectorAll('.prog-fill');
  const progressData = [
    Math.min(100, Math.round((completed.filter(l => ['what-is-ai','ml-types','math-for-ml','stats-probability','python-ai'].includes(l)).length / 5) * 100)),
    Math.min(100, Math.round((completed.filter(l => ['supervised-learning','unsupervised','decision-trees','svm','clustering','model-evaluation'].includes(l)).length / 6) * 100)),
    Math.min(100, Math.round((completed.filter(l => ['neural-networks','cnn','rnn-lstm','transformers','generative-ai'].includes(l)).length / 5) * 100)),
  ];
  fills.forEach((fill, i) => {
    if (progressData[i] !== undefined) {
      fill.style.width = `${progressData[i]}%`;
      fill.closest('.prog-bar-wrap')?.querySelector('span:last-child')?.textContent !== undefined &&
        (fill.closest('.prog-bar-wrap').querySelector('span:last-child').textContent = `${progressData[i]}%`);
    }
  });
}

// ============================================
// GLOBAL INIT (runs on every page)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  injectAuthSystem();
  renderLeaderboard();
  renderBadgeGrid();
  updateDashboard();
});

