// ============================================================
// NEUROLEARN — AI CHATBOT TUTOR
// Self-contained: injects CSS + HTML, no external deps
// Uses Web Speech API for voice read-aloud
// ============================================================

(function () {
  'use strict';

  // ── CSS ─────────────────────────────────────────────────────
  const CHATBOT_CSS = `
    /* ── Chatbot Toggle Button ── */
    #nlChatToggle {
      position: fixed;
      bottom: 28px;
      left: 28px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a78bfa, #38bdf8);
      border: none;
      cursor: pointer;
      z-index: 9990;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      box-shadow: 0 8px 32px rgba(167,139,250,0.45);
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s;
    }
    #nlChatToggle:hover { transform: scale(1.1) rotate(-5deg); box-shadow: 0 12px 40px rgba(167,139,250,0.6); }
    #nlChatToggle .nlct-badge {
      position: absolute;
      top: -4px; right: -4px;
      width: 18px; height: 18px;
      background: #f472b6;
      border-radius: 50%;
      font-size: 0.6rem;
      font-weight: 800;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #0a0f2e;
      animation: nlPulse 2s infinite;
    }
    @keyframes nlPulse { 0%,100%{box-shadow:0 0 0 0 rgba(244,114,182,0.5)} 50%{box-shadow:0 0 0 8px rgba(244,114,182,0)} }

    /* ── Chatbot Panel ── */
    #nlChatPanel {
      position: fixed;
      bottom: 100px;
      left: 28px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 540px;
      max-height: calc(100vh - 120px);
      background: rgba(10,15,46,0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(167,139,250,0.2);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      z-index: 9991;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
      transform: scale(0.9) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    #nlChatPanel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    .nlcp-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    .nlcp-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg,#a78bfa,#38bdf8);
      display: flex; align-items:center; justify-content:center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .nlcp-info { flex: 1; }
    .nlcp-name { font-size: 0.95rem; font-weight: 700; color: #fff; }
    .nlcp-status { font-size: 0.72rem; color: #34d399; display: flex; align-items: center; gap: 5px; }
    .nlcp-dot { width:6px; height:6px; border-radius:50%; background:#34d399; animation: nlPulse 2s infinite; }
    .nlcp-actions { display: flex; gap: 8px; }
    .nlcp-action-btn {
      width: 30px; height: 30px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.5);
      font-size: 0.9rem;
      cursor: pointer;
      display: flex; align-items:center; justify-content:center;
      transition: all 0.2s;
    }
    .nlcp-action-btn:hover { background: rgba(167,139,250,0.15); color: #a78bfa; border-color: rgba(167,139,250,0.3); }
    .nlcp-action-btn.active { background: rgba(167,139,250,0.2); color: #a78bfa; }

    /* Messages */
    .nlcp-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .nlcp-messages::-webkit-scrollbar { width: 4px; }
    .nlcp-messages::-webkit-scrollbar-track { background: transparent; }
    .nlcp-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .nl-msg {
      display: flex;
      gap: 10px;
      animation: nlMsgIn 0.25s ease;
    }
    @keyframes nlMsgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .nl-msg.user { flex-direction: row-reverse; }
    .nl-msg-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items:center; justify-content:center;
      font-size: 0.85rem;
      flex-shrink: 0;
      background: linear-gradient(135deg,#a78bfa,#38bdf8);
    }
    .nl-msg.user .nl-msg-avatar { background: linear-gradient(135deg,#f472b6,#a78bfa); }
    .nl-msg-bubble {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 0.83rem;
      line-height: 1.55;
      color: rgba(255,255,255,0.9);
    }
    .nl-msg.bot .nl-msg-bubble {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-bottom-left-radius: 4px;
    }
    .nl-msg.user .nl-msg-bubble {
      background: linear-gradient(135deg,rgba(167,139,250,0.25),rgba(56,189,248,0.15));
      border: 1px solid rgba(167,139,250,0.25);
      border-bottom-right-radius: 4px;
    }
    .nl-msg-bubble strong { color: #a78bfa; }
    .nl-msg-bubble code {
      background: rgba(0,0,0,0.4);
      padding: 1px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      color: #38bdf8;
    }
    .nl-voice-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.3);
      font-size: 0.75rem;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s;
    }
    .nl-voice-btn:hover { color: #a78bfa; }
    .nl-voice-btn.speaking { color: #34d399; }

    /* Typing indicator */
    .nl-typing .nl-msg-bubble { display: flex; align-items:center; gap: 5px; padding: 12px 16px; }
    .nl-typing-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,255,255,0.4);
      animation: nlTyping 1.2s infinite;
    }
    .nl-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .nl-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes nlTyping { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }

    /* Quick chips */
    .nlcp-chips {
      padding: 8px 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex-shrink: 0;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .nl-chip {
      padding: 5px 12px;
      background: rgba(167,139,250,0.08);
      border: 1px solid rgba(167,139,250,0.2);
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #a78bfa;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      font-family: 'Outfit', sans-serif;
    }
    .nl-chip:hover { background: rgba(167,139,250,0.18); transform: translateY(-1px); }

    /* Input area */
    .nlcp-input-area {
      display: flex;
      gap: 10px;
      padding: 14px 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    #nlChatInput {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 10px 14px;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 0.83rem;
      outline: none;
      transition: border-color 0.2s;
    }
    #nlChatInput:focus { border-color: rgba(167,139,250,0.4); }
    #nlChatInput::placeholder { color: rgba(255,255,255,0.25); }
    #nlChatSend {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg,#a78bfa,#38bdf8);
      border: none;
      cursor: pointer;
      display: flex; align-items:center; justify-content:center;
      font-size: 1rem;
      transition: transform 0.2s, opacity 0.2s;
      flex-shrink: 0;
    }
    #nlChatSend:hover { transform: scale(1.05); }
    #nlChatSend:disabled { opacity: 0.4; cursor: not-allowed; }

    @media (max-width: 480px) {
      #nlChatPanel { left: 10px; width: calc(100vw - 20px); bottom: 90px; }
      #nlChatToggle { left: 18px; bottom: 20px; }
    }
  `;

  // ── Knowledge Base ───────────────────────────────────────────
  const KB = [
    // Platform navigation
    { p: ['where','find','go','navigate','page'], k: ['learn','lesson','course','module','topic'],
      r: '📚 Head to the <strong>Learn</strong> page for structured lessons! It has 3 tracks: <strong>Beginner → Intermediate → Advanced</strong>, covering everything from AI basics to deep learning. Click "Learn" in the navbar.' },
    { p: ['playground','code','python','run','execute','write'],
      r: '💻 The <strong>Playground</strong> page lets you write and run Python-like ML code right in your browser! It has 8 pre-built templates: Linear Regression, KNN, Neural Networks, and more. Try pressing <code>Ctrl+Enter</code> to run!' },
    { p: ['game','play','fun','interactive','mini'],
      r: '🎮 Check out the <strong>Mini Games</strong> page! You can play:\n• <strong>Gradient Descent</strong> — roll a ball down a loss landscape\n• <strong>Data Sorter</strong> — classify data points\n• <strong>Neuron Builder</strong> — wire up a neural net\n• <strong>K-Means</strong> — watch clustering live\n• <strong>Bias Buster</strong> — fix unfair datasets\n• <strong>Perceptron</strong> — train a single neuron' },
    { p: ['quiz','test','assessment','question','mcq'],
      r: '🎯 The <strong>Quiz</strong> page has 30+ questions across 4 modes: AI Foundations, Machine Learning, Deep Learning, and Mixed. You have 20 seconds per question and earn XP for correct answers — streaks give bonus XP!' },
    { p: ['simulate','simulation','real world','spam','sentiment','stock'],
      r: '🔬 The <strong>Simulate</strong> page has 6 real-world AI demos:\n• 📧 Spam Detector (Naive Bayes)\n• 😊 Sentiment Analysis\n• 🏠 House Price Predictor\n• ✏️ Digit Recognizer (draw on canvas!)\n• 🖼️ Image Classifier (ResNet)\n• 📈 Stock Predictor (LSTM)' },
    { p: ['xp','badge','streak','leaderboard','rank','gamif'],
      r: '🏆 The XP & gamification system: every lesson, quiz, game, and simulation earns XP. You unlock 8 badges (🏆⚡🤖🔥🧠🎯🔮🌊). Check the leaderboard on the home page to see your rank!' },
    { p: ['login','register','signup','sign in','account','auth'],
      r: '🔐 Click the <strong>Login</strong> button in the navbar to sign up or log in! Registration gives you +100 bonus XP. Your progress (XP, completed lessons) is saved to your account.' },
    { p: ['badge','achievement','unlock'],
      r: '🎖️ There are 8 badges to unlock based on your XP:\n• 🏆 AI Pioneer (0 XP)\n• ⚡ Quick Learner (100 XP)\n• 🤖 Bot Builder (200 XP)\n• 🔥 7-Day Streak (300 XP)\n• 🧠 Neuro Master (500 XP)\n• 🎯 Quiz Champion (1000 XP)\n• 🔮 Data Wizard (1500 XP)\n• 🌊 Deep Diver (2000 XP)' },

    // AI/ML Concepts
    { p: ['what is ai','what is artificial intelligence','define ai','explain ai'],
      r: '🤖 <strong>Artificial Intelligence (AI)</strong> is the simulation of human intelligence by machines. It includes reasoning, learning, problem-solving, perception, and language understanding.\n\nKey branches: <strong>Machine Learning</strong>, Deep Learning, NLP, Computer Vision, and Robotics.' },
    { p: ['what is ml','what is machine learning','define ml','explain ml','machine learning'],
      r: '📊 <strong>Machine Learning (ML)</strong> is a subset of AI where systems <em>learn from data</em> without being explicitly programmed.\n\n<strong>3 main types:</strong>\n• <strong>Supervised</strong> — learns from labeled data (e.g., spam detection)\n• <strong>Unsupervised</strong> — finds patterns in unlabeled data (e.g., clustering)\n• <strong>Reinforcement</strong> — learns by trial and error (e.g., game AI)' },
    { p: ['deep learning','neural network','what is deep learning'],
      r: '🧠 <strong>Deep Learning</strong> uses multi-layered Neural Networks (called "deep" because of many hidden layers).\n\nEach layer learns increasingly abstract features. For images: edges → shapes → objects.\n\nKey architectures: <strong>CNN</strong> (images), <strong>RNN/LSTM</strong> (sequences), <strong>Transformer</strong> (language).' },
    { p: ['neural network','how neural','neuron','perceptron'],
      r: '⚡ A <strong>Neural Network</strong> mimics the brain:\n\n• <strong>Neurons</strong> receive inputs, apply weights, add bias, pass through an activation function\n• <strong>Layers</strong>: Input → Hidden(s) → Output\n• <strong>Training</strong>: Forward pass (predict) → Calculate loss → Backpropagation → Update weights\n\nFormula: <code>output = activation(W·x + b)</code>' },
    { p: ['gradient descent','optimization','learning rate'],
      r: '⛰️ <strong>Gradient Descent</strong> finds the minimum of the loss function by iteratively stepping in the direction of steepest descent.\n\n<code>w = w - α · ∂L/∂w</code>\n\n• <strong>α (learning rate)</strong>: Step size — too large = overshoot, too small = slow\n• <strong>SGD</strong>: One sample at a time\n• <strong>Mini-batch</strong>: Small batches (most common)\n• <strong>Adam</strong>: Adaptive learning rates (best default)' },
    { p: ['backpropagation','backprop','how does training work'],
      r: '🔄 <strong>Backpropagation</strong> is the algorithm that trains neural networks:\n\n1. <strong>Forward pass</strong>: Compute predictions\n2. <strong>Compute loss</strong>: e.g., MSE or Cross-Entropy\n3. <strong>Backward pass</strong>: Compute gradients using chain rule\n4. <strong>Update weights</strong>: <code>w -= lr × gradient</code>\n\nThis repeats for many epochs until loss is minimized.' },
    { p: ['overfitting','underfitting','regularization','dropout'],
      r: '⚖️ <strong>Overfitting</strong> = model memorizes training data, fails on new data (high variance)\n<strong>Underfitting</strong> = model is too simple to capture patterns (high bias)\n\n<strong>Solutions for Overfitting:</strong>\n• <strong>Dropout</strong>: Randomly zero out neurons during training\n• <strong>L1/L2 Regularization</strong>: Penalize large weights\n• <strong>More data</strong> / Data augmentation\n• <strong>Early stopping</strong>: Stop before overfitting' },
    { p: ['activation function','relu','sigmoid','softmax','tanh'],
      r: '🔧 <strong>Activation Functions</strong> add non-linearity:\n\n• <strong>ReLU</strong>: <code>max(0,x)</code> — Most popular for hidden layers\n• <strong>Sigmoid</strong>: <code>1/(1+e^-x)</code> → [0,1] — Binary classification\n• <strong>Softmax</strong>: Converts to probabilities — Multi-class output\n• <strong>Tanh</strong>: <code>(e^x - e^-x)/(e^x + e^-x)</code> → [-1,1]\n\nReLU is the default choice — it avoids vanishing gradients.' },
    { p: ['cnn','convolutional','image classification','computer vision'],
      r: '🖼️ <strong>CNN (Convolutional Neural Network)</strong> is designed for images:\n\n• <strong>Convolution layer</strong>: Applies filters to detect features (edges, textures)\n• <strong>Pooling layer</strong>: Reduces spatial dimensions (Max Pool)\n• <strong>Fully Connected</strong>: Final classification\n\nFamous CNNs: <strong>LeNet → AlexNet → VGG → ResNet → EfficientNet</strong>\n\nResNet-50 achieves ~76% accuracy on ImageNet!' },
    { p: ['rnn','lstm','recurrent','sequence','time series'],
      r: '📈 <strong>RNN/LSTM</strong> handles sequential data (text, time series, speech):\n\n• <strong>RNN</strong>: Hidden state carries context through sequence, but suffers from vanishing gradients\n• <strong>LSTM (Long Short-Term Memory)</strong>: Uses <em>gates</em> (input, forget, output) to control information flow\n• <strong>GRU</strong>: Simpler version of LSTM, fewer parameters\n\nUsed for: stock prediction, language modeling, translation.' },
    { p: ['transformer','attention','bert','gpt','llm'],
      r: '🤯 <strong>Transformers</strong> revolutionized AI (2017 "Attention is All You Need"):\n\n• <strong>Self-Attention</strong>: Each token attends to all others — no recurrence needed\n• <strong>BERT</strong>: Bidirectional encoder — great for understanding\n• <strong>GPT</strong>: Decoder-only — great for generation\n\nTransformers power: ChatGPT, DALL-E, Gemini, GitHub Copilot. They\'re the foundation of modern AI!' },
    { p: ['naive bayes','bayes theorem','bayesian'],
      r: '📧 <strong>Naive Bayes</strong> applies Bayes\' theorem assuming feature independence:\n\n<code>P(class|features) ∝ P(class) × ∏P(feature|class)</code>\n\n"Naive" = assumes features are conditionally independent (rarely true, but works great in practice!)\n\nBest for: <strong>Text classification, spam detection, sentiment analysis</strong>. Fast and simple.' },
    { p: ['linear regression','regression','predict value','continuous'],
      r: '📐 <strong>Linear Regression</strong> predicts continuous values:\n\n<code>ŷ = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ</code>\n\n• Minimizes <strong>MSE (Mean Squared Error)</strong>\n• <strong>R²</strong> measures goodness of fit (1.0 = perfect)\n• Assumes linear relationship between features and target\n\nTry it in the Playground → "Linear Regression" template!' },
    { p: ['logistic regression','classification','binary'],
      r: '🎯 <strong>Logistic Regression</strong> classifies binary outcomes (0 or 1):\n\n• Applies <strong>sigmoid</strong> to linear model: <code>P(y=1) = σ(w·x + b)</code>\n• Decision boundary at P = 0.5\n• Uses <strong>Cross-Entropy loss</strong> instead of MSE\n• Despite the name, it\'s a *classification* algorithm!\n\nExtended to multi-class via <strong>Softmax Regression</strong>.' },
    { p: ['decision tree','random forest','ensemble','boosting'],
      r: '🌳 <strong>Decision Trees</strong> split data based on feature thresholds:\n\n• Each node = a question (e.g., "age > 30?")\n• Leaf = final class prediction\n• Prone to overfitting alone\n\n<strong>Ensemble methods</strong> fix this:\n• <strong>Random Forest</strong>: Many trees, majority vote\n• <strong>XGBoost/Gradient Boosting</strong>: Trees built sequentially to fix errors\n\nRandom Forest & XGBoost win most Kaggle tabular competitions!' },
    { p: ['k-means','clustering','unsupervised learning'],
      r: '🔵 <strong>K-Means Clustering</strong> groups data into K clusters:\n\n1. Initialize K centroids randomly\n2. Assign each point to the nearest centroid\n3. Recompute centroids as cluster mean\n4. Repeat until convergence\n\nKey challenge: choosing K. Use the <strong>Elbow Method</strong> (plot inertia vs K). Try the K-Means game on the Games page!' },
    { p: ['knn','k nearest neighbor','k-nearest'],
      r: '🔍 <strong>KNN (K-Nearest Neighbors)</strong>:\n\n• No training phase — just stores data\n• For prediction: find K nearest points by distance (Euclidean/Manhattan)\n• Classification: majority vote of K neighbors\n• Regression: average of K neighbors\n\nChoosing K: odd numbers avoid ties, K=5 is a common default.\nTry it in the Playground → "KNN Classifier"!' },
    { p: ['svm','support vector machine','kernel'],
      r: '⚡ <strong>SVM (Support Vector Machine)</strong> finds the optimal hyperplane that maximizes the margin between classes:\n\n• <strong>Support vectors</strong>: Points closest to the boundary\n• <strong>Kernel trick</strong>: Maps data to higher dimensions (RBF, polynomial) for non-linear classification\n• Works great for high-dimensional data (text classification)\n\nSVM with RBF kernel is powerful for small-medium datasets.' },
    { p: ['natural language processing','nlp','text','sentiment','language model'],
      r: '💬 <strong>NLP (Natural Language Processing)</strong> helps machines understand human language:\n\n• <strong>Tokenization</strong>: Split text into words/tokens\n• <strong>Embeddings</strong>: Represent words as vectors (Word2Vec, GloVe, BERT)\n• <strong>Tasks</strong>: Sentiment analysis, translation, summarization, Q&A\n\nModern NLP is dominated by <strong>Transformers</strong> (BERT, GPT, T5). Try the Sentiment Analysis simulation!' },
    { p: ['epoch','batch','iteration','training process'],
      r: '🔄 Training terminology:\n\n• <strong>Epoch</strong>: One full pass through the entire training dataset\n• <strong>Batch size</strong>: Number of samples per gradient update\n• <strong>Iteration</strong>: One gradient update step\n\nRelationship: <code>iterations = dataset_size / batch_size</code>\n\nTypically train for 10-1000 epochs depending on dataset size and model complexity.' },
    { p: ['loss function','cost function','mse','cross entropy'],
      r: '📉 <strong>Loss Functions</strong> measure prediction error:\n\n• <strong>MSE</strong>: <code>Σ(y - ŷ)² / n</code> — Regression\n• <strong>MAE</strong>: <code>Σ|y - ŷ| / n</code> — Robust to outliers\n• <strong>Cross-Entropy</strong>: <code>-Σ y log(ŷ)</code> — Classification\n• <strong>Binary Cross-Entropy</strong>: For binary classification\n\nThe loss function defines what the model optimizes for.' },
    { p: ['precision','recall','f1','accuracy','metric','evaluation'],
      r: '📊 <strong>Classification Metrics</strong>:\n\n• <strong>Accuracy</strong>: <code>(TP+TN)/(TP+TN+FP+FN)</code> — misleading with imbalanced data\n• <strong>Precision</strong>: <code>TP/(TP+FP)</code> — minimize false positives\n• <strong>Recall</strong>: <code>TP/(TP+FN)</code> — minimize false negatives\n• <strong>F1 Score</strong>: <code>2×(P×R)/(P+R)</code> — balance of both\n• <strong>AUC-ROC</strong>: Overall classifier quality\n\nFor medical diagnosis: prioritize Recall (catch all disease cases).' },
    { p: ['train test split','validation','cross validation'],
      r: '🔀 <strong>Data Splitting</strong> prevents overfitting evaluation:\n\n• <strong>Train set</strong>: Model learns from this (~70-80%)\n• <strong>Validation set</strong>: Tune hyperparameters (~10-15%)\n• <strong>Test set</strong>: Final unbiased evaluation (~10-20%)\n\n<strong>K-Fold Cross Validation</strong>: Split into K folds, train on K-1, validate on 1, rotate. More reliable estimate of generalization.' },
    { p: ['feature engineering','feature selection','dimensionality reduction','pca'],
      r: '🔧 <strong>Feature Engineering</strong> — transforming raw data into useful features:\n\n• <strong>Normalization/Scaling</strong>: StandardScaler, MinMaxScaler\n• <strong>One-hot encoding</strong>: Convert categories to binary columns\n• <strong>PCA</strong>: Reduce dimensions while preserving variance\n• <strong>Feature selection</strong>: Remove irrelevant features (correlation, importance)\n\nGood features often matter more than algorithm choice!' },
    { p: ['gan','generative','diffusion','image generation'],
      r: '🎨 <strong>Generative AI</strong>:\n\n• <strong>GAN (Generative Adversarial Network)</strong>: Generator vs Discriminator game — creates realistic images, faces, art\n• <strong>VAE (Variational Autoencoder)</strong>: Learns latent space representations\n• <strong>Diffusion Models</strong>: Add noise then learn to remove it — powers DALL-E, Stable Diffusion, Midjourney\n• <strong>LLMs</strong>: GPT-4, Gemini, Claude — predict next token at scale' },
    { p: ['hello','hi','hey','greet','howdy'],
      r: '👋 Hey there! I\'m <strong>NeuroBot</strong>, your AI learning assistant.\n\nI can help you with:\n• 🤖 AI/ML concept explanations\n• 📚 Navigating the NeuroLearn platform\n• 💡 Tips for the playground, games & quizzes\n• 🔬 Understanding simulations\n\nWhat would you like to learn today?' },
    { p: ['thank','thanks','great','awesome','helpful','good'],
      r: '😊 Glad I could help! Keep exploring NeuroLearn — every lesson, game, and quiz earns you XP and brings you closer to becoming an AI expert! 🚀\n\nAnything else you\'d like to know?' },
    { p: ['help','what can you do','what do you know'],
      r: '🧠 I can explain:\n\n<strong>Concepts:</strong> Neural networks, CNN, RNN, Transformers, Gradient Descent, Backprop, Overfitting, Regularization, SVM, KNN, Decision Trees, K-Means, NLP, GAN, Diffusion...\n\n<strong>Platform:</strong> Where to find lessons, how to use the playground, games tips, quiz strategy, XP & badges\n\nJust ask me anything! 💬' },
  ];

  // Context chips per page
  const PAGE_CHIPS = {
    'index.html':      ['What is AI?','How to earn XP?','Show me badges','What is deep learning?'],
    'learn.html':      ['Explain neural networks','What is backprop?','Overfitting tips','Best activation?'],
    'games.html':      ['How does gradient descent work?','Explain k-means','What is a perceptron?','How neural nets learn?'],
    'quiz.html':       ['Quiz tips','What is precision vs recall?','Explain cross-entropy','CNN vs RNN'],
    'playground.html': ['Python ML tips','What is linear regression?','How KNN works?','Explain decision tree'],
    'simulate.html':   ['How does Naive Bayes work?','Explain LSTM','What is ResNet?','How digit recognition works?'],
  };
  const DEFAULT_CHIPS = ['What is AI?','Explain neural networks','What is overfitting?','How does backprop work?'];

  function getPageChips() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return PAGE_CHIPS[page] || DEFAULT_CHIPS;
  }

  function findAnswer(query) {
    const q = query.toLowerCase().trim();
    let bestScore = 0;
    let bestResponse = null;

    for (const entry of KB) {
      let score = 0;
      // Check primary patterns
      if (entry.p) {
        for (const pat of entry.p) {
          if (q.includes(pat)) score += 3;
          else if (pat.split(' ').some(word => q.includes(word) && word.length > 3)) score += 1;
        }
      }
      // Check keyword boost
      if (entry.k) {
        for (const kw of entry.k) {
          if (q.includes(kw)) score += 2;
        }
      }
      if (score > bestScore) { bestScore = score; bestResponse = entry.r; }
    }

    if (bestScore >= 2) return bestResponse;
    return null;
  }

  // ── State ────────────────────────────────────────────────────
  let voiceEnabled = true;
  let speaking = false;

  // ── Voice ────────────────────────────────────────────────────
  function speak(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, '').replace(/[•·]/g, '').replace(/\n+/g, '. ');
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 1.0; utt.pitch = 1.05; utt.volume = 0.9;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    utt.onstart  = () => { speaking = true; };
    utt.onend    = () => { speaking = false; };
    speechSynthesis.speak(utt);
  }

  function stopSpeak() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    speaking = false;
  }

  // ── DOM Helpers ──────────────────────────────────────────────
  function addMessage(text, role, autoSpeak = false) {
    const msgs = document.getElementById('nlMessages');
    if (!msgs) return;

    const div = document.createElement('div');
    div.className = `nl-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'nl-msg-avatar';
    avatar.textContent = role === 'bot' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'nl-msg-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    if (role === 'bot') {
      const voiceBtn = document.createElement('button');
      voiceBtn.className = 'nl-voice-btn';
      voiceBtn.innerHTML = '🔊 Read aloud';
      voiceBtn.onclick = () => {
        if (speaking) { stopSpeak(); voiceBtn.textContent = '🔊 Read aloud'; voiceBtn.classList.remove('speaking'); }
        else { speak(text); voiceBtn.innerHTML = '⏹ Stop'; voiceBtn.classList.add('speaking'); setTimeout(() => { voiceBtn.innerHTML = '🔊 Read aloud'; voiceBtn.classList.remove('speaking'); }, text.length * 55); }
      };
      bubble.appendChild(voiceBtn);
      div.appendChild(avatar);
      div.appendChild(bubble);
    } else {
      div.appendChild(bubble);
      div.appendChild(avatar);
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;

    if (autoSpeak && voiceEnabled && role === 'bot') {
      setTimeout(() => speak(text), 300);
    }
    return div;
  }

  function showTyping() {
    const msgs = document.getElementById('nlMessages');
    const div = document.createElement('div');
    div.className = 'nl-msg bot nl-typing';
    div.id = 'nlTyping';
    const avatar = document.createElement('div');
    avatar.className = 'nl-msg-avatar'; avatar.textContent = '🤖';
    const bubble = document.createElement('div');
    bubble.className = 'nl-msg-bubble';
    bubble.innerHTML = '<div class="nl-typing-dot"></div><div class="nl-typing-dot"></div><div class="nl-typing-dot"></div>';
    div.appendChild(avatar); div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('nlTyping');
    if (t) t.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    const input = document.getElementById('nlChatInput');
    if (input) input.value = '';
    const send = document.getElementById('nlChatSend');
    if (send) send.disabled = true;

    addMessage(text, 'user');
    showTyping();

    setTimeout(() => {
      hideTyping();
      const answer = findAnswer(text);
      const response = answer || `🤔 Hmm, I'm not sure about that specific topic yet! Try asking about:\n\n• Neural networks, CNN, RNN, Transformers\n• Gradient descent, backpropagation, loss functions\n• Overfitting, regularization, dropout\n• SVM, KNN, Decision Trees, K-Means\n• Or navigate using the chips below!\n\nYou can also explore the <strong>Learn</strong> page for in-depth lessons.`;
      addMessage(response, 'bot', false);
      if (send) send.disabled = false;
    }, 600 + Math.random() * 400);
  }

  // ── Build UI ─────────────────────────────────────────────────
  function buildChatbot() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CHATBOT_CSS;
    document.head.appendChild(style);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'nlChatToggle';
    toggle.setAttribute('aria-label', 'Open AI Tutor Chat');
    toggle.innerHTML = '🤖<span class="nlct-badge">AI</span>';
    document.body.appendChild(toggle);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'nlChatPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'AI Tutor Chatbot');
    panel.innerHTML = `
      <div class="nlcp-header">
        <div class="nlcp-avatar">🤖</div>
        <div class="nlcp-info">
          <div class="nlcp-name">NeuroBot</div>
          <div class="nlcp-status"><span class="nlcp-dot"></span>AI Tutor · Always available</div>
        </div>
        <div class="nlcp-actions">
          <button class="nlcp-action-btn active" id="nlVoiceToggle" title="Toggle voice">🔊</button>
          <button class="nlcp-action-btn" id="nlClearChat" title="Clear chat">🗑️</button>
          <button class="nlcp-action-btn" id="nlCloseChat" title="Close">✕</button>
        </div>
      </div>
      <div class="nlcp-messages" id="nlMessages"></div>
      <div class="nlcp-chips" id="nlChips"></div>
      <div class="nlcp-input-area">
        <input type="text" id="nlChatInput" placeholder="Ask me anything about AI/ML..." autocomplete="off" />
        <button id="nlChatSend">→</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Chips
    const chipsEl = document.getElementById('nlChips');
    const chips = getPageChips();
    chips.forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'nl-chip';
      btn.textContent = chip;
      btn.onclick = () => sendMessage(chip);
      chipsEl.appendChild(btn);
    });

    // Events
    toggle.onclick = () => {
      const isOpen = panel.classList.toggle('open');
      toggle.innerHTML = isOpen ? '✕<span class="nlct-badge">AI</span>' : '🤖<span class="nlct-badge">AI</span>';
      if (isOpen && document.getElementById('nlMessages').children.length === 0) {
        setTimeout(() => {
          addMessage('👋 Hi! I\'m <strong>NeuroBot</strong>, your AI learning tutor!\n\nI can explain <strong>AI/ML concepts</strong>, help you navigate the platform, or give tips for games and quizzes.\n\nWhat would you like to explore today? 🚀', 'bot', true);
        }, 200);
      }
    };

    document.getElementById('nlCloseChat').onclick = () => {
      panel.classList.remove('open');
      toggle.innerHTML = '🤖<span class="nlct-badge">AI</span>';
    };

    document.getElementById('nlClearChat').onclick = () => {
      const msgs = document.getElementById('nlMessages');
      msgs.innerHTML = '';
      addMessage('Chat cleared! Ask me anything about AI & ML 🤖', 'bot');
    };

    document.getElementById('nlVoiceToggle').onclick = function () {
      voiceEnabled = !voiceEnabled;
      this.textContent = voiceEnabled ? '🔊' : '🔇';
      this.classList.toggle('active', voiceEnabled);
      if (!voiceEnabled) stopSpeak();
    };

    const input = document.getElementById('nlChatInput');
    const sendBtn = document.getElementById('nlChatSend');
    sendBtn.onclick = () => sendMessage(input.value);
    input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); } };

    // Pre-load voices
    if (window.speechSynthesis) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }
})();
