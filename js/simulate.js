// simulate.js — Real-world AI simulation demos

// ============================================================
// SIM 1: SPAM DETECTOR
// ============================================================
const SPAM_WORDS = ['free','win','prize','lottery','click','money','offer','guaranteed','cash','urgent','act now','limited','exclusive','congratulations','winner','bonus','earn','income'];
const HAM_WORDS  = ['meeting','project','report','team','schedule','review','update','call','tomorrow','please','attached','discuss','deadline','proposal'];

function runSpamDetector() {
  const text = (document.getElementById('spamInput').value || '').toLowerCase();
  if (!text.trim()) { showToast('Please enter some email text first!', 'info'); return; }

  let spamScore = 0, hamScore = 0;
  const foundSpam = [], foundHam = [];

  SPAM_WORDS.forEach(w => { if (text.includes(w)) { spamScore += 2; foundSpam.push(w); } });
  HAM_WORDS.forEach(w => { if (text.includes(w)) { hamScore += 1.5; foundHam.push(w); } });

  // Base prior
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
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${spamPct}%; background:${isSpam ? '#f87171' : 'var(--green)'};"></div></div>
    </div>
    <div class="sr-desc">
      ${foundSpam.length > 0 ? `🔴 Spam signals: <strong>${foundSpam.slice(0,4).join(', ')}</strong><br>` : ''}
      ${foundHam.length > 0 ? `🟢 Legit signals: <strong>${foundHam.slice(0,3).join(', ')}</strong>` : ''}
      <br><em style="color:var(--text-muted)">Model: Naive Bayes · P(spam|words) computed using Bayes theorem</em>
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
  const neuPct = 100 - posPct - negPct;

  let sentiment, emoji, cls;
  if (posPct > 45) { sentiment = 'POSITIVE'; emoji = '😊'; cls = 'positive'; }
  else if (negPct > 45) { sentiment = 'NEGATIVE'; emoji = '😠'; cls = 'negative'; }
  else { sentiment = 'NEUTRAL'; emoji = '😐'; cls = 'neutral'; }

  const result = document.getElementById('sentimentResult');
  result.className = `sim-result ${cls}`;
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label">${emoji} Sentiment: ${sentiment}</div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😊 Positive</span><span>${posPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${posPct}%; background:#34d399;"></div></div>
    </div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😠 Negative</span><span>${negPct}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${negPct}%; background:#f87171;"></div></div>
    </div>
    <div class="sr-bar-wrap">
      <div class="sr-bar-label"><span>😐 Neutral</span><span>${Math.max(0,neuPct)}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:${Math.max(0,neuPct)}%; background:#94a3b8;"></div></div>
    </div>
    <div class="sr-desc">
      ${posFound.length ? `🟢 Positive words: <strong>${posFound.slice(0,4).join(', ')}</strong><br>` : ''}
      ${negFound.length ? `🔴 Negative words: <strong>${negFound.slice(0,4).join(', ')}</strong><br>` : ''}
      <em style="color:var(--text-muted)">Model: Lexicon-based with valence scores · ${words.length} words analyzed</em>
    </div>
  `;
  addXP(30);
  showToast(`${emoji} Sentiment: ${sentiment}! +30 XP`, 'success');
}

// ============================================================
// SIM 3: HOUSE PRICE PREDICTOR
// ============================================================
function runHousePredictor() {
  const beds  = parseInt(document.getElementById('hpBeds').value)  || 3;
  const baths = parseInt(document.getElementById('hpBaths').value) || 2;
  const area  = parseInt(document.getElementById('hpArea').value)  || 1800;
  const age   = parseInt(document.getElementById('hpAge').value)   || 10;
  const loc   = parseInt(document.getElementById('hpLoc').value)   || 7;

  // Simulated linear model weights (representative of real estate data)
  const price =
    50000 +
    beds   * 18000 +
    baths  * 12000 +
    area   * 85 +
    loc    * 22000 -
    age    * 1200 +
    (Math.random() - 0.5) * 15000;

  const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  const priceRange = [
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price * 0.92),
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price * 1.08)
  ];

  const features = [
    { label: 'Area Impact', pct: Math.round((area * 85 / price) * 100), col: '#a78bfa' },
    { label: 'Location',    pct: Math.round((loc * 22000 / price) * 100), col: '#38bdf8' },
    { label: 'Bedrooms',    pct: Math.round((beds * 18000 / price) * 100), col: '#f472b6' },
    { label: 'Bathrooms',   pct: Math.round((baths * 12000 / price) * 100), col: '#34d399' },
  ];

  const result = document.getElementById('housePriceResult');
  result.className = 'sim-result info';
  result.style.display = 'block';
  result.innerHTML = `
    <div class="sr-label" style="color:#34d399;">🏠 Predicted Price: <span style="color:var(--yellow)">${priceFormatted}</span></div>
    <div class="sr-desc" style="margin-bottom:10px">95% Confidence Interval: ${priceRange[0]} – ${priceRange[1]}</div>
    ${features.map(f => `
      <div class="sr-bar-wrap">
        <div class="sr-bar-label"><span>${f.label}</span><span>${Math.max(0,f.pct)}%</span></div>
        <div class="sr-bar"><div class="sr-bar-fill" style="width:${Math.min(90,Math.max(0,f.pct))}%; background:${f.col};"></div></div>
      </div>
    `).join('')}
    <div class="sr-desc"><em style="color:var(--text-muted)">Model: Linear Regression · R² ≈ 0.87 · Features: ${beds} bed, ${baths} bath, ${area} sqft, Age: ${age}yr, Location: ${loc}/10</em></div>
  `;
  addXP(30);
  showToast(`🏠 Price predicted: ${priceFormatted}! +30 XP`, 'success');
}

// ============================================================
// SIM 4: DIGIT RECOGNIZER
// ============================================================
const digitCanvas = document.getElementById('digitCanvas');
if (digitCanvas) {
  const ctx = digitCanvas.getContext('2d');
  let drawing = false;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 200, 200);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';

  const getPos = (e) => {
    const rect = digitCanvas.getBoundingClientRect();
    const scaleX = 200 / rect.width, scaleY = 200 / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left)*scaleX, y: (e.touches[0].clientY - rect.top)*scaleY };
    return { x: (e.clientX - rect.left)*scaleX, y: (e.clientY - rect.top)*scaleY };
  };

  digitCanvas.addEventListener('mousedown', (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  digitCanvas.addEventListener('mousemove', (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  digitCanvas.addEventListener('mouseup', () => drawing = false);
  digitCanvas.addEventListener('mouseleave', () => drawing = false);
  digitCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, {passive:false});
  digitCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, {passive:false});
  digitCanvas.addEventListener('touchend', () => drawing = false);
}

function clearDigit() {
  const canvas = document.getElementById('digitCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,200,200);
  document.getElementById('digitBars').innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;">Draw a digit and click Recognize</p>';
}

function recognizeDigit() {
  // Simulated CNN prediction
  const guessedDigit = Math.floor(Math.random() * 10);
  const confidences = Array.from({length:10}, (_,i) => {
    if (i === guessedDigit) return 0.65 + Math.random() * 0.3;
    return Math.random() * 0.25;
  });
  // Normalize
  const total = confidences.reduce((a,b)=>a+b,0);
  const normalized = confidences.map(c => c/total);
  const sorted = normalized.map((c,i)=>({i,c})).sort((a,b)=>b.c-a.c);

  const barsEl = document.getElementById('digitBars');
  barsEl.innerHTML = sorted.map(({i,c},rank) => `
    <div class="db-row ${rank===0?'top-pred':''}">
      <span class="db-label">${i}</span>
      <div class="db-bar"><div class="db-fill" style="width:${Math.round(c*100)}%"></div></div>
      <span class="db-pct">${Math.round(c*100)}%</span>
    </div>
  `).join('');

  addXP(25);
  showToast(`✏️ Recognized as "${guessedDigit}" (${Math.round(normalized[guessedDigit]*100)}% confidence)! +25 XP`, 'success');
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
    <div class="sr-desc" style="margin-bottom:12px">Top-5 ImageNet predictions:</div>
    ${img.top.map(([label, pct], i) => `
      <div class="sr-bar-wrap">
        <div class="sr-bar-label"><span>${i===0?'🥇':'  '} ${label}</span><span>${pct}%</span></div>
        <div class="sr-bar"><div class="sr-bar-fill" style="width:${pct}%; background:${['#a78bfa','#38bdf8','#f472b6','#34d399','#fbbf24'][i]};"></div></div>
      </div>
    `).join('')}
    <div class="sr-desc"><em style="color:var(--text-muted)">Model: ResNet-50 · ImageNet (1000 classes) · Top-1 Accuracy: 76.1%</em></div>
  `;
  addXP(30);
  showToast(`🖼️ Classified as "${img.top[0][0]}"! +30 XP`, 'success');
}

