const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.querySelector('#start-screen');
const gameOverScreen = document.querySelector('#game-over');
const playButton = document.querySelector('#play-button');
const restartButton = document.querySelector('#restart-button');
const finalScore = document.querySelector('#final-score');

let player, bullets, enemies, score, keys, running, lastTime, spawnTimer, animationId;

function resize() { canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
function startGame() { cancelAnimationFrame(animationId); resize(); player = { x: innerWidth / 2, y: innerHeight - 70, w: 34, h: 42, speed: 370 }; bullets = []; enemies = []; score = 0; keys = {}; running = true; lastTime = performance.now(); spawnTimer = 0; startScreen.hidden = true; gameOverScreen.hidden = true; canvas.hidden = false; animationId = requestAnimationFrame(loop); }
function endGame() { running = false; finalScore.textContent = score; gameOverScreen.hidden = false; }
function shoot() { if (bullets.length < 8) bullets.push({ x: player.x, y: player.y - 22, r: 3, speed: 600 }); }
function spawnEnemy() { const size = 18 + Math.random() * 9; enemies.push({ x: size + Math.random() * (innerWidth - size * 2), y: -size, size, speed: 65 + Math.random() * 65 + score * .4, color: ['#f28fb3', '#8bc7ed', '#f6d77a', '#b59be8'][Math.floor(Math.random() * 4)] }); }
function hit(a, b) { return Math.abs(a.x - b.x) < a.w / 2 + b.size && Math.abs(a.y - b.y) < a.h / 2 + b.size; }
function update(dt) {
  const direction = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0); player.x = Math.max(25, Math.min(innerWidth - 25, player.x + direction * player.speed * dt));
  bullets.forEach(b => b.y -= b.speed * dt); bullets = bullets.filter(b => b.y > -10);
  spawnTimer -= dt; if (spawnTimer <= 0) { spawnEnemy(); spawnTimer = Math.max(.35, 1.05 - score * .01); }
  enemies.forEach(e => e.y += e.speed * dt);
  for (let i = enemies.length - 1; i >= 0; i--) { const e = enemies[i]; if (e.y > innerHeight + e.size) return endGame(); if (hit(player, { x: e.x, y: e.y + 10, w: 52, h: 28, size: e.size })) { enemies.splice(i, 1); score += 10; } }
}
function draw() { ctx.clearRect(0, 0, innerWidth, innerHeight); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(player.x - 11, player.y - 31, 8, 24, -.15, 0, Math.PI * 2); ctx.ellipse(player.x + 11, player.y - 31, 8, 24, .15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f7dce5'; ctx.beginPath(); ctx.ellipse(player.x - 11, player.y - 31, 3, 17, -.15, 0, Math.PI * 2); ctx.ellipse(player.x + 11, player.y - 31, 3, 17, .15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(player.x, player.y - 5, 23, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#3f3442'; ctx.beginPath(); ctx.arc(player.x - 8, player.y - 9, 2.5, 0, Math.PI * 2); ctx.arc(player.x + 8, player.y - 9, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#e891ad'; ctx.beginPath(); ctx.arc(player.x, player.y - 2, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#b87942'; ctx.fillRect(player.x - 29, player.y + 13, 58, 13); ctx.strokeStyle = '#7f4d2d'; ctx.lineWidth = 3; ctx.strokeRect(player.x - 29, player.y + 13, 58, 13); enemies.forEach(e => { ctx.fillStyle = e.color; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.size * .72, e.size, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff9'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#fff9'; ctx.beginPath(); ctx.ellipse(e.x, e.y - e.size * .35, e.size * .12, e.size * .25, 0, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = '#5a3b4b'; ctx.font = '700 20px Trebuchet MS'; ctx.fillText(`EGGS  ${score}`, 24, 36); }
function loop(now) { if (!running) return; const dt = Math.min((now - lastTime) / 1000, .05); lastTime = now; update(dt); draw(); if (running) animationId = requestAnimationFrame(loop); }
window.addEventListener('resize', resize); window.addEventListener('keydown', e => { keys[e.key] = true; if (e.code === 'Space') { e.preventDefault(); if (running) shoot(); } }); window.addEventListener('keyup', e => { keys[e.key] = false; }); playButton.addEventListener('click', startGame); restartButton.addEventListener('click', startGame);
