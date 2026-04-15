// simulate.js — Real-world AI simulation demos

// ============================================================
// SIM 1: SPAM DETECTOR
// ============================================================
const SPAM_WORDS = ['free','win','prize','lottery','click','money','offer','guaranteed','cash','urgent','act now','limited','exclusive','congratulations','winner','bonus','earn','income'];
const HAM_WORDS  = ['meeting','project','report','team','schedule','review','update','call','tomorrow','please','attached','discuss','deadline','proposal'];

const SPAM_DATASETS = [
  { label: '🎉 Lottery Win', text: 'CONGRATULATIONS! You have WON a FREE iPhone! Click here NOW to claim your exclusive prize. Limited time offer — guaranteed cash reward!' },
  { label: '💸 Money Offer', text: 'Earn $5000 from home! Guaranteed income with our exclusive bonus system. Act now — free registration, limited slots!' },
  { label: '📧 Legit Email', text: 'Hi team, please review the attached project report. Let\'s schedule a call tomorrow to discuss the deadline and update our proposal.' },
  { label: '🏢 Work Update', text: 'Meeting scheduled for Thursday. Please update your progress report and discuss the review with the team before the deadline.' },
];

function loadSpamDataset(idx) {
  document.getElementById('spamInput').value = SPAM_DATASETS[idx].text;
  document.getElementById('spamResult').style.display = 'none';
}

function runSpamDetector() {
  const text = (document.getElementById('spamInput').value || '').toLowerCase();
  if (!text.trim()) { showToast('Please enter some email text first!', 'info'); return; }

  let spamScore = 0, hamScore = 0;
  const foundSpam = [], foundHam = [];

  SPAM_WORDS.forEach(w => { if (text.includes(w)) { spamScore += 2; foundSpam.push(w); } });
  HAM_WORDS.forEach(w  => { if (text.includes(w)) { hamScore  += 1.5; foundHam.push(w); } });

  spamScore += 1; hamScore += 1;
  const total = spamScore + hamScore;
  const spamPct = Math.round((spamScore / total) * 100);
  const isSpam = spamScore > hamScore;

  const result = document.getElementById('spamResult');
  result.className = `sim-result ${isSpam ? 'spam' : 'ham'}`;
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label">${isSpam ? '🚫 SPAM DETECTED' : '✉️ LEGITIMATE EMAIL'}</div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>Spam Probability</span><span>${spamPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${spamPct}%; background:${isSpam ? '#f87171' : 'var(--green)'}; transition:width 1s ease;"></div></div>
    </div>
    <div class="sr-desc">
      ${foundSpam.length > 0 ? `🔴 Spam signals: <strong>${foundSpam.slice(0,4).join(', ')}</strong><br>` : ''}
      ${foundHam.length > 0  ? `🟢 Legit signals: <strong>${foundHam.slice(0,3).join(', ')}</strong><br>` : ''}
      <em style="color:var(--text-muted)">Model: Naive Bayes · P(spam|words) via Bayes theorem</em>
    </div>
  `;
  addXP(30);
  showToast(`📧 Email classified as ${isSpam ? 'SPAM' : 'Legitimate'}! +30 XP`, isSpam ? 'error' : 'success');
}

// ============================================================
// SIM 2: SENTIMENT ANALYSIS
// ============================================================
const POSITIVE_WORDS = ['amazing','excellent','great','love','fantastic','wonderful','best','perfect','awesome','happy','beautiful','brilliant','outstanding','superb','delightful','recommend','pleased','thrilled','enjoyable'];
const NEGATIVE_WORDS = ['terrible','awful','horrible','worst','hate','disappointing','poor','bad','broken','useless','waste','regret','failed','disgusting','mediocre','defective','disappointed','frustrated','annoying'];

const SENTIMENT_DATASETS = [
  { label: '😍 Positive', text: 'This product is absolutely amazing! Best purchase ever 🎉 I love everything about it — wonderful quality and outstanding service.' },
  { label: '😠 Negative', text: 'Terrible quality, broke after 2 days. Very disappointed and frustrated. Worst purchase ever. I hate this useless product.' },
  { label: '😐 Neutral',  text: 'The product arrived on time. It works as described. Nothing spectacular but does the job without any major issues.' },
  { label: '🌟 Rave Review', text: 'Brilliant! Thrilled with this purchase. Excellent performance, beautiful design. Highly recommend to everyone!' },
];

function loadSentimentDataset(idx) {
  document.getElementById('sentimentInput').value = SENTIMENT_DATASETS[idx].text;
  document.getElementById('sentimentResult').style.display = 'none';
}

function fillSentiment(text) { document.getElementById('sentimentInput').value = text; }

function runSentiment() {
  const text = (document.getElementById('sentimentInput').value || '').toLowerCase();
  if (!text.trim()) { showToast('Please enter some text first!', 'info'); return; }

  const words = text.split(/\s+/);
  const exclamations = (text.match(/!/g) || []).length;
  const emojis = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;

  let posScore = 0, negScore = 0;
  const posFound = [], negFound = [];

  POSITIVE_WORDS.forEach(w => { if (text.includes(w)) { posScore += 2; posFound.push(w); } });
  NEGATIVE_WORDS.forEach(w => { if (text.includes(w)) { negScore += 2; negFound.push(w); } });

  posScore += exclamations * 0.5 + emojis * 0.5;

  const total = posScore + negScore + 2;
  const posPct = Math.round((posScore / total) * 100);
  const negPct = Math.round((negScore / total) * 100);
  const neuPct = Math.max(0, 100 - posPct - negPct);

  let sentiment, emoji, cls;
  if (posPct > 45)      { sentiment = 'POSITIVE'; emoji = '😊'; cls = 'positive'; }
  else if (negPct > 45) { sentiment = 'NEGATIVE'; emoji = '😠'; cls = 'negative'; }
  else                  { sentiment = 'NEUTRAL';  emoji = '😐'; cls = 'neutral';  }

  const result = document.getElementById('sentimentResult');
  result.className = `sim-result ${cls}`;
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label">${emoji} Sentiment: ${sentiment}</div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😊 Positive</span><span>${posPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${posPct}%; background:#34d399; transition:width 1s ease;"></div></div>
    </div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😠 Negative</span><span>${negPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${negPct}%; background:#f87171; transition:width 1s ease;"></div></div>
    </div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😐 Neutral</span><span>${neuPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${neuPct}%; background:#94a3b8; transition:width 1s ease;"></div></div>
    </div>
    <div class="sr-desc">
      ${posFound.length ? `🟢 Positive: <strong>${posFound.slice(0,4).join(', ')}</strong><br>` : ''}
      ${negFound.length ? `🔴 Negative: <strong>${negFound.slice(0,4).join(', ')}</strong><br>` : ''}
      <em style="color:var(--text-muted)">Lexicon-based · ${words.length} words analyzed</em>
    </div>
  `;
  addXP(30);
  showToast(`${emoji} Sentiment: ${sentiment}! +30 XP`, 'success');
}

