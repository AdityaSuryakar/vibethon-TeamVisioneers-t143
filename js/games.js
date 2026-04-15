// games.js — Interactive mini-games for AIML concepts

// ============================================
// GAME LAUNCHER
// ============================================
function launchGame(gameId) {
  const modal = document.getElementById('gameModal');
  const titleEl = document.getElementById('gameModalTitle');
  const body = document.getElementById('gameBody');

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const gameConfigs = {
    'gradient-descent': { title: '⛰️ Gradient Descent Game', render: renderGradientDescent },
    'data-sorter':      { title: '🗂️ Data Sorter',          render: renderDataSorter },
    'neuron-builder':   { title: '🧠 Neuron Builder',        render: renderNeuronBuilder },
    'kmeans':           { title: '🎯 K-Means Adventure',     render: renderKMeans },
    'bias-buster':      { title: '⚖️ Bias Buster',           render: renderBiasBuster },
    'perceptron':       { title: '⚡ Perceptron Trainer',    render: renderPerceptron },
  };

  const cfg = gameConfigs[gameId];
  if (!cfg) return;
  titleEl.textContent = cfg.title;
  body.innerHTML = '';
  cfg.render(body);
}

function closeGame() {
  document.getElementById('gameModal').style.display = 'none';
  document.body.style.overflow = '';
  // Stop any running game loops
  if (window._gameLoopId) { cancelAnimationFrame(window._gameLoopId); window._gameLoopId = null; }
  if (window._gameTimerId) { clearInterval(window._gameTimerId); window._gameTimerId = null; }
}

document.getElementById('gameModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('gameModal')) closeGame();
});

