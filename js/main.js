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

// Profile Dropdown + Modal CSS
const profileStyles = document.createElement('style');
profileStyles.textContent = `
/* ---- Nav Profile Pill ---- */
.user-nav-profile {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 5px 12px 5px 6px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  transition: var(--transition);
  position: relative;
  user-select: none;
}
.user-nav-profile:hover { border-color: var(--border-hover); box-shadow: var(--shadow-card); }
.unp-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--gradient-main);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 800; color: white; flex-shrink: 0;
  overflow: hidden;
}
.unp-name { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
.unp-chevron { font-size: 0.7rem; color: var(--text-muted); transition: transform 0.2s; }
.unp-dropdown.open ~ * .unp-chevron,
.user-nav-profile:has(.unp-dropdown.open) .unp-chevron { transform: rotate(180deg); }

/* Dropdown */
.unp-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0;
  min-width: 200px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card), 0 16px 40px rgba(0,0,0,0.4);
  z-index: 9990;
  opacity: 0; transform: translateY(-8px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  padding: 6px;
}
.unp-dropdown.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
.unp-dd-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; text-align: left;
  padding: 10px 14px; border-radius: var(--radius-md);
  font-family: var(--font-main); font-size: 0.88rem; font-weight: 600;
  color: var(--text-secondary);
  background: transparent; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.unp-dd-item:hover { background: rgba(167,139,250,0.1); color: var(--text-primary); }
.unp-dd-divider { height: 1px; background: var(--border); margin: 4px 0; }
.unp-dd-logout { color: #f87171; }
.unp-dd-logout:hover { background: rgba(248,113,113,0.1); color: #f87171; }

/* ---- Profile Modal ---- */
.profile-modal-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.profile-modal {
  width: 100%; max-width: 460px; max-height: 90vh;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  overflow-y: auto;
  animation: fadeInUp 0.3s ease;
  display: flex; flex-direction: column; gap: 0;
}
.pm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px 0;
}
.pm-header h2 { font-size: 1.2rem; font-weight: 800; }
.pm-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.06); border: 1px solid var(--border);
  font-size: 0.85rem; color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.pm-close:hover { background: rgba(248,113,113,0.15); color: #f87171; border-color: rgba(248,113,113,0.3); }

/* Avatar */
.pm-avatar-section { display: flex; flex-direction: column; align-items: center; padding: 20px 24px 0; gap: 8px; }
.pm-avatar-wrap { position: relative; width: 80px; height: 80px; }
.pm-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--gradient-main);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 900; color: white;
  border: 3px solid var(--border);
  overflow: hidden;
}
.pm-avatar-edit {
  position: absolute; bottom: 2px; right: 2px;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--bg-card); border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; cursor: pointer;
  transition: var(--transition);
}
.pm-avatar-edit:hover { border-color: var(--purple); background: rgba(167,139,250,0.15); }
.pm-avatar-hint { font-size: 0.75rem; color: var(--text-muted); }

/* Tabs */
.pm-tabs {
  display: flex; gap: 6px; padding: 16px 24px 0;
  border-bottom: 1px solid var(--border);
}
.pm-tab {
  flex: 1; padding: 9px 16px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-family: var(--font-main); font-size: 0.85rem; font-weight: 700;
  color: var(--text-muted); background: transparent; cursor: pointer;
  border: 1px solid transparent; border-bottom: none;
  transition: var(--transition);
}
.pm-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
.pm-tab.active {
  color: var(--purple); background: rgba(167,139,250,0.08);
  border-color: var(--border);
}

/* Sections */
.pm-section {
  display: flex; flex-direction: column; gap: 16px;
  padding: 20px 24px 24px;
}
.pm-field { display: flex; flex-direction: column; gap: 6px; }
.pm-field label { font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); }
.pm-field input, .pm-field textarea {
  padding: 11px 14px;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-main); font-size: 0.9rem;
  transition: border-color 0.2s;
  resize: vertical;
}
.pm-field input:focus, .pm-field textarea:focus {
  outline: none; border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
}
.pm-field input:disabled { opacity: 0.45; cursor: not-allowed; }
.pm-field-note { font-size: 0.75rem; color: var(--text-muted); margin-top: -2px; }
.pm-error { font-size: 0.82rem; color: #f87171; font-weight: 600; min-height: 18px; }
.pm-save {
  padding: 12px 24px;
  background: var(--gradient-main);
  color: white; font-family: var(--font-main);
  font-size: 0.95rem; font-weight: 700;
  border-radius: var(--radius-md);
  cursor: pointer; transition: var(--transition); align-self: flex-end;
}
.pm-save:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }

/* ---- OAuth Social Buttons ---- */
.af-oauth {
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 4px;
}
.af-oauth-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 11px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-main); font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
  border: 1.5px solid var(--border);
}
.af-google {
  background: #fff; color: #3c4043;
  border-color: #dadce0;
}
.af-google:hover { background: #f8f9fa; box-shadow: 0 2px 12px rgba(0,0,0,0.15); transform: translateY(-1px); }
.af-github {
  background: #24292f; color: #fff;
  border-color: #444c56;
}
.af-github:hover { background: #2d333b; box-shadow: 0 2px 12px rgba(0,0,0,0.35); transform: translateY(-1px); }

.af-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 4px 0;
}
.af-divider::before, .af-divider::after {
  content: ''; flex: 1; height: 1px;
  background: var(--border);
}
.af-divider span { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }

/* ---- OAuth Popup ---- */
.oauth-popup-overlay {
  position: fixed; inset: 0; z-index: 20000;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
.oauth-popup {
  width: 100%; max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  overflow: hidden;
  animation: fadeInUp 0.25s ease;
  font-family: 'Outfit', sans-serif;
}
.oauth-popup-header {
  display: flex; align-items: center; gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e8eaed;
}
.oauth-header-logo { flex-shrink: 0; }
.oauth-header-text h3 { font-size: 1rem; font-weight: 700; color: #202124; margin-bottom: 2px; }
.oauth-header-text p { font-size: 0.78rem; color: #5f6368; }
.oauth-popup-body { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 14px; }
.oauth-loading {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 8px 0 4px;
}
.oauth-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 3px solid #e8eaed;
  border-top-color: #4285F4;
  animation: spin 0.8s linear infinite;
}
.oauth-spinner.github-spin { border-top-color: #24292f; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.oauth-loading p { font-size: 0.88rem; color: #5f6368; text-align: center; }
.oauth-account-select { display: flex; flex-direction: column; gap: 8px; }
.oauth-account-select p { font-size: 0.85rem; color: #5f6368; margin-bottom: 4px; font-weight: 500; }
.oauth-account-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 8px;
  border: 1.5px solid #e8eaed; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #fff;
}
.oauth-account-row:hover { border-color: #4285F4; background: #f8f9ff; }
.oauth-account-row.github-row:hover { border-color: #24292f; background: #f6f8fa; }
.oauth-acc-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 800; color: #fff; flex-shrink: 0;
}
.oauth-acc-info { flex: 1; text-align: left; }
.oauth-acc-name { font-size: 0.9rem; font-weight: 700; color: #202124; }
.oauth-acc-email { font-size: 0.78rem; color: #5f6368; }
.oauth-acc-check { font-size: 1rem; }
.oauth-use-other {
  font-size: 0.82rem; color: #4285F4; font-weight: 600;
  background: transparent; cursor: pointer; border: none;
  padding: 6px 0; width: 100%; text-align: center;
  transition: opacity 0.15s;
}
.oauth-use-other:hover { opacity: 0.75; }
.oauth-email-form { display: flex; flex-direction: column; gap: 10px; }
.oauth-email-form input {
  padding: 11px 14px;
  border: 1.5px solid #dadce0; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: #202124;
  outline: none; transition: border-color 0.15s;
}
.oauth-email-form input:focus { border-color: #4285F4; box-shadow: 0 0 0 3px rgba(66,133,244,0.15); }
.oauth-email-form input.gh-focus:focus { border-color: #24292f; box-shadow: 0 0 0 3px rgba(36,41,47,0.12); }
.oauth-email-form p.oauth-form-hint { font-size: 0.75rem; color: #5f6368; }
.oauth-continue-btn {
  padding: 11px 20px;
  border-radius: 8px; font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: all 0.15s; width: 100%;
  color: #fff;
}
.oauth-continue-btn.google-btn { background: #4285F4; border: none; }
.oauth-continue-btn.google-btn:hover { background: #3367d6; box-shadow: 0 2px 12px rgba(66,133,244,0.4); }
.oauth-continue-btn.github-btn { background: #24292f; border: none; }
.oauth-continue-btn.github-btn:hover { background: #2d333b; box-shadow: 0 2px 12px rgba(36,41,47,0.4); }
.oauth-policy { font-size: 0.72rem; color: #80868b; text-align: center; line-height: 1.4; }
.oauth-popup-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid #e8eaed;
  background: #f8f9fa;
}
.oauth-footer-logo { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #80868b; font-weight: 600; }
.oauth-footer-cancel {
  font-size: 0.8rem; color: #80868b; background: transparent;
  border: none; cursor: pointer; font-family: 'Outfit', sans-serif;
  padding: 4px 8px; border-radius: 4px; transition: background 0.15s;
}
.oauth-footer-cancel:hover { background: #e8eaed; }
`;
document.head.appendChild(profileStyles);

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
  // Always compare against fresh USERS_KEY data (not stale getCurrentUser snapshot)
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === btoa(password));
  if (!user) return { error: 'Invalid email or password. Please try again.' };
  // Store a fresh copy from the canonical users array
  setCurrentUser({ ...user });
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
  if (idx >= 0) { users[idx] = { ...users[idx], xp }; saveUsers(users); }
}

