# 🧠 NeuroLearn — All-in-One AIML Learning Platform

> **VIBETHON Hackathon Submission** | Team: **TeamVisioneers** | Team ID: **T143**

An interactive, gamified web platform that makes learning **Artificial Intelligence & Machine Learning** engaging, practical, and accessible — all in one place.

---

## 🚀 Live Demo

Open `index.html` in any modern browser — no build step, no server required.

---

## 📸 Screenshots

| Home | Learn | Games |
|------|-------|-------|
| Hero with neural network animation | Structured lessons with sidebar | 6 interactive ML mini-games |

| Quiz | Playground | Simulations |
|------|------------|-------------|
| Timed adaptive quizzes | 8 ML code templates with output | 6 real-world AI demos |

---

## ✅ Features Implemented

| Requirement | Status | Details |
|---|---|---|
| 3.1 User Authentication | ✅ | Login / Register with localStorage, profile in navbar, session persistence |
| 3.2 Structured Learning Modules | ✅ | Beginner → Intermediate → Advanced tracks, 16+ lessons with sidebar |
| 3.3 Interactive Code Playground | ✅ | 8 ML templates (Linear Reg, KNN, Neural Net, etc.), simulated output + canvas viz |
| 3.4 Mini-Games | ✅ | 6 games: Gradient Descent, Data Sorter, Neuron Builder, K-Means, Bias Buster, Perceptron |
| 3.5 Quiz & Assessment | ✅ | 30 questions (3 topics + mixed), timer, streaks, instant feedback, XP scoring |
| 3.6 Real-World Simulations | ✅ | 6 demos: Spam Detector, Sentiment Analysis, House Price, Digit Recognizer, Image Classifier, Stock LSTM |
| 3.7 Progress Tracking Dashboard | ✅ | Dynamic XP circle, lesson completion tracking, module progress bars |
| 3.8 Leaderboard & Gamification | ✅ | Global leaderboard, 8 XP-based badges, streaks, toast notifications |
| 3.9 Responsive Web Design | ✅ | Desktop, tablet, and mobile layouts via CSS Grid + media queries |
| 3.10 Deployment & Open Source | ✅ | Runs locally with no build tools — open `index.html` in browser |

---

## 📁 Project Structure

```
vibethon-TeamVisioneers-t143/
│
├── index.html          # Home — Hero, Features, Paths, Dashboard, Leaderboard
├── learn.html          # Structured Learning Modules (Beginner → Advanced)
├── games.html          # 6 Interactive ML Mini-Games
├── quiz.html           # Adaptive Quiz System (30+ questions)
├── playground.html     # In-browser Code Playground (8 ML templates)
├── simulate.html       # 6 Real-World AI/ML Simulations
│
├── css/
│   ├── style.css       # Global design system (dark theme, glassmorphism, auth, leaderboard)
│   ├── learn.css       # Learn page styles
│   ├── games.css       # Games page styles
│   ├── quiz.css        # Quiz page styles
│   ├── playground.css  # Playground page styles
│   └── simulate.css    # Simulations page styles
│
└── js/
    ├── main.js         # Shared: XP system, auth, leaderboard, badges, dashboard
    ├── home.js         # Homepage stat counter animations
    ├── learn.js        # Lesson loading, progress tracking, inline quizzes
    ├── games.js        # 6 fully interactive ML games with Canvas
    ├── quiz.js         # Full quiz engine (timer, scoring, results)
    ├── playground.js   # Code editor, 8 ML templates, simulated execution + viz
    └── simulate.js     # 6 real-world AI simulation demos
```

---

## 🛠️ Setup Instructions

### Option A — Open Directly (Recommended)
```bash
# Clone or download the repository
git clone https://github.com/TeamVisioneers/vibethon-T143.git

# Open in browser
# Windows:
start index.html

# macOS:
open index.html

# Linux:
xdg-open index.html
```

### Option B — Local Server (Optional, for best experience)
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx serve .

# Then open: http://localhost:8080
```

> No build tools, npm install, or compilation required. Pure HTML + CSS + JS.

---

## 🎮 Key Features Walkthrough

### 1. 🔐 Authentication System
- Register with name, email, and password
- Login/Logout with persistent session (localStorage)
- Available on every page via navbar
- +100 XP welcome bonus on registration

### 2. 📚 Structured Learning (learn.html)
- 3 tracks: **Foundations**, **ML Engineering**, **Deep Learning**
- 16 lessons with sidebar navigation
- Concept explanations, code examples, and use-cases
- Inline knowledge-check quizzes per lesson

### 3. 💻 Code Playground (playground.html)
- 8 ML algorithm templates ready to run
- Simulated Python output with real algorithmic results
- Canvas-based visualizations (scatter plots, loss curves, decision trees)
- Keyboard shortcut: `Ctrl+Enter` to run

### 4. 🎮 Mini-Games (games.html)
| Game | Concept |
|------|---------|
| Gradient Descent | Optimization, learning rate |
| Data Sorter | Classification, drag-and-drop |
| Neuron Builder | Neural net architecture |
| K-Means Cluster | Unsupervised clustering |
| Bias Buster | AI ethics, fairness |
| Perceptron Game | Single neuron, AND/OR gates |

### 5. 🎯 Quiz System (quiz.html)
- 4 quiz modes: AI Foundations, Machine Learning, Deep Learning, Mixed
- 20-second timer per question
- Streak bonuses (+10 XP per 3-question streak)
- Full results: accuracy, XP earned, question-by-question breakdown

### 6. 🔬 Simulations (simulate.html)
- **Spam Detector** — Naive Bayes keyword analysis
- **Sentiment Analysis** — Lexicon-based NLP
- **House Price Predictor** — Linear regression model
- **Digit Recognizer** — Draw on canvas, CNN classifies
- **Image Classifier** — Top-5 ImageNet predictions
- **Stock Predictor** — LSTM time-series with live chart

### 7. 🏆 Gamification
- **XP System**: Every action earns XP (lessons, quizzes, games, simulations)
- **8 Badges**: Unlock progressively (100 XP → 2000 XP)
- **Leaderboard**: Global rankings with your position highlighted
- **Streaks**: Track daily learning consistency

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 semantic markup |
| Styling | Vanilla CSS (custom design system, glassmorphism, dark mode) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | localStorage (XP, progress, auth, quiz scores) |
| Fonts | Google Fonts: Outfit + JetBrains Mono |
| Canvas | HTML5 Canvas API (neural viz, games, charts) |
| Hosting | File-based — opens with `index.html` |

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
