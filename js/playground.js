// ============================================================
// playground.js — Interactive ML Code Playground (Ace Editor)
// ============================================================

// ============================================================
// CODE TEMPLATES — ML algorithms with simulated run functions
// ============================================================
const TEMPLATES = {
  'linear-regression': {
    filename: 'linear_regression.py',
    concept: '📈 Linear Regression finds the best-fit line through data by minimizing Mean Squared Error (MSE). It models y = wx + b, where w (weight) and b (bias) are learned via gradient descent.',
    code: `# ================================================
# LINEAR REGRESSION — from scratch
# ================================================
import numpy as np

# --- Generate synthetic dataset ---
np.random.seed(42)
X = np.linspace(0, 10, 30)
noise = np.random.randn(30) * 1.5
y = 2.5 * X + 3 + noise  # True: y = 2.5x + 3

print("=== LINEAR REGRESSION ===")
print(f"Dataset: {len(X)} samples")
print(f"Feature range: [{X.min():.1f}, {X.max():.1f}]")
print(f"Target range: [{y.min():.1f}, {y.max():.1f}]")
print()

# --- Train/test split ---
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# --- Gradient Descent ---
w, b = 0.0, 0.0
lr = 0.01
epochs = 500

print("Training with Gradient Descent...")
for epoch in range(epochs):
    y_pred = w * X_train + b
    error = y_pred - y_train
    
    # Compute gradients
    dw = (2 / len(X_train)) * np.dot(error, X_train)
    db = (2 / len(X_train)) * np.sum(error)
    
    # Update weights
    w -= lr * dw
    b -= lr * db
    
    if epoch % 100 == 0:
        mse = np.mean(error ** 2)
        print(f"  Epoch {epoch:4d} | MSE: {mse:.4f} | w={w:.3f}, b={b:.3f}")

# --- Evaluation ---
y_test_pred = w * X_test + b
test_mse = np.mean((y_test_pred - y_test) ** 2)
test_mae = np.mean(np.abs(y_test_pred - y_test))
ss_res = np.sum((y_test - y_test_pred) ** 2)
ss_tot = np.sum((y_test - np.mean(y_test)) ** 2)
r2 = 1 - ss_res / ss_tot

print()
print("=== MODEL RESULTS ===")
print(f"Learned:      y = {w:.3f}x + {b:.3f}")
print(f"True:         y = 2.500x + 3.000")
print(f"Test MSE:     {test_mse:.4f}")
print(f"Test MAE:     {test_mae:.4f}")
print(f"R² Score:     {r2:.4f}")
print()

if r2 > 0.9:
    print("✅ Excellent fit! R² > 0.9")
elif r2 > 0.7:
    print("✓ Good fit! R² > 0.7")
else:
    print("⚠  Model needs more training or better features")`,
    run: function (output, viz) {
      const lines = [];
      const X = Array.from({ length: 30 }, (_, i) => i * 10 / 29);
      const y = X.map(x => 2.5 * x + 3 + (Math.random() - 0.5) * 3);
      let w = 0, b = 0, lr = 0.01;
      const Xt = X.slice(0, 24), yt = y.slice(0, 24);

      lines.push({ type: 'header', text: '=== LINEAR REGRESSION ===' });
      lines.push({ type: 'result', text: `Dataset: 30 samples` });
      lines.push({ type: 'result', text: `Feature range: [${X[0].toFixed(1)}, ${X[X.length - 1].toFixed(1)}]` });
      lines.push({ type: 'result', text: `Target range: [${Math.min(...y).toFixed(1)}, ${Math.max(...y).toFixed(1)}]` });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'info', text: 'Training with Gradient Descent...' });

      for (let e = 0; e < 500; e++) {
        const yp = Xt.map(x => w * x + b);
        const err = yp.map((p, i) => p - yt[i]);
        const dw = (2 / Xt.length) * Xt.reduce((s, x, i) => s + err[i] * x, 0);
        const db = (2 / Xt.length) * err.reduce((s, v) => s + v, 0);
        w -= lr * dw; b -= lr * db;
        if (e % 100 === 0) {
          const mse = err.reduce((s, v) => s + v * v, 0) / Xt.length;
          lines.push({ type: 'result', text: `  Epoch ${String(e).padStart(4, ' ')} | MSE: ${mse.toFixed(4)} | w=${w.toFixed(3)}, b=${b.toFixed(3)}` });
        }
      }

      const Xtest = X.slice(24), ytest = y.slice(24);
      const yptest = Xtest.map(x => w * x + b);
      const mse = yptest.reduce((s, v, i) => s + (v - ytest[i]) ** 2, 0) / ytest.length;
      const mae = yptest.reduce((s, v, i) => s + Math.abs(v - ytest[i]), 0) / ytest.length;
      const ssTot = ytest.reduce((s, v) => s + (v - ytest.reduce((a, b) => a + b, 0) / ytest.length) ** 2, 0);
      const ssRes = yptest.reduce((s, v, i) => s + (v - ytest[i]) ** 2, 0);
      const r2 = 1 - ssRes / ssTot;

      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'header', text: '=== MODEL RESULTS ===' });
      lines.push({ type: 'result', text: `Learned:      y = ${w.toFixed(3)}x + ${b.toFixed(3)}` });
      lines.push({ type: 'result', text: `True:         y = 2.500x + 3.000` });
      lines.push({ type: 'result', text: `Test MSE:     ${mse.toFixed(4)}` });
      lines.push({ type: 'result', text: `Test MAE:     ${mae.toFixed(4)}` });
      lines.push({ type: 'result', text: `R² Score:     ${r2.toFixed(4)}` });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: r2 > 0.7 ? '✅ Excellent fit! Model learned well.' : '⚠ Model could be improved' });

      output(lines);
      addXP(50);
      showToast('✅ Linear Regression executed! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#080c1f'); bg.addColorStop(1, '#050810');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const pad = 40;
        const xScale = (W - pad * 2) / (Math.max(...X));
        const yScale = (H - pad * 2) / (Math.max(...y) - Math.min(...y));
        const toC = (x, y_) => [pad + x * xScale, H - pad - (y_ - Math.min(...y)) * yScale];
        X.forEach((x, i) => {
          const [cx, cy] = toC(x, y[i]);
          ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,0.7)'; ctx.fill();
        });
        ctx.beginPath();
        const [x1, y1] = toC(X[0], w * X[0] + b);
        const [x2, y2] = toC(X[X.length - 1], w * X[X.length - 1] + b);
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        const lg = ctx.createLinearGradient(x1, 0, x2, 0);
        lg.addColorStop(0, '#a78bfa'); lg.addColorStop(1, '#f472b6');
        ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillText('📈 Linear Regression Fit', pad, 20);
      });
    }
  },
  'knn': {
    filename: 'k_nearest_neighbors.py',
    concept: '🔵 K-Nearest Neighbors (KNN) classifies a new point by majority vote of its K closest training samples. It\'s a non-parametric, lazy learner — it memorizes the training data and makes decisions at prediction time.',
    code: `# ================================================
# K-NEAREST NEIGHBORS — from scratch
# ================================================

def euclidean_distance(a, b):
    """Compute Euclidean distance between two points"""
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def knn_predict(X_train, y_train, x_query, k=3):
    """Classify using K nearest neighbors"""
    distances = [(euclidean_distance(x_query, x), y)
                 for x, y in zip(X_train, y_train)]
    distances.sort(key=lambda d: d[0])
    k_nearest = [label for _, label in distances[:k]]
    return max(set(k_nearest), key=k_nearest.count)

# --- Dataset: Iris-like ---
X_train = [
    [1.4, 0.2], [1.5, 0.1], [1.3, 0.3],
    [4.5, 1.5], [4.7, 1.4], [4.9, 1.5],
    [5.9, 2.1], [6.1, 2.3], [5.8, 1.8],
]
y_train = ['Setosa']*3 + ['Versicolor']*3 + ['Virginica']*3

print("=== K-NEAREST NEIGHBORS ===")
print("Training samples:", len(X_train))
print("Classes: Setosa, Versicolor, Virginica")
print()

test_points = [[1.5, 0.25], [4.8, 1.45], [6.0, 2.0]]
expected     = ['Setosa',   'Versicolor','Virginica']

print("=== PREDICTIONS (K=3) ===")
correct = 0
for point, true_label in zip(test_points, expected):
    pred = knn_predict(X_train, y_train, point, k=3)
    match = "✓" if pred == true_label else "✗"
    if pred == true_label:
        correct += 1
    print(f"  {match} Point {point} → {pred} (True: {true_label})")

print()
print(f"Accuracy: {correct}/{len(expected)} = {correct/len(expected)*100:.0f}%")`,
    run: function (output, viz) {
      const lines = [];
      const classes = ['Setosa', 'Versicolor', 'Virginica'];
      const colors = ['#34d399', '#a78bfa', '#f472b6'];
      lines.push({ type: 'header', text: '=== K-NEAREST NEIGHBORS ===' });
      lines.push({ type: 'result', text: 'Training samples: 9' });
      lines.push({ type: 'result', text: 'Classes: Setosa, Versicolor, Virginica' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'header', text: '=== PREDICTIONS (K=3) ===' });
      const preds = [['Setosa','Setosa'],['Versicolor','Versicolor'],['Virginica','Virginica']];
      preds.forEach(([pred, truth]) => {
        lines.push({ type: 'success', text: `  ✓ Predicted: ${pred} → True: ${truth}` });
      });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: 'Accuracy: 3/3 = 100%' });
      output(lines);
      addXP(50);
      showToast('🔵 KNN executed! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);
        const trainData = [
          [[1.4,0.2],[1.5,0.1],[1.3,0.3],'#34d399'],
          [[4.5,1.5],[4.7,1.4],[4.9,1.5],'#a78bfa'],
          [[5.9,2.1],[6.1,2.3],[5.8,1.8],'#f472b6'],
        ];
        const xMin=1,xMax=7,yMin=0,yMax=2.5;
        const toC=(px,py)=>[40+(px-xMin)/(xMax-xMin)*(W-60),H-30-(py-yMin)/(yMax-yMin)*(H-50)];
        trainData.forEach(([pts,,color])=>{pts.forEach(([px,py])=>{const[cx,cy]=toC(px,py);ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fillStyle=color+'cc';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();});});
        const[tx,ty]=toC(4.8,1.45);ctx.beginPath();ctx.arc(tx,ty,10,0,Math.PI*2);ctx.fillStyle='rgba(251,191,36,0.3)';ctx.fill();ctx.beginPath();ctx.arc(tx,ty,5,0,Math.PI*2);ctx.fillStyle='#fbbf24';ctx.fill();
        ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono';ctx.textAlign='left';ctx.fillText('🔵 KNN Classification',40,18);
        classes.forEach((c,i)=>{ctx.fillStyle=colors[i];ctx.fillText(`● ${c}`,W-130,18+i*14);});
      });
    }
  },
  'kmeans': {
    filename: 'kmeans_clustering.py',
    concept: '🎯 K-Means groups data into K clusters by iteratively assigning each point to the nearest centroid and recomputing centroids as cluster means. It minimizes within-cluster sum of squares (WCSS).',
    code: `# ================================================
# K-MEANS CLUSTERING — from scratch
# ================================================
import random
import math

def distance(a, b):
    return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def kmeans(points, k=3, max_iters=50):
    # Random init
    centroids = random.sample(points, k)
    
    for iteration in range(max_iters):
        # Assign clusters
        clusters = [[] for _ in range(k)]
        for p in points:
            dists = [distance(p, c) for c in centroids]
            clusters[dists.index(min(dists))].append(p)
        
        # Update centroids
        new_centroids = []
        for cluster in clusters:
            if cluster:
                cx = sum(p[0] for p in cluster) / len(cluster)
                cy = sum(p[1] for p in cluster) / len(cluster)
                new_centroids.append([cx, cy])
            else:
                new_centroids.append(centroids[len(new_centroids)])
        
        # Check convergence
        if all(distance(a,b) < 0.001 for a,b in zip(centroids, new_centroids)):
            print(f"  Converged at iteration {iteration+1}!")
            break
        centroids = new_centroids
        
        if iteration % 5 == 0:
            wcss = sum(distance(p,centroids[i])**2
                       for i,cl in enumerate(clusters) for p in cl)
            print(f"  Iter {iteration:3d} | WCSS: {wcss:.2f}")
    
    return clusters, centroids

# Generate data
random.seed(42)
points = []
for cx, cy in [(2,2), (-2,2), (0,-2)]:
    for _ in range(40):
        points.append([cx + random.gauss(0,0.7), cy + random.gauss(0,0.7)])

print("=== K-MEANS CLUSTERING ===")
print(f"Dataset: {len(points)} points, K=3")
print()
print("Running K-Means...")
clusters, centroids = kmeans(points, k=3)

print()
print("=== CLUSTER RESULTS ===")
for i, (cl, c) in enumerate(zip(clusters, centroids)):
    print(f"  Cluster {i+1}: {len(cl)} points, centroid=[{c[0]:.2f}, {c[1]:.2f}]")
print()
print("✅ Clustering complete!")`,
    run: function (output, viz) {
      const lines = [];
      const pts = []; const centers = [[2,2],[-2,2],[0,-2]]; const colors = ['#a78bfa','#38bdf8','#f472b6'];
      centers.forEach((c,ci) => { for(let i=0;i<40;i++) pts.push({x:c[0]+(Math.random()-0.5)*1.4,y:c[1]+(Math.random()-0.5)*1.4,cls:ci}); });
      lines.push({type:'header',text:'=== K-MEANS CLUSTERING ==='});
      lines.push({type:'result',text:'Dataset: 120 points, K=3'});
      lines.push({type:'divider',text:''});
      lines.push({type:'info',text:'Running K-Means...'});
      [0,5,10,15].forEach(it=>lines.push({type:'result',text:`  Iter ${String(it).padStart(3,' ')} | WCSS: ${(120-it*5+Math.random()*5).toFixed(2)}`}));
      lines.push({type:'success',text:'  Converged at iteration 18!'});
      lines.push({type:'divider',text:''});
      lines.push({type:'header',text:'=== CLUSTER RESULTS ==='});
      lines.push({type:'result',text:'  Cluster 1: 40 points, centroid=[2.03, 1.97]'});
      lines.push({type:'result',text:'  Cluster 2: 40 points, centroid=[-1.98, 2.01]'});
      lines.push({type:'result',text:'  Cluster 3: 40 points, centroid=[0.02, -2.05]'});
      lines.push({type:'divider',text:''});
      lines.push({type:'success',text:'✅ Clustering complete!'});
      output(lines); addXP(50); showToast('🎯 K-Means executed! +50 XP','success');

      viz((canvas,ctx)=>{
        const W=canvas.width,H=canvas.height;
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#080c1f';ctx.fillRect(0,0,W,H);
        const toC=(x,y)=>[(x+4)/8*(W-60)+30,H/2-y/8*(H-40)];
        pts.forEach(p=>{const[cx,cy]=toC(p.x,p.y);ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle=colors[p.cls]+'99';ctx.fill();});
        centers.forEach(([x,y],i)=>{const[cx,cy]=toC(x,y);ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fillStyle=colors[i];ctx.fill();ctx.fillStyle='white';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✦',cx,cy);});
        ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('🎯 K-Means Clustering (K=3)',10,8);
      });
    }
  },
  'neural-net': {
    filename: 'neural_network.py',
    concept: '🧠 A Neural Network is a stack of layers where each neuron computes a weighted sum of inputs, applies an activation function, and passes the result forward. Learning happens via backpropagation + gradient descent.',
    code: `# ================================================
# NEURAL NETWORK — XOR Problem from scratch
# ================================================
import math
import random

def sigmoid(x):
    return 1 / (1 + math.exp(-max(-500, min(500, x))))

def sigmoid_deriv(x):
    s = sigmoid(x)
    return s * (1 - s)

# Simple 2-4-1 neural network
random.seed(42)

# Initialize weights
w_hidden = [[random.gauss(0,0.5) for _ in range(2)] for _ in range(4)]
b_hidden = [0.0] * 4
w_output = [random.gauss(0,0.5) for _ in range(4)]
b_output = 0.0

# XOR data
X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 1, 1, 0]

lr = 0.5
print("=== NEURAL NETWORK — XOR Problem ===")
print("Architecture: 2 → 4 → 1")
print("Training for 5000 epochs...")
print()

for epoch in range(5001):
    total_loss = 0
    for xi, yi in zip(X, y):
        # Forward pass
        hidden = []
        hidden_z = []
        for j in range(4):
            z = sum(xi[k]*w_hidden[j][k] for k in range(2)) + b_hidden[j]
            hidden_z.append(z)
            hidden.append(sigmoid(z))
        
        out_z = sum(hidden[j]*w_output[j] for j in range(4)) + b_output
        out = sigmoid(out_z)
        
        error = yi - out
        total_loss += error ** 2
        
        # Backprop
        d_out = error * sigmoid_deriv(out_z)
        for j in range(4):
            d_hidden = d_out * w_output[j] * sigmoid_deriv(hidden_z[j])
            for k in range(2):
                w_hidden[j][k] += lr * d_hidden * xi[k]
            b_hidden[j] += lr * d_hidden
            w_output[j] += lr * d_out * hidden[j]
        b_output += lr * d_out
    
    if epoch % 1000 == 0:
        print(f"  Epoch {epoch:5d} | Loss: {total_loss:.6f}")

print()
print("=== PREDICTIONS ===")
for xi, yi in zip(X, y):
    hidden = [sigmoid(sum(xi[k]*w_hidden[j][k] for k in range(2))+b_hidden[j]) for j in range(4)]
    pred = sigmoid(sum(hidden[j]*w_output[j] for j in range(4))+b_output)
    ok = "✓" if abs(pred - yi) < 0.1 else "✗"
    print(f"  {ok} {xi} → {pred:.4f} (Expected: {yi})")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({type:'header',text:'=== NEURAL NETWORK — XOR Problem ==='});
      lines.push({type:'result',text:'Architecture: 2 → 4 → 1'});
      lines.push({type:'result',text:'Training for 5000 epochs...'});
      lines.push({type:'divider',text:''});
      [0,1000,2000,3000,4000,5000].forEach((ep,i)=>{
        const losses=[0.2503,0.1832,0.0934,0.0412,0.0187,0.0067];
        lines.push({type:'result',text:`  Epoch ${String(ep).padStart(5,' ')} | Loss: ${losses[i].toFixed(6)}`});
      });
      lines.push({type:'divider',text:''});
      lines.push({type:'header',text:'=== PREDICTIONS ==='});
      lines.push({type:'success',text:'  ✓ [0,0] → 0.0312 (Expected: 0)'});
      lines.push({type:'success',text:'  ✓ [0,1] → 0.9681 (Expected: 1)'});
      lines.push({type:'success',text:'  ✓ [1,0] → 0.9673 (Expected: 1)'});
      lines.push({type:'success',text:'  ✓ [1,1] → 0.0287 (Expected: 0)'});
      lines.push({type:'divider',text:''});
      lines.push({type:'success',text:'✅ XOR solved! Neural network converged.'});
      output(lines); addXP(75); showToast('🧠 Neural Network trained! +75 XP','success');

      viz((canvas,ctx)=>{
        const W=canvas.width,H=canvas.height;
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#080c1f';ctx.fillRect(0,0,W,H);
        const losses=[0.2503,0.22,0.18,0.14,0.10,0.07,0.05,0.037,0.025,0.018,0.010,0.006,0.005];
        const pts=losses.length;const maxL=0.26;
        ctx.beginPath();
        losses.forEach((l,i)=>{const cx=40+(W-60)/(pts-1)*i,cy=30+(H-60)*(1-l/maxL);if(i===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx,cy);});
        const gr=ctx.createLinearGradient(40,0,W-20,0);gr.addColorStop(0,'#f472b6');gr.addColorStop(1,'#a78bfa');
        ctx.strokeStyle=gr;ctx.lineWidth=2.5;ctx.stroke();
        losses.forEach((l,i)=>{const cx=40+(W-60)/(pts-1)*i,cy=30+(H-60)*(1-l/maxL);ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle='#a78bfa';ctx.fill();});
        ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono';ctx.textAlign='left';ctx.fillText('🧠 Training Loss Curve',40,18);
      });
    }
  },
  'gradient-descent': {
    filename: 'gradient_descent.py',
    concept: '⛰️ Gradient Descent iteratively moves in the direction of steepest descent (negative gradient) to minimize a loss function. Learning rate controls step size — too large = oscillation, too small = slow convergence.',
    code: `# ================================================
# GRADIENT DESCENT VARIANTS
# ================================================

# Loss function: f(x) = x^4 - 4x^2 + x
def f(x):   return x**4 - 4*x**2 + x
def df(x):  return 4*x**3 - 8*x + 1

def gradient_descent(x_init, lr=0.01, n_iters=100, method='vanilla'):
    x = x_init
    velocity = 0
    
    for i in range(n_iters):
        grad = df(x)
        
        if method == 'vanilla':
            x = x - lr * grad
        elif method == 'momentum':
            velocity = 0.9 * velocity - lr * grad
            x = x + velocity
    
    return x

print("=== GRADIENT DESCENT COMPARISON ===")
x_init = 2.0
print(f"Starting point: x = {x_init}")
print(f"True minima near: x ≈ -1.38 and x ≈ 1.35")
print()

for method, lr in [('vanilla', 0.01), ('momentum', 0.01)]:
    x_final = gradient_descent(x_init, lr=lr, method=method)
    print(f"Method: {method.upper():10s} | x_final: {x_final:.6f} | f(x): {f(x_final):.6f}")

print()
print("✅ Gradient descent demo complete!")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({type:'header',text:'=== GRADIENT DESCENT COMPARISON ==='});
      lines.push({type:'result',text:'Starting point: x = 2.0'});
      lines.push({type:'result',text:'True minima near: x ≈ -1.38 and x ≈ 1.35'});
      lines.push({type:'divider',text:''});
      lines.push({type:'result',text:'Method: VANILLA    | x_final: 1.354821 | f(x): -3.122441'});
      lines.push({type:'result',text:'Method: MOMENTUM   | x_final: 1.354819 | f(x): -3.122441'});
      lines.push({type:'divider',text:''});
      lines.push({type:'success',text:'✅ Gradient descent demo complete!'});
      output(lines); addXP(50); showToast('⛰️ Gradient Descent executed! +50 XP','success');

      viz((canvas,ctx)=>{
        const W=canvas.width,H=canvas.height;
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#080c1f';ctx.fillRect(0,0,W,H);
        const f=x=>x**4-4*x**2+x;
        const xMin=-2.5,xMax=2.5,yMin=-5,yMax=5;
        const toC=(x,y)=>[(x-xMin)/(xMax-xMin)*(W-60)+30,H-30-(y-yMin)/(yMax-yMin)*(H-50)];
        ctx.beginPath();
        for(let px=0;px<=W;px++){const x=xMin+(px/W)*(xMax-xMin),y=f(x);if(y<yMax&&y>yMin){const[cx,cy]=toC(x,y);if(px===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx,cy);}}
        const gr=ctx.createLinearGradient(30,0,W-30,0);gr.addColorStop(0,'#a78bfa');gr.addColorStop(1,'#38bdf8');
        ctx.strokeStyle=gr;ctx.lineWidth=2.5;ctx.stroke();
        const minPt=toC(1.354,-3.12);ctx.beginPath();ctx.arc(minPt[0],minPt[1],8,0,Math.PI*2);ctx.fillStyle='#34d399';ctx.fill();
        ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono';ctx.textAlign='left';ctx.fillText('⛰️ f(x) = x⁴ - 4x² + x',30,18);ctx.fillStyle='#34d399';ctx.fillText('● Minimum',W-100,18);
      });
    }
  },
  'decision-tree': {
    filename: 'decision_tree.py',
    concept: '🌳 Decision Trees split data by choosing the feature and threshold that maximizes information gain (reduces entropy/Gini impurity). They\'re interpretable and form the basis of Random Forests.',
    code: `# ================================================
# DECISION TREE — Visualization & Concepts
# ================================================

print("=== DECISION TREE CLASSIFIER ===")
print()
print("Training on Iris-like dataset (simplified)...")
print()
print("Tree Structure:")
print("─" * 38)
print(" [Petal Length <= 2.5?]")
print(" ├── YES → Setosa      (100% pure, 50 samples)")
print(" └── NO  → [Petal Width <= 1.8?]")
print("           ├── YES → Versicolor  (95.8% pure, 48 samples)")
print("           └── NO  → Virginica   (97.7% pure, 46 samples)")
print()
print("Node Metrics:")
print(f"  Root: Gini = 0.667 | Info Gain = 0.334")
print(f"  Left Leaf (Setosa): Gini = 0.000 (Pure!)")
print(f"  Right Inner: Gini = 0.498")
print()
print("=== TEST ACCURACY: 97.3% ===")
print()
print("Feature Importances:")
print("  Petal Length: 0.521 ████████████████▌")
print("  Petal Width:  0.448 ██████████████▎")
print("  Sepal Length: 0.024 ▊")
print("  Sepal Width:  0.007 ▎")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({type:'header',text:'=== DECISION TREE CLASSIFIER ==='});
      lines.push({type:'divider',text:''});
      lines.push({type:'info',text:'Training on Iris-like dataset...'});
      lines.push({type:'divider',text:''});
      ['Tree Structure:','─'.repeat(38),' [Petal Length <= 2.5?]',' ├── YES → Setosa      (100% pure, 50 samples)',' └── NO  → [Petal Width <= 1.8?]','           ├── YES → Versicolor  (95.8%, 48 samples)','           └── NO  → Virginica   (97.7%, 46 samples)'].forEach(t=>lines.push({type:'table',text:t}));
      lines.push({type:'divider',text:''});
      lines.push({type:'result',text:'Root: Gini=0.667 | Info Gain=0.334'});
      lines.push({type:'success',text:'Left Leaf: Gini=0.000 (Pure!)'});
      lines.push({type:'divider',text:''});
      lines.push({type:'header',text:'=== TEST ACCURACY: 97.3% ==='});
      lines.push({type:'divider',text:''});
      lines.push({type:'result',text:'Feature Importances:'});
      lines.push({type:'result',text:'  Petal Length: 0.521 ████████████'});
      lines.push({type:'result',text:'  Petal Width:  0.448 ██████████'});
      output(lines); addXP(50); showToast('🌳 Decision Tree executed! +50 XP','success');

      viz((canvas,ctx)=>{
        const W=canvas.width,H=canvas.height;
        ctx.clearRect(0,0,W,H);ctx.fillStyle='#080c1f';ctx.fillRect(0,0,W,H);
        const drawNode=(x,y,text,color,w=160,h=50)=>{const rx=x-w/2,ry=y-h/2;ctx.fillStyle=color+'22';ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(rx,ry,w,h,8);ctx.fill();ctx.stroke();ctx.fillStyle='white';ctx.font='11px Outfit';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);};
        const drawLine=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1.5;ctx.stroke();};
        const W2=W/2;
        drawLine(W2,60,W2-200,140);drawLine(W2,60,W2+70,140);
        drawLine(W2+70,165,W2-50,230);drawLine(W2+70,165,W2+200,230);
        drawNode(W2,35,'[Petal Length ≤ 2.5?]','#a78bfa',200,50);
        drawNode(W2-200,165,'🌸 Setosa 100%','#34d399',140,50);
        drawNode(W2+70,165,'[Petal Width ≤ 1.8?]','#38bdf8',180,50);
        drawNode(W2-50,255,'🌼 Versicolor 95.8%','#fbbf24',160,50);
        drawNode(W2+200,255,'🌺 Virginica 97.7%','#f472b6',160,50);
        ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('🌳 Decision Tree (Iris)',10,5);
      });
    }
  },
  'naive-bayes': {
    filename: 'naive_bayes.py',
    concept: '🎲 Naive Bayes applies Bayes\' theorem with the "naive" assumption that features are conditionally independent. Despite this simplification, it works remarkably well for text classification.',
    code: `# ================================================
# NAIVE BAYES — Spam Classifier
# ================================================

train_emails = [
    ("win free money prize lottery", "spam"),
    ("click here free offer", "spam"),
    ("make money fast guaranteed", "spam"),
    ("meeting tomorrow project update", "ham"),
    ("please review the attached report", "ham"),
    ("schedule call for next week", "ham"),
    ("free offer win prize now", "spam"),
    ("team lunch tomorrow friday", "ham"),
]

spam = [e for e, l in train_emails if l == "spam"]
ham  = [e for e, l in train_emails if l == "ham"]
p_spam = len(spam) / len(train_emails)
p_ham  = len(ham)  / len(train_emails)

print("=== NAIVE BAYES SPAM CLASSIFIER ===")
print(f"Training emails: {len(train_emails)}")
print(f"P(spam) = {p_spam:.3f}")
print(f"P(ham)  = {p_ham:.3f}")
print()

test_emails = ["free prize lottery winner", "project meeting update tomorrow"]

print("=== PREDICTIONS ===")
for email in test_emails:
    words = email.split()
    spam_score = p_spam
    ham_score  = p_ham
    for word in words:
        sf = sum(1 for e in spam if word in e) / len(spam)
        hf = sum(1 for e in ham  if word in e) / len(ham)
        spam_score *= (sf + 0.01)
        ham_score  *= (hf + 0.01)
    pred = "SPAM" if spam_score > ham_score else "HAM"
    conf = spam_score / (spam_score + ham_score) * 100
    print(f"  '{email}'")
    print(f"  → {pred} (confidence: {conf:.1f}%)")
    print()`,
    run: function (output, viz) {
      const lines = [];
      lines.push({type:'header',text:'=== NAIVE BAYES SPAM CLASSIFIER ==='});
      lines.push({type:'result',text:'Training emails: 8'});
      lines.push({type:'result',text:'P(spam) = 0.500'});
      lines.push({type:'result',text:'P(ham)  = 0.500'});
      lines.push({type:'divider',text:''});
      lines.push({type:'header',text:'=== PREDICTIONS ==='});
      lines.push({type:'result',text:"  'free prize lottery winner'"});
      lines.push({type:'error',text:'  → SPAM (confidence: 91.3%)'});
      lines.push({type:'divider',text:''});
      lines.push({type:'result',text:"  'project meeting update tomorrow'"});
      lines.push({type:'success',text:'  → HAM (confidence: 86.7%)'});
      lines.push({type:'divider',text:''});
      lines.push({type:'success',text:'✅ Naive Bayes classifier complete!'});
      output(lines); addXP(50); showToast('🎲 Naive Bayes executed! +50 XP','success');
    }
  },
  'perceptron': {
    filename: 'perceptron.py',
    concept: '⚡ The Perceptron is the building block of neural networks. It computes a weighted sum of inputs, adds a bias, and applies a step function. It can only classify linearly separable data.',
    code: `# ================================================
# PERCEPTRON — The Building Block of NNs
# ================================================

class Perceptron:
    def __init__(self, n_features, lr=0.1):
        self.weights = [0.0] * n_features
        self.bias = 0
        self.lr = lr
    
    def activate(self, z):
        return 1 if z >= 0 else 0
    
    def predict(self, x):
        z = sum(w*xi for w,xi in zip(self.weights, x)) + self.bias
        return self.activate(z)
    
    def train(self, X, y, epochs=10):
        for epoch in range(epochs):
            errors = 0
            for xi, yi in zip(X, y):
                pred = self.predict(xi)
                error = yi - pred
                if error != 0:
                    errors += 1
                    for j in range(len(self.weights)):
                        self.weights[j] += self.lr * error * xi[j]
                    self.bias += self.lr * error
            
            acc = sum(self.predict(x)==t for x,t in zip(X,y))
            print(f"  Epoch {epoch+1:2d} | Errors: {errors} | Acc: {acc}/{len(X)}")
            
            if errors == 0:
                print("  → Converged! ✅")
                break

# AND gate
X = [[0,0],[0,1],[1,0],[1,1]]
y_and = [0, 0, 0, 1]

print("=== PERCEPTRON — AND Gate ===")
p = Perceptron(n_features=2, lr=0.1)
p.train(X, y_and, epochs=20)

print()
print("=== RESULTS ===")
for x in X:
    pred = p.predict(x)
    print(f"  {x} AND = {pred}")

print()
print(f"Learned weights: {[round(w,2) for w in p.weights]}")
print(f"Learned bias: {p.bias:.2f}")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({type:'header',text:'=== PERCEPTRON — AND Gate ==='});
      [1,2,3,4,5].forEach(ep=>{
        const errs=ep<=2?4-ep+1:0;const acc=ep<=2?ep+2:4;
        lines.push({type:errs===0?'success':'result',text:`  Epoch ${String(ep).padStart(2,' ')} | Errors: ${errs} | Acc: ${acc}/4`});
        if(errs===0)lines.push({type:'success',text:'  → Converged! ✅'});
      });
      lines.push({type:'divider',text:''});
      lines.push({type:'header',text:'=== RESULTS ==='});
      lines.push({type:'success',text:'  [0,0] AND = 0'});
      lines.push({type:'success',text:'  [0,1] AND = 0'});
      lines.push({type:'success',text:'  [1,0] AND = 0'});
      lines.push({type:'success',text:'  [1,1] AND = 1'});
      lines.push({type:'divider',text:''});
      lines.push({type:'result',text:'Learned weights: [0.1, 0.1]'});
      lines.push({type:'result',text:'Learned bias: -0.10'});
      output(lines); addXP(50); showToast('⚡ Perceptron trained! +50 XP','success');
    }
  }
};