// Update a field in both getCurrentUser snapshot AND the canonical USERS_KEY array
function updateUserField(fields) {
  const user = getCurrentUser();
  if (!user) return;
  const updated = { ...user, ...fields };
  setCurrentUser(updated);
  const users = getUsers();
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx >= 0) { users[idx] = { ...users[idx], ...fields }; saveUsers(users); }
  return updated;
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
          <div class="af-oauth">
            <button type="button" class="af-oauth-btn af-google" onclick="openOAuthFlow('google')">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>
            <button type="button" class="af-oauth-btn af-github" onclick="openOAuthFlow('github')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>
          <div class="af-divider"><span>or sign in with email</span></div>
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
          <div class="af-oauth">
            <button type="button" class="af-oauth-btn af-google" onclick="openOAuthFlow('google')">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
              Sign up with Google
            </button>
            <button type="button" class="af-oauth-btn af-github" onclick="openOAuthFlow('github')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Sign up with GitHub
            </button>
          </div>
          <div class="af-divider"><span>or register with email</span></div>
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
      <span class="unp-chevron">▾</span>
      <div class="unp-dropdown" id="unpDropdown">
        <button class="unp-dd-item" onclick="openProfileModal(); closeProfileDropdown();">👤 Profile Settings</button>
        <div class="unp-dd-divider"></div>
        <button class="unp-dd-item unp-dd-logout" onclick="logoutUser()">↩ Sign Out</button>
      </div>
    `;
    profileEl.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('unpDropdown').classList.toggle('open');
    });
    document.addEventListener('click', closeProfileDropdown);

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
    // Avatar: photo or initial
    if (avatarEl) {
      if (user.photo) {
        avatarEl.style.backgroundImage = `url(${user.photo})`;
        avatarEl.style.backgroundSize = 'cover';
        avatarEl.style.backgroundPosition = 'center';
        avatarEl.textContent = '';
      } else {
        avatarEl.style.backgroundImage = '';
        avatarEl.textContent = user.name.charAt(0).toUpperCase();
      }
    }
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
// OAUTH SOCIAL LOGIN (Google / GitHub)
// ============================================
const OAUTH_PROVIDER_UI = {
  google: {
    name: 'Google',
    accentColor: '#4285F4',
    avatarBg: 'linear-gradient(135deg,#4285F4,#34A853)',
    spinnerClass: '',
    btnClass: 'google-btn',
    footerLogoSvg: `<svg width="14" height="14" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>`,
    policyText: 'By continuing, Google will share your name and email address with NeuroLearn.',
    headerIconSvg: `<svg width="32" height="32" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>`,
  },
  github: {
    name: 'GitHub',
    accentColor: '#24292f',
    avatarBg: 'linear-gradient(135deg,#24292f,#57606a)',
    spinnerClass: 'github-spin',
    btnClass: 'github-btn',
    footerLogoSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#24292f"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
    policyText: 'By continuing, GitHub will share your username and email address with NeuroLearn.',
    headerIconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#24292f"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
  },
};

function openOAuthFlow(provider) {
  closeAuth();
  const ui = OAUTH_PROVIDER_UI[provider];
  // Show ALL known accounts (from any registration method) — like Google's account picker
  const allUsers = getUsers();
  const currentUser = getCurrentUser();

  // Remove any old OAuth popup
  const old = document.getElementById('oauthPopup');
  if (old) old.remove();

  const popup = document.createElement('div');
  popup.id = 'oauthPopup';
  popup.className = 'oauth-popup-overlay';
  popup.innerHTML = `
    <div class="oauth-popup" role="dialog" aria-modal="true">
      <div class="oauth-popup-header">
        <div class="oauth-header-logo">${ui.headerIconSvg}</div>
        <div class="oauth-header-text">
          <h3>Sign in with ${ui.name}</h3>
          <p>to continue to NeuroLearn</p>
        </div>
      </div>
      <div class="oauth-popup-body" id="oauthPopupBody">
        <div class="oauth-loading" id="oauthLoading">
          <div class="oauth-spinner ${ui.spinnerClass}"></div>
          <p>Connecting to ${ui.name}...</p>
        </div>
      </div>
      <div class="oauth-popup-footer">
        <div class="oauth-footer-logo">${ui.footerLogoSvg} ${ui.name}</div>
        <button class="oauth-footer-cancel" onclick="closeOAuthPopup()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';

  // Simulate network delay, then show account picker or email form
  setTimeout(() => {
    const body = document.getElementById('oauthPopupBody');
    if (!body) return;

    if (allUsers.length > 0) {
      // Sort: current user first, then rest alphabetically
      const sorted = [...allUsers].sort((a, b) => {
        if (currentUser && a.id === currentUser.id) return -1;
        if (currentUser && b.id === currentUser.id) return 1;
        return a.name.localeCompare(b.name);
      });

      const accountRows = sorted.map(u => `
        <div class="oauth-account-row ${provider === 'github' ? 'github-row' : ''}" onclick="handleOAuthComplete('${provider}','${u.email}','${u.name.replace(/'/g, "\\'")}')">
          <div class="oauth-acc-avatar" style="background:${ui.avatarBg}">${u.name.charAt(0).toUpperCase()}</div>
          <div class="oauth-acc-info">
            <div class="oauth-acc-name">${u.name}${currentUser && u.id === currentUser.id ? ' <span style="font-size:0.7rem;color:#80868b;font-weight:400">(current)</span>' : ''}</div>
            <div class="oauth-acc-email">${u.email}</div>
          </div>
          <span class="oauth-acc-check">›</span>
        </div>
      `).join('');

      body.innerHTML = `
        <div class="oauth-account-select">
          <p>Choose an account</p>
          ${accountRows}
        </div>
        <button class="oauth-use-other" onclick="_showOAuthEmailForm('${provider}')" style="color:${ui.accentColor}">
          + Use a different account
        </button>
        <p class="oauth-policy">${ui.policyText}</p>
      `;
    } else {
      // No saved accounts — show email form directly
      _showOAuthEmailForm(provider);
    }
  }, 900);
}