// ============================================
// GAME 1: GRADIENT DESCENT
// ============================================
function renderGradientDescent(container) {
  container.innerHTML = `
    <div class="gd-game">
      <p style="color:var(--text-secondary); font-size:0.9rem;">The <strong style="color:var(--text-primary)">red ball</strong> starts at a random position. Press <strong style="color:var(--purple)">Run</strong> to watch gradient descent find the minimum of the loss function. Adjust the learning rate and see what happens!</p>
      <div class="gd-canvas-wrap">
        <canvas id="gdCanvas" width="840" height="320"></canvas>
      </div>
      <div class="gd-controls">
        <div class="gd-ctrl">
          <label>Learning Rate: <span id="lrVal">0.05</span></label>
          <input type="range" id="lrSlider" min="0.005" max="0.3" step="0.005" value="0.05" oninput="document.getElementById('lrVal').textContent=parseFloat(this.value).toFixed(3)">
        </div>
        <div class="gd-ctrl">
          <label>Momentum: <span id="momVal">0.0</span></label>
          <input type="range" id="momSlider" min="0" max="0.95" step="0.05" value="0" oninput="document.getElementById('momVal').textContent=parseFloat(this.value).toFixed(2)">
        </div>
        <div class="gd-ctrl">
          <label>Iterations: <span id="iterVal">0</span></label>
          <input type="range" id="iterSlider" min="10" max="200" step="10" value="80" oninput="document.getElementById('iterVal').textContent=this.value" disabled>
        </div>
      </div>
      <div class="gd-stats">
        <div class="gd-stat"><div class="gd-stat-val" id="gdLoss">—</div><div class="gd-stat-label">Current Loss</div></div>
        <div class="gd-stat"><div class="gd-stat-val" id="gdX">—</div><div class="gd-stat-label">Position X</div></div>
        <div class="gd-stat"><div class="gd-stat-val" id="gdIter">0</div><div class="gd-stat-label">Iterations</div></div>
        <div class="gd-stat"><div class="gd-stat-val" id="gdStatus" style="font-size:1rem;">Ready</div><div class="gd-stat-label">Status</div></div>
      </div>
      <div class="gd-btns">
        <button class="gd-btn gd-btn-main" id="gdRunBtn" onclick="gdRun()">▶ Run Descent</button>
        <button class="gd-btn gd-btn-reset" onclick="gdReset()">↺ Reset</button>
      </div>
    </div>
  `;

  // Loss function: multi-modal with valleys
  const lossFunc = (x) => 0.3 * Math.sin(2 * x) * Math.sin(0.5 * x) + 0.1 * x * x + Math.sin(x * 3) * 0.15;
  const dLoss = (x) => 0.6 * Math.cos(2 * x) * Math.sin(0.5 * x) + 0.15 * Math.sin(2 * x) * Math.cos(0.5 * x) + 0.2 * x + 0.45 * Math.cos(x * 3);

  const canvas = document.getElementById('gdCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const xMin = -4, xMax = 4;
  const toCanvasX = (x) => ((x - xMin) / (xMax - xMin)) * W;
  const toCanvasY = (y) => H - 30 - ((y + 0.5) / 1.5) * (H - 60);

  let ballX = 3.5, ballVel = 0, running = false, iteration = 0;
  window._gdState = { ballX, ballVel, running, iteration };

  function drawScene() {
    ctx.clearRect(0, 0, W, H);
    // Draw gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(10,15,46,0.8)');
    bgGrad.addColorStop(1, 'rgba(5,7,20,1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const x = (W / 8) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const y = (H / 6) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Draw loss curve with gradient fill
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let px = 0; px <= W; px++) {
      const x = xMin + (px / W) * (xMax - xMin);
      const y = lossFunc(x);
      ctx.lineTo(px, toCanvasY(y));
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
    fillGrad.addColorStop(0, 'rgba(167,139,250,0.12)');
    fillGrad.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.beginPath();
    for (let px = 0; px <= W; px++) {
      const x = xMin + (px / W) * (xMax - xMin);
      const y = lossFunc(x);
      if (px === 0) ctx.moveTo(px, toCanvasY(y));
      else ctx.lineTo(px, toCanvasY(y));
    }
    ctx.strokeStyle = 'rgba(167,139,250,0.8)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ball glow
    const bx = toCanvasX(window._gdState.ballX);
    const by = toCanvasY(lossFunc(window._gdState.ballX));
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 40);
    glow.addColorStop(0, 'rgba(244,114,182,0.4)');
    glow.addColorStop(1, 'rgba(244,114,182,0)');
    ctx.beginPath(); ctx.arc(bx, by, 40, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    // Ball
    const ballGrad = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 12);
    ballGrad.addColorStop(0, '#fff');
    ballGrad.addColorStop(0.4, '#f472b6');
    ballGrad.addColorStop(1, '#7c3aed');
    ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad; ctx.fill();

    // Labels
    ctx.fillStyle = 'rgba(148,163,184,0.6)';
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillText('Loss', 10, 20);
    ctx.fillText('Position X', W - 80, H - 8);
  }

  function gdStep() {
    const lr = parseFloat(document.getElementById('lrSlider').value);
    const mom = parseFloat(document.getElementById('momSlider').value);
    const grad = dLoss(window._gdState.ballX);
    window._gdState.ballVel = mom * window._gdState.ballVel - lr * grad;
    window._gdState.ballX += window._gdState.ballVel;
    window._gdState.ballX = Math.max(xMin, Math.min(xMax, window._gdState.ballX));
    window._gdState.iteration++;

    const loss = lossFunc(window._gdState.ballX);
    document.getElementById('gdLoss').textContent = loss.toFixed(4);
    document.getElementById('gdX').textContent = window._gdState.ballX.toFixed(3);
    document.getElementById('gdIter').textContent = window._gdState.iteration;
    document.getElementById('iterVal').textContent = window._gdState.iteration;

    drawScene();

    if (Math.abs(grad) < 0.001 || window._gdState.iteration >= 300) {
      window._gdState.running = false;
      document.getElementById('gdStatus').textContent = '✅ Converged!';
      document.getElementById('gdStatus').style.color = 'var(--green)';
      document.getElementById('gdRunBtn').textContent = '▶ Run Again';
      addXP(150);
      showToast('🏆 Gradient Descent mastered! +150 XP', 'success');
      return;
    }
    if (window._gdState.running) {
      window._gameLoopId = requestAnimationFrame(gdStep);
    }
  }

  window.gdRun = function() {
    if (window._gdState.running) return;
    window._gdState.running = true;
    document.getElementById('gdStatus').textContent = '⚡ Running...';
    document.getElementById('gdStatus').style.color = 'var(--yellow)';
    document.getElementById('gdRunBtn').textContent = '⏸ Running...';
    gdStep();
  };

  window.gdReset = function() {
    if (window._gameLoopId) { cancelAnimationFrame(window._gameLoopId); window._gameLoopId = null; }
    window._gdState = { ballX: xMin + Math.random() * (xMax - xMin), ballVel: 0, running: false, iteration: 0 };
    document.getElementById('gdLoss').textContent = '—';
    document.getElementById('gdX').textContent = '—';
    document.getElementById('gdIter').textContent = '0';
    document.getElementById('iterVal').textContent = '0';
    document.getElementById('gdStatus').textContent = 'Ready';
    document.getElementById('gdStatus').style.color = '';
    document.getElementById('gdRunBtn').textContent = '▶ Run Descent';
    drawScene();
  };

  window._gdState = { ballX: 3.2, ballVel: 0, running: false, iteration: 0 };
  drawScene();
}

// ============================================
// GAME 2: DATA SORTER
// ============================================
function renderDataSorter(container) {
  const dataItems = [
    { text: '🌸 Petal length: 5.1cm', label: 'flower' },
    { text: '📧 "WIN A PRIZE NOW"', label: 'spam' },
    { text: '🏠 3 beds, 2 baths', label: 'house' },
    { text: '📧 "Meeting at 3pm"', label: 'not-spam' },
    { text: '🌸 Petal width: 1.8cm', label: 'flower' },
    { text: '🏠 Downtown loft', label: 'house' },
    { text: '📧 "Free money!!!"', label: 'spam' },
    { text: '🌸 Sepal: 4.9cm', label: 'flower' },
    { text: '📧 "Project deadline"', label: 'not-spam' },
    { text: '🏠 Garden view', label: 'house' },
  ];

  let score = 0, total = 0, timeLeft = 45;
  let shuffled = [...dataItems].sort(() => Math.random() - 0.5).slice(0, 8);

  container.innerHTML = `
    <div class="ds-game">
      <div class="ds-header">
        <p style="color:var(--text-secondary);font-size:0.88rem;">Click on a data item, then click the correct bucket to classify it. Race the clock!</p>
        <div class="ds-score-wrap">
          <div class="ds-score"><span class="ds-score-val" id="dsScore" style="color:var(--green)">0</span><span class="ds-score-label">Score</span></div>
          <div class="ds-score"><span class="ds-score-val" id="dsTimer" style="color:var(--orange)">45s</span><span class="ds-score-label">Time</span></div>
          <div class="ds-score"><span class="ds-score-val" id="dsAccuracy" style="color:var(--blue)">—%</span><span class="ds-score-label">Accuracy</span></div>
        </div>
      </div>
      <div class="ds-timer-bar"><div class="ds-timer-fill" id="dsTimerFill" style="width:100%"></div></div>
      <div class="ds-arena">
        <div class="ds-queue" id="dsQueue"><h4>📥 Data Queue (click to select)</h4></div>
        <div class="ds-center-arrow">→</div>
        <div class="ds-buckets" id="dsBuckets">
          <div class="ds-bucket" id="bucket-spam" data-bucket="spam" onclick="dsDropToBucket('spam')">
            <h4 style="color:#f87171">🚫 Spam</h4>
          </div>
          <div class="ds-bucket" id="bucket-not-spam" data-bucket="not-spam" onclick="dsDropToBucket('not-spam')">
            <h4 style="color:var(--green)">✉️ Legitimate</h4>
          </div>
          <div class="ds-bucket" id="bucket-flower" data-bucket="flower" onclick="dsDropToBucket('flower')">
            <h4 style="color:var(--pink)">🌸 Iris Flower</h4>
          </div>
          <div class="ds-bucket" id="bucket-house" data-bucket="house" onclick="dsDropToBucket('house')">
            <h4 style="color:var(--blue)">🏠 Real Estate</h4>
          </div>
        </div>
      </div>
    </div>
  `;

  let selected = null;

  function renderQueue() {
    const q = document.getElementById('dsQueue');
    q.innerHTML = '<h4>📥 Data Queue (click to select)</h4>';
    shuffled.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'ds-item';
      el.textContent = item.text;
      el.dataset.idx = i;
      el.addEventListener('click', () => {
        document.querySelectorAll('.ds-item').forEach(e => e.style.borderColor = '');
        selected = i;
        el.style.borderColor = 'var(--purple)';
        el.style.background = 'rgba(167,139,250,0.15)';
      });
      q.appendChild(el);
    });
  }

  window.dsDropToBucket = function(bucketId) {
    if (selected === null) { showToast('👆 Select a data item first!', 'info'); return; }
    const item = shuffled[selected];
    const correct = item.label === bucketId;
    total++;
    if (correct) {
      score++;
      showToast('✅ Correct classification! +10 pts', 'success');
      addXP(10);
    } else {
      showToast(`❌ Wrong! It was "${item.label}"`, 'error');
    }

    shuffled.splice(selected, 1);
    selected = null;
    document.getElementById('dsScore').textContent = score;
    document.getElementById('dsAccuracy').textContent = `${Math.round((score / total) * 100)}%`;

    if (shuffled.length === 0) {
      clearInterval(window._gameTimerId);
      addXP(score * 10);
      showToast(`🎉 Round complete! Score: ${score}/${total} +${score * 10} XP`, 'success');
      setTimeout(() => { shuffled = [...dataItems].sort(() => Math.random() - 0.5).slice(0, 8); renderQueue(); }, 1000);
    } else {
      renderQueue();
    }
  };

  renderQueue();

  // Timer
  window._gameTimerId = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / 45) * 100;
    document.getElementById('dsTimer').textContent = `${timeLeft}s`;
    document.getElementById('dsTimerFill').style.width = `${pct}%`;
    document.getElementById('dsTimerFill').style.background = timeLeft < 10 ? '#f87171' : 'var(--gradient-main)';
    if (timeLeft <= 0) {
      clearInterval(window._gameTimerId);
      const xpEarned = score * 15;
      addXP(xpEarned);
      showToast(`⏱ Time's up! Final score: ${score}/${total} +${xpEarned} XP`, 'info');
      document.getElementById('dsTimer').textContent = '0s';
    }
  }, 1000);
}