// ============================================================
// GLOBAL STATE
// ============================================================
let currentTemplate = 'linear-regression';
let runMode = 'simulated';
let aceEditor = null; // Ace editor instance

// ============================================================
// ACE EDITOR INITIALIZATION
// ============================================================
function initAceEditor() {
  aceEditor = ace.edit('aceEditor');
  aceEditor.setTheme('ace/theme/one_dark');
  aceEditor.session.setMode('ace/mode/python');

  // Editor options for a great coding experience
  aceEditor.setOptions({
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    showPrintMargin: false,
    highlightActiveLine: true,
    highlightGutterLine: true,
    showGutter: true,
    wrap: false,
    tabSize: 4,
    useSoftTabs: true,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    scrollPastEnd: 0.5,
    animatedScroll: true,
    cursorStyle: 'smooth',
    displayIndentGuides: true,
    fadeFoldWidgets: true,
  });

  // Custom cursor/line color via Ace API
  aceEditor.setHighlightActiveLine(true);

  // Update line/col indicator
  aceEditor.selection.on('changeCursor', () => {
    const pos = aceEditor.getCursorPosition();
    const el = document.getElementById('lineCount');
    if (el) el.textContent = `Ln ${pos.row + 1}, Col ${pos.column + 1}`;
  });

  // Ctrl+Enter to run code
  aceEditor.commands.addCommand({
    name: 'runCode',
    bindKey: { win: 'Ctrl-Enter', mac: 'Cmd-Enter' },
    exec: () => runCode()
  });

  // Load default template
  loadTemplate('linear-regression');
}

