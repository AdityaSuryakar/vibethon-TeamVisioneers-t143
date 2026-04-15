// playground.js — Interactive ML Code Playground

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

      // Visualize
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

        // Data points
        X.forEach((x, i) => {
          const [cx, cy] = toC(x, y[i]);
          ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,0.7)'; ctx.fill();
        });

        // Regression line
        ctx.beginPath();
        const [x1, y1] = toC(X[0], w * X[0] + b);
        const [x2, y2] = toC(X[X.length - 1], w * X[X.length - 1] + b);
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        const lg = ctx.createLinearGradient(x1, 0, x2, 0);
        lg.addColorStop(0, '#a78bfa'); lg.addColorStop(1, '#f472b6');
        ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.stroke();

        // Labels
        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillText('📈 Linear Regression Fit', pad, 20);
        ctx.fillStyle = '#38bdf8'; ctx.font = '10px JetBrains Mono';
        ctx.fillText('● Data points', W - 120, 20);
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('— Fitted line', W - 120, 34);
      });
    }
  },
  'knn': {
    filename: 'k_nearest_neighbors.py',
    concept: '🔵 K-Nearest Neighbors (KNN) classifies a new point by majority vote of its K closest training samples. It\'s a non-parametric, lazy learner — it memorizes the training data and makes decisions at prediction time.',
    code: `# ================================================
# K-NEAREST NEIGHBORS — from scratch
# ================================================
import numpy as np

def euclidean_distance(a, b):
    """Compute Euclidean distance between two points"""
    return np.sqrt(np.sum((a - b) ** 2))

def knn_predict(X_train, y_train, x_query, k=3):
    """Classify using K nearest neighbors"""
    distances = [(euclidean_distance(x_query, x), y) 
                 for x, y in zip(X_train, y_train)]
    distances.sort(key=lambda d: d[0])
    k_nearest = [label for _, label in distances[:k]]
    
    # Majority vote
    return max(set(k_nearest), key=k_nearest.count)

# --- Dataset: 2D classification (3 classes) ---
np.random.seed(42)
classes = ['Setosa', 'Versicolor', 'Virginica']
X_train = np.array([
    [1.4, 0.2], [1.5, 0.1], [1.3, 0.3],  # Setosa
    [4.5, 1.5], [4.7, 1.4], [4.9, 1.5],  # Versicolor
    [5.9, 2.1], [6.1, 2.3], [5.8, 1.8],  # Virginica
])
y_train = ['Setosa'] * 3 + ['Versicolor'] * 3 + ['Virginica'] * 3

print("=== K-NEAREST NEIGHBORS ===")
print(f"Training samples: {len(X_train)}")
print(f"Features: [Petal Length, Petal Width]")
print(f"Classes: {', '.join(classes)}")
print()

# --- Test predictions ---
test_points = [
    np.array([1.5, 0.25]),   # Should be Setosa
    np.array([4.8, 1.45]),   # Should be Versicolor
    np.array([6.0, 2.0]),    # Should be Virginica
    np.array([3.5, 1.2]),    # Ambiguous
]
test_labels = ['Setosa', 'Versicolor', 'Virginica', 'Unknown']

print("=== PREDICTIONS (K=3) ===")
correct = 0
for point, true_label in zip(test_points, test_labels):
    pred = knn_predict(X_train, y_train, point, k=3)
    match = "✓" if pred == true_label else "~"
    if pred == true_label:
        correct += 1
    print(f"  {match} Point {point} → {pred} (True: {true_label})")

print()
accuracy = correct / (len(test_points) - 1)  # exclude ambiguous
print(f"Accuracy (excl ambiguous): {accuracy*100:.0f}%")`,
    run: function (output, viz) {
      const lines = [];
      const classes = ['Setosa', 'Versicolor', 'Virginica'];
      const centroids = [[1.5, 0.2], [4.7, 1.47], [5.93, 2.07]];
      const colors = ['#34d399', '#a78bfa', '#f472b6'];

      lines.push({ type: 'header', text: '=== K-NEAREST NEIGHBORS ===' });
      lines.push({ type: 'result', text: `Training samples: 9` });
      lines.push({ type: 'result', text: `Features: [Petal Length, Petal Width]` });
      lines.push({ type: 'result', text: `Classes: ${classes.join(', ')}` });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'header', text: '=== PREDICTIONS (K=3) ===' });

      const preds = [['Setosa', 'Setosa'], ['Versicolor', 'Versicolor'], ['Virginica', 'Virginica'], ['Versicolor', 'Unknown']];
      let correct = 0;
      preds.forEach(([pred, truth]) => {
        const match = pred === truth ? '✓' : (truth === 'Unknown' ? '~' : '✗');
        if (pred === truth) correct++;
        lines.push({ type: pred === truth ? 'success' : 'result', text: `  ${match} Predicted: ${pred} → True: ${truth}` });
      });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: `Accuracy: ${Math.round(correct / 3 * 100)}%` });

      output(lines);
      addXP(50);
      showToast('🔵 KNN executed! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);

        const trainData = [
          [[1.4, 0.2], [1.5, 0.1], [1.3, 0.3], '#34d399'],
          [[4.5, 1.5], [4.7, 1.4], [4.9, 1.5], '#a78bfa'],
          [[5.9, 2.1], [6.1, 2.3], [5.8, 1.8], '#f472b6'],
        ];
        const xMin = 1, xMax = 7, yMin = 0, yMax = 2.5;
        const toC = (px, py) => [40 + (px - xMin) / (xMax - xMin) * (W - 60), H - 30 - (py - yMin) / (yMax - yMin) * (H - 50)];

        // Draw training points
        trainData.forEach(([pts, color]) => {
          pts.forEach(([px, py]) => {
            const [cx, cy] = toC(px, py);
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
            glow.addColorStop(0, color + '88'); glow.addColorStop(1, color + '00');
            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fillStyle = color + 'cc'; ctx.fill();
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
          });
        });

        // Test point
        const [tx, ty] = toC(4.8, 1.45);
        ctx.beginPath(); ctx.arc(tx, ty, 12, 0, Math.PI * 2); ctx.fillStyle = 'rgba(251,191,36,0.3)'; ctx.fill();
        ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
        ctx.fillStyle = 'white'; ctx.font = '10px Outfit'; ctx.textAlign = 'center';
        ctx.fillText('?', tx, ty + 4);

        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillText('🔵 KNN Classification (Iris Dataset)', 40, 18);
        trainData.forEach(([, color], i) => {
          ctx.fillStyle = color; ctx.fillText(`● ${classes[i]}`, W - 130, 18 + i * 14);
        });
        ctx.fillStyle = '#fbbf24'; ctx.fillText('? Query', W - 130, 60);
      });
    }
  },
  'kmeans': {
    filename: 'kmeans_clustering.py',
    concept: '🎯 K-Means groups data into K clusters by iteratively assigning each point to the nearest centroid and recomputing centroids as cluster means. It minimizes within-cluster sum of squares (WCSS).',
    code: `# ================================================
# K-MEANS CLUSTERING — from scratch
# ================================================
import numpy as np

def initialize_centroids(X, k):
    """Random initialization of centroids"""
    indices = np.random.choice(len(X), k, replace=False)
    return X[indices].copy()

def assign_clusters(X, centroids):
    """Assign each point to nearest centroid"""
    distances = np.array([[np.linalg.norm(x - c) 
                           for c in centroids] for x in X])
    return np.argmin(distances, axis=1)

def update_centroids(X, labels, k):
    """Recompute centroids as cluster means"""
    return np.array([X[labels == i].mean(axis=0) 
                     for i in range(k)])

def kmeans(X, k=3, max_iters=100):
    np.random.seed(42)
    centroids = initialize_centroids(X, k)
    
    for iteration in range(max_iters):
        labels = assign_clusters(X, centroids)
        new_centroids = update_centroids(X, labels, k)
        
        # Check convergence
        if np.allclose(centroids, new_centroids, atol=1e-6):
            print(f"  Converged at iteration {iteration + 1}!")
            break
        
        centroids = new_centroids
        wcss = sum(np.linalg.norm(X[labels==i] - c)**2 
                   for i, c in enumerate(centroids) 
                   if len(X[labels==i]) > 0)
        if iteration % 5 == 0:
            print(f"  Iter {iteration:3d} | WCSS: {wcss:.2f}")
    
    return labels, centroids

# --- Generate clustered dataset ---
np.random.seed(42)
X = np.vstack([
    np.random.randn(40, 2) * 0.7 + [2, 2],
    np.random.randn(40, 2) * 0.7 + [-2, 2],
    np.random.randn(40, 2) * 0.7 + [0, -2]
])

print("=== K-MEANS CLUSTERING ===")
print(f"Dataset: {len(X)} points, 2 features, K=3")
print()
print("Running K-Means...")
labels, centroids = kmeans(X, k=3)

# --- Results ---
print()
print("=== CLUSTER RESULTS ===")
for k in range(3):
    size = np.sum(labels == k)
    print(f"  Cluster {k+1}: {size} points, centroid={centroids[k].round(2)}")

print()
print("✅ Clustering complete!")`,
    run: function (output, viz) {
      const lines = [];
      const pts = [];
      const centers = [[2, 2], [-2, 2], [0, -2]];
      const colors = ['#a78bfa', '#38bdf8', '#f472b6'];
      centers.forEach((c, ci) => {
        for (let i = 0; i < 40; i++) pts.push({ x: c[0] + (Math.random() - 0.5) * 1.4, y: c[1] + (Math.random() - 0.5) * 1.4, cls: ci });
      });

      lines.push({ type: 'header', text: '=== K-MEANS CLUSTERING ===' });
      lines.push({ type: 'result', text: 'Dataset: 120 points, 2 features, K=3' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'info', text: 'Running K-Means...' });
      [0, 5, 10, 15].forEach(it => lines.push({ type: 'result', text: `  Iter ${String(it).padStart(3, ' ')} | WCSS: ${(120 - it * 5 + Math.random() * 5).toFixed(2)}` }));
      lines.push({ type: 'success', text: '  Converged at iteration 18!' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'header', text: '=== CLUSTER RESULTS ===' });
      lines.push({ type: 'result', text: `  Cluster 1: 40 points, centroid=[2.03, 1.97]` });
      lines.push({ type: 'result', text: `  Cluster 2: 40 points, centroid=[-1.98, 2.01]` });
      lines.push({ type: 'result', text: `  Cluster 3: 40 points, centroid=[0.02, -2.05]` });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: '✅ Clustering complete!' });
      output(lines);
      addXP(50);
      showToast('🎯 K-Means executed! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);
        const toC = (x, y) => [(x + 4) / (8) * (W - 60) + 30, H / 2 - y / (8) * (H - 40)];
        pts.forEach(p => {
          const [cx, cy] = toC(p.x, p.y);
          ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fillStyle = colors[p.cls] + '99'; ctx.fill();
          ctx.strokeStyle = colors[p.cls]; ctx.lineWidth = 1; ctx.stroke();
        });
        centers.forEach(([x, y], i) => {
          const [cx, cy] = toC(x, y);
          ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fillStyle = colors[i]; ctx.fill();
          ctx.fillStyle = 'white'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('✦', cx, cy);
        });
        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('🎯 K-Means Clustering Result (K=3)', 10, 8);
      });
    }
  },
  'neural-net': {
    filename: 'neural_network.py',
    concept: '🧠 A Neural Network is a stack of layers where each neuron computes a weighted sum of inputs, applies an activation function, and passes the result forward. Learning happens via backpropagation + gradient descent.',
    code: `# ================================================
# NEURAL NETWORK — from scratch (XOR problem)
# ================================================
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_deriv(x):
    s = sigmoid(x)
    return s * (1 - s)

class NeuralNetwork:
    def __init__(self, layers):
        """layers: list of layer sizes, e.g. [2, 4, 1]"""
        self.weights = [np.random.randn(layers[i], layers[i+1]) * 0.5
                        for i in range(len(layers)-1)]
        self.biases  = [np.zeros((1, layers[i+1]))
                        for i in range(len(layers)-1)]
    
    def forward(self, X):
        self.activations = [X]
        self.z_values = []
        current = X
        for w, b in zip(self.weights, self.biases):
            z = current @ w + b
            self.z_values.append(z)
            current = sigmoid(z)
            self.activations.append(current)
        return current
    
    def train(self, X, y, lr=0.5, epochs=5000):
        losses = []
        for epoch in range(epochs):
            output = self.forward(X)
            error = y - output
            loss = np.mean(error ** 2)
            losses.append(loss)
            
            # Backprop
            delta = error * sigmoid_deriv(self.z_values[-1])
            for i in reversed(range(len(self.weights))):
                self.weights[i] += self.activations[i].T @ delta * lr
                self.biases[i]  += delta.mean(axis=0, keepdims=True) * lr
                if i > 0:
                    delta = (delta @ self.weights[i].T) * \\
                            sigmoid_deriv(self.z_values[i-1])
            
            if epoch % 1000 == 0:
                print(f"  Epoch {epoch:5d} | Loss: {loss:.6f}")

# --- XOR Problem ---
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)

print("=== NEURAL NETWORK — XOR Problem ===")
print("Architecture: 2 → 4 → 1")
print("Training for 5000 epochs...")
print()

nn = NeuralNetwork([2, 4, 1])
nn.train(X, y, lr=0.5, epochs=5000)

print()
print("=== PREDICTIONS ===")
preds = nn.forward(X)
for i, (inp, pred, true) in enumerate(zip(X, preds, y)):
    correct = "✓" if abs(pred[0] - true[0]) < 0.1 else "✗"
    print(f"  {correct} {inp} → {pred[0]:.4f} (Expected: {true[0]})")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({ type: 'header', text: '=== NEURAL NETWORK — XOR Problem ===' });
      lines.push({ type: 'result', text: 'Architecture: 2 → 4 → 1' });
      lines.push({ type: 'result', text: 'Training for 5000 epochs...' });
      lines.push({ type: 'divider', text: '' });
      const losses = [0.2503, 0.1832, 0.0934, 0.0412, 0.0187, 0.0067];
      [0, 1000, 2000, 3000, 4000, 5000].forEach((ep, i) => {
        if (i < 6) lines.push({ type: 'result', text: `  Epoch ${String(ep).padStart(5, ' ')} | Loss: ${losses[i].toFixed(6)}` });
      });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'header', text: '=== PREDICTIONS ===' });
      lines.push({ type: 'success', text: '  ✓ [0,0] → 0.0312 (Expected: 0)' });
      lines.push({ type: 'success', text: '  ✓ [0,1] → 0.9681 (Expected: 1)' });
      lines.push({ type: 'success', text: '  ✓ [1,0] → 0.9673 (Expected: 1)' });
      lines.push({ type: 'success', text: '  ✓ [1,1] → 0.0287 (Expected: 0)' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: '✅ XOR solved! Neural network converged.' });
      output(lines);
      addXP(75);
      showToast('🧠 Neural Network trained! +75 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);
        const losses = [0.2503, 0.22, 0.18, 0.14, 0.10, 0.07, 0.05, 0.037, 0.025, 0.018, 0.010, 0.006, 0.005];
        const pts = losses.length;
        const maxL = 0.26;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) { const y = 30 + (H - 60) / 5 * i; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 20, y); ctx.stroke(); }

        ctx.beginPath();
        losses.forEach((l, i) => {
          const cx = 40 + (W - 60) / (pts - 1) * i, cy = 30 + (H - 60) * (1 - l / maxL);
          if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        });
        const gr = ctx.createLinearGradient(40, 0, W - 20, 0);
        gr.addColorStop(0, '#f472b6'); gr.addColorStop(1, '#a78bfa');
        ctx.strokeStyle = gr; ctx.lineWidth = 2.5; ctx.stroke();

        losses.forEach((l, i) => {
          const cx = 40 + (W - 60) / (pts - 1) * i, cy = 30 + (H - 60) * (1 - l / maxL);
          ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = '#a78bfa'; ctx.fill();
        });

        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillText('🧠 Training Loss Curve', 40, 18);
        ctx.fillStyle = '#475569'; ctx.font = '10px JetBrains Mono';
        ctx.fillText('Loss', 10, H / 2);
        ctx.fillText('Epoch →', W / 2, H - 5);
      });
    }
  },
  'gradient-descent': {
    filename: 'gradient_descent.py',
    concept: '⛰️ Gradient Descent iteratively moves in the direction of steepest descent (negative gradient) to minimize a loss function. Learning rate controls step size — too large = oscillation, too small = slow convergence.',
    code: `# ================================================
# GRADIENT DESCENT VARIANTS
# ================================================
import numpy as np

# Loss function: f(x) = x^4 - 4x^2 + x
def f(x):   return x**4 - 4*x**2 + x
def df(x):  return 4*x**3 - 8*x + 1  # Derivative

def gradient_descent(x_init, lr=0.01, n_iters=100, method='vanilla'):
    x = x_init
    history = [x]
    velocity = 0  # For momentum
    
    for i in range(n_iters):
        grad = df(x)
        
        if method == 'vanilla':
            x = x - lr * grad
        elif method == 'momentum':
            velocity = 0.9 * velocity - lr * grad
            x = x + velocity
        elif method == 'adagrad':
            if not hasattr(gradient_descent, 'G'):
                gradient_descent.G = 0
            gradient_descent.G += grad**2
            x = x - (lr / (np.sqrt(gradient_descent.G) + 1e-8)) * grad
        
        history.append(x)
    return x, history

print("=== GRADIENT DESCENT COMPARISON ===")
x_init = 2.0
print(f"Starting point: x = {x_init}")
print(f"True minima near: x ≈ -1.38 and x ≈ 1.35")
print()

for method, lr in [('vanilla', 0.01), ('momentum', 0.01)]:
    if hasattr(gradient_descent, 'G'):
        del gradient_descent.G
    x_final, history = gradient_descent(x_init, lr=lr, method=method)
    print(f"Method: {method.upper():10s} | x_final: {x_final:.6f} | f(x): {f(x_final):.6f}")
    print(f"  Iterations to converge: ~{len(history)}")
print()
print("✅ Gradient descent demo complete!")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({ type: 'header', text: '=== GRADIENT DESCENT COMPARISON ===' });
      lines.push({ type: 'result', text: 'Starting point: x = 2.0' });
      lines.push({ type: 'result', text: 'True minima near: x ≈ -1.38 and x ≈ 1.35' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'result', text: 'Method: VANILLA    | x_final: 1.354821 | f(x): -3.122441' });
      lines.push({ type: 'result', text: '  Iterations to converge: ~100' });
      lines.push({ type: 'result', text: 'Method: MOMENTUM   | x_final: 1.354819 | f(x): -3.122441' });
      lines.push({ type: 'result', text: '  Iterations to converge: ~45' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'success', text: '✅ Gradient descent demo complete!' });
      output(lines); addXP(50); showToast('⛰️ Gradient Descent executed! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);
        const f = x => x ** 4 - 4 * x ** 2 + x;
        const xMin = -2.5, xMax = 2.5;
        const yMin = -5, yMax = 5;
        const toC = (x, y) => [(x - xMin) / (xMax - xMin) * (W - 60) + 30, H - 30 - (y - yMin) / (yMax - yMin) * (H - 50)];
        ctx.beginPath();
        for (let px = 0; px <= W; px++) {
          const x = xMin + (px / W) * (xMax - xMin), y = f(x);
          if (y < yMax && y > yMin) { const [cx, cy] = toC(x, y); if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy); }
        }
        const gr = ctx.createLinearGradient(30, 0, W - 30, 0);
        gr.addColorStop(0, '#a78bfa'); gr.addColorStop(1, '#38bdf8');
        ctx.strokeStyle = gr; ctx.lineWidth = 2.5; ctx.stroke();
        const minPt = toC(1.354, -3.12);
        ctx.beginPath(); ctx.arc(minPt[0], minPt[1], 8, 0, Math.PI * 2); ctx.fillStyle = '#34d399'; ctx.fill();
        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left';
        ctx.fillText('⛰️ Loss Function f(x) = x⁴ - 4x² + x', 30, 18);
        ctx.fillStyle = '#34d399'; ctx.fillText('● Minimum', W - 100, 18);
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
print("────────────────────────────────")
print(" [Petal Length <= 2.5?]")
print(" ├── YES → Setosa      (100% pure, 50 samples)")
print(" └── NO  → [Petal Width <= 1.8?]")
print("           ├── YES → Versicolor  (95.8% pure, 48 samples)")
print("           └── NO  → Virginica   (97.7% pure, 46 samples)")
print()
print("────────────────────────────────")
print("Node Metrics:")
print()
print("  Root Node:")
print("    Samples: 150  |  Classes: [50, 50, 50]")
print("    Gini Impurity: 0.667  |  Info Gain: 0.334")
print()
print("  Left Leaf (Setosa):")
print("    Samples: 50   |  Gini: 0.000 (Pure!)")
print()
print("  Right → Inner Node:")
print("    Samples: 100  |  Gini: 0.498")
print("    Best split: Petal Width <= 1.8")
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
      lines.push({ type: 'header', text: '=== DECISION TREE CLASSIFIER ===' });
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'info', text: 'Training on Iris-like dataset...' });
      lines.push({ type: 'divider', text: '' });
      ['Tree Structure:', '─'.repeat(38), ' [Petal Length <= 2.5?]', ' ├── YES → Setosa      (100% pure, 50 samples)', ' └── NO  → [Petal Width <= 1.8?]', '           ├── YES → Versicolor  (95.8%, 48 samples)', '           └── NO  → Virginica   (97.7%, 46 samples)'].forEach(t => lines.push({ type: 'table', text: t }));
      lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'result', text: 'Root: Gini=0.667 | Info Gain=0.334' });
      lines.push({ type: 'success', text: 'Left Leaf: Gini=0.000 (Pure!)' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'header', text: '=== TEST ACCURACY: 97.3% ===' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'result', text: 'Feature Importances:' });
      lines.push({ type: 'result', text: '  Petal Length: 0.521 ████████████' }); lines.push({ type: 'result', text: '  Petal Width:  0.448 ██████████' });
      output(lines); addXP(50); showToast('🌳 Decision Tree visualized! +50 XP', 'success');

      viz((canvas, ctx) => {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080c1f'; ctx.fillRect(0, 0, W, H);
        const drawNode = (x, y, text, color, w = 160, h = 50) => {
          const rx = x - w / 2, ry = y - h / 2;
          ctx.fillStyle = color + '22'; ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(rx, ry, w, h, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'white'; ctx.font = '11px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(text, x, y);
        };
        const drawLine = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5; ctx.stroke(); };
        const W2 = W / 2;
        drawLine(W2, 60, W2 - 200, 140); drawLine(W2, 60, W2 + 70, 140);
        drawLine(W2 + 70, 165, W2 - 50, 230); drawLine(W2 + 70, 165, W2 + 200, 230);
        drawNode(W2, 35, '[Petal Length ≤ 2.5?]', '#a78bfa', 200, 50);
        drawNode(W2 - 200, 165, '🌸 Setosa 100%', '#34d399', 140, 50);
        drawNode(W2 + 70, 165, '[Petal Width ≤ 1.8?]', '#38bdf8', 180, 50);
        drawNode(W2 - 50, 255, '🌼 Versicolor 95.8%', '#fbbf24', 160, 50);
        drawNode(W2 + 200, 255, '🌺 Virginica 97.7%', '#f472b6', 160, 50);
        ctx.fillStyle = '#6b7280'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('🌳 Decision Tree Structure (Iris Dataset)', 10, 5);
      });
    }
  },
  'naive-bayes': {
    filename: 'naive_bayes.py',
    concept: '🎲 Naive Bayes applies Bayes\' theorem with the "naive" assumption that features are conditionally independent. Despite this simplification, it works remarkably well for text classification (spam detection, sentiment analysis).',
    code: `# ================================================
# NAIVE BAYES — Spam Classifier
# ================================================
import numpy as np

# Training data: [word counts], label
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

# Build vocabulary
vocab = set(w for email, _ in train_emails for w in email.split())
vocab = sorted(vocab)

print("=== NAIVE BAYES SPAM CLASSIFIER ===")
print(f"Training emails: {len(train_emails)}")
print(f"Vocabulary size: {len(vocab)}")
print()

# Count spam/ham
spam = [e for e, l in train_emails if l == "spam"]
ham  = [e for e, l in train_emails if l == "ham"]

p_spam = len(spam) / len(train_emails)
p_ham  = len(ham)  / len(train_emails)

print(f"P(spam) = {p_spam:.3f}")
print(f"P(ham)  = {p_ham:.3f}")
print()

# Test
test_emails = [
    "free prize lottery winner",
    "project meeting update tomorrow",
]

print("=== PREDICTIONS ===")
for email in test_emails:
    words = email.split()
    spam_score = p_spam
    ham_score  = p_ham
    for word in words:
        spam_freq = sum(1 for e in spam if word in e) / len(spam)
        ham_freq  = sum(1 for e in ham  if word in e) / len(ham)
        spam_score *= (spam_freq + 0.01)
        ham_score  *= (ham_freq  + 0.01)
    
    pred = "SPAM 🚫" if spam_score > ham_score else "HAM ✉️"
    conf = spam_score / (spam_score + ham_score) * 100
    print(f"  Email: '{email}'")
    print(f"  → Prediction: {pred} (confidence: {conf:.1f}%)")
    print()`,
    run: function (output, viz) {
      const lines = [];
      lines.push({ type: 'header', text: '=== NAIVE BAYES SPAM CLASSIFIER ===' });
      lines.push({ type: 'result', text: 'Training emails: 8 | Vocabulary: 24 words' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'result', text: 'P(spam) = 0.500' }); lines.push({ type: 'result', text: 'P(ham)  = 0.500' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'header', text: '=== PREDICTIONS ===' });
      lines.push({ type: 'result', text: "  Email: 'free prize lottery winner'" }); lines.push({ type: 'error', text: '  → Prediction: SPAM 🚫 (confidence: 91.3%)' }); lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'result', text: "  Email: 'project meeting update tomorrow'" }); lines.push({ type: 'success', text: '  → Prediction: HAM ✉️ (confidence: 86.7%)' }); lines.push({ type: 'divider', text: '' });
      lines.push({ type: 'success', text: '✅ Naive Bayes classifier complete!' });
      output(lines); addXP(50); showToast('🎲 Naive Bayes executed! +50 XP', 'success');
    }
  },
  'perceptron': {
    filename: 'perceptron.py',
    concept: '⚡ The Perceptron is the building block of neural networks. It computes a weighted sum of inputs, adds a bias, and applies a step function. It can only classify linearly separable data.',
    code: `# ================================================
# PERCEPTRON — The Building Block of NNs
# ================================================
import numpy as np

class Perceptron:
    def __init__(self, n_features, lr=0.1):
        self.weights = np.zeros(n_features)
        self.bias = 0
        self.lr = lr
    
    def activate(self, z):
        """Step function: output 1 if z >= 0, else 0"""
        return 1 if z >= 0 else 0
    
    def predict(self, x):
        z = np.dot(self.weights, x) + self.bias
        return self.activate(z)
    
    def train(self, X, y, epochs=10):
        for epoch in range(epochs):
            errors = 0
            for xi, yi in zip(X, y):
                pred = self.predict(xi)
                error = yi - pred
                if error != 0:
                    errors += 1
                    self.weights += self.lr * error * xi
                    self.bias += self.lr * error
            
            acc = sum(self.predict(x)==t for x,t in zip(X,y))
            print(f"  Epoch {epoch+1:2d} | Errors: {errors} | Acc: {acc}/{len(X)}")
            
            if errors == 0:
                print("  → Converged! ✅")
                break

# AND gate
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y_and = np.array([0, 0, 0, 1])  # AND

print("=== PERCEPTRON — AND Gate ===")
p = Perceptron(n_features=2, lr=0.1)
p.train(X, y_and, epochs=20)

print()
print("=== RESULTS ===")
gate_map = {(0,0):0, (0,1):0, (1,0):0, (1,1):1}
for x in X:
    pred = p.predict(x)
    key = tuple(map(int, x))
    correct = "✓" if pred == gate_map[key] else "✗"
    print(f"  {correct} {x.astype(int)} AND = {pred}")

print()
print(f"Learned weights: {p.weights.round(2)}")
print(f"Learned bias:    {p.bias:.2f}")`,
    run: function (output, viz) {
      const lines = [];
      lines.push({ type: 'header', text: '=== PERCEPTRON — AND Gate ===' });
      [1, 2, 3, 4, 5].forEach(ep => {
        const errs = ep <= 2 ? 4 - ep + 1 : 0;
        const acc = ep <= 2 ? ep + 2 : 4;
        lines.push({ type: errs === 0 ? 'success' : 'result', text: `  Epoch ${String(ep).padStart(2, ' ')} | Errors: ${errs} | Acc: ${acc}/4` });
        if (errs === 0) lines.push({ type: 'success', text: '  → Converged! ✅' });
      });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'header', text: '=== RESULTS ===' });
      lines.push({ type: 'success', text: '  ✓ [0 0] AND = 0' }); lines.push({ type: 'success', text: '  ✓ [0 1] AND = 0' });
      lines.push({ type: 'success', text: '  ✓ [1 0] AND = 0' }); lines.push({ type: 'success', text: '  ✓ [1 1] AND = 1' });
      lines.push({ type: 'divider', text: '' }); lines.push({ type: 'result', text: 'Learned weights: [0.1, 0.1]' }); lines.push({ type: 'result', text: 'Learned bias:    -0.10' });
      output(lines); addXP(50); showToast('⚡ Perceptron trained! +50 XP', 'success');
    }
  }
};

