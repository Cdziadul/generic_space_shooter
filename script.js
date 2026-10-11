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
function spawnEnemy() { const size = 22 + Math.random() * 13; enemies.push({ x: size + Math.random() * (innerWidth - size * 2), y: -size, size, speed: 65 + Math.random() * 65 + score * .4 }); }
function hit(a, b) { return Math.abs(a.x - b.x) < a.w / 2 + b.size && Math.abs(a.y - b.y) < a.h / 2 + b.size; }
function update(dt) {
  const direction = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0); player.x = Math.max(25, Math.min(innerWidth - 25, player.x + direction * player.speed * dt));
  bullets.forEach(b => b.y -= b.speed * dt); bullets = bullets.filter(b => b.y > -10);
  spawnTimer -= dt; if (spawnTimer <= 0) { spawnEnemy(); spawnTimer = Math.max(.35, 1.05 - score * .01); }
  enemies.forEach(e => e.y += e.speed * dt);
  for (let i = enemies.length - 1; i >= 0; i--) { const e = enemies[i]; if (e.y > innerHeight + e.size || hit(player, e)) return endGame(); for (let j = bullets.length - 1; j >= 0; j--) if (Math.hypot(e.x - bullets[j].x, e.y - bullets[j].y) < e.size + bullets[j].r) { enemies.splice(i, 1); bullets.splice(j, 1); score += 10; break; } }
}
function draw() { ctx.clearRect(0, 0, innerWidth, innerHeight); ctx.fillStyle = '#70efff'; ctx.beginPath(); ctx.moveTo(player.x, player.y - 24); ctx.lineTo(player.x - 19, player.y + 18); ctx.lineTo(player.x, player.y + 10); ctx.lineTo(player.x + 19, player.y + 18); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; bullets.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); }); enemies.forEach(e => { ctx.fillStyle = '#ff5577'; ctx.beginPath(); ctx.moveTo(e.x, e.y - e.size); ctx.lineTo(e.x + e.size, e.y); ctx.lineTo(e.x, e.y + e.size); ctx.lineTo(e.x - e.size, e.y); ctx.closePath(); ctx.fill(); }); ctx.fillStyle = '#edf5ff'; ctx.font = '700 20px Trebuchet MS'; ctx.fillText(`SCORE  ${score}`, 24, 36); }
function loop(now) { if (!running) return; const dt = Math.min((now - lastTime) / 1000, .05); lastTime = now; update(dt); draw(); if (running) animationId = requestAnimationFrame(loop); }
window.addEventListener('resize', resize); window.addEventListener('keydown', e => { keys[e.key] = true; if (e.code === 'Space') { e.preventDefault(); if (running) shoot(); } }); window.addEventListener('keyup', e => { keys[e.key] = false; }); playButton.addEventListener('click', startGame); restartButton.addEventListener('click', startGame);