// ============================================================
// TEMPLATE LOADING
// ============================================================
function loadTemplate(id) {
  currentTemplate = id;
  const tpl = TEMPLATES[id];
  if (!tpl) return;

  document.querySelectorAll('.template-item').forEach(t => t.classList.remove('active'));
  const el = document.getElementById(`tpl-${id}`);
  if (el) el.classList.add('active');

  document.getElementById('pgtFilename').textContent = `📄 ${tpl.filename}`;
  document.getElementById('cpContent').textContent = tpl.concept;

  if (aceEditor) {
    aceEditor.setValue(tpl.code, -1); // -1 = move cursor to start
    aceEditor.clearSelection();
    aceEditor.focus();
  }

  clearOutput();
}

// ============================================================
// FREE CODE MODE
// ============================================================
const FREE_CODE_STARTER = `# ================================================
# Free Python Sandbox — write any code here!
# ================================================

# Example: variables and math
name = "NeuroLearn"
print("Welcome to", name)

# Example: a simple function
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 8):
    print(f"{i}! = {factorial(i)}")

# Example: list comprehension
squares = [x**2 for x in range(10)]
print()
print("Squares:", squares)

# Example: basic ML math (no numpy needed)
data = [2, 4, 4, 4, 5, 5, 7, 9]
mean = sum(data) / len(data)
variance = sum((x - mean)**2 for x in data) / len(data)
std = variance ** 0.5
print(f"\\nData: {data}")
print(f"Mean: {mean:.2f}")
print(f"Std Dev: {std:.2f}")
`;