let currentTemplate = 'linear-regression';
let runMode = 'simulated'; // 'simulated' | 'execute'

function loadTemplate(id) {
  currentTemplate = id;
  const tpl = TEMPLATES[id];
  if (!tpl) return;

  document.querySelectorAll('.template-item').forEach(t => t.classList.remove('active'));
  const el = document.getElementById(`tpl-${id}`);
  if (el) el.classList.add('active');

  document.getElementById('pgtFilename').textContent = `📄 ${tpl.filename}`;
  document.getElementById('codeEditor').value = tpl.code;
  document.getElementById('cpContent').textContent = tpl.concept;
  updateLineNumbers();
  clearOutput();
}

function updateLineNumbers() {
  const editor = document.getElementById('codeEditor');
  const lines = editor.value.split('\n').length;
  document.getElementById('lineCount').textContent = `Lines: ${lines}`;
  document.getElementById('lineNumbers').textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
}

function clearOutput() {
  const out = document.getElementById('outputArea');
  out.innerHTML = `<div class="output-placeholder"><span style="font-size:2rem">▶</span><p>Press <strong>Run Code</strong> to execute.</p></div>`;
  document.getElementById('vizArea').style.display = 'none';
  setStatus('ready');
}

function resetCode() {
  if (currentTemplate === 'free') {
    document.getElementById('codeEditor').value = FREE_CODE_STARTER;
    updateLineNumbers();
    clearOutput();
  } else {
    loadTemplate(currentTemplate);
  }
}

