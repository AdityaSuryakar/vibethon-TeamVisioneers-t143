// home.js — Homepage specific animations and interactions
document.addEventListener('DOMContentLoaded', () => {
  // Animate hero stats on load
  setTimeout(() => {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
    });
  }, 800);
});