// ============================================
// GAME 3: NEURON BUILDER
// ============================================
function renderNeuronBuilder(container) {
  container.innerHTML = `
    <div class="nb-game">
      <p style="color:var(--text-secondary);font-size:0.88rem;">Configure the neural network architecture below. Watch how the network structure changes and observe the output signal! Adjust inputs and weights to see predictions change.</p>
      <div class="nb-canvas-wrap">
        <canvas id="nbCanvas" width="840" height="350"></canvas>
      </div>
      <div class="nb-controls">
        <div class="nb-ctrl-group">
          <label>Hidden Layers:</label>
          <input type="number" id="nbLayers" min="1" max="4" value="2" oninput="updateNB()">
        </div>
        <div class="nb-ctrl-group">
          <label>Neurons/Layer:</label>
          <input type="number" id="nbNeurons" min="2" max="6" value="4" oninput="updateNB()">
        </div>
        <div class="nb-ctrl-group">
          <label>Input 1:</label>
          <input type="number" id="nbIn1" min="-1" max="1" step="0.1" value="0.5" oninput="updateNB()">
        </div>
        <div class="nb-ctrl-group">
          <label>Input 2:</label>
          <input type="number" id="nbIn2" min="-1" max="1" step="0.1" value="0.3" oninput="updateNB()">
        </div>
        <button class="gd-btn gd-btn-main" onclick="randomizeWeights()">🎲 Randomize Weights</button>
      </div>
      <div class="nb-output">
        <div class="nb-out-card"><div class="nb-out-val" id="nbOutput1">—</div><div class="nb-out-label">Output Neuron 1</div></div>
        <div class="nb-out-card"><div class="nb-out-val" id="nbOutput2">—</div><div class="nb-out-label">Output Neuron 2</div></div>
        <div class="nb-out-card"><div class="nb-out-val" id="nbParams">0</div><div class="nb-out-label">Total Parameters</div></div>
        <div class="nb-out-card"><div class="nb-out-val" id="nbDepth">3</div><div class="nb-out-label">Network Depth</div></div>
      </div>
    </div>
  `;

  let weights = {};
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  function randomizeWeights() {
    weights = {};
    showToast('🎲 Weights randomized! Watch the outputs change!', 'info');
    updateNB();
  }
  window.randomizeWeights = randomizeWeights;

  function getWeight(key) {
    if (!weights[key]) weights[key] = (Math.random() * 2 - 1) * 0.8;
    return weights[key];
  }

  function updateNB() {
    const numHidden = Math.min(4, Math.max(1, parseInt(document.getElementById('nbLayers').value) || 2));
    const neuronsPerLayer = Math.min(6, Math.max(2, parseInt(document.getElementById('nbNeurons').value) || 4));
    const in1 = parseFloat(document.getElementById('nbIn1').value) || 0;
    const in2 = parseFloat(document.getElementById('nbIn2').value) || 0;

    const layers = [2, ...Array(numHidden).fill(neuronsPerLayer), 2];
    let totalParams = 0;
    for (let i = 0; i < layers.length - 1; i++) {
      totalParams += layers[i] * layers[i + 1] + layers[i + 1];
    }
    document.getElementById('nbParams').textContent = totalParams;
    document.getElementById('nbDepth').textContent = layers.length;

    // Forward pass (simplified)
    let current = [in1, in2];
    for (let li = 1; li < layers.length; li++) {
      const next = [];
      for (let ni = 0; ni < layers[li]; ni++) {
        let sum = getWeight(`b_${li}_${ni}`);
        for (let pi = 0; pi < current.length; pi++) {
          sum += current[pi] * getWeight(`w_${li}_${pi}_${ni}`);
        }
        next.push(sigmoid(sum));
      }
      current = next;
    }

    document.getElementById('nbOutput1').textContent = current[0].toFixed(4);
    document.getElementById('nbOutput2').textContent = current[1].toFixed(4);

    drawNB(layers, current);
  }

  function drawNB(layers, outputs) {
    const canvas = document.getElementById('nbCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(10,15,46,0.9)'); bgGrad.addColorStop(1, 'rgba(5,7,20,1)');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    const positions = layers.map((count, li) => {
      const x = (W / (layers.length + 1)) * (li + 1);
      return Array.from({ length: count }, (_, ni) => ({
        x, y: (H / (count + 1)) * (ni + 1), val: Math.random()
      }));
    });

    const colors = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#fb923c'];

    // Draw connections
    for (let li = 0; li < positions.length - 1; li++) {
      positions[li].forEach(n1 => {
        positions[li + 1].forEach(n2 => {
          const w = getWeight(`w_${li + 1}_${positions[li].indexOf(n1)}_${positions[li + 1].indexOf(n2)}`);
          const alpha = Math.abs(w) * 0.6;
          ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = w > 0 ? `rgba(167,139,250,${alpha})` : `rgba(248,113,113,${alpha})`;
          ctx.lineWidth = Math.abs(w) * 2.5;
          ctx.stroke();
        });
      });
    }

    // Draw neurons
    positions.forEach((layer, li) => {
      const color = colors[li % colors.length];
      layer.forEach((n) => {
        const r = 16;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
        glow.addColorStop(0, `${color}66`); glow.addColorStop(1, `${color}00`);
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color + 'cc'; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      });
    });

    // Layer labels
    const labels = ['Input', ...Array(layers.length - 2).fill('Hidden'), 'Output'];
    ctx.fillStyle = 'rgba(148,163,184,0.7)'; ctx.font = '11px Outfit, sans-serif'; ctx.textAlign = 'center';
    positions.forEach((layer, li) => { ctx.fillText(labels[li], layer[0].x, H - 8); });
  }

  window.updateNB = updateNB;
  updateNB();
}

