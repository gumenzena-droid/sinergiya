const player = document.querySelector('#voice');
const listen = document.querySelector('#listen');
const status = document.querySelector('#status');
let context, analyser, samples, frame;


function animate() {
  analyser.getByteTimeDomainData(samples);
  let energy = 0;
  for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
  const level = Math.min(1, Math.sqrt(energy / samples.length) * 4.5);
  document.documentElement.style.setProperty('--voice', level.toFixed(3));
  frame = requestAnimationFrame(animate);
}
function prepareAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  if (!context) {
    context = new Audio();
    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    samples = new Uint8Array(analyser.fftSize);
    context.createMediaElementSource(player).connect(analyser);
    analyser.connect(context.destination);
  }
  context.resume().catch(() => {});
}
function stopAnimation() {
  cancelAnimationFrame(frame);
  document.documentElement.style.setProperty('--voice', '0');
}
player.addEventListener('pointerdown', prepareAudio);
player.addEventListener('play', () => {
  prepareAudio();
  stopAnimation();
  if (analyser) animate();
});
for (const event of ['pause', 'ended', 'error']) player.addEventListener(event, stopAnimation);
player.addEventListener('error', () => {
  status.textContent = 'Не удалось загрузить запись. Попробуйте обновить страницу.';
});
listen.hidden = false;
player.classList.add('enhanced-player');
player.addEventListener('playing', () => { player.dataset.started = ''; });
listen.addEventListener('click', async () => {
  if (!player.paused) {
    player.pause();
    return;
  }
  try {
    prepareAudio();
    await player.play();
    status.textContent = '';
  } catch {
    status.textContent = 'Не удалось запустить запись. Попробуйте ещё раз.';
  }
});
player.addEventListener('playing', () => { listen.textContent = 'Поставить на паузу'; });
for (const event of ['pause', 'ended', 'error']) {
  player.addEventListener(event, () => {
    listen.textContent = 'Прослушать запись';
  });
}