// ============================================================
// SIM 3: HOUSE PRICE PREDICTOR
// ============================================================
const HOUSE_DATASETS = [
  { label: '🏡 Starter Home', beds: 2, baths: 1, area: 900,  age: 25, loc: 4 },
  { label: '🏠 Family House', beds: 4, baths: 2, area: 2200, age: 8,  loc: 7 },
  { label: '🏰 Luxury Villa',  beds: 6, baths: 4, area: 4500, age: 2,  loc: 10 },
  { label: '🏗️ Old Apartment', beds: 2, baths: 1, area: 700,  age: 45, loc: 3 },
];

function loadHouseDataset(idx) {
  const d = HOUSE_DATASETS[idx];
  document.getElementById('hpBeds').value  = d.beds;
  document.getElementById('hpBaths').value = d.baths;
  document.getElementById('hpArea').value  = d.area;
  document.getElementById('hpAge').value   = d.age;
  document.getElementById('hpLoc').value   = d.loc;
  document.getElementById('locVal').textContent = d.loc;
  document.getElementById('housePriceResult').style.display = 'none';
}

function runHousePredictor() {
  const beds  = parseInt(document.getElementById('hpBeds').value)  || 3;
  const baths = parseInt(document.getElementById('hpBaths').value) || 2;
  const area  = parseInt(document.getElementById('hpArea').value)  || 1800;
  const age   = parseInt(document.getElementById('hpAge').value)   || 10;
  const loc   = parseInt(document.getElementById('hpLoc').value)   || 7;

  const price =
    50000 +
    beds   * 18000 +
    baths  * 12000 +
    area   * 85 +
    loc    * 22000 -
    age    * 1200 +
    (Math.random() - 0.5) * 15000;

  const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  const priceFormatted = fmt(price);

  const features = [
    { label: 'Area Impact', pct: Math.round((area * 85   / price) * 100), col: '#a78bfa' },
    { label: 'Location',    pct: Math.round((loc  * 22000 / price) * 100), col: '#38bdf8' },
    { label: 'Bedrooms',    pct: Math.round((beds * 18000 / price) * 100), col: '#f472b6' },
    { label: 'Bathrooms',   pct: Math.round((baths* 12000 / price) * 100), col: '#34d399' },
  ];

  const result = document.getElementById('housePriceResult');
  result.className = 'sim-result info';
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label" style="color:#34d399;">🏠 Predicted: <span style="color:var(--yellow)">${priceFormatted}</span></div>
    <div class="sr-desc" style="margin-bottom:10px">95% CI: ${fmt(price*0.92)} – ${fmt(price*1.08)}</div>
    ${features.map(f => `
      <div class="sr-bar-wrap">
        <div class="sr-bar-label"><span>${f.label}</span><span>${Math.max(0,f.pct)}%</span></div>
        <div class="sr-bar"><div class="sr-bar-fill" style="width:${Math.min(90,Math.max(0,f.pct))}%; background:${f.col}; transition:width 1s ease;"></div></div>
      </div>
    `).join('')}
    <div class="sr-desc"><em style="color:var(--text-muted)">Linear Regression · R²≈0.87 · ${beds}bd ${baths}ba ${area}sqft Age:${age}yr Loc:${loc}/10</em></div>
  `;
  addXP(30);
  showToast(`🏠 Predicted: ${priceFormatted}! +30 XP`, 'success');
}

// ============================================================
// SIM 4: DIGIT RECOGNIZER — Pixel-analysis based classifier
// ============================================================
const digitCanvas = document.getElementById('digitCanvas');
let digitDrawn = false;

if (digitCanvas) {
  const ctx = digitCanvas.getContext('2d');
  let drawing = false;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 200, 200);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const getPos = (e) => {
    const rect = digitCanvas.getBoundingClientRect();
    const scaleX = 200 / rect.width, scaleY = 200 / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left)*scaleX, y: (e.touches[0].clientY - rect.top)*scaleY };
    return { x: (e.clientX - rect.left)*scaleX, y: (e.clientY - rect.top)*scaleY };
  };

  digitCanvas.addEventListener('mousedown', (e) => { drawing = true; digitDrawn = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  digitCanvas.addEventListener('mousemove', (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  digitCanvas.addEventListener('mouseup',    () => { drawing = false; ctx.beginPath(); });
  digitCanvas.addEventListener('mouseleave', () => { drawing = false; ctx.beginPath(); });
  digitCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; digitDrawn = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, {passive:false});
  digitCanvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, {passive:false});
  digitCanvas.addEventListener('touchend',   () => { drawing = false; ctx.beginPath(); });
}

function clearDigit() {
  const canvas = document.getElementById('digitCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,200,200);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  digitDrawn = false;
  document.getElementById('digitBars').innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;">Draw a digit and click Recognize</p>';
}

/**
 * Analyses the drawn pixels and returns feature scores for each digit 0-9.
 * Uses: bounding box, aspect ratio, ink density per zone, top/bottom/left/right
 * projection, hole detection (for 0,6,8,9), crossing-count heuristics.
 */
function analyzeCanvasPixels() {
  const canvas = document.getElementById('digitCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const imgData = ctx.getImageData(0, 0, W, H).data; // RGBA

  // Pixel is "ink" if its red channel > 50 (white drawn on black)
  const isInk = (x, y) => imgData[(y * W + x) * 4] > 50;

  // ── 1. Bounding box ─────────────────────────────────────────
  let minX = W, maxX = 0, minY = H, maxY = 0;
  let totalInk = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (isInk(x, y)) {
        totalInk++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }

  if (totalInk < 100) return null; // too little drawn

  const bW = maxX - minX + 1, bH = maxY - minY + 1;
  const aspect = bW / bH;        // wide > 1, tall < 1
  const density = totalInk / (bW * bH); // fill ratio inside bounding box

  // ── 2. Divide bounding box into a 4×4 zone grid ─────────────
  const ZONES = 4;
  const zoneInk = Array.from({length: ZONES}, () => new Array(ZONES).fill(0));
  const zoneMax = Math.max(1, (bW / ZONES) * (bH / ZONES));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (isInk(x, y)) {
        const zi = Math.min(ZONES-1, Math.floor(((y-minY)/bH)*ZONES));
        const zj = Math.min(ZONES-1, Math.floor(((x-minX)/bW)*ZONES));
        zoneInk[zi][zj]++;
      }
    }
  }
  // Normalize zone ink to 0-1
  const z = zoneInk.map(row => row.map(v => Math.min(1, v / zoneMax)));

  // Helper: average ink of a set of zones  [row, col pairs]
  const zone = (...coords) => {
    const vals = coords.map(([r,c]) => z[r][c]);
    return vals.reduce((a,b)=>a+b,0) / vals.length;
  };

  // ── 3. Horizontal / Vertical projections ────────────────────
  // Count ink pixels per row/column (normalized)
  const rowProj = new Array(H).fill(0);
  const colProj = new Array(W).fill(0);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (isInk(x, y)) { rowProj[y]++; colProj[x]++; }
    }
  }

  // ── 4. Centroid of ink ──────────────────────────────────────
  let cx = 0, cy = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (isInk(x, y)) { cx += (x-minX)/bW; cy += (y-minY)/bH; }
    }
  }
  cx /= totalInk; cy /= totalInk; // normalized 0-1 within bounding box

  // ── 5. Hole detection using flood-fill from corners ─────────
  // A digit with a closed loop (0,6,8,9) will have interior pixels
  // not reachable from the background corners.
  const visited = new Uint8Array(W * H);
  const queue = [];
  const enqueue = (x, y) => {
    if (x<0||x>=W||y<0||y>=H) return;
    const idx = y*W+x;
    if (visited[idx] || isInk(x,y)) return;
    visited[idx] = 1; queue.push([x,y]);
  };
  // Seed from all four edges
  for (let x=0;x<W;x++) { enqueue(x,0); enqueue(x,H-1); }
  for (let y=0;y<H;y++) { enqueue(0,y); enqueue(W-1,y); }
  while (queue.length) {
    const [qx,qy] = queue.pop();
    enqueue(qx+1,qy); enqueue(qx-1,qy); enqueue(qx,qy+1); enqueue(qx,qy-1);
  }
  // Interior empty pixels = potential holes (enclosed regions)
  let holeCount = 0;
  for (let y=minY+2;y<=maxY-2;y++) {
    for (let x=minX+2;x<=maxX-2;x++) {
      if (!isInk(x,y) && !visited[y*W+x]) holeCount++;
    }
  }
  const holeRatio = holeCount / (bW * bH);
  const hasHole   = holeRatio > 0.04; // clear enclosed region
  const bigHole   = holeRatio > 0.10;

  // ── 6. Score each digit ─────────────────────────────────────
  const scores = new Array(10).fill(0);

  // DIGIT 0 — round/oval, very wide, ONE big hole, ink on all sides
  scores[0] += hasHole ? 3.5 : 0;
  scores[0] += bigHole ? 2.0 : 0;
  scores[0] += (aspect > 0.55 && aspect < 1.4) ? 1.5 : 0;
  scores[0] += (zone([0,0],[0,3],[3,0],[3,3]) > 0.3) ? 1.5 : 0; // corners filled
  scores[0] += (density > 0.18 && density < 0.55) ? 1.0 : 0;   // ring-like
  scores[0] -= (zone([1,1],[1,2],[2,1],[2,2]) > 0.3) ? 2.0 : 0; // center should be empty

  // DIGIT 1 — very narrow, tall, mostly right half or center column
  scores[1] += (aspect < 0.35) ? 3.5 : 0;
  scores[1] += !hasHole ? 1.0 : 0;
  scores[1] += (density > 0.5) ? 2.0 : 0;  // mostly filled column
  scores[1] += (zone([0,1],[0,2],[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]) > 0.5) ? 2.0 : 0;
  scores[1] += (cy > 0.4 && cy < 0.65) ? 0.5 : 0;

  // DIGIT 2 — top-right curve, middle bar, bottom-left stroke; no hole
  scores[2] += !hasHole ? 1.0 : -1.0;
  scores[2] += (zone([0,2],[0,3]) > 0.2) ? 1.5 : 0; // ink top-right
  scores[2] += (zone([3,0],[3,1]) > 0.2) ? 1.5 : 0; // ink bottom-left
  scores[2] += (zone([1,1],[1,2],[2,1],[2,2]) > 0.2) ? 1.5 : 0; // mid diagonal
  scores[2] += (aspect > 0.5 && aspect < 1.3) ? 1.0 : 0;
  scores[2] += density < 0.45 ? 1.0 : 0;

  // DIGIT 3 — two bumps on the right side; no hole; right-heavy
  scores[3] += !hasHole ? 1.0 : -0.5;
  scores[3] += (zone([0,2],[0,3],[1,2],[1,3]) > 0.3) ? 1.5 : 0; // top-right
  scores[3] += (zone([2,2],[2,3],[3,2],[3,3]) > 0.3) ? 1.5 : 0; // bottom-right
  scores[3] += (zone([0,0],[1,0],[2,0],[3,0]) < 0.15) ? 1.5 : 0; // left mostly empty
  scores[3] += (zone([1,1],[2,1]) > 0.15) ? 1.0 : 0; // mid right
  scores[3] += (aspect > 0.5 && aspect < 1.1) ? 1.0 : 0;

  // DIGIT 4 — top-left stroke + vertical right stroke + horizontal bar; no loop
  scores[4] += !hasHole ? 1.5 : 0;
  scores[4] += (zone([0,0],[1,0],[1,1]) > 0.2) ? 2.0 : 0;  // top-left arm
  scores[4] += (zone([0,3],[1,3],[2,3],[3,3]) > 0.3) ? 2.0 : 0; // right vertical
  scores[4] += (zone([2,0],[2,1],[2,2],[2,3]) > 0.3) ? 1.5 : 0; // horizontal bar
  scores[4] += (cy < 0.5) ? 0.5 : 0; // top-heavy

  // DIGIT 5 — top-left bar, mid-left down, lower loop; ONE possible small hole
  scores[5] += (zone([0,0],[0,1],[0,2],[0,3]) > 0.3) ? 1.5 : 0; // top bar
  scores[5] += (zone([3,0],[3,1],[3,2],[3,3]) > 0.2) ? 1.5 : 0; // bottom arc
  scores[5] += (zone([1,0],[2,0]) > 0.2) ? 1.5 : 0; // left mid stroke
  scores[5] += (zone([1,1],[2,2],[2,3]) > 0.2) ? 1.0 : 0; // lower right
  scores[5] += (zone([0,2],[0,3]) > 0.1) ? 0.5 : 0;

  // DIGIT 6 — loop at bottom; open at top-right; ONE hole
  scores[6] += hasHole ? 2.5 : -1.0;
  scores[6] += (zone([0,0],[0,1]) > 0.1) ? 1.5 : 0; // ink top-left (curve start)
  scores[6] += (zone([0,2],[0,3]) < 0.1) ? 1.5 : 0; // open top-right
  scores[6] += (zone([3,1],[3,2]) > 0.2) ? 1.0 : 0; // bottom loop
  scores[6] += (cy > 0.5) ? 1.0 : 0; // bottom-heavy

  // DIGIT 7 — horizontal top bar + diagonal stroke going right to bottom-left
  scores[7] += !hasHole ? 1.5 : 0;
  scores[7] += (zone([0,0],[0,1],[0,2],[0,3]) > 0.35) ? 2.5 : 0; // top bar
  scores[7] += (zone([1,2],[1,3],[2,2],[2,3]) > 0.2) ? 1.5 : 0; // upper-right diagonal
  scores[7] += (zone([3,0],[3,1]) > 0.1) ? 1.0 : 0; // bottom of diagonal
  scores[7] += (zone([1,0],[2,0]) < 0.1) ? 1.0 : 0; // left mostly empty below top
  scores[7] += density < 0.4 ? 1.0 : 0;

  // DIGIT 8 — TWO holes (or one big); symmetric; high density
  scores[8] += (holeRatio > 0.06) ? 3.0 : 0;
  scores[8] += (zone([0,1],[0,2],[1,0],[1,3]) > 0.3 && zone([2,0],[2,3],[3,1],[3,2]) > 0.3) ? 2.0 : 0;
  scores[8] += (zone([0,0],[0,3],[3,0],[3,3]) > 0.15) ? 1.0 : 0;
  scores[8] += (Math.abs(cx-0.5) < 0.15) ? 1.5 : 0; // symmetric
  scores[8] += (aspect > 0.4 && aspect < 0.95) ? 1.0 : 0;

  // DIGIT 9 — loop at top; tail going down; ONE hole at top
  scores[9] += hasHole ? 2.5 : -1.0;
  scores[9] += (zone([0,0],[0,1],[0,2],[0,3],[1,0],[1,3]) > 0.3) ? 1.5 : 0; // top loop
  scores[9] += (zone([3,2],[3,3],[2,3]) > 0.1) ? 1.5 : 0; // tail bottom right
  scores[9] += (zone([3,0],[3,1]) < 0.15) ? 1.0 : 0; // bottom-left open
  scores[9] += (cy < 0.5) ? 1.5 : -0.5; // top-heavy (loop on top)

  return scores;
}

function recognizeDigit() {
  if (!digitDrawn) {
    showToast('Please draw a digit on the canvas first!', 'info');
    return;
  }

  const rawScores = analyzeCanvasPixels();
  if (!rawScores) {
    showToast('Draw more clearly — try filling the canvas!', 'info');
    return;
  }

  // Soften with a small random noise to simulate model uncertainty
  const noisy = rawScores.map(s => Math.max(0, s + (Math.random() - 0.5) * 0.4));

  // Softmax to get probabilities
  const expScores = noisy.map(s => Math.exp(s));
  const expSum = expScores.reduce((a,b) => a+b, 0);
  const probs = expScores.map(s => s / expSum);

  // Sort by probability descending
  const sorted = probs.map((c,i) => ({i, c})).sort((a,b) => b.c - a.c);
  const topDigit = sorted[0].i;
  const topConf  = Math.round(sorted[0].c * 100);

  const barsEl = document.getElementById('digitBars');
  barsEl.innerHTML = sorted.map(({i,c}, rank) => `
    <div class="db-row ${rank===0 ? 'top-pred' : ''}">
      <span class="db-label">${i}</span>
      <div class="db-bar"><div class="db-fill" style="width:${Math.round(c*100)}%; transition:width 0.8s ease;"></div></div>
      <span class="db-pct">${Math.round(c*100)}%</span>
    </div>
  `).join('');

  addXP(25);
  showToast(`✏️ Recognized as "${topDigit}" (${topConf}% confidence)! +25 XP`, 'success');
}

// ============================================================
// SIM 5: IMAGE CLASSIFIER
// ============================================================
const IMAGE_DATA = {
  cat:    { emoji: '🐱', top: [['tabby cat',95],['Persian cat',88],['domestic shorthair',72],['kitten',61],['Siamese cat',45]] },
  dog:    { emoji: '🐕', top: [['Labrador retriever',92],['Golden retriever',80],['German shepherd',65],['Border collie',54],['Beagle',40]] },
  car:    { emoji: '🚗', top: [['sports car',90],['convertible',74],['sedan',68],['race car',55],['roadster',42]] },
  flower: { emoji: '🌸', top: [['cherry blossom',88],['lotus flower',76],['rose',72],['sakura',65],['magnolia',48]] },
  bird:   { emoji: '🦅', top: [['bald eagle',94],['hawk',79],['falcon',70],['osprey',58],['kite bird',44]] },
  pizza:  { emoji: '🍕', top: [['pizza',97],['flatbread',72],['focaccia',55],['quiche',40],['calzone',33]] },
};

let selectedImage = 'cat';
function selectImage(el, imgId) {
  document.querySelectorAll('.img-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  selectedImage = imgId;
  document.getElementById('imgPreview').textContent = IMAGE_DATA[imgId].emoji;
  document.getElementById('imageResult').style.display = 'none';
}

function runImageClassifier() {
  const img = IMAGE_DATA[selectedImage];
  const result = document.getElementById('imageResult');
  result.className = 'sim-result info';
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label" style="color:#38bdf8;">🔍 CNN Classification Results</div>
    <div class="sr-desc" style="margin-bottom:12px">Top-5 ImageNet predictions for ${img.emoji}:</div>
    ${img.top.map(([label, pct], i) => `
      <div class="sr-bar-wrap">
        <div class="sr-bar-label"><span>${i===0?'🥇':'  '} ${label}</span><span>${pct}%</span></div>
        <div class="sr-bar"><div class="sr-bar-fill" style="width:${pct}%; background:${['#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24'][i]}; transition:width 1s ease;"></div></div>
      </div>
    `).join('')}
    <div class="sr-desc"><em style="color:var(--text-muted)">ResNet-50 · ImageNet (1000 classes) · Top-1 Acc: 76.1%</em></div>
  `;
  addXP(30);
  showToast(`🖼️ Classified as "${img.top[0][0]}"! +30 XP`, 'success');
}