function _showOAuthEmailForm(provider) {
  const ui = OAUTH_PROVIDER_UI[provider];
  const body = document.getElementById('oauthPopupBody');
  if (!body) return;
  body.innerHTML = `
    <div class="oauth-email-form">
      <p style="font-size:0.85rem;color:#5f6368;font-weight:500;">Enter your ${ui.name} account email</p>
      <input type="email" id="oauthEmailInput" placeholder="${provider === 'github' ? 'you@example.com' : 'yourname@gmail.com'}"
        class="${provider === 'github' ? 'gh-focus' : ''}" />
      <input type="text" id="oauthNameInput" placeholder="Your display name (for new accounts)" />
      <p class="oauth-form-hint">Already on NeuroLearn? We'll log you in. New here? We'll create your account.</p>
      <button class="oauth-continue-btn ${ui.btnClass}" onclick="_submitOAuthEmail('${provider}')">
        Continue
      </button>
      <p class="oauth-policy">${ui.policyText}</p>
    </div>
  `;
  setTimeout(() => { const el = document.getElementById('oauthEmailInput'); if (el) el.focus(); }, 50);
}

function _submitOAuthEmail(provider) {
  const emailEl = document.getElementById('oauthEmailInput');
  const nameEl = document.getElementById('oauthNameInput');
  const email = emailEl?.value.trim();
  const name = nameEl?.value.trim();
  if (!email || !email.includes('@')) { if (emailEl) { emailEl.style.borderColor = '#ea4335'; emailEl.focus(); } return; }
  // Show mini-loading
  const ui = OAUTH_PROVIDER_UI[provider];
  const body = document.getElementById('oauthPopupBody');
  body.innerHTML = `<div class="oauth-loading"><div class="oauth-spinner ${ui.spinnerClass}"></div><p>Authorizing with ${ui.name}...</p></div>`;
  setTimeout(() => handleOAuthComplete(provider, email, name || email.split('@')[0]), 1200);
}