function setStatus(state) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const states = { ready: ['', 'Ready'], running: ['running', 'Running...'], success: ['success', 'Done'], error: ['error', 'Error'] };
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
  if (langEl) langEl.textContent = mode === 'execute' ? '⚡ Execute Mode (Skulpt Python)' : '🎨 Simulated Mode';
  showToast(
    mode === 'execute'
      ? '⚡ Execute mode: your code runs in a real Python interpreter!'
      : '🎨 Simulated mode: template visualizations with ML metrics',
    'info'
  );
}

// ============================================================
// FREE CODE MODE (blank sandbox in Execute mode)
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
print("\nSquares:", squares)

# Example: basic ML math (no numpy needed)
data = [2, 4, 4, 4, 5, 5, 7, 9]
mean = sum(data) / len(data)
variance = sum((x - mean)**2 for x in data) / len(data)
std = variance ** 0.5
print(f"\nData: {data}")
print(f"Mean: {mean:.2f}")
print(f"Std Dev: {std:.2f}")
`;

function loadFreeCode() {
  currentTemplate = 'free';
  document.querySelectorAll('.template-item').forEach(t => t.classList.remove('active'));
  const el = document.getElementById('tpl-free');
  if (el) el.classList.add('active');
  document.getElementById('pgtFilename').textContent = '✏️ free_code.py';
  document.getElementById('codeEditor').value = FREE_CODE_STARTER;
  document.getElementById('cpContent').textContent =
    '✏️ Free Code Mode — Write any Python code and click ⚡ Execute to run it in the browser via the Skulpt interpreter.\n\n' +
    'Supports: print(), variables, functions, loops, classes, recursion, list/dict/set, math, string formatting, and more!\n\n' +
    'Limitations: No numpy, no file I/O — but great for learning Python basics and simple ML math from scratch!';
  updateLineNumbers();
  clearOutput();
  // Auto-switch to execute mode for free code
  setRunMode('execute');
}

// ============================================================
// SKULPT PYTHON EXECUTION ENGINE
// ============================================================
function runWithSkulpt(code) {
  if (typeof Sk === 'undefined') {
    renderOutput([
      { type: 'error', text: '⚠ Skulpt interpreter not loaded.' },
      { type: 'info',  text: 'Make sure you are connected to the internet (Skulpt loads from CDN).' },
      { type: 'result',text: 'Alternatively, switch to 🎨 Simulated mode to use the ML templates.' },
    ]);
    setStatus('error');
    return;
  }

  const outputLines = [];
  let inputBuffer = '';

  Sk.configure({
    output: (text) => {
      // Capture each line of stdout
      inputBuffer += text;
      const lines = inputBuffer.split('\n');
      inputBuffer = lines.pop(); // keep partial line
      lines.forEach(line => {
        outputLines.push({ type: 'result', text: line });
      });
    },
    read: (fname) => {
      if (Sk.builtinFiles?.files[fname] !== undefined)
        return Sk.builtinFiles.files[fname];
      throw `File not found: '${fname}'`;
    },
    execLimit: 30000,   // 30 second execution limit
    yieldLimit: 100,
  });

  Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody('<stdin>', false, code, true)
  ).then(() => {
    // Flush remaining partial line
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
    // Parse Skulpt error nicely
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
  const code = document.getElementById('codeEditor').value.trim();
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
    // Real Python execution via Skulpt
    document.getElementById('vizArea').style.display = 'none';
    // Small delay for UI to update
    setTimeout(() => {
      runWithSkulpt(code);
      runBtn.classList.remove('running');
    }, 100);
  } else {
    // Simulated mode — run the template's JS function with vizualizations
    const tpl = TEMPLATES[currentTemplate];
    if (!tpl) {
      showToast('💡 Switch to ⚡ Execute mode to run free code!', 'info');
      renderOutput([{ type: 'info', text: 'No template selected. Switch to ⚡ Execute mode or pick an ML template from the sidebar.' }]);
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

// Editor line numbers sync
const editor = document.getElementById('codeEditor');
if (editor) {
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    document.getElementById('lineNumbers').scrollTop = editor.scrollTop;
  });
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = start + 4;
      updateLineNumbers();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      runCode();
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadTemplate('linear-regression');
});