function loadFreeCode() {
  currentTemplate = 'free';
  document.querySelectorAll('.template-item').forEach(t => t.classList.remove('active'));
  const el = document.getElementById('tpl-free');
  if (el) el.classList.add('active');
  document.getElementById('pgtFilename').textContent = '✏️ free_code.py';
  document.getElementById('cpContent').textContent =
    '✏️ Free Code Mode — Write any Python code and click ⚡ Execute to run it in the browser.\n\n' +
    'Supports: print(), variables, functions, loops, classes, list/dict/set, math, and more!\n\n' +
    'Tip: Press Ctrl+Enter to run quickly.';

  if (aceEditor) {
    aceEditor.setValue(FREE_CODE_STARTER, -1);
    aceEditor.clearSelection();
    aceEditor.focus();
  }
  clearOutput();
  setRunMode('execute');
}

// ============================================================
// OUTPUT HELPERS
// ============================================================
function clearOutput() {
  const out = document.getElementById('outputArea');
  out.innerHTML = `<div class="output-placeholder"><span style="font-size:2rem">▶</span><p>Press <strong>Run Code</strong> or <kbd>Ctrl+Enter</kbd> to execute.</p></div>`;
  document.getElementById('vizArea').style.display = 'none';
  setStatus('ready');
}

function resetCode() {
  if (currentTemplate === 'free') {
    if (aceEditor) {
      aceEditor.setValue(FREE_CODE_STARTER, -1);
      aceEditor.clearSelection();
    }
    clearOutput();
  } else {
    loadTemplate(currentTemplate);
  }
}

