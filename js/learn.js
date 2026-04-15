// learn.js — Learning page interactivity

const lessons = {
  // Foundations
  'what-is-ai': { title: 'What is Artificial Intelligence?', category: 'Foundations', tag: '🌱', time: '8 min', xp: 50 },
  'ml-types': { title: 'Types of Machine Learning', category: 'Foundations', tag: '🌱', time: '10 min', xp: 50 },
  'math-for-ml': { title: 'Math for ML: Linear Algebra', category: 'Foundations', tag: '🌱', time: '15 min', xp: 75 },
  'stats-probability': { title: 'Statistics & Probability', category: 'Foundations', tag: '🌱', time: '12 min', xp: 75 },
  'python-ai': { title: 'Python for AI Basics', category: 'Foundations', tag: '🌱', time: '20 min', xp: 100 },
  // Machine Learning
  'supervised-learning': { title: 'Supervised Learning', category: 'Machine Learning', tag: '⚙️', time: '15 min', xp: 100 },
  'unsupervised': { title: 'Unsupervised Learning', category: 'Machine Learning', tag: '⚙️', time: '12 min', xp: 100 },
  'decision-trees': { title: 'Decision Trees & Random Forests', category: 'Machine Learning', tag: '⚙️', time: '18 min', xp: 125 },
  'svm': { title: 'Support Vector Machines', category: 'Machine Learning', tag: '⚙️', time: '14 min', xp: 125 },
  'clustering': { title: 'Clustering Algorithms', category: 'Machine Learning', tag: '⚙️', time: '13 min', xp: 100 },
  'model-evaluation': { title: 'Model Evaluation & Tuning', category: 'Machine Learning', tag: '⚙️', time: '16 min', xp: 125 },
  // Deep Learning
  'neural-networks': { title: 'Neural Networks Fundamentals', category: 'Deep Learning', tag: '🧠', time: '20 min', xp: 150 },
  'cnn': { title: 'Convolutional Neural Networks', category: 'Deep Learning', tag: '🧠', time: '22 min', xp: 150 },
  'rnn-lstm': { title: 'RNN & LSTM Networks', category: 'Deep Learning', tag: '🧠', time: '20 min', xp: 150 },
  'transformers': { title: 'Transformers & Attention', category: 'Deep Learning', tag: '🧠', time: '25 min', xp: 175 },
  'generative-ai': { title: 'Generative AI & LLMs', category: 'Deep Learning', tag: '🧠', time: '22 min', xp: 175 },
  // NLP
  'nlp-intro': { title: 'Introduction to NLP', category: 'NLP', tag: '💬', time: '12 min', xp: 125 },
  'tokenization': { title: 'Tokenization & Embeddings', category: 'NLP', tag: '💬', time: '14 min', xp: 125 },
  'sentiment-analysis': { title: 'Sentiment Analysis', category: 'NLP', tag: '💬', time: '12 min', xp: 125 },
  'seq2seq': { title: 'Seq2Seq & Machine Translation', category: 'NLP', tag: '💬', time: '18 min', xp: 150 },
  'bert-gpt': { title: 'BERT, GPT & Large Language Models', category: 'NLP', tag: '💬', time: '25 min', xp: 175 },
  // Computer Vision
  'cv-intro': { title: 'Introduction to Computer Vision', category: 'Computer Vision', tag: '👁️', time: '12 min', xp: 125 },
  'image-classification': { title: 'Image Classification', category: 'Computer Vision', tag: '👁️', time: '15 min', xp: 125 },
  'object-detection': { title: 'Object Detection (YOLO, R-CNN)', category: 'Computer Vision', tag: '👁️', time: '20 min', xp: 150 },
  'image-segmentation': { title: 'Image Segmentation', category: 'Computer Vision', tag: '👁️', time: '18 min', xp: 150 },
  'cv-applications': { title: 'CV Applications & GANs', category: 'Computer Vision', tag: '👁️', time: '20 min', xp: 175 },
};