function handleOAuthComplete(provider, email, displayName) {
  const users = getUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  const isNew = !user;

  if (isNew) {
    // Create account via OAuth
    const name = displayName || email.split('@')[0];
    user = {
      id: Date.now(), name, email,
      password: btoa(`oauth_${provider}_${Date.now()}`), // random password — can't use email/pass login
      provider, xp: 0, streak: 1,
      joinDate: new Date().toLocaleDateString()
    };
    users.push(user);
    saveUsers(users);
  } else if (!user.provider) {
    // Link OAuth provider to existing email account
    user.provider = provider;
    users[users.findIndex(u => u.id === user.id)] = user;
    saveUsers(users);
  }

  setCurrentUser({ ...user });
  closeOAuthPopup();
  updateAuthUI();
  renderLeaderboard();
  renderBadgeGrid();

  if (isNew) {
    addXP(100);
    showToast(`🚀 Welcome, ${user.name}! Signed up via ${OAUTH_PROVIDER_UI[provider].name} — +100 XP!`, 'success');
  } else {
    showToast(`🎉 Welcome back, ${user.name}!`, 'success');
  }
}

function closeOAuthPopup() {
  const popup = document.getElementById('oauthPopup');
  if (popup) popup.remove();
  document.body.style.overflow = '';
}