// ============================================
// GAME 4: K-MEANS
// ============================================
function renderKMeans(container) {
  container.innerHTML = `
    <div class="km-game">
      <p style="color:var(--text-secondary);font-size:0.88rem;">Click on the canvas to place cluster centroids (⬣), then press <strong style="color:var(--purple)">Run K-Means</strong> to watch the algorithm group data points together!</p>
      <div class="km-canvas-wrap" id="kmCanvasWrap">
        <canvas id="kmCanvas" width="840" height="380"></canvas>
      </div>
      <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
        <button class="gd-btn gd-btn-main" onclick="runKMeans()">▶ Run K-Means</button>
        <button class="gd-btn gd-btn-reset" onclick="kmReset()">↺ Reset Centroids</button>
        <button class="gd-btn gd-btn-reset" onclick="kmGenerateData()">🎲 New Data</button>
        <span style="color:var(--text-muted);font-size:0.85rem;"><span id="kmIterLabel">Click canvas to place centroids</span></span>
      </div>
      <div class="km-legend" id="kmLegend"></div>
    </div>
  `;

  const clusterColors = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24'];
  const canvas = document.getElementById('kmCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let dataPoints = [], centroids = [], assignments = [], iteration = 0;

  function generateData() {
    dataPoints = [];
    const numClusters = 4;
    for (let c = 0; c < numClusters; c++) {
      const cx = 80 + Math.random() * (W - 160);
      const cy = 40 + Math.random() * (H - 80);
      for (let i = 0; i < 30; i++) {
        dataPoints.push({
          x: cx + (Math.random() - 0.5) * 120,
          y: cy + (Math.random() - 0.5) * 120
        });
      }
    }
    centroids = []; assignments = Array(dataPoints.length).fill(-1); iteration = 0;
    document.getElementById('kmIterLabel').textContent = 'Click canvas to place centroids';
    draw();
  }

  canvas.addEventListener('click', (e) => {
    if (centroids.length >= 5) { showToast('Max 5 centroids! Reset to add more.', 'info'); return; }
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    centroids.push({ x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY });
    draw();
    document.querySelector('#kmLegend').innerHTML = centroids.map((_, i) => `<div class="km-legend-item"><div class="km-dot" style="background:${clusterColors[i]}"></div>Cluster ${i + 1}</div>`).join('');
  });

  function assignPoints() {
    assignments = dataPoints.map(p => {
      let minDist = Infinity, closestC = 0;
      centroids.forEach((c, ci) => {
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d < minDist) { minDist = d; closestC = ci; }
      });
      return closestC;
    });
  }

  function updateCentroids() {
    centroids = centroids.map((c, ci) => {
      const assigned = dataPoints.filter((_, i) => assignments[i] === ci);
      if (assigned.length === 0) return c;
      return { x: assigned.reduce((s, p) => s + p.x, 0) / assigned.length, y: assigned.reduce((s, p) => s + p.y, 0) / assigned.length };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(10,15,46,0.95)'); bg.addColorStop(1, 'rgba(5,7,20,1)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    dataPoints.forEach((p, i) => {
      const color = assignments[i] >= 0 ? clusterColors[assignments[i]] : 'rgba(148,163,184,0.4)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color + '99'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
    });

    centroids.forEach((c, ci) => {
      const color = clusterColors[ci];
      // Glow
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 30);
      glow.addColorStop(0, color + '55'); glow.addColorStop(1, color + '00');
      ctx.beginPath(); ctx.arc(c.x, c.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
      // Star shape
      ctx.beginPath(); ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('✦', c.x, c.y);
    });
  }

  window.runKMeans = async function() {
    if (centroids.length < 2) { showToast('Place at least 2 centroids first!', 'info'); return; }
    for (let it = 0; it < 15; it++) {
      assignPoints(); updateCentroids(); iteration++;
      document.getElementById('kmIterLabel').textContent = `Iteration: ${iteration}`;
      draw();
      await new Promise(r => setTimeout(r, 150));
    }
    addXP(130); showToast('🎯 K-Means converged! +130 XP', 'success');
  };

  window.kmReset = function() { centroids = []; assignments = Array(dataPoints.length).fill(-1); iteration = 0; document.getElementById('kmIterLabel').textContent = 'Click canvas to place centroids'; document.querySelector('#kmLegend').innerHTML = ''; draw(); };
  window.kmGenerateData = generateData;

  generateData();
}

// ============================================
// GAME 5: BIAS BUSTER
// ============================================
function renderBiasBuster(container) {
  const scenarios = [
    { title: 'Hiring Algorithm Training Data', data: [{role:'Engineer', gender:'Male', hired:true},{role:'Engineer', gender:'Male', hired:true},{role:'Engineer', gender:'Male', hired:true},{role:'Engineer', gender:'Female', hired:false},{role:'Manager', gender:'Male', hired:true},{role:'Manager', gender:'Female', hired:false}], issue: 'Gender bias — 83% of training data is male engineers', fix: 'Balance dataset: include equal representation of all genders' },
    { title: 'Medical Diagnosis Model', data: [{age:'<30',condition:'Healthy',diagnosed:false},{age:'30-50',condition:'Healthy',diagnosed:false},{age:'>50',condition:'Healthy',diagnosed:true},{age:'>50',condition:'Sick',diagnosed:true},{age:'<30',condition:'Sick',diagnosed:false}], issue: 'Age bias — older patients always diagnosed regardless of actual condition', fix: 'Remove correlated age features or rebalance with diverse age groups' },
    { title: 'Facial Recognition Training', data: [{skin:'Light',recognized:true},{skin:'Light',recognized:true},{skin:'Light',recognized:true},{skin:'Light',recognized:true},{skin:'Dark',recognized:false},{skin:'Medium',recognized:false}], issue: 'Racial bias — 67% of training data is light-skinned', fix: 'Collect diverse training data with equal representation across skin tones' },
  ];

  let current = 0;
  const s = scenarios[current];

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:24px;">
      <p style="color:var(--text-secondary);font-size:0.88rem;">Analyze the dataset below. Can you identify the bias? Select your diagnosis and propose a fix!</p>
      <div style="padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:16px;">
        <h3 style="margin-bottom:16px;font-size:1.1rem;">${s.title}</h3>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;font-family:var(--font-code);">
            <thead><tr>${Object.keys(s.data[0]).map(k => `<th style="padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);color:var(--text-muted);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em">${k}</th>`).join('')}</tr></thead>
            <tbody>${s.data.map(row => `<tr>${Object.values(row).map(v => `<td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);color:${v===true?'var(--green)':v===false?'#f87171':'var(--text-secondary)'}">${v===true?'✓ Yes':v===false?'✗ No':v}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <p style="font-weight:700;font-size:0.95rem;">What type of bias do you see? 🔍</p>
        <div style="display:flex;flex-direction:column;gap:8px;" id="biasOptions">
          <button class="iq-btn" onclick="checkBias(this, false)">📊 Measurement Bias (incorrect labels)</button>
          <button class="iq-btn" onclick="checkBias(this, true)">👥 Representation Bias (unequal groups)</button>
          <button class="iq-btn" onclick="checkBias(this, false)">⚙️ Algorithm Bias (wrong model choice)</button>
          <button class="iq-btn" onclick="checkBias(this, false)">🔗 Aggregation Bias (grouping issues)</button>
        </div>
      </div>
      <div id="biasResult" style="display:none;padding:20px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:12px;">
        <p style="color:var(--green);font-weight:700;margin-bottom:8px;">✅ Bias Identified!</p>
        <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:6px;"><strong style="color:var(--text-primary)">Issue:</strong> ${s.issue}</p>
        <p style="color:var(--text-secondary);font-size:0.88rem;"><strong style="color:var(--text-primary)">Fix:</strong> ${s.fix}</p>
      </div>
    </div>
  `;

  window.checkBias = function(btn, correct) {
    document.querySelectorAll('#biasOptions .iq-btn').forEach(b => b.disabled = true);
    if (correct) { btn.classList.add('correct'); document.getElementById('biasResult').style.display = 'block'; addXP(120); showToast('⚖️ Bias detected! +120 XP', 'success'); }
    else { btn.classList.add('wrong'); showToast('❌ Not quite! Try another answer.', 'error'); }
  };
}

// ============================================
// GAME 6: PERCEPTRON
// ============================================
function renderPerceptron(container) {
  container.innerHTML = `
    <div class="gd-game">
      <p style="color:var(--text-secondary);font-size:0.88rem;">A perceptron learns to separate two classes. Click <strong style="color:var(--purple)">Train</strong> to see it find the decision boundary through iterative weight updates!</p>
      <div class="gd-canvas-wrap"><canvas id="pcCanvas" width="840" height="340"></canvas></div>
      <div class="gd-controls">
        <div class="gd-ctrl"><label>Learning Rate: <span id="pcLR">0.1</span></label><input type="range" id="pcLRSlider" min="0.01" max="0.5" step="0.01" value="0.1" oninput="document.getElementById('pcLR').textContent=parseFloat(this.value).toFixed(2)"></div>
        <div class="gd-ctrl"><label>Epochs: <span id="pcEpochVal">0</span></label><input type="range" id="pcEpochSlider" min="1" max="100" value="0" disabled></div>
        <div class="gd-ctrl"><label>Accuracy: <span id="pcAcc">0%</span></label><input type="range" id="pcAccSlider" min="0" max="100" value="0" disabled></div>
      </div>
      <div class="gd-btns">
        <button class="gd-btn gd-btn-main" onclick="pcTrain()">▶ Train Perceptron</button>
        <button class="gd-btn gd-btn-reset" onclick="pcReset()">↺ Reset</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('pcCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let w1 = Math.random() - 0.5, w2 = Math.random() - 0.5, bias = Math.random() - 0.5;

  const data = Array.from({ length: 40 }, () => {
    const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1;
    return { x, y, label: (x + y > 0.2) ? 1 : -1 };
  });

  const predict = (x, y) => (x * w1 + y * w2 + bias) >= 0 ? 1 : -1;
  const toCanvasX = (x) => ((x + 1.5) / 3) * W;
  const toCanvasY = (y) => H - ((y + 1.5) / 3) * H;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(10,15,46,0.9)'); bg.addColorStop(1, 'rgba(5,7,20,1)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Decision boundary
    if (Math.abs(w2) > 0.001) {
      const x1 = -1.5, y1 = -(w1 * x1 + bias) / w2;
      const x2 = 1.5, y2 = -(w1 * x2 + bias) / w2;
      ctx.beginPath(); ctx.moveTo(toCanvasX(x1), toCanvasY(y1)); ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
      const grad = ctx.createLinearGradient(toCanvasX(x1), toCanvasY(y1), toCanvasX(x2), toCanvasY(y2));
      grad.addColorStop(0, 'rgba(167,139,250,0.8)'); grad.addColorStop(1, 'rgba(56,189,248,0.8)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke();
    }

    // Data points
    data.forEach(p => {
      const correct = predict(p.x, p.y) === p.label;
      const color = p.label === 1 ? (correct ? '#38bdf8' : '#93c5fd') : (correct ? '#f472b6' : '#fda4af');
      ctx.beginPath(); ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 8, 0, Math.PI * 2);
      ctx.fillStyle = color + 'cc'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (!correct) { ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✗', toCanvasX(p.x), toCanvasY(p.y)); }
    });
  }

  window.pcTrain = async function() {
    const lr = parseFloat(document.getElementById('pcLRSlider').value);
    for (let epoch = 0; epoch < 50; epoch++) {
      let errors = 0;
      data.forEach(p => {
        const pred = predict(p.x, p.y);
        if (pred !== p.label) { errors++; w1 += lr * p.label * p.x; w2 += lr * p.label * p.y; bias += lr * p.label; }
      });
      const acc = Math.round(((data.length - errors) / data.length) * 100);
      document.getElementById('pcEpochVal').textContent = epoch + 1;
      document.getElementById('pcAcc').textContent = `${acc}%`;
      draw();
      await new Promise(r => setTimeout(r, 60));
      if (errors === 0) { addXP(180); showToast('⚡ Perceptron converged! +180 XP', 'success'); return; }
    }
    addXP(60); showToast('Training complete!', 'info');
  };

  window.pcReset = function() {
    w1 = Math.random() - 0.5; w2 = Math.random() - 0.5; bias = Math.random() - 0.5;
    document.getElementById('pcEpochVal').textContent = '0';
    document.getElementById('pcAcc').textContent = '0%';
    draw();
  };

  draw();
}