function setStatus(state) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const states = { ready: ['', 'Ready'], running: ['running', 'Running...'], success: ['success', 'Done ✓'], error: ['error', 'Error'] };
  dot.className = `status-dot ${states[state][0]}`;
  text.textContent = states[state][1];
}

function renderOutput(lines) {
  const out = document.getElementById('outputArea');
  out.innerHTML = lines.map(({ type, text }) => {
    const cls = { result: 'out-result', success: 'out-success', error: 'out-error', info: 'out-info', header: 'out-header', divider: 'out-divider', table: 'out-table' }[type] || 'out-result';
    const prefix = type === 'divider' ? '' : '>>> ';
    const displayText = type === 'divider' ? '─'.repeat(48) : text;
    return `<div class="output-line"><span class="out-prefix">${prefix}</span><span class="${cls}">${displayText}</span></div>`;
  }).join('');
}

// ============================================================
// RUN MODE TOGGLE
// ============================================================
function setRunMode(mode) {
  runMode = mode;
  document.querySelectorAll('.rmt-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(mode === 'simulated' ? 'btnSimulated' : 'btnExecute').classList.add('active');
  const langEl = document.getElementById('pgtLang');
  if (langEl) langEl.textContent = mode === 'execute' ? '⚡ Execute' : '🎨 Simulated';
  showToast(
    mode === 'execute'
      ? '⚡ Execute mode: your code runs via Python interpreter!'
      : '🎨 Simulated mode: template visualizations with ML metrics',
    'info'
  );
}

// ============================================================
// SKULPT PYTHON EXECUTION
// ============================================================
function runWithSkulpt(code) {
  if (typeof Sk === 'undefined') {
    renderOutput([
      { type: 'error', text: '⚠ Skulpt interpreter not loaded.' },
      { type: 'info',  text: 'Make sure you are connected to the internet.' },
      { type: 'result', text: 'Try switching to 🎨 Simulated mode for ML templates.' },
    ]);
    setStatus('error');
    return;
  }

  const outputLines = [];
  let inputBuffer = '';

  Sk.configure({
    output: (text) => {
      inputBuffer += text;
      const lines = inputBuffer.split('\n');
      inputBuffer = lines.pop();
      lines.forEach(line => {
        outputLines.push({ type: 'result', text: line });
      });
    },
    read: (fname) => {
      if (Sk.builtinFiles?.files[fname] !== undefined)
        return Sk.builtinFiles.files[fname];
      throw `File not found: '${fname}'`;
    },
    execLimit: 30000,
    yieldLimit: 100,
  });

  Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody('<stdin>', false, code, true)
  ).then(() => {
    if (inputBuffer.trim()) outputLines.push({ type: 'result', text: inputBuffer });
    if (outputLines.length === 0)
      outputLines.push({ type: 'info', text: '(Program completed with no output)' });
    outputLines.push({ type: 'divider', text: '' });
    outputLines.push({ type: 'success', text: '✅ Program finished successfully' });
    renderOutput(outputLines);
    setStatus('success');
    addXP(15);
    showToast('⚡ Code executed! +15 XP', 'success');
  }).catch((err) => {
    if (inputBuffer.trim()) outputLines.push({ type: 'result', text: inputBuffer });
    const errStr = err.toString();
    const match = errStr.match(/on line (\d+)/);
    const lineInfo = match ? ` (Line ${match[1]})` : '';
    outputLines.push({ type: 'divider', text: '' });
    outputLines.push({ type: 'error', text: `⚠ ${errStr.replace('Error: ', '')}${lineInfo}` });
    renderOutput(outputLines);
    setStatus('error');
    showToast('❌ Python error — check your code', 'error');
  });
}

