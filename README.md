# 🧠 NeuroLearn — All-in-One AIML Learning Platform

> **VIBETHON Hackathon Submission** | Team: **TeamVisioneers** | Team ID: **T143**

An interactive, gamified web platform that makes learning **Artificial Intelligence & Machine Learning** engaging, practical, and accessible — all in one place.

---

## 🌐 Live Demo

🔗 **[https://adityasuryakar.github.io/vibethon-TeamVisioneers-t143/](https://adityasuryakar.github.io/vibethon-TeamVisioneers-t143/)**

> Recommended: Chrome / Edge / Firefox 90+  
> No build step, no server, no npm required — pure static site.

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| 🏠 **Home** | Hero with animated neural network, leaderboard, badges, progress dashboard |
| 📚 **Learn** | 26 lessons across 5 tracks with AI hierarchy diagrams and inline quizzes |
| 💻 **Playground** | Ace editor + Skulpt Python interpreter + 8 ML templates with visualizations |
| 🎮 **Games** | 6 interactive ML mini-games (Gradient Descent, K-Means, Neuron Builder…) |
| 🎯 **Quiz** | 6 quiz modes (AI Foundations → Mixed Challenge), timed, scored, streaked |
| 🔬 **Simulate** | 6 real-world AI demos with datasets, flow steps, and fixed digit recognizer |

---

## ✅ Features Implemented

| # | Requirement | Status | Details |
|---|---|---|---|
| 3.1 | User Authentication | ✅ Done | Login / Register with localStorage, OAuth-style Google/GitHub flow, profile modal, +100 XP welcome bonus |
| 3.2 | Structured Learning Modules | ✅ Done | 26 lessons: Foundations → ML → Deep Learning → NLP → Computer Vision (5 tracks) |
| 3.3 | Interactive Code Playground | ✅ Done | Ace Editor + Skulpt Python, 8 ML templates, simulated viz + real execution mode |
| 3.4 | Mini-Games | ✅ Done | 6 games: Gradient Descent, Decision Tree, Neuron Builder, Classification, K-Means, Perceptron |
| 3.5 | Quiz & Assessment | ✅ Done | 6 quiz modes, 60+ questions, 20s timer, streaks, instant feedback, full results |
| 3.6 | Real-World Simulations | ✅ Done | 6 demos with dataset samples, interaction flow, fixed pixel-analysis digit recognizer |
| 3.7 | Progress Tracking Dashboard | ✅ Done | **Real-time** XP tracking, per-track progress bars, floating progress widget, cross-tab sync, activity feed |
| 3.8 | Leaderboard & Gamification | ✅ Done | Global leaderboard, 8 XP badges, streaks, XP toasts, badge unlock notifications |
| 3.9 | Responsive Web Design | ✅ Done | Desktop, tablet, mobile via CSS Grid + media queries |
| 3.10 | Deployment & Open Source | ✅ Done | Deployed on GitHub Pages — zero-dependency static site |
| ⭐ | **AI Chatbot Tutor**  | ✅ Done | NeuroBot: 30+ ML/AI concept answers, voice read-aloud, page-aware chips, typing indicator |
| ⭐ | **Voice Explanations**  | ✅ Done | Web Speech API TTS built into chatbot — "Read aloud" on every bot message |
| ⭐ | **Real-Time Progress Tracker**  | ✅ Done | Floating analytics widget with SVG ring, track bars, live activity feed, cross-tab sync |

---

## 📁 Project Structure

```
vibethon-TeamVisioneers-t143/
│
├── index.html              # Home — Hero, Features, Learning Paths, Dashboard, Leaderboard
├── learn.html              # 26 Lessons across 5 tracks (Foundations → CV)
├── games.html              # 6 Interactive ML Mini-Games
├── quiz.html               # Quiz System — 6 modes, 60+ questions, timer, scoring
├── playground.html         # Code Playground — Ace Editor + Skulpt Python
├── simulate.html           # 6 Real-World AI/ML Simulations with datasets & flow
├── README.md               # Project documentation (this file)
│
├── css/
│   ├── style.css           # Global design system (dark theme, glassmorphism, auth, leaderboard)
│   ├── learn.css           # Learning module styles
│   ├── games.css           # Games page styles
│   ├── quiz.css            # Quiz arena styles
│   ├── playground.css      # Code editor styles
│   └── simulate.css        # Simulation cards + datasets + interaction flow
│
└── js/
    ├── main.js             # Shared: XP system, auth, leaderboard, badges, dashboard (all pages)
    ├── home.js             # Hero stat counter animations
    ├── learn.js            # 26 lesson content, sidebar, progress tracking, inline quizzes
    ├── games.js            # 6 fully interactive ML games with Canvas
    ├── quiz.js             # Full quiz engine (timer, scoring, streaks, results)
    ├── playground.js       # Ace editor, 8 ML templates, Skulpt execution, Canvas viz
    ├── simulate.js         # 6 AI demos + pixel-analysis digit recognizer + datasets
    ├── chatbot.js          # 🤖 NeuroBot AI Tutor (knowledge base, voice, page-aware)
    └── progress-tracker.js # 📊 Real-time progress widget (SVG ring, track bars, activity feed)
```

---

## 🛠️ Setup Instructions

### Option A — Visit Live Site (Recommended)
👉 **[https://adityasuryakar.github.io/vibethon-TeamVisioneers-t143/](https://adityasuryakar.github.io/vibethon-TeamVisioneers-t143/)**

### Option B — Run Locally
```bash
# Clone the repository
git clone https://github.com/AdityaSuryakar/vibethon-TeamVisioneers-t143.git
cd vibethon-TeamVisioneers-t143

# Open in browser
# Windows:
start index.html
# macOS:
open index.html
# Linux:
xdg-open index.html
```

### Option C — Local Dev Server (optional, avoids CORS)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

> **No build tools, no npm install, no compilation required.** Pure HTML + CSS + JS.

---

## 🎮 Feature Walkthrough

### 1. 🔐 Authentication
- Register with name, email, password — **+100 XP** welcome bonus
- OAuth-style Google & GitHub sign-in flow (simulated, no backend needed)
- Login/logout with persistent session (localStorage)
- Profile modal with photo upload, bio, password change
- Available on every page via navbar; profile dropdown when logged in

### 2. 📚 Structured Learning (26 lessons, 5 tracks)
| Track | Lessons | Level |
|-------|---------|-------|
| 🌱 Foundations | What is AI, ML Types, Linear Algebra, Stats, Python | Beginner |
| ⚙️ Machine Learning | Supervised, Unsupervised, Decision Trees, SVM, Clustering, Evaluation | Intermediate |
| 🧠 Deep Learning | Neural Networks, CNN, RNN/LSTM, Transformers, Generative AI | Advanced |
| 💬 NLP | Intro NLP, Tokenization, Sentiment, Seq2Seq, BERT/GPT | Intermediate–Advanced |
| 👁️ Computer Vision | Intro CV, Image Classification, Object Detection, Segmentation, GANs | Intermediate–Advanced |

- Visual AI hierarchy diagrams, type cards, apps showcase, inline quiz per lesson
- XP earned per lesson completion, tracked in real-time

### 3. 💻 Code Playground
- **Ace Editor** — syntax highlighting, auto-indent, keyboard shortcuts
- **Simulated mode** — rich ML visualizations from 8 templates
- **Execute mode** — runs real Python via **Skulpt** interpreter
- Templates: Linear Regression, KNN, K-Means, Neural Net, Decision Tree, Gradient Descent, Naive Bayes, Perceptron
- `Ctrl+Enter` to run

### 4. 🎮 Mini-Games (6 games)
| Game | Concept | XP |
|------|---------|-----|
| Neuron Builder | Neural net architecture | +100 |
| Decision Tree Explorer | Splits, entropy | +110 |
| Gradient Descent ⭐ | Optimization, learning rate | +150 |
| Classification Challenge | Decision boundaries, F1 | +140 |
| K-Means Adventure | Unsupervised clustering | +130 |
| Perceptron Trainer | Weights, decision boundary | +180 |

### 5. 🎯 Quiz System (6 modes, 60+ questions)
- AI Foundations (10 Q, 200 XP) · ML (10 Q, 300 XP) · Deep Learning (10 Q, 400 XP)
- NLP (10 Q, 400 XP) · Computer Vision (10 Q, 400 XP) · Mixed Challenge (15 Q, 500 XP)
- 20-second timer, streak bonuses (+10 XP per 3-streak), full results breakdown

### 6. 🔬 Simulations (6 demos)
Each simulation includes **dataset samples** to click, **interaction flow steps**, and AI model explanations:
- 📧 **Spam Detector** — Naive Bayes keyword scoring + 4 dataset presets
- 😊 **Sentiment Analysis** — Lexicon-based NLP + 4 presets (pos/neg/neutral/rave)
- 🏠 **House Price Predictor** — Linear regression, feature impact bars + 4 house presets
- ✏️ **Digit Recognizer** — **Real pixel analysis** (bounding box, hole detection, zone grid, softmax) — not random!
- 🖼️ **Image Classifier** — ResNet-50 Top-5 ImageNet results
- 📈 **Stock Predictor** — LSTM time-series with live Canvas chart

### 7. 📊 Real-Time Progress Tracker
- **Floating progress widget** accessible on every page (📊 button)
- **SVG ring indicator** showing overall completion percentage
- **Per-track progress bars** — Foundations, ML, Deep Learning, NLP, Computer Vision
- **Live activity feed** — recent lessons, quizzes, games, simulations logged with timestamps
- **Cross-tab sync** — updates reflected across open browser tabs in real-time
- **Quick stats grid** — lessons completed, quizzes taken, games played, simulations run
- **Streak tracking** — consecutive days of activity
- **Auto-refresh** every 3 seconds for real-time feel

### 8. 🏆 Leaderboard & Badges
- Global leaderboard with real user injection + mock entries
- 8 XP-based badges: 🏆 AI Pioneer → 🌊 Deep Diver
- Toast notifications for new badge unlocks

### 9. 🤖 AI Chatbot Tutor (Bonus)
NeuroBot — floating chat widget on **every page**:
- **30+ ML/AI topic answers** (neural networks, backprop, CNN, RNN, transformers, loss functions, metrics…)
- **Voice read-aloud** via Web Speech API (TTS), toggleable per-message
- **Page-aware quick chips** — different suggested questions per page
- **Typing indicator** animation
- **Clear/mute/close controls**

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 semantic markup |
| Styling | Vanilla CSS (custom design system, glassmorphism, dark mode) |
| Logic | Vanilla JavaScript (ES6+, IIFE, Canvas API) |
| Code Editor | [Ace Editor](https://ace.c9.io/) (CDN) |
| Python Runtime | [Skulpt](http://skulpt.org/) (CDN) |
| Voice | Web Speech API (built-in browser) |
| Storage | localStorage (XP, progress, auth, quiz scores, activity log) |
| Fonts | Google Fonts: Outfit + JetBrains Mono |
| Hosting | [GitHub Pages](https://adityasuryakar.github.io/vibethon-TeamVisioneers-t143/) |

---

## 👥 Team

**Team Name:** TeamVisioneers  
**Team ID:** T143  
**Hackathon:** VIBETHON

---

## 📝 License

Built for VIBETHON Hackathon. Educational use.

---

*"Making AI & ML education accessible, fun, and interactive for everyone."* 🧠✨