// ============================================
function closeProfileDropdown() {
  const dd = document.getElementById('unpDropdown');
  if (dd) dd.classList.remove('open');
}

// ============================================
// PROFILE MODAL
// ============================================
function openProfileModal() {
  let modal = document.getElementById('profileModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'profile-modal-overlay';
    modal.innerHTML = `
      <div class="profile-modal" role="dialog" aria-modal="true" aria-label="Profile Settings">
        <div class="pm-header">
          <h2>👤 Profile Settings</h2>
          <button class="pm-close" onclick="closeProfileModal()" aria-label="Close">✕</button>
        </div>

        <!-- Avatar Upload -->
        <div class="pm-avatar-section">
          <div class="pm-avatar-wrap">
            <div class="pm-avatar" id="pmAvatar">A</div>
            <label class="pm-avatar-edit" for="pmPhotoInput" title="Change photo">📷</label>
            <input type="file" id="pmPhotoInput" accept="image/*" style="display:none" onchange="handlePhotoUpload(event)" />
          </div>
          <div class="pm-avatar-hint">Click 📷 to upload a profile photo</div>
        </div>

        <div class="pm-tabs">
          <button class="pm-tab active" id="pmTabInfo" onclick="switchPmTab('info')">📝 Info</button>
          <button class="pm-tab" id="pmTabPassword" onclick="switchPmTab('password')">🔒 Password</button>
        </div>

        <!-- Info Section -->
        <div id="pmSectionInfo" class="pm-section">
          <div class="pm-field">
            <label for="pmName">Display Name</label>
            <input type="text" id="pmName" placeholder="Your full name" />
          </div>
          <div class="pm-field">
            <label for="pmEmail">Email Address</label>
            <input type="email" id="pmEmail" placeholder="you@example.com" disabled />
            <span class="pm-field-note">Email cannot be changed</span>
          </div>
          <div class="pm-field">
            <label for="pmMobile">Mobile Number</label>
            <input type="tel" id="pmMobile" placeholder="+91 98765 43210" />
          </div>
          <div class="pm-field">
            <label for="pmBio">Short Bio</label>
            <textarea id="pmBio" placeholder="Tell us a bit about yourself..." rows="3"></textarea>
          </div>
          <p class="pm-error" id="pmInfoError" role="alert"></p>
          <button class="pm-save" onclick="handleProfileUpdate()">Save Changes ✓</button>
        </div>

        <!-- Password Section -->
        <div id="pmSectionPassword" class="pm-section" style="display:none">
          <div class="pm-field">
            <label for="pmCurrentPwd">Current Password</label>
            <input type="password" id="pmCurrentPwd" placeholder="••••••••" />
          </div>
          <div class="pm-field">
            <label for="pmNewPwd">New Password <span style="color:var(--text-muted);font-weight:400">(min 6 chars)</span></label>
            <input type="password" id="pmNewPwd" placeholder="••••••••" />
          </div>
          <div class="pm-field">
            <label for="pmConfirmPwd">Confirm New Password</label>
            <input type="password" id="pmConfirmPwd" placeholder="••••••••" />
          </div>
          <p class="pm-error" id="pmPwdError" role="alert"></p>
          <button class="pm-save" onclick="handlePasswordChange()">Update Password 🔒</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeProfileModal(); });
  }

  // Pre-fill fields
  const user = getCurrentUser();
  if (user) {
    const pmAvatar = document.getElementById('pmAvatar');
    if (user.photo) {
      pmAvatar.style.backgroundImage = `url(${user.photo})`;
      pmAvatar.style.backgroundSize = 'cover';
      pmAvatar.style.backgroundPosition = 'center';
      pmAvatar.textContent = '';
    } else {
      pmAvatar.style.backgroundImage = '';
      pmAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
    document.getElementById('pmName').value = user.name || '';
    document.getElementById('pmEmail').value = user.email || '';
    document.getElementById('pmMobile').value = user.mobile || '';
    document.getElementById('pmBio').value = user.bio || '';
    // Clear password fields
    ['pmCurrentPwd', 'pmNewPwd', 'pmConfirmPwd'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['pmInfoError', 'pmPwdError'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
  }

  switchPmTab('info');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function switchPmTab(tab) {
  document.getElementById('pmSectionInfo').style.display = tab === 'info' ? 'flex' : 'none';
  document.getElementById('pmSectionPassword').style.display = tab === 'password' ? 'flex' : 'none';
  document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab === 'info' ? 'pmTabInfo' : 'pmTabPassword').classList.add('active');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('📷 Image must be under 2MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const pmAvatar = document.getElementById('pmAvatar');
    pmAvatar.style.backgroundImage = `url(${dataUrl})`;
    pmAvatar.style.backgroundSize = 'cover';
    pmAvatar.style.backgroundPosition = 'center';
    pmAvatar.textContent = '';
    // Store temporarily on the element for handleProfileUpdate to read
    pmAvatar.dataset.pendingPhoto = dataUrl;
  };
  reader.readAsDataURL(file);
}

function handleProfileUpdate() {
  const errEl = document.getElementById('pmInfoError');
  const name = document.getElementById('pmName').value.trim();
  const mobile = document.getElementById('pmMobile').value.trim();
  const bio = document.getElementById('pmBio').value.trim();
  const pmAvatar = document.getElementById('pmAvatar');
  const pendingPhoto = pmAvatar?.dataset.pendingPhoto || null;

  if (!name) { errEl.textContent = 'Display name cannot be empty.'; return; }
  errEl.textContent = '';

  const fields = { name, mobile, bio };
  if (pendingPhoto) fields.photo = pendingPhoto;

  updateUserField(fields);
  updateAuthUI();
  closeProfileModal();
  showToast('✅ Profile updated successfully!', 'success');
}

function handlePasswordChange() {
  const errEl = document.getElementById('pmPwdError');
  const currentPwd = document.getElementById('pmCurrentPwd').value;
  const newPwd = document.getElementById('pmNewPwd').value;
  const confirmPwd = document.getElementById('pmConfirmPwd').value;
  const user = getCurrentUser();

  if (!user) return;
  if (btoa(currentPwd) !== user.password) { errEl.textContent = '❌ Current password is incorrect.'; return; }
  if (newPwd.length < 6) { errEl.textContent = '❌ New password must be at least 6 characters.'; return; }
  if (newPwd !== confirmPwd) { errEl.textContent = '❌ Passwords do not match.'; return; }

  errEl.textContent = '';
  updateUserField({ password: btoa(newPwd) });
  closeProfileModal();
  showToast('🔒 Password changed successfully!', 'success');
}

// ============================================
// BADGE SYSTEM  (Req 3.8)
// ============================================
const BADGES_DEF = [
  { id: 'ai-pioneer', icon: '🏆', name: 'AI Pioneer', desc: 'Joined NeuroLearn', xpReq: 0 },
  { id: 'quick-learner', icon: '⚡', name: 'Quick Learner', desc: 'Earned 100 XP', xpReq: 100 },
  { id: 'bot-builder', icon: '🤖', name: 'Bot Builder', desc: 'Earned 200 XP', xpReq: 200 },
  { id: 'streak-7', icon: '🔥', name: '7-Day Streak', desc: 'Earned 300 XP', xpReq: 300 },
  { id: 'neuro-master', icon: '🧠', name: 'Neuro Master', desc: 'Earned 500 XP', xpReq: 500 },
  { id: 'quiz-champ', icon: '🎯', name: 'Quiz Champion', desc: 'Earned 1000 XP', xpReq: 1000 },
  { id: 'data-wizard', icon: '🔮', name: 'Data Wizard', desc: 'Earned 1500 XP', xpReq: 1500 },
  { id: 'deep-diver', icon: '🌊', name: 'Deep Diver', desc: 'Earned 2000 XP', xpReq: 2000 },
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
window.addXP = function (amount) {
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
  { name: 'Aryan S.', xp: 2450, streak: 12 },
  { name: 'Priya K.', xp: 2210, streak: 8 },
  { name: 'Rohan M.', xp: 1980, streak: 5 },
  { name: 'Aisha T.', xp: 1750, streak: 7 },
  { name: 'Dev P.', xp: 1520, streak: 3 },
  { name: 'Sneha R.', xp: 1340, streak: 4 },
  { name: 'Karan B.', xp: 1190, streak: 2 },
  { name: 'Meera J.', xp: 980, streak: 6 },
  { name: 'Vivek N.', xp: 820, streak: 1 },
  { name: 'Anjali D.', xp: 650, streak: 2 },
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
    Math.min(100, Math.round((completed.filter(l => ['what-is-ai', 'ml-types', 'math-for-ml', 'stats-probability', 'python-ai'].includes(l)).length / 5) * 100)),
    Math.min(100, Math.round((completed.filter(l => ['supervised-learning', 'unsupervised', 'decision-trees', 'svm', 'clustering', 'model-evaluation'].includes(l)).length / 6) * 100)),
    Math.min(100, Math.round((completed.filter(l => ['neural-networks', 'cnn', 'rnn-lstm', 'transformers', 'generative-ai'].includes(l)).length / 5) * 100)),
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