// ============================================================
// MAIN RUN DISPATCHER
// ============================================================
function runCode() {
  if (!aceEditor) return;
  const code = aceEditor.getValue().trim();
  if (!code) { showToast('✏️ Write some code first!', 'info'); return; }

  const runBtn = document.getElementById('runBtn');
  runBtn.classList.add('running');
  setStatus('running');
  document.getElementById('outputArea').innerHTML =
    '<div style="color:var(--text-muted);padding:16px 0;font-style:italic;display:flex;align-items:center;gap:8px">'
    + '<span style="animation:spin 1s linear infinite;display:inline-block">⚙</span> '
    + (runMode === 'execute' ? 'Running Python via Skulpt interpreter…' : 'Simulating ML execution…')
    + '</div>';

  if (runMode === 'execute') {
    document.getElementById('vizArea').style.display = 'none';
    setTimeout(() => {
      runWithSkulpt(code);
      runBtn.classList.remove('running');
    }, 100);
  } else {
    const tpl = TEMPLATES[currentTemplate];
    if (!tpl) {
      showToast('💡 Switch to ⚡ Execute mode to run your own code!', 'info');
      renderOutput([{ type: 'info', text: 'No template selected. Switch to ⚡ Execute mode or pick an ML template.' }]);
      setStatus('ready');
      runBtn.classList.remove('running');
      return;
    }
    setTimeout(() => {
      try {
        tpl.run(
          (lines) => renderOutput(lines),
          (drawFn) => {
            const vizArea = document.getElementById('vizArea');
            const canvas = document.getElementById('vizCanvas');
            const ctx = canvas.getContext('2d');
            vizArea.style.display = 'flex';
            vizArea.style.flexDirection = 'column';
            drawFn(canvas, ctx);
          }
        );
        setStatus('success');
      } catch (e) {
        renderOutput([{ type: 'error', text: `RuntimeError: ${e.message}` }]);
        setStatus('error');
      }
      runBtn.classList.remove('running');
    }, 400);
  }
}

// ============================================================
// INITIALIZE ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initAceEditor();
});
