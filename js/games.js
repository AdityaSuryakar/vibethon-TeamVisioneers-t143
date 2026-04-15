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
    'gradient-descent':         { title: '⛰️ Gradient Descent Game',     render: renderGradientDescent },
    'decision-tree':            { title: '🌳 Decision Tree Explorer',    render: renderDecisionTree },
    'neuron-builder':           { title: '🧠 Neuron Builder',             render: renderNeuronBuilder },
    'kmeans':                   { title: '🎯 K-Means Adventure',          render: renderKMeans },
    'classification-challenge': { title: '🏷️ Classification Challenge',  render: renderClassificationChallenge },
    'perceptron':               { title: '⚡ Perceptron Trainer',         render: renderPerceptron },
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
// GAME 2: DECISION TREE EXPLORER
// ============================================
function renderDecisionTree(container) {
  // Dataset: fruit classification by color & size
  const dataset = [
    { color: 'red',    size: 'large',  sweetness: 'high', label: '🍎 Apple' },
    { color: 'red',    size: 'small',  sweetness: 'high', label: '🍒 Cherry' },
    { color: 'yellow', size: 'large',  sweetness: 'high', label: '🍌 Banana' },
    { color: 'yellow', size: 'small',  sweetness: 'low',  label: '🍋 Lemon' },
    { color: 'green',  size: 'large',  sweetness: 'low',  label: '🍈 Melon' },
    { color: 'green',  size: 'small',  sweetness: 'low',  label: '🥝 Kiwi' },
    { color: 'purple', size: 'small',  sweetness: 'high', label: '🍇 Grape' },
    { color: 'orange', size: 'large',  sweetness: 'high', label: '🍊 Orange' },
  ];

  // Decision tree structure with multiple levels
  const treeRoot = {
    question: 'What color is the fruit?',
    feature: 'color',
    children: {
      'red':    { question: 'What size is it?', feature: 'size', children: { 'large': { leaf: '🍎 Apple' }, 'small': { leaf: '🍒 Cherry' } } },
      'yellow': { question: 'What size is it?', feature: 'size', children: { 'large': { leaf: '🍌 Banana' }, 'small': { leaf: '🍋 Lemon' } } },
      'green':  { question: 'What size is it?', feature: 'size', children: { 'large': { leaf: '🍈 Melon' }, 'small': { leaf: '🥝 Kiwi' } } },
      'purple': { leaf: '🍇 Grape' },
      'orange': { leaf: '🍊 Orange' },
    }
  };

  let score = 0, total = 0;
  let currentFruit = null;
  let currentNode = null;
  let path = [];

  function pickFruit() {
    currentFruit = dataset[Math.floor(Math.random() * dataset.length)];
    currentNode = treeRoot;
    path = [];
    renderStep();
  }

  function renderStep() {
    const gameDiv = document.getElementById('dtGame');
    if (!gameDiv) return;

    const isLeaf = currentNode.leaf !== undefined;
    const pathHTML = path.map((p, i) => `
      <div class="dt-path-step" style="animation-delay:${i * 0.08}s">
        <span class="dt-path-q">${p.q}</span>
        <span class="dt-path-a">→ <strong style="color:var(--blue)">${p.a}</strong></span>
      </div>`).join('');

    if (isLeaf) {
      const correct = currentNode.leaf === currentFruit.label;
      total++;
      if (correct) { score++; addXP(15); }
      gameDiv.innerHTML = `
        <div class="dt-path">${pathHTML}</div>
        <div class="dt-result" style="background:${correct ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}; border:1px solid ${correct ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}; border-radius:16px; padding:20px; text-align:center; margin-top:16px;">
          <div style="font-size:3rem; margin-bottom:8px;">${correct ? '🎉' : '❌'}</div>
          <p style="font-size:1.1rem; font-weight:700; color:${correct ? 'var(--green)' : '#f87171'};">${correct ? 'Correct!' : 'Wrong!'}</p>
          <p style="color:var(--text-secondary); font-size:0.9rem;">The fruit was: <strong style="color:var(--text-primary);">${currentFruit.label}</strong></p>
          <p style="color:var(--text-secondary); font-size:0.9rem;">Tree predicted: <strong style="color:${correct ? 'var(--green)' : '#f87171'};">${currentNode.leaf}</strong></p>
          <p style="color:var(--purple); font-size:0.85rem; margin-top:8px;">Score: ${score}/${total} &nbsp;|&nbsp; Accuracy: ${total > 0 ? Math.round(score/total*100) : 0}%</p>
        </div>
        <div style="display:flex; gap:12px; margin-top:16px; justify-content:center;">
          <button class="gd-btn gd-btn-main" onclick="dtNext()">▶ Next Fruit</button>
        </div>`;
      document.getElementById('dtScore').textContent = score;
      document.getElementById('dtAcc').textContent = `${Math.round(score/total*100)}%`;
      if (correct) showToast('🌳 Correct! Tree predicted right! +15 XP', 'success');
      else showToast('❌ Wrong branch! Study the tree rules.', 'error');
    } else {
      const opts = Object.keys(currentNode.children);
      const btns = opts.map(opt => `
        <button class="dt-option-btn" onclick="dtChoose('${opt}')">${opt}</button>`).join('');
      gameDiv.innerHTML = `
        <div class="dt-fruit-card">
          <div class="dt-emoji">${currentFruit.label.split(' ')[0]}</div>
          <div class="dt-fruit-attrs">
            <span class="dt-attr">Color: <strong style="color:var(--blue)">${currentFruit.color}</strong></span>
            <span class="dt-attr">Size: <strong style="color:var(--pink)">${currentFruit.size}</strong></span>
            <span class="dt-attr">Sweetness: <strong style="color:var(--yellow)">${currentFruit.sweetness}</strong></span>
          </div>
        </div>
        <div class="dt-path" style="margin:12px 0;">${pathHTML}</div>
        <div class="dt-question-box">
          <div class="dt-q-badge">🌿 Decision Node</div>
          <p class="dt-question">${currentNode.question}</p>
          <div class="dt-options">${btns}</div>
        </div>`;
    }
  }

  window.dtChoose = function(value) {
    path.push({ q: currentNode.question, a: value });
    currentNode = currentNode.children[value];
    if (!currentNode) {
      showToast('🤔 No branch for that value, picking again!', 'info');
      pickFruit(); return;
    }
    renderStep();
  };

  window.dtNext = function() { pickFruit(); };

  // Also draw a static tree visualization on canvas
  container.innerHTML = `
    <div class="gd-game" style="gap:16px;">
      <p style="color:var(--text-secondary);font-size:0.88rem;">A mystery fruit appears! Follow the <strong style="color:var(--purple)">decision tree</strong> rules by answering each question. Choose the right branches to classify it correctly!</p>
      <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
        <div class="gd-stat"><div class="gd-stat-val" id="dtScore" style="color:var(--green)">0</div><div class="gd-stat-label">Correct</div></div>
        <div class="gd-stat"><div class="gd-stat-val" id="dtAcc" style="color:var(--blue)">—%</div><div class="gd-stat-label">Accuracy</div></div>
      </div>
      <div id="dtGame" style="min-height:200px;"></div>
    </div>`;

  // Inject styles for DT game
  if (!document.getElementById('dtStyles')) {
    const s = document.createElement('style');
    s.id = 'dtStyles';
    s.textContent = `
      .dt-fruit-card { display:flex; align-items:center; gap:20px; padding:16px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; margin-bottom:12px; }
      .dt-emoji { font-size:3.5rem; }
      .dt-fruit-attrs { display:flex; flex-wrap:wrap; gap:10px; }
      .dt-attr { padding:6px 14px; background:rgba(255,255,255,0.06); border-radius:20px; font-size:0.85rem; color:var(--text-secondary); }
      .dt-question-box { background:rgba(167,139,250,0.08); border:1px solid rgba(167,139,250,0.25); border-radius:16px; padding:20px; }
      .dt-q-badge { display:inline-block; padding:4px 12px; background:rgba(167,139,250,0.2); border-radius:20px; font-size:0.78rem; color:var(--purple); font-weight:600; margin-bottom:10px; }
      .dt-question { font-size:1.15rem; font-weight:700; margin-bottom:14px; }
      .dt-options { display:flex; flex-wrap:wrap; gap:10px; }
      .dt-option-btn { padding:10px 20px; border:1.5px solid var(--border); border-radius:12px; background:var(--bg-card); color:var(--text-primary); font-family:var(--font-main); font-size:0.9rem; cursor:pointer; transition:all 0.2s; text-transform:capitalize; }
      .dt-option-btn:hover { border-color:var(--purple); background:rgba(167,139,250,0.15); transform:translateY(-2px); }
      .dt-path { display:flex; flex-direction:column; gap:6px; }
      .dt-path-step { display:flex; gap:10px; align-items:center; font-size:0.85rem; padding:6px 12px; background:rgba(56,189,248,0.07); border-radius:8px; border-left:3px solid var(--blue); animation:fadeSlideIn 0.3s ease both; }
      .dt-path-q { color:var(--text-secondary); }
      @keyframes fadeSlideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:none; } }
    `;
    document.head.appendChild(s);
  }

  pickFruit();
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
// GAME 5: CLASSIFICATION CHALLENGE
// ============================================
function renderClassificationChallenge(container) {
  // Levels: each defines a dataset and asks the user to place a threshold on one axis
  const levels = [
    {
      name: 'Email Spam Filter',
      desc: 'Drag the threshold line to separate Spam (🔴) from Legitimate (🔵) emails by keyword score.',
      points: [
        ...Array.from({length:14}, () => ({ x: Math.random()*38+2,  label: 0 })),  // legit: low score
        ...Array.from({length:14}, () => ({ x: Math.random()*38+60, label: 1 })),  // spam: high score
      ],
      xLabel: 'Keyword Score',
      defaultThreshold: 50,
      xMin: 0, xMax: 100,
    },
    {
      name: 'Tumour Size Detector',
      desc: 'Set the threshold on tumour size to separate Benign (🔵) from Malignant (🔴) cases.',
      points: [
        ...Array.from({length:12}, () => ({ x: Math.random()*18+2,  label: 0 })),
        ...Array.from({length:12}, () => ({ x: Math.random()*18+22, label: 1 })),
      ],
      xLabel: 'Tumour Size (mm)',
      defaultThreshold: 20,
      xMin: 0, xMax: 45,
    },
    {
      name: 'Credit Risk Scorer',
      desc: 'Divide Low-Risk (🔵) from High-Risk (🔴) applicants by their credit score.',
      points: [
        ...Array.from({length:15}, () => ({ x: Math.random()*150+550, label: 0 })),
        ...Array.from({length:15}, () => ({ x: Math.random()*150+300, label: 1 })),
      ],
      xLabel: 'Credit Score',
      defaultThreshold: 500,
      xMin: 250, xMax: 750,
    },
  ];

  let lvlIdx = 0;
  let threshold, isDragging = false;

  function startLevel(idx) {
    lvlIdx = idx;
    const lvl = levels[idx];
    threshold = lvl.defaultThreshold;
    renderLevel();
  }

  function renderLevel() {
    const lvl = levels[lvlIdx];
    container.innerHTML = `
      <div class="gd-game">
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <h3 style="font-size:1rem;color:var(--purple);">Level ${lvlIdx+1}/${levels.length}: ${lvl.name}</h3>
          <span style="color:var(--text-muted);font-size:0.85rem;">${lvl.desc}</span>
        </div>
        <div class="gd-canvas-wrap"><canvas id="ccCanvas" width="840" height="200"></canvas></div>
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-top:4px;">
          <span style="color:var(--text-secondary);font-size:0.85rem;">🖱️ Drag the <strong style="color:#fbbf24;">yellow line</strong> to set threshold</span>
          <div class="gd-stat" style="min-width:80px;"><div class="gd-stat-val" id="ccF1" style="color:var(--green);">—</div><div class="gd-stat-label">F1-Score</div></div>
          <div class="gd-stat" style="min-width:80px;"><div class="gd-stat-val" id="ccAcc" style="color:var(--blue);">—%</div><div class="gd-stat-label">Accuracy</div></div>
          <div class="gd-stat" style="min-width:80px;"><div class="gd-stat-val" id="ccTP" style="color:#34d399;">—</div><div class="gd-stat-label">True Pos</div></div>
          <div class="gd-stat" style="min-width:80px;"><div class="gd-stat-val" id="ccFP" style="color:#f87171;">—</div><div class="gd-stat-label">False Pos</div></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:4px;">
          <button class="gd-btn gd-btn-main" id="ccSubmitBtn" onclick="ccSubmit()">✅ Lock In Threshold</button>
          ${lvlIdx > 0 ? '<button class="gd-btn gd-btn-reset" onclick="ccPrev()">← Prev</button>' : ''}
        </div>
      </div>`;

    const canvas = document.getElementById('ccCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const { xMin, xMax, xLabel } = lvl;

    const toCanvasX = x => ((x - xMin) / (xMax - xMin)) * (W - 80) + 40;
    const fromCanvasX = cx => ((cx - 40) / (W - 80)) * (xMax - xMin) + xMin;

    function computeMetrics(thresh) {
      let tp=0, fp=0, tn=0, fn=0;
      lvl.points.forEach(p => {
        const pred = p.x >= thresh ? 1 : 0;
        if (pred===1 && p.label===1) tp++;
        else if (pred===1 && p.label===0) fp++;
        else if (pred===0 && p.label===0) tn++;
        else fn++;
      });
      const precision = tp+fp > 0 ? tp/(tp+fp) : 0;
      const recall    = tp+fn > 0 ? tp/(tp+fn) : 0;
      const f1 = precision+recall > 0 ? 2*precision*recall/(precision+recall) : 0;
      const acc = (tp+tn)/lvl.points.length;
      return { tp, fp, tn, fn, f1, acc };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'rgba(10,15,46,0.95)'); bg.addColorStop(1,'rgba(5,7,20,1)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      // Axis
      ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, H-30); ctx.lineTo(W-40, H-30); ctx.stroke();
      ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='11px Outfit,sans-serif'; ctx.textAlign='center';
      ctx.fillText(xLabel, W/2, H-5);

      // Shade regions
      const tx = toCanvasX(threshold);
      ctx.fillStyle='rgba(56,189,248,0.07)'; ctx.fillRect(40, 20, tx-40, H-50);
      ctx.fillStyle='rgba(248,113,113,0.07)'; ctx.fillRect(tx, 20, W-40-tx, H-50);

      // Points
      lvl.points.forEach(p => {
        const cx = toCanvasX(p.x);
        const cy = 30 + Math.random() * (H - 80); // jitter vertically
        const color = p.label===0 ? '#38bdf8' : '#f87171';
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI*2);
        ctx.fillStyle = color+'cc'; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth=1.5; ctx.stroke();
      });

      // Threshold line
      const gline = ctx.createLinearGradient(tx, 20, tx, H-30);
      gline.addColorStop(0,'rgba(251,191,36,0.9)'); gline.addColorStop(1,'rgba(251,191,36,0.4)');
      ctx.beginPath(); ctx.moveTo(tx, 20); ctx.lineTo(tx, H-30);
      ctx.strokeStyle=gline; ctx.lineWidth=3; ctx.stroke();
      // Drag handle
      ctx.beginPath(); ctx.arc(tx, H-30, 10, 0, Math.PI*2);
      ctx.fillStyle='#fbbf24'; ctx.fill();
      ctx.strokeStyle='white'; ctx.lineWidth=2; ctx.stroke();
      // Threshold label
      ctx.fillStyle='#fbbf24'; ctx.font='bold 12px Outfit,sans-serif'; ctx.textAlign='center';
      ctx.fillText(threshold.toFixed(1), tx, 14);

      // Update metrics
      const m = computeMetrics(threshold);
      const f1El=document.getElementById('ccF1'), accEl=document.getElementById('ccAcc'),
            tpEl=document.getElementById('ccTP'),  fpEl=document.getElementById('ccFP');
      if(f1El) f1El.textContent = m.f1.toFixed(2);
      if(accEl) accEl.textContent = `${Math.round(m.acc*100)}%`;
      if(tpEl) tpEl.textContent = m.tp;
      if(fpEl) fpEl.textContent = m.fp;
    }

    // store points with stable y positions (not re-random on draw)
    lvl.points.forEach(p => { if(p.cy===undefined) p.cy = 30 + Math.random()*(H-80); });
    function drawStable() {
      ctx.clearRect(0, 0, W, H);
      const bg2 = ctx.createLinearGradient(0,0,0,H);
      bg2.addColorStop(0,'rgba(10,15,46,0.95)'); bg2.addColorStop(1,'rgba(5,7,20,1)');
      ctx.fillStyle=bg2; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='rgba(148,163,184,0.3)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(40,H-30); ctx.lineTo(W-40,H-30); ctx.stroke();
      ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='11px Outfit,sans-serif'; ctx.textAlign='center';
      ctx.fillText(lvl.xLabel, W/2, H-5);
      const tx2 = toCanvasX(threshold);
      ctx.fillStyle='rgba(56,189,248,0.07)'; ctx.fillRect(40,20,tx2-40,H-50);
      ctx.fillStyle='rgba(248,113,113,0.07)'; ctx.fillRect(tx2,20,W-40-tx2,H-50);
      lvl.points.forEach(p=>{
        const cx=toCanvasX(p.x); const color=p.label===0?'#38bdf8':'#f87171';
        ctx.beginPath(); ctx.arc(cx,p.cy,7,0,Math.PI*2);
        ctx.fillStyle=color+'cc'; ctx.fill(); ctx.strokeStyle=color; ctx.lineWidth=1.5; ctx.stroke();
      });
      const gl=ctx.createLinearGradient(tx2,20,tx2,H-30);
      gl.addColorStop(0,'rgba(251,191,36,0.9)'); gl.addColorStop(1,'rgba(251,191,36,0.4)');
      ctx.beginPath(); ctx.moveTo(tx2,20); ctx.lineTo(tx2,H-30); ctx.strokeStyle=gl; ctx.lineWidth=3; ctx.stroke();
      ctx.beginPath(); ctx.arc(tx2,H-30,10,0,Math.PI*2); ctx.fillStyle='#fbbf24'; ctx.fill(); ctx.strokeStyle='white'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='#fbbf24'; ctx.font='bold 12px Outfit,sans-serif'; ctx.textAlign='center'; ctx.fillText(threshold.toFixed(1),tx2,14);
      const m=computeMetrics(threshold);
      const f1E=document.getElementById('ccF1'),aE=document.getElementById('ccAcc'),tE=document.getElementById('ccTP'),fE=document.getElementById('ccFP');
      if(f1E)f1E.textContent=m.f1.toFixed(2); if(aE)aE.textContent=`${Math.round(m.acc*100)}%`; if(tE)tE.textContent=m.tp; if(fE)fE.textContent=m.fp;
    }

    canvas.addEventListener('mousedown', (e)=>{ const r=canvas.getBoundingClientRect(); const cx=(e.clientX-r.left)*(W/r.width); const tx3=toCanvasX(threshold); if(Math.abs(cx-tx3)<18) isDragging=true; });
    canvas.addEventListener('mousemove', (e)=>{ if(!isDragging) return; const r=canvas.getBoundingClientRect(); threshold=Math.max(lvl.xMin, Math.min(lvl.xMax, fromCanvasX((e.clientX-r.left)*(W/r.width)))); drawStable(); });
    canvas.addEventListener('mouseup', ()=>{ isDragging=false; });
    canvas.addEventListener('mouseleave', ()=>{ isDragging=false; });
    // Touch support
    canvas.addEventListener('touchstart', (e)=>{ const r=canvas.getBoundingClientRect(); const cx=(e.touches[0].clientX-r.left)*(W/r.width); if(Math.abs(cx-toCanvasX(threshold))<24) isDragging=true; e.preventDefault(); }, {passive:false});
    canvas.addEventListener('touchmove', (e)=>{ if(!isDragging) return; const r=canvas.getBoundingClientRect(); threshold=Math.max(lvl.xMin,Math.min(lvl.xMax,fromCanvasX((e.touches[0].clientX-r.left)*(W/r.width)))); drawStable(); e.preventDefault(); }, {passive:false});
    canvas.addEventListener('touchend', ()=>{ isDragging=false; });

    window.ccSubmit = function() {
      const m = computeMetrics(threshold);
      const xpEarned = Math.round(m.f1 * 140);
      addXP(xpEarned);
      if (m.f1 >= 0.85) {
        showToast(`🏆 Excellent! F1=${m.f1.toFixed(2)} +${xpEarned} XP`, 'success');
      } else if (m.f1 >= 0.6) {
        showToast(`✅ Good job! F1=${m.f1.toFixed(2)} +${xpEarned} XP. Try to beat 0.85!`, 'info');
      } else {
        showToast(`🔧 F1=${m.f1.toFixed(2)}. Adjust the threshold more carefully!`, 'error');
      }
      if (lvlIdx < levels.length - 1) {
        setTimeout(() => startLevel(lvlIdx + 1), 1500);
      } else {
        setTimeout(() => { showToast('🎉 All levels complete! +50 bonus XP', 'success'); addXP(50); }, 1600);
      }
    };
    window.ccPrev = function() { startLevel(lvlIdx - 1); };

    drawStable();
  }

  startLevel(0);
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