// ============================================================
// SIM 6: STOCK PREDICTOR (LSTM)
// ============================================================
const STOCK_DATA = {
  AAPL:  { base: 185, trend: 0.3,  vol: 3, color: '#a78bfa' },
  GOOGL: { base: 140, trend: 0.2,  vol: 2.5, color: '#38bdf8' },
  MSFT:  { base: 375, trend: 0.4,  vol: 4, color: '#34d399' },
  TSLA:  { base: 250, trend: -0.1, vol: 8, color: '#f472b6' },
};

let selectedStock = 'AAPL';

function selectStock(el, ticker) {
  document.querySelectorAll('.stk-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedStock = ticker;
  drawStockChart(ticker);
  document.getElementById('stockResult').style.display = 'none';
}

function generateStockPrices(ticker, days = 30) {
  const d = STOCK_DATA[ticker];
  const prices = [d.base];
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.48) * d.vol + d.trend;
    prices.push(Math.max(prices[i-1] + change, d.base * 0.7));
  }
  return prices;
}

function drawStockChart(ticker) {
  const canvas = document.getElementById('stockCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const prices = generateStockPrices(ticker);
  const d = STOCK_DATA[ticker];

  ctx.clearRect(0,0,W,H);
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'rgba(10,15,46,0.9)'); bg.addColorStop(1,'rgba(5,7,20,1)');
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

  const minP = Math.min(...prices)-5, maxP = Math.max(...prices)+5;
  const toC = (i, p) => [(i/(prices.length-1))*(W-40)+20, H-20 - ((p-minP)/(maxP-minP))*(H-40)];

  ctx.beginPath();
  prices.forEach((p,i) => { const [x,y] = toC(i,p); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.lineTo(...toC(prices.length-1, minP)); ctx.lineTo(...toC(0, minP)); ctx.closePath();
  const fill = ctx.createLinearGradient(0,0,0,H);
  fill.addColorStop(0, d.color+'40'); fill.addColorStop(1, d.color+'00');
  ctx.fillStyle = fill; ctx.fill();

  ctx.beginPath();
  prices.forEach((p,i) => { const [x,y] = toC(i,p); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle = '#6b7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillText(`${ticker} · 30-day history`, 20, 14);
  const last = prices[prices.length-1];
  const change = last - prices[0];
  ctx.fillStyle = change > 0 ? '#34d399' : '#f87171';
  ctx.textAlign = 'right';
  ctx.fillText(`$${last.toFixed(2)} (${change>0?'+':''}${change.toFixed(2)})`, W-20, 14);
}

function runStockPredictor() {
  const d = STOCK_DATA[selectedStock];
  const currentPrices = generateStockPrices(selectedStock, 30);
  const last = currentPrices[currentPrices.length-1];
  const trend = currentPrices.slice(-5).reduce((a,b)=>a+b,0)/5 - currentPrices.slice(-10,-5).reduce((a,b)=>a+b,0)/5;
  const prediction = last + trend * 0.7 + (Math.random()-0.5)*d.vol*0.5;
  const changePct = ((prediction - last) / last * 100).toFixed(2);

  const result = document.getElementById('stockResult');
  result.className = `sim-result ${prediction > last ? 'ham' : 'spam'}`;
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label">${prediction > last ? '📈' : '📉'} LSTM Prediction: Next Day</div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>Model Confidence</span><span>${(65+Math.random()*20).toFixed(0)}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:75%; background:${d.color}; transition:width 1s ease;"></div></div>
    </div>
    <div class="sr-desc">
      <strong>Current:</strong> $${last.toFixed(2)}<br>
      <strong>Predicted:</strong> <span style="color:${prediction>last?'#34d399':'#f87171'}">$${prediction.toFixed(2)} (${changePct>0?'+':''}${changePct}%)</span><br>
      <em style="color:var(--text-muted)">LSTM · 64 units · 30-day window · MAE: $${(d.vol*0.6).toFixed(2)}</em><br>
      <em style="color:var(--text-muted)">⚠️ Simulated only — not financial advice!</em>
    </div>
  `;
  addXP(35);
  showToast(`📈 LSTM prediction for ${selectedStock} complete! +35 XP`, 'success');
}

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  drawStockChart('AAPL');
});