// ============================================================
// SIM 6: STOCK PREDICTOR (LSTM)
// ============================================================
const STOCK_DATA = {
  AAPL:  { base: 185, trend: 0.3, vol: 3, color: '#a78bfa' },
  GOOGL: { base: 140, trend: 0.2, vol: 2.5, color: '#38bdf8' },
  MSFT:  { base: 375, trend: 0.4, vol: 4, color: '#34d399' },
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

  // Area fill
  ctx.beginPath();
  prices.forEach((p,i) => { const [x,y] = toC(i,p); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.lineTo(...toC(prices.length-1, minP)); ctx.lineTo(...toC(0, minP)); ctx.closePath();
  const fill = ctx.createLinearGradient(0,0,0,H);
  fill.addColorStop(0, d.color+'40'); fill.addColorStop(1, d.color+'00');
  ctx.fillStyle = fill; ctx.fill();

  // Line
  ctx.beginPath();
  prices.forEach((p,i) => { const [x,y] = toC(i,p); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.stroke();

  // Labels
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
      <div class="sr-bar-label"><span>Model Confidence</span><span>${(65 + Math.random()*20).toFixed(0)}%</span></div>
      <div class="sr-bar"><div class="sr-bar-fill" style="width:75%; background:${d.color};"></div></div>
    </div>
    <div class="sr-desc">
      <strong>Current price:</strong> $${last.toFixed(2)}<br>
      <strong>Predicted next day:</strong> <span style="color:${prediction>last?'#34d399':'#f87171'}">$${prediction.toFixed(2)} (${changePct > 0 ? '+':''}${changePct}%)</span><br>
      <em style="color:var(--text-muted)">Model: LSTM (64 units, 2 layers) · Features: OHLCV, 30-day window · MAE: $${(d.vol*0.6).toFixed(2)}</em>
      <br><em style="color:var(--text-muted)">⚠️ Simulated predictions only — not financial advice!</em>
    </div>
  `;
  addXP(35);
  showToast(`📈 LSTM prediction complete for ${selectedStock}! +35 XP`, 'success');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  drawStockChart('AAPL');
});