// =====================================================
// LESSON CONTENT (rich HTML for each lesson)
// =====================================================
const LESSON_CONTENT = {

  // ═══════════════════════════════════════════
  // FOUNDATIONS
  // ═══════════════════════════════════════════
  'what-is-ai': {
    intro: { icon: '🧠', concept: 'Artificial Intelligence is the simulation of human intelligence in machines — enabling them to reason, learn, perceive, and act.' },
    sections: [
      { h: 'What is Artificial Intelligence?', body: '<p>AI is a broad field of computer science focused on creating systems that perform tasks normally requiring <strong>human intelligence</strong>:</p><ul class="lesson-list"><li>🗣️ Understanding natural language (NLP)</li><li>👁️ Recognizing images and objects (Computer Vision)</li><li>🎯 Making decisions and solving problems</li><li>🎵 Creating art, music, and text (Generative AI)</li><li>🤖 Moving and interacting with the physical world (Robotics)</li></ul>' },
      { h: 'The AI Hierarchy', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Artificial Intelligence (AI)</div><div class="hv-desc">Broadest field — any technique enabling machines to mimic human behavior</div></div><div class="hv-item" style="--w:70%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Machine Learning (ML)</div><div class="hv-desc">Subset of AI — systems that learn from data without explicit programming</div></div><div class="hv-item" style="--w:45%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Deep Learning (DL)</div><div class="hv-desc">Subset of ML — uses multi-layer neural networks</div></div><div class="hv-item" style="--w:28%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Generative AI</div><div class="hv-desc">Creates new content — text, images, code, audio</div></div></div>' },
      { h: 'Types of AI by Capability', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#34d399">🤖</div><h4>Narrow AI (ANI)</h4><p>Designed for one specific task. All current AI falls here — chess engines, image recognizers, chatbots.</p><span class="tag tag-green">Current Reality</span></div><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🧠</div><h4>General AI (AGI)</h4><p>Matches human-level intelligence across all domains. Does not yet exist.</p><span class="tag tag-purple">Future Goal</span></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🌟</div><h4>Super AI (ASI)</h4><p>Surpasses human intelligence in all areas. Purely hypothetical.</p><span class="tag tag-pink">Speculative</span></div></div>' },
      { h: 'Real-World Applications', body: '<div class="apps-showcase"><div class="app-item"><span>🏥</span><div><strong>Healthcare</strong><p>Disease diagnosis, drug discovery, medical imaging analysis</p></div></div><div class="app-item"><span>🚗</span><div><strong>Autonomous Vehicles</strong><p>Self-driving cars, obstacle detection, route planning</p></div></div><div class="app-item"><span>💬</span><div><strong>Virtual Assistants</strong><p>Siri, Alexa, Google — understanding and responding to speech</p></div></div><div class="app-item"><span>🏦</span><div><strong>Finance</strong><p>Fraud detection, algorithmic trading, credit scoring</p></div></div></div>' },
    ],
    quiz: { q: 'Which of the following is the correct relationship?', opts: ['AI is a subset of Machine Learning', 'Machine Learning is a subset of AI', 'Deep Learning is a subset of Statistics', 'AI and ML are the same thing'], ans: 1, exp: 'Machine Learning is a subset of AI. AI is the broadest field, ML is a way to achieve AI by learning from data, and Deep Learning is a subset of ML using neural networks.' },
    nextLesson: 'ml-types', nextLabel: 'Types of Machine Learning'
  },

  'ml-types': {
    intro: { icon: '⚙️', concept: 'Machine Learning has three primary paradigms — each defined by how the algorithm receives feedback during training.' },
    sections: [
      { h: 'The Three Types of Machine Learning', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🏷️</div><h4>Supervised Learning</h4><p>The model learns from <strong>labeled data</strong> — input-output pairs. It finds a mapping from inputs to outputs.</p><ul class="lesson-list"><li>📧 Email spam detection</li><li>🏠 House price prediction</li><li>🔬 Medical diagnosis</li></ul><span class="tag tag-purple">Most Common</span></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🔍</div><h4>Unsupervised Learning</h4><p>The model finds <strong>hidden patterns</strong> in unlabeled data — no predefined output to learn from.</p><ul class="lesson-list"><li>🛍️ Customer segmentation</li><li>🗜️ Data compression (PCA)</li><li>🔎 Anomaly detection</li></ul><span class="tag tag-blue">No Labels Needed</span></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🎮</div><h4>Reinforcement Learning</h4><p>An <strong>agent</strong> learns by taking actions in an environment and receiving rewards or penalties.</p><ul class="lesson-list"><li>♟️ Game playing (AlphaGo)</li><li>🤖 Robotics control</li><li>💹 Trading algorithms</li></ul><span class="tag tag-green">Trial & Error</span></div></div>' },
      { h: 'Comparing the Three Types', body: '<div class="apps-showcase"><div class="app-item"><span>📊</span><div><strong>Data Requirements</strong><p>Supervised needs labels (expensive). Unsupervised uses raw data. RL needs an environment/simulator.</p></div></div><div class="app-item"><span>🎯</span><div><strong>Goal</strong><p>Supervised: predict output. Unsupervised: discover structure. RL: maximize cumulative reward.</p></div></div><div class="app-item"><span>📏</span><div><strong>Evaluation</strong><p>Supervised: accuracy/MSE on test set. Unsupervised: cluster quality. RL: total reward over episodes.</p></div></div></div><div class="concept-card" style="--cc-color:#fbbf24;margin-top:14px"><div class="cc-icon">➕</div><div class="cc-content"><h3>Semi-Supervised & Self-Supervised</h3><p><strong>Semi-supervised</strong> uses a small amount of labeled data + large unlabeled set. <strong>Self-supervised</strong> (used in BERT/GPT) creates labels automatically from the data itself (e.g., predict the next word).</p></div></div>' },
    ],
    quiz: { q: 'Which type of ML would you use to group customers into segments without predefined categories?', opts: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Semi-supervised Learning'], ans: 1, exp: 'Unsupervised Learning (e.g., K-Means clustering) groups data points by similarity without any predefined labels — perfect for customer segmentation where categories are not known in advance.' },
    nextLesson: 'math-for-ml', nextLabel: 'Math for ML: Linear Algebra'
  },

  'math-for-ml': {
    intro: { icon: '📐', concept: 'Linear Algebra and Calculus are the mathematical backbone of machine learning — understanding them lets you reason about how models work, not just use them.' },
    sections: [
      { h: 'Vectors & Matrices', body: '<p>Data in ML is represented as <strong>vectors</strong> (1D) and <strong>matrices</strong> (2D):</p><ul class="lesson-list"><li>📌 A single data point (e.g., height, weight, age) = a <strong>vector</strong></li><li>📊 A dataset of 1000 patients = a <strong>matrix</strong> (1000 rows × features columns)</li><li>🖼️ A color image = a <strong>3D tensor</strong> (H × W × 3 channels)</li></ul><div class="concept-card" style="--cc-color:#38bdf8;margin-top:12px"><div class="cc-icon">⚡</div><div class="cc-content"><h3>Matrix Multiplication</h3><p>The core operation in deep learning. A forward pass through a neural network layer is: <strong>output = activation(W · x + b)</strong> — where W is a weight matrix and x is an input vector.</p></div></div>' },
      { h: 'Key Linear Algebra Concepts', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">📏</div><h4>Dot Product</h4><p>Measures similarity between two vectors. The basis of attention mechanisms and cosine similarity.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🔄</div><h4>Transpose</h4><p>Flips a matrix over its diagonal. Essential in matrix multiplication and backpropagation.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🎯</div><h4>Eigenvalues/Vectors</h4><p>Used in PCA (dimensionality reduction) to find directions of maximum variance in data.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🔢</div><h4>Norms</h4><p>L1 and L2 norms measure vector magnitude. Used in regularization (Lasso, Ridge).</p></div></div>' },
      { h: 'Calculus for ML: Gradients', body: '<p>Training ML models = minimizing a <strong>loss function</strong>. We do this via <strong>gradient descent</strong>:</p><ul class="lesson-list"><li>📉 Compute the gradient (partial derivatives) of loss w.r.t. each weight</li><li>⬇️ Update each weight: <code>w = w − lr × ∂L/∂w</code></li><li>🔄 Repeat until convergence</li></ul><p style="margin-top:10px;color:var(--text-secondary);font-size:0.9rem">The <strong>chain rule</strong> of calculus makes backpropagation possible — computing gradients through many layers efficiently.</p>' },
    ],
    quiz: { q: 'In the weight update rule w = w − lr × gradient, what role does the learning rate (lr) play?', opts: ['It selects which weights to update', 'It controls the step size of each weight update', 'It measures the loss function', 'It initializes the weights'], ans: 1, exp: 'The learning rate controls how big each parameter update step is. Too large → overshooting/divergence. Too small → very slow convergence. Choosing the right lr is critical in training.' },
    nextLesson: 'stats-probability', nextLabel: 'Statistics & Probability'
  },

  'stats-probability': {
    intro: { icon: '📊', concept: 'Statistics and probability provide the mathematical foundation for understanding data distributions, model uncertainty, and the behavior of ML algorithms.' },
    sections: [
      { h: 'Descriptive Statistics', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">📍</div><h4>Mean / Median / Mode</h4><p>Measures of central tendency. Mean is sensitive to outliers; median is robust.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📏</div><h4>Variance & Std Dev</h4><p>Measure spread. High variance = data is spread out widely from the mean.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">📈</div><h4>Distributions</h4><p>Normal (Gaussian) distribution is fundamental. Many ML algorithms assume normally distributed features.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🔗</div><h4>Correlation</h4><p>Measures linear relationship between two variables. Range: −1 to +1. ≠ Causation.</p></div></div>' },
      { h: 'Probability Concepts in ML', body: '<ul class="lesson-list"><li>🎲 <strong>Probability</strong>: P(A) = likelihood of event A occurring ∈ [0, 1]</li><li>🔗 <strong>Conditional Probability</strong>: P(A|B) = probability of A given B has occurred</li><li>🧮 <strong>Bayes\' Theorem</strong>: P(A|B) = P(B|A) × P(A) / P(B) — the foundation of Naive Bayes classifiers</li><li>📊 <strong>Maximum Likelihood Estimation (MLE)</strong>: Find model parameters that maximize the probability of observing the training data</li></ul><div class="concept-card" style="--cc-color:#a78bfa;margin-top:12px"><div class="cc-icon">🧠</div><div class="cc-content"><h3>Why It Matters</h3><p>Logistic Regression outputs probabilities. Neural networks with softmax output class probability distributions. Bayesian methods express model uncertainty — all rooted in probability theory.</p></div></div>' },
    ],
    quiz: { q: 'What does a high variance in a dataset indicate?', opts: ['Data points are close to the mean', 'Data points are spread far from the mean', 'The model is overfitting', 'Features are highly correlated'], ans: 1, exp: 'Variance measures the average squared deviation from the mean. High variance means data points are widely spread out, indicating greater diversity or noise in the data.' },
    nextLesson: 'python-ai', nextLabel: 'Python for AI Basics'
  },

  'python-ai': {
    intro: { icon: '🐍', concept: 'Python is the dominant programming language for AI/ML due to its simplicity, readability, and an unmatched ecosystem of scientific libraries.' },
    sections: [
      { h: 'The Python ML Stack', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🔢</div><h4>NumPy</h4><p>Fast N-dimensional array operations. The backbone of all numeric computation in Python ML.</p><span class="tag tag-purple">Foundation</span></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🐼</div><h4>Pandas</h4><p>DataFrames for loading, cleaning, and manipulating tabular datasets. CSV, Excel, SQL support.</p><span class="tag tag-blue">Data Wrangling</span></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">📊</div><h4>Matplotlib / Seaborn</h4><p>Visualization libraries for plotting distributions, correlations, training curves, and more.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">⚙️</div><h4>Scikit-Learn</h4><p>Ready-to-use ML algorithms (classify, cluster, regress), plus preprocessing and evaluation tools.</p><span class="tag tag-green">ML Ready</span></div></div>' },
      { h: 'Deep Learning Frameworks', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#fb923c">🔥</div><h4>PyTorch</h4><p>Dynamic computation graph. Preferred for research. Native Python feel. Used by Meta, most top labs.</p><span class="tag tag-orange">Research Favorite</span></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🌊</div><h4>TensorFlow / Keras</h4><p>Google\'s framework. Keras API makes building models very accessible. Strong production/deployment tools.</p><span class="tag tag-green">Production Ready</span></div></div><div class="concept-card" style="--cc-color:#fbbf24;margin-top:14px"><div class="cc-icon">💡</div><div class="cc-content"><h3>Quick Start Pattern</h3><p>Load data with Pandas → preprocess with NumPy/Scikit-Learn → build model with PyTorch/Keras → evaluate and visualize with Matplotlib.</p></div></div>' },
      { h: 'Essential Python for ML — Code Patterns', body: '<pre style="background:rgba(10,15,46,0.8);border:1px solid var(--border);border-radius:12px;padding:16px;font-family:var(--font-code);font-size:0.82rem;color:#e2e8f0;overflow-x:auto;line-height:1.6"><code><span style="color:#a78bfa">import</span> numpy <span style="color:#a78bfa">as</span> np\n<span style="color:#a78bfa">import</span> pandas <span style="color:#a78bfa">as</span> pd\n<span style="color:#a78bfa">from</span> sklearn.model_selection <span style="color:#a78bfa">import</span> train_test_split\n<span style="color:#a78bfa">from</span> sklearn.linear_model <span style="color:#a78bfa">import</span> LogisticRegression\n\n<span style="color:#64748b"># Load data</span>\ndf = pd.read_csv(<span style="color:#34d399">\'data.csv\'</span>)\nX, y = df.drop(<span style="color:#34d399">\'label\'</span>, axis=<span style="color:#fbbf24">1</span>), df[<span style="color:#34d399">\'label\'</span>]\n\n<span style="color:#64748b"># Split & train</span>\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=<span style="color:#fbbf24">0.2</span>)\nmodel = LogisticRegression().fit(X_train, y_train)\nprint(model.score(X_test, y_test))</code></pre>' },
    ],
    quiz: { q: 'Which Python library provides ready-to-use ML algorithms like LogisticRegression, KMeans, and RandomForest?', opts: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn'], ans: 3, exp: 'Scikit-Learn (sklearn) provides a consistent API for dozens of ML algorithms, preprocessing tools, and evaluation metrics — it is the go-to library for classical ML in Python.' },
    nextLesson: 'supervised-learning', nextLabel: 'Supervised Learning'
  },

  // ═══════════════════════════════════════════
  // MACHINE LEARNING
  // ═══════════════════════════════════════════
  'supervised-learning': {
    intro: { icon: '🏷️', concept: 'Supervised Learning trains models on labeled input-output pairs, learning a mapping that generalizes to predict outputs for unseen inputs.' },
    sections: [
      { h: 'How Supervised Learning Works', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Labeled Training Data (X → y)</div><div class="hv-desc">Thousands of examples: each input X paired with correct output y</div></div><div class="hv-item" style="--w:80%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Model Training — minimize loss function</div><div class="hv-desc">Model adjusts parameters to reduce error between predictions and true labels</div></div><div class="hv-item" style="--w:60%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Validation — tune hyperparameters</div><div class="hv-desc">Held-out set used to check for overfitting and tune settings</div></div><div class="hv-item" style="--w:40%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Test Set Evaluation — final unbiased score</div></div></div>' },
      { h: 'Classification vs Regression', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🏷️</div><h4>Classification</h4><p>Predicts a <strong>discrete category</strong>. Output is a class label.</p><ul class="lesson-list"><li>📧 Spam or Not Spam</li><li>🔬 Benign or Malignant</li><li>🐾 Cat, Dog, or Bird</li></ul></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📈</div><h4>Regression</h4><p>Predicts a <strong>continuous number</strong>. Output is a real value.</p><ul class="lesson-list"><li>🏠 House price ($)</li><li>🌡️ Temperature forecast</li><li>📊 Sales revenue</li></ul></div></div>' },
      { h: 'Key Supervised Algorithms', body: '<div class="apps-showcase"><div class="app-item"><span>📏</span><div><strong>Linear Regression</strong><p>Fit a line through data. Minimize MSE. Great baseline for regression.</p></div></div><div class="app-item"><span>🔀</span><div><strong>Logistic Regression</strong><p>Binary classifier using sigmoid. Outputs probability ∈ [0,1].</p></div></div><div class="app-item"><span>🌲</span><div><strong>Decision Trees</strong><p>Split data recursively on best features. Human-interpretable.</p></div></div><div class="app-item"><span>🤝</span><div><strong>k-NN</strong><p>Classify new point by majority vote of k nearest training neighbors.</p></div></div></div>' },
    ],
    quiz: { q: 'In supervised learning, what is the key requirement for the training data?', opts: ['Data must be numerical only', 'Each input must have a corresponding correct output label', 'Data must be evenly distributed', 'At least 1 million samples are required'], ans: 1, exp: 'Supervised learning requires labeled data — each training example consists of an input X and its corresponding correct output y. The model learns to map X → y from these examples.' },
    nextLesson: 'unsupervised', nextLabel: 'Unsupervised Learning'
  },

  'unsupervised': {
    intro: { icon: '🔍', concept: 'Unsupervised Learning discovers hidden structure in unlabeled data — no teacher, no correct answers — just patterns waiting to be found.' },
    sections: [
      { h: 'What Can Unsupervised Learning Find?', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎯</div><h4>Clusters</h4><p>Groups of similar data points. K-Means, DBSCAN, Hierarchical Clustering.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📉</div><h4>Reduced Dimensions</h4><p>Compress high-dimensional data while preserving structure. PCA, t-SNE, UMAP.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔎</div><h4>Anomalies</h4><p>Detect rare, unusual points that deviate from normal patterns. Fraud detection, fault monitoring.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">📦</div><h4>Associations</h4><p>Find rules like "users who buy X also buy Y." Market basket analysis, recommendation engines.</p></div></div>' },
      { h: 'Dimensionality Reduction', body: '<div class="concept-card" style="--cc-color:#38bdf8"><div class="cc-icon">📉</div><div class="cc-content"><h3>Principal Component Analysis (PCA)</h3><p>PCA finds the directions of maximum variance in data (principal components) and projects data onto a lower-dimensional space. Used for: compressing data before training, removing noise, and 2D/3D visualization of high-dimensional datasets.</p></div></div><ul class="lesson-list" style="margin-top:12px"><li>🗜️ Reduce 1000 features → 50 without losing much information</li><li>🎨 Visualize high-D data in 2D with t-SNE or UMAP</li><li>⚡ Speed up training by removing redundant features</li></ul>' },
      { h: 'Association Rule Mining', body: '<p>Find relationships between items in transactions — the classic example is <strong>Market Basket Analysis</strong>:</p><div class="apps-showcase"><div class="app-item"><span>🛒</span><div><strong>Classic Example</strong><p>"Customers who buy diapers also buy beer" — discovered by Walmart in the 1990s</p></div></div><div class="app-item"><span>🎬</span><div><strong>Recommender Systems</strong><p>"Users who watched A also liked B" — collaborative filtering foundations</p></div></div></div>' },
    ],
    quiz: { q: 'Which of the following is an example of unsupervised learning?', opts: ['Training a spam detector with labeled emails', 'Grouping customers by purchase behavior without predefined categories', 'Teaching a robot with reward signals', 'Predicting house prices from labeled sales data'], ans: 1, exp: 'Grouping customers into segments without predefined categories is unsupervised learning (clustering). No labels exist — the algorithm discovers structure in the data on its own.' },
    nextLesson: 'decision-trees', nextLabel: 'Decision Trees & Random Forests'
  },

  'decision-trees': {
    intro: { icon: '🌳', concept: 'Decision Trees learn a hierarchical series of if-else rules from data. Random Forests ensemble hundreds of trees to dramatically improve accuracy and robustness.' },
    sections: [
      { h: 'How Decision Trees Work', body: '<p>A decision tree splits data <strong>recursively</strong> on the feature that best separates classes:</p><ol class="lesson-list" style="list-style:decimal;padding-left:1.5rem"><li>Start with all training samples at the root node</li><li>Find the feature and threshold that best splits the data (using Gini impurity or Information Gain / Entropy)</li><li>Split into child nodes; repeat until a stopping criterion is met</li><li>Leaf nodes give the final prediction (majority class or average value)</li></ol><div class="concept-card" style="--cc-color:#38bdf8;margin-top:12px"><div class="cc-icon">📊</div><div class="cc-content"><h3>Gini Impurity vs Entropy</h3><p>Both measure node impurity (how mixed the classes are). <strong>Gini</strong>: faster to compute. <strong>Entropy</strong>: information theory based. Information Gain = parent impurity − weighted child impurity.</p></div></div>' },
      { h: 'From Decision Trees to Random Forests', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Problem: Single trees overfit — high variance</div><div class="hv-desc">A deep tree memorizes training data and generalizes poorly</div></div><div class="hv-item" style="--w:80%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Solution 1 — Bagging: train many trees on random data subsets</div></div><div class="hv-item" style="--w:60%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Solution 2 — Feature randomness: each split considers random feature subset</div></div><div class="hv-item" style="--w:40%;--col:rgba(251,191,36,0.15);--border:rgba(251,191,36,0.4)"><div class="hv-label">Random Forest: majority vote of 100–1000 trees → low variance, high accuracy</div></div></div>' },
      { h: 'Advantages & When to Use', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#34d399">✅</div><h4>Advantages</h4><p>Interpretable (trees). No feature scaling needed. Handles mixed data types. Built-in feature importance.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">⚠️</div><h4>Limitations</h4><p>Single trees overfit easily. Cannot extrapolate beyond training range. Biased toward high-cardinality features.</p></div><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎯</div><h4>Best Use Cases</h4><p>Tabular / structured data. When interpretability matters (tree). When accuracy matters (forest). Feature selection.</p></div></div>' },
    ],
    quiz: { q: 'What is the purpose of "feature randomness" in Random Forests?', opts: ['Speed up training by using fewer features', 'Reduce correlation between trees, lowering ensemble variance', 'Select the most important features only', 'Prevent the tree from growing too deep'], ans: 1, exp: 'By considering only a random subset of features at each split, Random Forest trees become more diverse and less correlated with each other — their errors cancel out when aggregated, reducing overall variance.' },
    nextLesson: 'svm', nextLabel: 'Support Vector Machines'
  },

  // ═══════════════════════════════════════════
  // DEEP LEARNING
  // ═══════════════════════════════════════════
  'neural-networks': {
    intro: { icon: '🧠', concept: 'Neural Networks are computational systems loosely inspired by biological brains — layers of interconnected neurons that transform inputs into outputs through learned weights.' },
    sections: [
      { h: 'Anatomy of a Neural Network', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Input Layer</div><div class="hv-desc">Receives raw features (pixels, numbers, embeddings). One neuron per feature.</div></div><div class="hv-item" style="--w:80%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Hidden Layers (1 to 100s)</div><div class="hv-desc">Learn progressively abstract representations. "Deep" = many hidden layers.</div></div><div class="hv-item" style="--w:55%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Output Layer</div><div class="hv-desc">Final prediction. Sigmoid (binary), Softmax (multi-class), Linear (regression)</div></div></div><p style="margin-top:10px;font-size:0.88rem;color:var(--text-secondary)">Each neuron computes: <code style="color:#a78bfa">output = activation(W · input + b)</code></p>' },
      { h: 'Activation Functions', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">⚡</div><h4>ReLU</h4><p>max(0, x). Most popular. Fast, avoids vanishing gradients. Used in hidden layers.</p><span class="tag tag-purple">Default Choice</span></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🔀</div><h4>Sigmoid</h4><p>Maps to (0,1). Good for binary classification output. Suffers vanishing gradients in deep nets.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🌊</div><h4>Tanh</h4><p>Maps to (-1,1). Zero-centered, often better than sigmoid for hidden layers.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🎯</div><h4>Softmax</h4><p>Converts logits to a probability distribution summing to 1. Used for multi-class output layer.</p></div></div>' },
      { h: 'Training via Backpropagation', body: '<ol class="lesson-list" style="list-style:decimal;padding-left:1.5rem"><li><strong>Forward Pass</strong>: Input flows through layers, producing a prediction ŷ</li><li><strong>Compute Loss</strong>: Compare ŷ to true label y (e.g., Cross-Entropy Loss)</li><li><strong>Backward Pass</strong>: Backpropagation computes ∂Loss/∂w for every weight using the chain rule</li><li><strong>Update Weights</strong>: Gradient descent: w = w − lr × ∂Loss/∂w</li><li><strong>Repeat</strong>: Over many mini-batches and epochs until loss converges</li></ol>' },
      { h: 'Key Training Tricks', body: '<div class="apps-showcase"><div class="app-item"><span>🎲</span><div><strong>Dropout</strong><p>Randomly zero out neurons during training (e.g., 20%) to prevent co-adaptation and reduce overfitting</p></div></div><div class="app-item"><span>📊</span><div><strong>Batch Normalization</strong><p>Normalize layer inputs at each mini-batch. Enables higher learning rates and faster, more stable training</p></div></div><div class="app-item"><span>⚡</span><div><strong>Adam Optimizer</strong><p>Adaptive learning rates per parameter. Most popular optimizer — works well with minimal tuning</p></div></div><div class="app-item"><span>🔄</span><div><strong>Early Stopping</strong><p>Stop training when validation loss stops improving — prevents overfitting automatically</p></div></div></div>' },
    ],
    quiz: { q: 'What is the purpose of an activation function in a neural network?', opts: ['To initialize the weights', 'To introduce non-linearity, enabling the network to learn complex patterns', 'To normalize the input data', 'To compute the final loss'], ans: 1, exp: 'Without activation functions, stacking layers would just be a linear transformation. Non-linear activations (ReLU, sigmoid, tanh) allow neural networks to learn arbitrary complex functions.' },
    nextLesson: 'cnn', nextLabel: 'Convolutional Neural Networks'
  },

  'svm': {
    intro: { icon: '📐', concept: 'Support Vector Machines find the optimal hyperplane that maximally separates classes, using support vectors — the closest data points to the boundary.' },
    sections: [
      { h: 'What is a Support Vector Machine?', body: '<p>SVMs find the decision boundary (hyperplane) that maximizes the <strong>margin</strong> — the gap between the two classes. Only the closest points (<em>support vectors</em>) define the boundary.</p><ul class="lesson-list"><li>🎯 Maximizes the margin between classes</li><li>📐 Works in high-dimensional spaces</li><li>🔑 Uses the kernel trick for non-linear data</li><li>✅ Effective even with small datasets</li></ul>' },
      { h: 'The Kernel Trick', body: '<div class="concept-card" style="--cc-color:#38bdf8"><div class="cc-icon">🔮</div><div class="cc-content"><h3>Key Idea</h3><p>When data is not linearly separable, SVMs use a <strong>kernel function</strong> to implicitly map data into a higher-dimensional space where a linear boundary exists.</p></div></div><div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">📏</div><h4>Linear Kernel</h4><p>For linearly separable data. Fast and simple.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🌊</div><h4>RBF Kernel</h4><p>Radial Basis Function — works well for most non-linear problems.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔢</div><h4>Polynomial Kernel</h4><p>Maps data using polynomial features. Good for image data.</p></div></div>' },
    ],
    quiz: { q: 'What is the "margin" in an SVM?', opts: ['The training error', 'The distance between the hyperplane and nearest data points', 'The kernel function output', 'The number of support vectors'], ans: 1, exp: 'The margin is the distance between the decision hyperplane and the nearest data points from each class. SVMs maximize this margin to improve generalization.' },
    nextLesson: 'clustering', nextLabel: 'Clustering Algorithms'
  },

  'clustering': {
    intro: { icon: '🎯', concept: 'Clustering is an unsupervised technique that groups similar data points together without any predefined labels.' },
    sections: [
      { h: 'Types of Clustering', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎯</div><h4>K-Means</h4><p>Partition data into K clusters by minimizing within-cluster variance. Fast and scalable.</p><span class="tag tag-green">Most Common</span></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🌲</div><h4>Hierarchical</h4><p>Build a tree (dendrogram) of clusters. No need to specify K upfront.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔵</div><h4>DBSCAN</h4><p>Density-based clustering. Identifies arbitrary-shaped clusters and handles noise/outliers.</p><span class="tag tag-purple">Noise Robust</span></div></div>' },
      { h: 'K-Means Algorithm Steps', body: '<ol class="lesson-list" style="list-style:decimal;padding-left:1.5rem"><li>Choose K — the number of clusters</li><li>Randomly initialize K centroids</li><li>Assign each point to the nearest centroid</li><li>Recompute centroids as the mean of assigned points</li><li>Repeat steps 3–4 until convergence</li></ol><div class="concept-card" style="--cc-color:#fbbf24"><div class="cc-icon">⚠️</div><div class="cc-content"><h3>Choosing K</h3><p>Use the <strong>Elbow Method</strong>: plot inertia vs K and look for the point where adding more clusters gives diminishing returns.</p></div></div>' },
    ],
    quiz: { q: 'Which clustering algorithm can detect arbitrarily-shaped clusters and handle noise?', opts: ['K-Means', 'Hierarchical (Ward)', 'DBSCAN', 'Gaussian Mixture Models'], ans: 2, exp: 'DBSCAN groups points based on density, naturally finding arbitrarily shaped clusters and marking low-density points as noise/outliers — something K-Means cannot do.' },
    nextLesson: 'model-evaluation', nextLabel: 'Model Evaluation & Tuning'
  },

  'model-evaluation': {
    intro: { icon: '📊', concept: 'Model evaluation measures how well a model performs, while hyperparameter tuning adjusts settings to maximize that performance.' },
    sections: [
      { h: 'Key Evaluation Metrics', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#34d399">✅</div><h4>Accuracy</h4><p>Correct predictions / total. Misleading for imbalanced data.</p></div><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎯</div><h4>F1-Score</h4><p>Harmonic mean of Precision &amp; Recall. Best for imbalanced classes.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📈</div><h4>AUC-ROC</h4><p>Area under ROC curve — measures discriminative ability across all thresholds.</p></div><div class="type-card"><div class="tc-icon" style="color:#fbbf24">📉</div><h4>MSE / RMSE</h4><p>Mean Squared / Root Mean Squared Error — for regression tasks.</p></div></div>' },
      { h: 'Hyperparameter Tuning', body: '<ul class="lesson-list"><li>🔍 <strong>Grid Search</strong>: Exhaustive search over parameter grid</li><li>🎲 <strong>Random Search</strong>: Random sampling — faster, often equally good</li><li>🧠 <strong>Bayesian Optimization</strong>: Uses past results to sample smarter</li><li>🔄 <strong>k-Fold Cross-Validation</strong>: Evaluate on k different train/test splits for unbiased estimate</li></ul>' },
    ],
    quiz: { q: 'For a highly imbalanced dataset (99% class A, 1% class B), which metric is most appropriate?', opts: ['Accuracy', 'Mean Squared Error', 'F1-Score or AUC-ROC', 'R-squared'], ans: 2, exp: 'Accuracy is misleading for imbalanced data. F1-Score and AUC-ROC better capture performance on the minority class.' },
    nextLesson: 'neural-networks', nextLabel: 'Neural Networks'
  },

  'cnn': {
    intro: { icon: '👁️', concept: 'CNNs use learnable filters to detect spatial patterns (edges, textures, shapes) in images through hierarchical feature extraction.' },
    sections: [
      { h: 'CNN Architecture', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Input Layer (Image: H × W × Channels)</div></div><div class="hv-item" style="--w:85%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Convolutional Layers — learn local features</div><div class="hv-desc">Apply filters (kernels) to detect edges, textures, shapes</div></div><div class="hv-item" style="--w:70%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Pooling Layers — reduce spatial size</div><div class="hv-desc">Max/Average pooling retains dominant features, reduces computation</div></div><div class="hv-item" style="--w:50%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Fully Connected Layers — classification head</div><div class="hv-desc">Flatten features and classify into output categories</div></div></div>' },
      { h: 'Famous CNN Architectures', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🏆</div><h4>LeNet-5 (1998)</h4><p>First successful CNN. Pioneered the conv-pool-FC pattern for digit recognition.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🚀</div><h4>AlexNet (2012)</h4><p>Won ImageNet. Introduced ReLU, Dropout, and GPU training at scale.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔬</div><h4>ResNet (2015)</h4><p>Residual connections allow training very deep networks (100+ layers).</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">⚡</div><h4>EfficientNet (2019)</h4><p>Compound scaling of depth, width, and resolution. State-of-the-art efficiency.</p></div></div>' },
    ],
    quiz: { q: 'What is the primary purpose of a pooling layer in a CNN?', opts: ['Adding non-linearity', 'Detecting edges in the image', 'Reducing spatial dimensions while retaining key features', 'Connecting all neurons fully'], ans: 2, exp: 'Pooling layers (max or average) reduce the spatial size of feature maps, decreasing computation and providing translation invariance while preserving the most important activations.' },
    nextLesson: 'rnn-lstm', nextLabel: 'RNN & LSTM Networks'
  },

  'rnn-lstm': {
    intro: { icon: '🔄', concept: 'RNNs process sequential data by maintaining a hidden state across time steps. LSTMs extend this with gating to handle long-range dependencies.' },
    sections: [
      { h: 'Recurrent Neural Networks (RNNs)', body: '<p>Unlike feedforward networks, RNNs have <strong>loops</strong> — the output at each step feeds back as input to the next step, giving the network a form of memory for sequences.</p><div class="concept-card" style="--cc-color:#f472b6"><div class="cc-icon">⚠️</div><div class="cc-content"><h3>Vanishing Gradient Problem</h3><p>In standard RNNs, gradients shrink exponentially during backpropagation through time, making it very hard to learn long-range dependencies.</p></div></div>' },
      { h: 'LSTM Gating Mechanism', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#f472b6">🗑️</div><h4>Forget Gate</h4><p>Decides what information to discard from the cell state. Sigmoid output ∈ [0,1].</p></div><div class="type-card"><div class="tc-icon" style="color:#a78bfa">📥</div><h4>Input Gate</h4><p>Decides what new information to write into the cell state.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📤</div><h4>Output Gate</h4><p>Controls what part of the cell state becomes the hidden state output.</p></div></div><ul class="lesson-list" style="margin-top:12px"><li>🔗 <strong>GRU</strong> (Gated Recurrent Unit) — simplified LSTM with fewer gates, often similar performance</li><li>📝 Applications: text generation, speech recognition, time series forecasting</li></ul>' },
    ],
    quiz: { q: 'What problem do LSTMs solve that basic RNNs struggle with?', opts: ['LSTMs train faster', 'LSTMs handle long-range dependencies via gating mechanisms', 'LSTMs use less memory', 'LSTMs work better on images'], ans: 1, exp: 'LSTMs use forget, input, and output gates to selectively retain or discard information, allowing them to model long-range dependencies — solving the vanishing gradient problem in basic RNNs.' },
    nextLesson: 'transformers', nextLabel: 'Transformers & Attention'
  },

  'transformers': {
    intro: { icon: '🤖', concept: 'Transformers replaced RNNs using self-attention to process entire sequences in parallel, enabling massive language models like GPT and BERT.' },
    sections: [
      { h: 'Self-Attention Mechanism', body: '<p>For each token, self-attention computes how much every other token should influence its representation — capturing long-range context without recurrence.</p><div class="apps-showcase"><div class="app-item"><span>🔑</span><div><strong>Query (Q)</strong><p>"What am I looking for?"</p></div></div><div class="app-item"><span>📚</span><div><strong>Key (K)</strong><p>"What do I contain?"</p></div></div><div class="app-item"><span>💬</span><div><strong>Value (V)</strong><p>"What do I output?"</p></div></div></div><p style="margin-top:12px;font-family:var(--font-code);font-size:0.9rem">Attention(Q,K,V) = softmax(QKᵀ / √d_k) × V</p>' },
      { h: 'Transformer Components', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🧱</div><h4>Encoder</h4><p>Processes input bidirectionally. Used in BERT for understanding tasks.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">✍️</div><h4>Decoder</h4><p>Generates output autoregressively. Used in GPT for text generation.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔗</div><h4>Multi-Head Attention</h4><p>Multiple heads capture different types of token relationships in parallel.</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">📍</div><h4>Positional Encoding</h4><p>Injects sequence order information since attention is permutation-invariant.</p></div></div>' },
    ],
    quiz: { q: 'What is the key innovation of the Transformer over RNNs?', opts: ['Uses convolutional layers', 'Processes entire sequences in parallel using self-attention', 'Requires less training data', 'Uses a single attention head'], ans: 1, exp: 'Transformers process all tokens simultaneously via self-attention, making them vastly more parallelizable than sequential RNNs — enabling training of much larger models on modern GPUs.' },
    nextLesson: 'generative-ai', nextLabel: 'Generative AI & LLMs'
  },

  'generative-ai': {
    intro: { icon: '✨', concept: 'Generative AI creates new content — text, images, code — by learning the underlying distribution of training data and sampling from it.' },
    sections: [
      { h: 'Types of Generative Models', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">⚔️</div><h4>GANs</h4><p>Generator vs Discriminator compete adversarially. Great for images.<br><span class="tag tag-purple">StyleGAN, DALL-E 1</span></p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📉</div><h4>Diffusion Models</h4><p>Add noise then learn to reverse it. State-of-the-art image quality.<br><span class="tag tag-blue">Stable Diffusion, DALL-E 3</span></p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">📝</div><h4>LLMs (GPT-style)</h4><p>Autoregressive transformers trained on massive text corpora.<br><span class="tag tag-pink">GPT-4, Claude, Gemini</span></p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🔄</div><h4>VAEs</h4><p>Learn a compressed latent space and generate by sampling from it.</p></div></div>' },
      { h: 'How LLMs Are Built', body: '<ul class="lesson-list"><li>📚 <strong>Pre-training</strong>: Next-token prediction on hundreds of billions of tokens</li><li>🎯 <strong>Instruction Fine-tuning</strong>: Teach the model to follow instructions</li><li>🔗 <strong>RLHF</strong>: Reinforcement Learning from Human Feedback — align with human values</li><li>⚡ <strong>Prompt Engineering</strong>: Craft prompts to guide model output without retraining</li><li>🧩 <strong>RAG</strong>: Retrieval-Augmented Generation — combine LLMs with external knowledge</li></ul>' },
    ],
    quiz: { q: 'What technique is used to align LLMs with human preferences?', opts: ['Transfer Learning', 'Reinforcement Learning from Human Feedback (RLHF)', 'Batch Normalization', 'Dropout Regularization'], ans: 1, exp: 'RLHF trains a reward model on human preference data, then uses RL to fine-tune the LLM to maximize that reward — making outputs more helpful, harmless, and honest.' },
    nextLesson: 'nlp-intro', nextLabel: 'Introduction to NLP'
  },

  'nlp-intro': {
    intro: { icon: '💬', concept: 'Natural Language Processing (NLP) enables machines to understand, interpret, and generate human language in all its complexity.' },
    sections: [
      { h: 'NLP Pipeline', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Raw Text Input</div></div><div class="hv-item" style="--w:85%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Preprocessing — tokenization, lowercasing, stopword removal</div></div><div class="hv-item" style="--w:70%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Feature Extraction — TF-IDF, word embeddings</div></div><div class="hv-item" style="--w:55%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Model — classifier, generator, translator</div></div><div class="hv-item" style="--w:35%;--col:rgba(251,191,36,0.15);--border:rgba(251,191,36,0.4)"><div class="hv-label">Output — label, text, translation</div></div></div>' },
      { h: 'Core NLP Tasks', body: '<div class="apps-showcase"><div class="app-item"><span>😊</span><div><strong>Sentiment Analysis</strong><p>Classifying text as positive / negative / neutral</p></div></div><div class="app-item"><span>🏷️</span><div><strong>Named Entity Recognition</strong><p>Identifying names, places, dates, organizations</p></div></div><div class="app-item"><span>🌍</span><div><strong>Machine Translation</strong><p>Translating text between languages automatically</p></div></div><div class="app-item"><span>📝</span><div><strong>Text Summarization</strong><p>Condensing long documents into concise summaries</p></div></div></div>' },
    ],
    quiz: { q: 'What does "tokenization" mean in NLP?', opts: ['Assigning security tokens to users', 'Splitting text into smaller units (words, subwords, characters)', 'Encrypting text data', 'Converting text to images'], ans: 1, exp: 'Tokenization splits raw text into tokens (words, subwords, or characters) that can be converted into numerical representations a model can process.' },
    nextLesson: 'tokenization', nextLabel: 'Tokenization & Embeddings'
  },

  'tokenization': {
    intro: { icon: '🔤', concept: 'Tokenization converts raw text into tokens; embeddings map tokens to dense numerical vectors that capture semantic meaning.' },
    sections: [
      { h: 'Word Embeddings', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">📦</div><h4>One-Hot Encoding</h4><p>Simple binary vector. Sparse, no semantic meaning, does not scale.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🗺️</div><h4>Word2Vec</h4><p>Dense vectors where similar words are geometrically close. "King − Man + Woman ≈ Queen"</p><span class="tag tag-green">Classic</span></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">⚡</div><h4>Contextual (BERT/GPT)</h4><p>Same word gets different embeddings depending on context. State of the art.</p><span class="tag tag-pink">Best Results</span></div></div>' },
      { h: 'Byte-Pair Encoding (BPE)', body: '<p>Modern LLMs use <strong>BPE</strong> — vocabulary built from common character sequences. Handles rare words and multiple languages gracefully.</p><ul class="lesson-list"><li>"playing" → "play" + "ing"</li><li>"tokenization" → "token" + "ization"</li><li>Vocabulary size: ~50,000 tokens for GPT-4</li></ul>' },
    ],
    quiz: { q: 'What is a key property of Word2Vec embeddings?', opts: ['They are one-hot vectors', 'Semantically similar words have similar vector representations', 'They only work with English', 'Context never changes the embedding'], ans: 1, exp: 'Word2Vec maps words to dense vectors where semantically similar words cluster together, enabling semantic arithmetic like "king − man + woman ≈ queen".' },
    nextLesson: 'sentiment-analysis', nextLabel: 'Sentiment Analysis'
  },

  'sentiment-analysis': {
    intro: { icon: '😊', concept: 'Sentiment Analysis classifies the emotional tone of text — from binary positive/negative to fine-grained emotion detection.' },
    sections: [
      { h: 'Approaches', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#34d399">📖</div><h4>Lexicon-Based</h4><p>Uses sentiment dictionaries (e.g., VADER). No training needed. Limited to known words.</p></div><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🧠</div><h4>ML-Based</h4><p>Naive Bayes, SVM on TF-IDF features. Fast training, requires labeled data.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🤖</div><h4>Deep Learning (BERT)</h4><p>Fine-tuned transformer. Best accuracy, captures context and sarcasm.</p><span class="tag tag-blue">State of Art</span></div></div>' },
      { h: 'Applications', body: '<div class="apps-showcase"><div class="app-item"><span>📦</span><div><strong>Product Reviews</strong><p>Rating prediction from Amazon/Netflix review text</p></div></div><div class="app-item"><span>📈</span><div><strong>Stock Market</strong><p>Predicting market direction from financial news headlines</p></div></div><div class="app-item"><span>🏥</span><div><strong>Healthcare</strong><p>Patient satisfaction analysis from doctor notes</p></div></div><div class="app-item"><span>📱</span><div><strong>Brand Monitoring</strong><p>Real-time sentiment tracking from social media</p></div></div></div>' },
    ],
    quiz: { q: 'Why does BERT outperform bag-of-words for sentiment analysis?', opts: ['BERT is faster', 'BERT understands bidirectional context and nuance like negation', 'BERT uses more stopwords', 'BERT requires no training data'], ans: 1, exp: 'BERT processes text bidirectionally using self-attention, capturing how each word relates to all others in context — detecting negation ("not good"), sarcasm, and subtle sentiment that bag-of-words misses.' },
    nextLesson: 'seq2seq', nextLabel: 'Seq2Seq & Translation'
  },

  'seq2seq': {
    intro: { icon: '🌍', concept: 'Sequence-to-Sequence models encode an input sequence and decode it into an output sequence of a different length — the foundation of machine translation.' },
    sections: [
      { h: 'Encoder-Decoder Architecture', body: '<div class="hierarchy-viz"><div class="hv-item" style="--w:100%;--col:rgba(167,139,250,0.15);--border:rgba(167,139,250,0.4)"><div class="hv-label">Input Sequence (e.g., English sentence)</div></div><div class="hv-item" style="--w:80%;--col:rgba(56,189,248,0.15);--border:rgba(56,189,248,0.4)"><div class="hv-label">Encoder → Context Vector</div><div class="hv-desc">Compresses entire input into a fixed-size representation</div></div><div class="hv-item" style="--w:60%;--col:rgba(244,114,182,0.15);--border:rgba(244,114,182,0.4)"><div class="hv-label">Decoder (autoregressive) → Output tokens one by one</div></div><div class="hv-item" style="--w:40%;--col:rgba(52,211,153,0.15);--border:rgba(52,211,153,0.4)"><div class="hv-label">Output Sequence (e.g., French translation)</div></div></div>' },
      { h: 'Attention Solves the Bottleneck', body: '<p>Compressing an entire sentence into one fixed context vector loses information for long sequences. <strong>Attention</strong> lets the decoder dynamically focus on relevant encoder positions at each decoding step.</p><ul class="lesson-list"><li>📍 Bahdanau Attention (2015) — first seq2seq attention</li><li>🚀 Led directly to the Transformer architecture (2017)</li><li>✅ Handles long sequences far better</li></ul>' },
    ],
    quiz: { q: 'What problem does attention solve in Seq2Seq models?', opts: ['Slow training', 'Bottleneck of compressing all input into one fixed context vector', 'Overfitting', 'Running out of memory'], ans: 1, exp: 'Attention allows the decoder to look at all encoder states (not just the final context vector) at every decoding step, preserving information from long sequences.' },
    nextLesson: 'bert-gpt', nextLabel: 'BERT, GPT & LLMs'
  },

  'bert-gpt': {
    intro: { icon: '🤖', concept: 'BERT and GPT are landmark pre-trained Transformer models differing in architecture (encoder vs decoder) and primary use case (understanding vs generation).' },
    sections: [
      { h: 'BERT vs GPT Comparison', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🔍</div><h4>BERT</h4><p>Bidirectional encoder. Pre-trained via Masked LM. Best for: classification, NER, Q&amp;A.</p><span class="tag tag-purple">Understanding</span></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">✍️</div><h4>GPT</h4><p>Autoregressive decoder. Pre-trained via next-token prediction. Best for: generation, chat, code.</p><span class="tag tag-blue">Generation</span></div></div><div class="concept-card" style="--cc-color:#f472b6;margin-top:14px"><div class="cc-icon">🌟</div><div class="cc-content"><h3>Modern LLMs</h3><p>GPT-4, Claude, Gemini extend GPT with RLHF alignment, 128K+ token context windows, and multimodal capabilities.</p></div></div>' },
      { h: 'Fine-tuning Strategies', body: '<ul class="lesson-list"><li>🧊 <strong>Zero-Shot</strong>: Use model as-is with a good prompt — no fine-tuning</li><li>🎯 <strong>Few-Shot</strong>: Provide examples in the prompt for in-context learning</li><li>🔧 <strong>Full Fine-tuning</strong>: Train all weights on task-specific labeled data</li><li>⚡ <strong>LoRA / QLoRA</strong>: Efficient fine-tuning — train only low-rank adapter weights (~1% of params)</li></ul>' },
    ],
    quiz: { q: 'What is the key architectural difference between BERT and GPT?', opts: ['BERT is larger than GPT', 'BERT is bidirectional (encoder-only); GPT is autoregressive (decoder-only)', 'GPT uses CNNs; BERT uses RNNs', 'BERT only classifies; GPT only generates'], ans: 1, exp: 'BERT reads the full sentence in both directions (bidirectional encoder), making it great for understanding. GPT predicts the next token left-to-right (autoregressive decoder), making it ideal for generation.' },
    nextLesson: 'cv-intro', nextLabel: 'Computer Vision Intro'
  },

  'cv-intro': {
    intro: { icon: '👁️', concept: 'Computer Vision enables machines to interpret visual information from images and videos — from simple classification to complex scene understanding.' },
    sections: [
      { h: 'Core CV Tasks', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🏷️</div><h4>Image Classification</h4><p>Assign one label to the entire image. "This is a cat."</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">📦</div><h4>Object Detection</h4><p>Locate and classify multiple objects with bounding boxes.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">✂️</div><h4>Segmentation</h4><p>Label every pixel — semantic (class) or instance (individual object).</p></div><div class="type-card"><div class="tc-icon" style="color:#34d399">🏃</div><h4>Pose Estimation</h4><p>Detect body keypoints (joints) to understand human pose and action.</p></div></div>' },
      { h: 'How Computers See Images', body: '<p>Images are 3D tensors: <strong>Height × Width × Channels</strong>. For RGB images, channels = 3, each pixel value 0–255.</p><ul class="lesson-list"><li>🖼️ A 224×224 RGB image = 150,528 numbers</li><li>🔍 CNNs learn filters detecting patterns at different scales</li><li>📊 Data augmentation (flip, rotate, crop, color jitter) expands training data artificially</li></ul>' },
    ],
    quiz: { q: 'What is the difference between object detection and image segmentation?', opts: ['No difference', 'Detection uses bounding boxes; segmentation labels every pixel', 'Segmentation is faster', 'Detection can only find one object'], ans: 1, exp: 'Object detection draws bounding boxes and classifies objects. Segmentation goes further — it assigns a class to every individual pixel for precise object boundary understanding.' },
    nextLesson: 'image-classification', nextLabel: 'Image Classification'
  },

  'image-classification': {
    intro: { icon: '🏷️', concept: 'Image classification assigns a single label to an entire image. Modern classifiers use CNNs pre-trained on ImageNet and fine-tuned for specific tasks.' },
    sections: [
      { h: 'Transfer Learning for Vision', body: '<div class="concept-card" style="--cc-color:#38bdf8"><div class="cc-icon">♻️</div><div class="cc-content"><h3>Why Transfer Learning?</h3><p>Training a CNN from scratch requires millions of labeled images. Instead, start with a model pre-trained on <strong>ImageNet</strong> (1.2M images, 1000 classes) and fine-tune on your specific dataset — even with just a few hundred examples.</p></div></div><ul class="lesson-list" style="margin-top:12px"><li>🧊 Freeze early layers (universal edges, textures)</li><li>🔧 Fine-tune later layers (task-specific features)</li><li>🎯 Replace the final classification head with your number of classes</li></ul>' },
      { h: 'Classic Benchmark Datasets', body: '<div class="apps-showcase"><div class="app-item"><span>🖼️</span><div><strong>ImageNet</strong><p>1.2M images, 1000 classes. The standard CV benchmark since 2010.</p></div></div><div class="app-item"><span>✈️</span><div><strong>CIFAR-10 / 100</strong><p>60K tiny 32×32 images. Great for rapid research experiments.</p></div></div><div class="app-item"><span>🔢</span><div><strong>MNIST</strong><p>70K handwritten digits. The "Hello World" of computer vision.</p></div></div><div class="app-item"><span>🏥</span><div><strong>CheXpert</strong><p>224K chest X-rays for medical AI research.</p></div></div></div>' },
    ],
    quiz: { q: 'Why is ImageNet pre-training useful for custom image classifiers?', opts: ['ImageNet models run faster', 'The model learns universal visual features (edges, textures) transferable to any visual task', 'It reduces the need for a GPU', 'ImageNet images are very small'], ans: 1, exp: 'ImageNet-pretrained models learn rich hierarchical visual features across 1000 categories. These features transfer well to new tasks, allowing good performance with far less task-specific data.' },
    nextLesson: 'object-detection', nextLabel: 'Object Detection'
  },

  'object-detection': {
    intro: { icon: '📦', concept: 'Object detection locates and classifies multiple objects within an image using bounding boxes — combining classification with spatial localization.' },
    sections: [
      { h: 'Detection Architectures', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🐢</div><h4>R-CNN Family</h4><p>Two-stage: propose regions then classify. Accurate, but slower. Faster R-CNN achieves good speed-accuracy balance.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">⚡</div><h4>YOLO</h4><p>One-stage: detects all objects in a single forward pass. Real-time (30+ FPS). YOLOv8 is state-of-the-art.</p><span class="tag tag-green">Real-time</span></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🎯</div><h4>SSD</h4><p>Single Shot MultiBox Detector. Multi-scale detection across feature maps.</p></div></div>' },
      { h: 'Key Metrics for Detection', body: '<ul class="lesson-list"><li>📐 <strong>IoU</strong> (Intersection over Union): Measures overlap between predicted and ground-truth box. IoU &gt; 0.5 counts as correct.</li><li>🎯 <strong>mAP</strong> (mean Average Precision): Average precision across all classes and IoU thresholds — the standard benchmark metric.</li><li>🔢 <strong>Precision vs Recall</strong>: Precision = no false alarms; Recall = no missed detections.</li></ul>' },
    ],
    quiz: { q: 'What makes YOLO faster than R-CNN for object detection?', opts: ['YOLO uses smaller images', 'YOLO detects all objects in a single forward pass vs two separate stages', 'YOLO only detects one object at a time', 'YOLO requires no training'], ans: 1, exp: 'YOLO (You Only Look Once) performs detection in one forward pass, while R-CNN first proposes candidate regions then classifies each one separately — making YOLO order-of-magnitude faster.' },
    nextLesson: 'image-segmentation', nextLabel: 'Image Segmentation'
  },

  'image-segmentation': {
    intro: { icon: '✂️', concept: 'Image segmentation assigns a class label to every pixel in an image — providing precise object boundaries beyond bounding boxes.' },
    sections: [
      { h: 'Types of Segmentation', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎨</div><h4>Semantic Segmentation</h4><p>Classifies every pixel into a category but treats all instances of the same class identically.</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">👥</div><h4>Instance Segmentation</h4><p>Identifies each individual object separately. Two cats = two different masks.<br><span class="tag tag-blue">Mask R-CNN</span></p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">🔬</div><h4>Panoptic Segmentation</h4><p>Combines semantic + instance — segments everything in the scene.<br><span class="tag tag-pink">Most Complete</span></p></div></div>' },
      { h: 'U-Net Architecture', body: '<div class="concept-card" style="--cc-color:#34d399"><div class="cc-icon">🏥</div><div class="cc-content"><h3>U-Net — Medical Imaging Standard</h3><p>U-Net uses an encoder-decoder structure with <strong>skip connections</strong> that pass high-resolution feature maps from encoder to decoder, preserving fine spatial detail. Originally designed for biomedical segmentation and works well with small datasets.</p></div></div>' },
    ],
    quiz: { q: 'What is the difference between semantic and instance segmentation?', opts: ['No difference', 'Instance segmentation distinguishes individual objects; semantic only assigns class per pixel', 'Semantic is more precise', 'Instance segmentation does not use neural networks'], ans: 1, exp: 'Semantic segmentation labels each pixel with a category but cannot distinguish between individual instances. Instance segmentation goes further and gives each object its own unique mask.' },
    nextLesson: 'cv-applications', nextLabel: 'CV Applications & GANs'
  },

  'cv-applications': {
    intro: { icon: '🌐', concept: 'Computer Vision powers real-world applications from autonomous driving to medical diagnostics, and GANs enable photorealistic synthetic image generation.' },
    sections: [
      { h: 'Real-World CV Applications', body: '<div class="apps-showcase"><div class="app-item"><span>🚗</span><div><strong>Autonomous Driving</strong><p>Real-time detection, segmentation of roads, pedestrians, vehicles</p></div></div><div class="app-item"><span>🏥</span><div><strong>Medical Imaging</strong><p>Tumor detection in X-rays and MRIs with radiologist-level accuracy</p></div></div><div class="app-item"><span>🏭</span><div><strong>Quality Control</strong><p>Automated defect detection in manufacturing lines</p></div></div><div class="app-item"><span>🛡️</span><div><strong>Security</strong><p>Face recognition, license plate reading, CCTV anomaly detection</p></div></div><div class="app-item"><span>🛍️</span><div><strong>Retail</strong><p>Amazon Go cashierless stores, virtual fashion try-on</p></div></div><div class="app-item"><span>🌾</span><div><strong>Agriculture</strong><p>Crop disease detection from drone and satellite imagery</p></div></div></div>' },
      { h: 'GANs for Image Generation', body: '<div class="types-grid"><div class="type-card"><div class="tc-icon" style="color:#a78bfa">🎨</div><h4>StyleGAN</h4><p>Generates photorealistic faces. Powers thispersondoesnotexist.com</p></div><div class="type-card"><div class="tc-icon" style="color:#38bdf8">🔊</div><h4>Pix2Pix</h4><p>Image-to-image translation: sketch to photo, day to night.</p></div><div class="type-card"><div class="tc-icon" style="color:#f472b6">✨</div><h4>Stable Diffusion</h4><p>Text-to-image diffusion model. State-of-the-art image quality in 2024.</p></div></div>' },
    ],
    quiz: { q: 'In a GAN, what is the role of the Discriminator?', opts: ['Generate new images', 'Distinguish between real and fake (generated) images', 'Compress images into latent vectors', 'Segment objects in images'], ans: 1, exp: 'The Discriminator is trained as a binary classifier to tell real images from generated ones. Its gradient signal teaches the Generator to produce increasingly realistic images over adversarial training.' },
    nextLesson: null, nextLabel: null
  },
};

// =====================================================
// PERSISTENCE
// =====================================================
const COMPLETED_KEY = 'neurolearn_completed';
function getCompleted() { return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'); }
function markCompleted(lessonId) {
  const comp = getCompleted();
  if (!comp.includes(lessonId)) { comp.push(lessonId); localStorage.setItem(COMPLETED_KEY, JSON.stringify(comp)); }
}
function isCompleted(lessonId) { return getCompleted().includes(lessonId); }

// =====================================================
// LOAD LESSON
// =====================================================
function loadLesson(lessonId) {
  document.querySelectorAll('.lesson-item').forEach(item => {
    item.classList.toggle('active', item.dataset.lesson === lessonId);
  });

  const lesson = lessons[lessonId];
  if (!lesson) { showToast('⚠️ Lesson not found', 'error'); return; }

  // Update header elements
  const titleEl = document.querySelector('.lesson-title');
  const timeEl = document.querySelector('.lh-time');
  const tagEl = document.querySelector('.lh-meta .tag');
  if (titleEl) titleEl.textContent = lesson.title;
  if (timeEl) timeEl.textContent = '\u23f1 ' + lesson.time + ' read';
  if (tagEl) tagEl.textContent = lesson.tag + ' ' + lesson.category;

  window.currentLesson = lessonId;

  // Render rich content if we have it
  const body = document.getElementById('lessonBody');
  const content = LESSON_CONTENT[lessonId];

  if (body && content) {
    const nextBtn = content.nextLesson
      ? '<button class="btn-next" onclick="loadLesson(\'' + content.nextLesson + '\')">' + content.nextLabel + ' \u2192</button>'
      : '';

    const sectionsHTML = content.sections.map(function (s) {
      return '<div class="lesson-section"><h2>' + s.h + '</h2>' + s.body + '</div>';
    }).join('');

    let quizHTML = '';
    if (content.quiz) {
      const q = content.quiz;
      const optsHTML = q.opts.map(function (opt, i) {
        const isAns = (i === q.ans);
        const escapedExp = q.exp.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return '<button class="iq-btn" onclick="checkIQ(this,' + isAns + ',\'' + escapedExp + '\')">' + opt + '</button>';
      }).join('');
      quizHTML = '<div class="lesson-section"><h2>Quick Knowledge Check</h2>'
        + '<div class="inline-quiz" id="inlineQuiz">'
        + '<div class="iq-question">' + q.q + '</div>'
        + '<div class="iq-options">' + optsHTML + '</div>'
        + '<div id="iq-exp" style="display:none;margin-top:14px;padding:14px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.3);border-radius:10px;font-size:0.88rem;color:var(--text-secondary);line-height:1.6"></div>'
        + '</div></div>';
    }

    const completed = isCompleted(lessonId);
    body.innerHTML = '<div class="lesson-intro">'
      + '<div class="concept-card" style="--cc-color:#a78bfa">'
      + '<div class="cc-icon">' + content.intro.icon + '</div>'
      + '<div class="cc-content"><h3>Core Concept</h3><p>' + content.intro.concept + '</p></div>'
      + '</div></div>'
      + sectionsHTML
      + quizHTML
      + '<div class="lesson-actions">'
      + '<button class="btn-complete' + (completed ? ' completed' : '') + '" id="completeBtn"'
      + (completed ? ' disabled' : ' onclick="completeLesson(\'' + lessonId + '\',' + lesson.xp + ')"')
      + '>' + (completed ? '\u2705 Lesson Completed!' : '\u2705 Mark as Complete &amp; Earn XP') + '</button>'
      + nextBtn
      + '</div>';
  } else {
    // Fallback: just update existing static content header
    const prog = document.getElementById('lessonProgress');
    if (prog) setTimeout(function () { prog.style.width = isCompleted(lessonId) ? '100%' : '0%'; }, 100);

    const btn = document.getElementById('completeBtn');
    if (btn) {
      if (isCompleted(lessonId)) {
        btn.textContent = '\u2705 Lesson Completed!';
        btn.classList.add('completed');
        btn.disabled = true;
      } else {
        btn.textContent = '\u2705 Mark as Complete & Earn XP';
        btn.classList.remove('completed');
        btn.disabled = false;
        btn.onclick = function () { completeLesson(lessonId, lesson.xp); };
      }
    }
  }

  showToast('\ud83d\udcd6 Loaded: ' + lesson.title, 'info');
  const contentEl = document.querySelector('.lesson-content');
  if (contentEl) contentEl.scrollTop = 0;
}

function completeLesson(lessonId, xp) {
  lessonId = lessonId || window.currentLesson || 'what-is-ai';
  xp = xp || 50;
  if (isCompleted(lessonId)) return;

  markCompleted(lessonId);
  addXP(xp);
  showToast('\ud83c\udf89 Lesson complete! +' + xp + ' XP earned!', 'success');

  const btn = document.getElementById('completeBtn');
  if (btn) { btn.textContent = '\u2705 Lesson Completed!'; btn.classList.add('completed'); btn.disabled = true; }

  const prog = document.getElementById('lessonProgress');
  if (prog) prog.style.width = '100%';

  const item = document.querySelector('[data-lesson="' + lessonId + '"] .li-status');
  if (item) { item.textContent = '\u2713'; item.classList.add('done'); }
}

function checkIQ(btn, isCorrect, explanation) {
  const allBtns = document.querySelectorAll('#inlineQuiz .iq-btn');
  allBtns.forEach(function (b) { b.disabled = true; });

  if (isCorrect) {
    btn.classList.add('correct');
    btn.textContent += ' \u2713 Correct!';
    addXP(10);
    showToast('\ud83c\udfaf Correct! +10 XP', 'success');
  } else {
    btn.classList.add('wrong');
    btn.textContent += ' \u2717 Wrong';
    allBtns.forEach(function (b) {
      if (b.onclick && b.onclick.toString().includes('true')) b.classList.add('correct');
    });
    showToast('\u274c Not quite! Try again next time.', 'error');
  }

  if (explanation) {
    const expEl = document.getElementById('iq-exp');
    if (expEl) { expEl.textContent = '\ud83d\udca1 ' + explanation; expEl.style.display = 'block'; }
  }
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.lesson-list').forEach(function (list) {
      const section = list.closest('.sidebar-section');
      section.style.display = (filter === 'all' || list.dataset.category === filter) ? 'block' : 'none';
    });
  });
});

// Search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.lesson-item').forEach(function (item) {
      const title = item.querySelector('.li-title').textContent.toLowerCase();
      item.style.display = title.includes(query) ? 'flex' : 'none';
    });
  });
}

// Initialize
window.currentLesson = 'what-is-ai';
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const track = params.get('track');
  if (track) {
    const trackMap = { beginner: 'what-is-ai', intermediate: 'supervised-learning', advanced: 'neural-networks' };
    if (trackMap[track]) loadLesson(trackMap[track]);
  }
  getCompleted().forEach(function (lessonId) {
    const item = document.querySelector('[data-lesson="' + lessonId + '"] .li-status');
    if (item) { item.textContent = '\u2713'; item.classList.add('done'); }
  });
});
