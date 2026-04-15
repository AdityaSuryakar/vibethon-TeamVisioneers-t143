// quiz.js — Full adaptive quiz system with 30+ questions

const QUIZ_BANK = {
  foundations: [
    { q: "What does AI stand for?", opts: ["Automated Intelligence", "Artificial Intelligence", "Applied Intelligence", "Algorithmic Interface"], ans: 1, exp: "AI stands for Artificial Intelligence — the simulation of human-like intelligence in machines." },
    { q: "Which of the following is NOT a type of machine learning?", opts: ["Supervised Learning", "Reinforcement Learning", "Deterministic Learning", "Unsupervised Learning"], ans: 2, exp: "The three main types of ML are Supervised, Unsupervised, and Reinforcement Learning. 'Deterministic Learning' is not a type." },
    { q: "What is the Turing Test used for?", opts: ["Testing computer speed", "Measuring internet bandwidth", "Determining if a machine can exhibit intelligent behavior", "Evaluating software bugs"], ans: 2, exp: "The Turing Test, proposed by Alan Turing in 1950, evaluates whether a machine can exhibit intelligent behavior indistinguishable from that of a human." },
    { q: "Which math concept is MOST fundamental for ML?", opts: ["Calculus and Linear Algebra", "Geometry only", "Trigonometry only", "Number Theory"], ans: 0, exp: "Calculus (for gradients/backprop) and Linear Algebra (for matrices/vectors) are the most essential math foundations for ML." },
    { q: "What is 'training data' in machine learning?", opts: ["Data used to test the model", "The labeled examples used to teach the model", "Random data generated for testing", "The output predictions of a model"], ans: 1, exp: "Training data is the labeled dataset used to teach the model to recognize patterns and make predictions." },
    { q: "Which is an example of Narrow AI (ANI)?", opts: ["A robot that can do all human tasks", "A chess engine that plays chess", "A system that surpasses human intelligence", "A fictional AI from movies"], ans: 1, exp: "A chess engine is Narrow AI — optimized for one specific task. All current AI systems are Narrow AI." },
    { q: "What is overfitting in ML?", opts: ["A model that performs poorly on all data", "A model too simple for the data", "A model that memorizes training data but fails on new data", "A model trained on too little data"], ans: 2, exp: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new, unseen data." },
    { q: "What is the purpose of a 'test set' in ML?", opts: ["To train the model", "To tune hyperparameters", "To evaluate final model performance on unseen data", "To visualize data distributions"], ans: 2, exp: "The test set is held out completely during training and used only for final evaluation of the model's real-world performance." },
    { q: "Which Python library is commonly used for data manipulation in ML?", opts: ["Django", "Pandas", "Flask", "Pygame"], ans: 1, exp: "Pandas is the go-to Python library for data manipulation, cleaning, and analysis in ML workflows." },
    { q: "What is the 'bias-variance tradeoff'?", opts: ["Choosing between accuracy and speed", "Balance between underfitting (high bias) and overfitting (high variance)", "Tradeoff between dataset size and model complexity", "Choosing between precision and recall"], ans: 1, exp: "The bias-variance tradeoff describes the tension between underfitting (too simple = high bias) and overfitting (too complex = high variance)." },
  ],
  ml: [
    { q: "In linear regression, what are we trying to minimize?", opts: ["Cross-entropy loss", "Mean Squared Error (MSE)", "Accuracy", "F1 Score"], ans: 1, exp: "Linear regression minimizes Mean Squared Error (MSE) — the average of squared differences between predicted and actual values." },
    { q: "What does 'k' represent in k-Nearest Neighbors (KNN)?", opts: ["Number of features", "Number of training samples", "Number of nearest neighbors to consider", "Number of output classes"], ans: 2, exp: "In KNN, 'k' is the number of nearest training examples used to make a prediction for a new data point." },
    { q: "What is the kernel trick in SVMs used for?", opts: ["Reducing model size", "Mapping data to higher dimensions to find linear separations", "Regularizing weights", "Speeding up training"], ans: 1, exp: "The kernel trick implicitly maps data to a higher-dimensional space where it becomes linearly separable, without explicitly computing the transformation." },
    { q: "What is entropy used for in Decision Trees?", opts: ["Measuring information gain for splitting", "Measuring model accuracy", "Regularizing leaf nodes", "Defining tree depth"], ans: 0, exp: "Entropy measures the impurity of a node. Decision trees use information gain (reduction in entropy) to select the best feature to split on." },
    { q: "Which algorithm uses 'ensemble' of decision trees?", opts: ["Linear Regression", "K-Means clustering", "Random Forest", "Naive Bayes"], ans: 2, exp: "Random Forest is an ensemble method that trains many decision trees on random subsets of data and aggregates their predictions." },
    { q: "What is 'gradient descent' used for?", opts: ["Data preprocessing", "Splitting datasets", "Minimizing the loss function by updating weights", "Feature selection"], ans: 2, exp: "Gradient descent is an optimization algorithm that iteratively updates model weights in the direction of steepest descent of the loss function." },
    { q: "In K-Means clustering, what is a 'centroid'?", opts: ["An outlier data point", "The center point representing each cluster", "The boundary between clusters", "A noise point in the data"], ans: 1, exp: "A centroid is the geometric center of a cluster in K-Means. The algorithm iteratively repositions centroids to minimize within-cluster distance." },
    { q: "What is cross-validation used for?", opts: ["Data augmentation", "Robust model evaluation by testing on multiple data splits", "Feature engineering", "Hyperparameter initialization"], ans: 1, exp: "Cross-validation (e.g., k-fold) evaluates model performance by training and testing on different subsets of data, giving a more robust estimate." },
    { q: "Which metric is best for imbalanced classification datasets?", opts: ["Accuracy", "Mean Squared Error", "F1 Score or AUC-ROC", "R² Score"], ans: 2, exp: "For imbalanced datasets, accuracy can be misleading. F1 Score (harmonic mean of precision/recall) or AUC-ROC are better metrics." },
    { q: "What is regularization in machine learning?", opts: ["A method to increase model complexity", "Technique to prevent overfitting by adding a penalty term to the loss", "Data normalization technique", "Algorithm for clustering"], ans: 1, exp: "Regularization (L1/L2) adds a penalty for large weights to the loss function, discouraging overly complex models and reducing overfitting." },
  ],
  dl: [
    { q: "What is the 'activation function' in a neural network?", opts: ["Function that initializes weights", "A non-linear function applied to neuron outputs", "The loss function", "A data normalization step"], ans: 1, exp: "Activation functions (ReLU, sigmoid, tanh) introduce non-linearity, allowing neural networks to learn complex patterns beyond linear relationships." },
    { q: "What does 'backpropagation' do?", opts: ["Feeds data forward through the network", "Computes gradients and updates weights using chain rule", "Initializes network weights randomly", "Normalizes layer inputs"], ans: 1, exp: "Backpropagation computes gradients of the loss with respect to each weight using the chain rule, enabling gradient descent to update weights." },
    { q: "What is the vanishing gradient problem?", opts: ["Gradients becoming too large in deep networks", "Gradients becoming nearly zero, preventing weight updates in early layers", "GPU memory running out during training", "Model weights exploding to infinity"], ans: 1, exp: "In deep networks, gradients can become exponentially small during backpropagation, causing early layers to learn very slowly or not at all." },
    { q: "What is a Convolutional Neural Network (CNN) primarily used for?", opts: ["Text generation", "Time series prediction", "Image recognition and processing", "Reinforcement learning"], ans: 2, exp: "CNNs use convolutional layers to detect spatial patterns (edges, shapes, textures) in images, making them ideal for computer vision tasks." },
    { q: "What is 'dropout' in neural networks?", opts: ["Removing neurons permanently", "A regularization technique that randomly deactivates neurons during training", "Removing low-importance features", "Reducing batch size"], ans: 1, exp: "Dropout randomly deactivates a fraction of neurons during each training step, forcing the network to learn redundant representations and reducing overfitting." },
    { q: "What is the 'attention mechanism' in Transformers?", opts: ["A way to visualize model weights", "Computing weighted importance of different input elements for each output", "A method to reduce model size", "A type of convolutional operation"], ans: 1, exp: "The attention mechanism computes how much each input token should 'attend to' other tokens, capturing long-range dependencies without recurrence." },
    { q: "What is a GAN (Generative Adversarial Network)?", opts: ["A network trained on labeled data only", "Two networks competing — generator creates data, discriminator distinguishes real from fake", "A type of clustering algorithm", "A reinforcement learning architecture"], ans: 1, exp: "GANs consist of a Generator (creates fake data) and Discriminator (distinguishes real from fake) that train adversarially to generate realistic synthetic data." },
    { q: "What problem do LSTMs solve compared to basic RNNs?", opts: ["LSTMs are faster to train", "LSTMs solve the vanishing gradient problem for long sequences", "LSTMs use less memory", "LSTMs work better for images"], ans: 1, exp: "LSTMs (Long Short-Term Memory) use gating mechanisms (forget, input, output gates) to selectively retain information, solving the vanishing gradient problem in long sequences." },
    { q: "What is transfer learning?", opts: ["Moving a model to a different computer", "Using a pre-trained model's knowledge as a starting point for a new task", "Translating a model to a different programming language", "Training a model on multiple datasets simultaneously"], ans: 1, exp: "Transfer learning reuses knowledge from a model pre-trained on a large dataset (e.g., ImageNet) as the starting point for a different but related task." },
    { q: "What is 'batch normalization' used for?", opts: ["Splitting data into batches", "Normalizing layer inputs to speed up training and stabilize learning", "Increasing the batch size", "Selecting a subset of features"], ans: 1, exp: "Batch normalization normalizes the inputs to each layer, reducing internal covariate shift, enabling higher learning rates and faster, more stable training." },
  ],
  nlp: [
    { q: "What does NLP stand for?", opts: ["Neural Learning Process", "Natural Language Processing", "Numeric Logic Programming", "Network Layer Protocol"], ans: 1, exp: "NLP stands for Natural Language Processing — the branch of AI that enables machines to understand, interpret, and generate human language." },
    { q: "What is 'tokenization' in NLP?", opts: ["Assigning security tokens", "Splitting text into smaller units like words or subwords", "Encrypting text data", "Converting text to images"], ans: 1, exp: "Tokenization splits raw text into tokens (words, subwords, or characters) that can be converted into numerical representations a model can process." },
    { q: "What does Word2Vec learn?", opts: ["Grammatical rules", "Dense vector representations where similar words are geometrically close", "Image features from text", "Sentence length distributions"], ans: 1, exp: "Word2Vec maps words to dense vectors where semantically similar words cluster together, enabling arithmetic like 'king − man + woman ≈ queen'." },
    { q: "What is 'sentiment analysis' used for?", opts: ["Analyzing network traffic", "Classifying the emotional tone of text", "Recognizing faces in images", "Translating code between languages"], ans: 1, exp: "Sentiment analysis classifies the sentiment (positive, negative, neutral) or emotion expressed in a piece of text — used in product reviews, social media monitoring, and more." },
    { q: "What is a Seq2Seq model primarily used for?", opts: ["Image classification", "Machine translation — converting one sequence to another", "Clustering data points", "Detecting fraudulent transactions"], ans: 1, exp: "Seq2Seq (Sequence-to-Sequence) models encode an input sequence (e.g., English sentence) and decode it into an output sequence (e.g., French translation) of potentially different length." },
    { q: "What is the key difference between BERT and GPT?", opts: ["BERT is larger", "BERT is bidirectional (encoder); GPT is autoregressive (decoder)", "GPT uses CNNs; BERT uses RNNs", "BERT cannot be fine-tuned"], ans: 1, exp: "BERT uses bidirectional context (encoder-only) making it great for understanding tasks. GPT uses left-to-right autoregressive generation (decoder-only) making it ideal for text generation." },
    { q: "What is Byte Pair Encoding (BPE) used for in NLP?", opts: ["Compressing model weights", "Subword tokenization for handling rare and unknown words", "Encrypting training data", "Measuring sentence similarity"], ans: 1, exp: "BPE builds a vocabulary of common subword units, allowing models to handle rare and unseen words by breaking them into known subwords — used in GPT, RoBERTa, and most modern LLMs." },
    { q: "What is Named Entity Recognition (NER)?", opts: ["Renaming columns in a dataset", "Identifying and classifying named entities (people, places, organizations) in text", "Naming model layers", "Recognizing faces in photos"], ans: 1, exp: "NER identifies and classifies named entities in text (e.g., 'Barack Obama' as PERSON, 'Paris' as LOCATION), a fundamental task in information extraction." },
    { q: "What problem does the attention mechanism in Seq2Seq models solve?", opts: ["Slow training speed", "The information bottleneck of compressing all input into one fixed context vector", "Overfitting on small datasets", "Running out of GPU memory"], ans: 1, exp: "Standard Seq2Seq compresses the full input into a single context vector, losing information for long sequences. Attention lets the decoder dynamically focus on relevant input positions at each step." },
    { q: "What is RLHF used for in training LLMs?", opts: ["Reducing model size", "Aligning model outputs with human values and preferences", "Speeding up tokenization", "Data augmentation"], ans: 1, exp: "Reinforcement Learning from Human Feedback (RLHF) trains a reward model based on human preferences and uses RL to fine-tune the LLM to produce more helpful, harmless, and honest responses." },
  ],
  cv: [
    { q: "What does CNN stand for in deep learning?", opts: ["Central Neural Node", "Convolutional Neural Network", "Clustered Neuron Network", "Computed Normalization Network"], ans: 1, exp: "CNN stands for Convolutional Neural Network — specialized architectures that use convolutional layers to detect spatial patterns (edges, textures, shapes) in images." },
    { q: "What is the primary purpose of a pooling layer in a CNN?", opts: ["Adding non-linearity", "Classifying the output", "Reducing spatial dimensions while retaining key features", "Initializing weights"], ans: 2, exp: "Pooling layers (max or average) reduce the spatial size of feature maps, decreasing computation and providing translation invariance while preserving the most important activations." },
    { q: "What is 'transfer learning' in computer vision?", opts: ["Moving a model to another computer", "Reusing a model pre-trained on a large dataset as a starting point for a new task", "Translating image labels to another language", "Testing the model on a new GPU"], ans: 1, exp: "Transfer learning reuses weights from a model pre-trained on ImageNet (1.2M images, 1000 classes). These learned visual features generalize well, allowing good performance with far less task-specific data." },
    { q: "What does YOLO stand for and why is it significant?", opts: ["You Observe Left Only — for edge detection", "You Only Look Once — detects all objects in one forward pass enabling real-time detection", "Year Of Large Objects — a dataset", "Yet Online Learning Object — an online algorithm"], ans: 1, exp: "YOLO (You Only Look Once) performs object detection in a single forward pass through the network, making it real-time capable (30+ FPS) compared to two-stage methods like R-CNN." },
    { q: "What is the difference between semantic and instance segmentation?", opts: ["No difference", "Instance segmentation distinguishes individual objects; semantic only assigns class per pixel", "Semantic is more precise", "Instance segmentation doesn't use neural networks"], ans: 1, exp: "Semantic segmentation assigns a class to every pixel but cannot tell apart individual objects of the same class. Instance segmentation gives each individual object its own unique segmentation mask." },
    { q: "What metric measures bounding box quality in object detection?", opts: ["F1-Score", "Accuracy", "IoU (Intersection over Union)", "Mean Squared Error"], ans: 2, exp: "IoU (Intersection over Union) measures the overlap between predicted and ground-truth bounding boxes. IoU > 0.5 is typically considered a correct detection. mAP averages this across all classes." },
    { q: "What is the role of the discriminator in a GAN?", opts: ["Generate new images", "Distinguish real images from generated (fake) ones", "Compress images to latent vectors", "Segment objects in images"], ans: 1, exp: "The Discriminator is a binary classifier trained to tell real images from generated ones. Its feedback (gradients) teaches the Generator to create increasingly realistic images over adversarial training." },
    { q: "Which architecture introduced residual (skip) connections to train very deep networks?", opts: ["AlexNet", "VGGNet", "ResNet", "Inception"], ans: 2, exp: "ResNet (He et al., 2015) introduced residual connections that skip one or more layers. This allows gradients to flow directly through the network, enabling training of networks with 100+ layers." },
    { q: "What is data augmentation in computer vision?", opts: ["Adding more GPU memory", "Artificially expanding the training dataset by applying transformations like flips, rotations, and color jitter", "Increasing image resolution", "Reducing the model size"], ans: 1, exp: "Data augmentation applies random transformations (flip, rotate, crop, brightness changes) to training images, artificially increasing dataset size and variety — improving model robustness and reducing overfitting." },
    { q: "What dataset is most commonly used to benchmark image classification models?", opts: ["MNIST", "CIFAR-10", "ImageNet", "COCO"], ans: 2, exp: "ImageNet (ILSVRC) with 1.2 million images across 1000 classes is the standard benchmark for image classification. The competition sparked the deep learning revolution when AlexNet won in 2012." },
  ],
};

// Mixed bank (random from all topics)
QUIZ_BANK.mixed = [
  ...QUIZ_BANK.foundations.slice(0, 3),
  ...QUIZ_BANK.ml.slice(0, 3),
  ...QUIZ_BANK.dl.slice(0, 3),
  ...QUIZ_BANK.nlp.slice(0, 3),
  ...QUIZ_BANK.cv.slice(0, 3),
].sort(() => Math.random() - 0.5);

// Quiz State
let quizState = {
  topic: null,
  questions: [],
  current: 0,
  score: 0,
  answers: [],
  streak: 0,
  maxStreak: 0,
  startTime: null,
  timerInterval: null,
  timeLeft: 20,
};

const SCORES_KEY = 'neurolearn_quiz_scores';
function getScores() { return JSON.parse(localStorage.getItem(SCORES_KEY) || '{}'); }
function saveScore(topic, score, total, acc, xp) {
  const scores = getScores();
  if (!scores[topic] || score > (scores[topic].score || 0)) {
    scores[topic] = { score, total, acc, xp, date: new Date().toLocaleDateString() };
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  }
}

function loadHighScores() {
  const scores = getScores();
  const scoreList = document.getElementById('scoreList');
  if (!scoreList) return;
  const entries = Object.entries(scores);
  if (entries.length === 0) return;

  const topicNames = { foundations: '🌱 AI Foundations', ml: '⚙️ Machine Learning', dl: '🧠 Deep Learning', nlp: '💬 NLP', cv: '👁️ Computer Vision', mixed: '🎲 Mixed' };
  scoreList.innerHTML = entries.map(([topic, data]) => `
    <div class="score-row">
      <span class="sr-topic">${topicNames[topic] || topic}</span>
      <span class="sr-score">${data.score}/${data.total}</span>
      <span class="sr-acc">${data.acc}%</span>
      <span class="sr-xp">⚡ ${data.xp} XP</span>
    </div>
  `).join('');
}

function startQuiz(topic) {
  quizState.topic = topic;
  quizState.questions = [...QUIZ_BANK[topic]].sort(() => Math.random() - 0.5);
  quizState.current = 0;
  quizState.score = 0;
  quizState.answers = [];
  quizState.streak = 0;
  quizState.maxStreak = 0;
  quizState.startTime = Date.now();

  document.getElementById('quizSelector').style.display = 'none';
  document.getElementById('quizResults').style.display = 'none';
  document.getElementById('quizArena').style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  const current = quizState.current;

  // Header update
  document.getElementById('qaQuestionNum').textContent = `Question ${current + 1} of ${total}`;
  document.getElementById('qaScore').textContent = `Score: ${quizState.score}`;
  document.getElementById('qaProgressFill').style.width = `${(current / total) * 100}%`;

  // Category
  const catMap = { foundations: '🌱 Foundations', ml: '⚙️ Machine Learning', dl: '🧠 Deep Learning', nlp: '💬 NLP', cv: '👁️ Computer Vision', mixed: '🎲 Mixed' };
  document.getElementById('qaCategory').textContent = catMap[quizState.topic] || '';

  // Question
  document.getElementById('qaQuestion').textContent = q.q;

  // Options
  const optContainer = document.getElementById('qaOptions');
  const letters = ['A', 'B', 'C', 'D'];
  optContainer.innerHTML = q.opts.map((opt, i) => `
    <button class="qa-option" onclick="selectAnswer(${i})" id="opt-${i}">
      <span class="qa-option-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');

  // Explanation hidden
  const exp = document.getElementById('qaExplanation');
  exp.style.display = 'none';

  // Timer
  clearInterval(quizState.timerInterval);
  quizState.timeLeft = 20;
  updateTimer();
  quizState.timerInterval = setInterval(() => {
    quizState.timeLeft--;
    updateTimer();
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timerInterval);
      selectAnswer(-1); // time's up - no answer
    }
  }, 1000);
}

function updateTimer() {
  const t = quizState.timeLeft;
  const fill = document.getElementById('qaTimerFill');
  const text = document.getElementById('qaTimerText');
  if (!fill || !text) return;
  fill.style.width = `${(t / 20) * 100}%`;
  fill.classList.toggle('urgent', t <= 7);
  text.textContent = `⏱ ${t}s`;
  text.style.color = t <= 7 ? '#f87171' : '';
}

function selectAnswer(selectedIdx) {
  clearInterval(quizState.timerInterval);
  const q = quizState.questions[quizState.current];
  const opts = document.querySelectorAll('.qa-option');
  opts.forEach(o => o.disabled = true);

  const correct = selectedIdx === q.ans;

  if (selectedIdx >= 0) {
    opts[selectedIdx].classList.add(correct ? 'correct' : 'wrong');
    opts[selectedIdx].classList.add('qa-option-pulse');
  }
  if (!correct) {
    opts[q.ans].classList.add('correct');
  }

  if (correct) {
    quizState.score++;
    quizState.streak++;
    quizState.maxStreak = Math.max(quizState.maxStreak, quizState.streak);
    addXP(20 + (quizState.streak >= 3 ? 10 : 0)); // streak bonus
  } else {
    quizState.streak = 0;
  }

  quizState.answers.push({ q: q.q, selected: selectedIdx, correct: q.ans, isCorrect: correct });
  document.getElementById('qaScore').textContent = `Score: ${quizState.score}`;

  // Show explanation
  const exp = document.getElementById('qaExplanation');
  exp.style.display = 'flex';
  exp.style.flexDirection = 'column';
  document.getElementById('qeIcon').textContent = correct ? '✅' : '❌';
  document.getElementById('qeTitle').textContent = correct ? `Correct! ${quizState.streak >= 3 ? '🔥 Streak Bonus +10 XP!' : ''}` : (selectedIdx === -1 ? "Time's up!" : 'Incorrect!');
  document.getElementById('qeTitle').style.color = correct ? 'var(--green)' : '#f87171';
  document.getElementById('qeText').textContent = q.exp;

  const isLast = quizState.current >= quizState.questions.length - 1;
  document.getElementById('nextQBtn').textContent = isLast ? 'View Results 🏆' : 'Next Question →';
}

function nextQuestion() {
  quizState.current++;
  if (quizState.current >= quizState.questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  document.getElementById('quizArena').style.display = 'none';
  document.getElementById('quizResults').style.display = 'block';

  const score = quizState.score;
  const total = quizState.questions.length;
  const acc = Math.round((score / total) * 100);
  const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);
  const xpMap = { foundations: 200, ml: 300, dl: 400, nlp: 400, cv: 400, mixed: 500 };
  const baseXP = xpMap[quizState.topic] || 200;
  const xpEarned = Math.round((score / total) * baseXP);

  addXP(xpEarned);
  saveScore(quizState.topic, score, total, acc, xpEarned);

  // Set conic-gradient for circle
  const pct = (score / total) * 360;
  document.querySelector('.qr-circle').style.background = `conic-gradient(#a78bfa ${pct}deg, rgba(255,255,255,0.06) ${pct}deg)`;

  // Celebration emoji based on score
  const celebrations = { 90: '🏆', 70: '🎉', 50: '👍', 0: '📚' };
  const cel = Object.entries(celebrations).reverse().find(([pct]) => acc >= parseInt(pct))?.[1] || '📚';
  document.getElementById('qrCelebration').textContent = cel;

  const titles = { 90: 'Outstanding! 🌟', 70: 'Great Job! 🎉', 50: 'Good Effort! 👍', 0: 'Keep Learning! 📚' };
  document.getElementById('qrTitle').textContent = Object.entries(titles).reverse().find(([p]) => acc >= parseInt(p))?.[1] || 'Done!';
  document.getElementById('qrScoreNum').textContent = score;
  document.getElementById('qrScoreMax').textContent = `/ ${total}`;
  document.getElementById('qrAccuracy').textContent = `${acc}%`;
  document.getElementById('qrXP').textContent = `+${xpEarned} XP`;
  document.getElementById('qrTime').textContent = `${timeTaken}s`;
  document.getElementById('qrStreak').textContent = quizState.maxStreak;

  // Breakdown
  const breakdown = document.getElementById('qrBreakdown');
  breakdown.innerHTML = quizState.answers.map((a, i) => `
    <div class="qrb-row">
      <span class="qrb-icon">${a.isCorrect ? '✅' : '❌'}</span>
      <span class="qrb-q">Q${i + 1}: ${a.q.substring(0, 60)}${a.q.length > 60 ? '...' : ''}</span>
      <span class="qrb-ans" style="color:${a.isCorrect ? 'var(--green)' : '#f87171'}">${a.isCorrect ? 'Correct' : 'Wrong'}</span>
    </div>
  `).join('');

  document.getElementById('qrRetryBtn').onclick = () => startQuiz(quizState.topic);
  showToast(`🏆 Quiz complete! +${xpEarned} XP earned!`, 'success');
}

// Initialize scores display
document.addEventListener('DOMContentLoaded', loadHighScores);
