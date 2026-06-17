import { game } from './engine/game.js';

window.onerror = (msg, url, line, col, err) => {
  const c = document.getElementById('game');
  if (c) {
    c.width = 640; c.height = 360;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#100'; ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = '#f44'; ctx.font = '11px monospace';
    ctx.fillText('Error: ' + (err ? err.message : msg), 20, 30);
    ctx.fillStyle = '#fff'; ctx.font = '9px monospace';
    if (err && err.stack) {
      err.stack.split('\n').slice(0, 4).forEach((l, i) => ctx.fillText(l, 20, 50 + i * 13));
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => game.start());
} else {
  game.start();
}
