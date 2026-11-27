const dimensions = [
  { id: 'IDENTITY', title: 'Сила имени', human: 'Определить миссию, ценности и принципы работы с клиентами.', digital: 'Перевести позиционирование в брендбук, которым сможет пользоваться цифровая команда.', result: 'Формулировка «кому и с чем я помогаю» и первая версия брендбука.', question: 'Могу ясно объяснить, кому я помогаю и в чём ценность моего подхода.' },
  { id: 'FREEDOM', title: 'ИИ в деле', human: 'Разобрать, что мешает пробовать новое, и выбрать посильную первую задачу.', digital: 'Сравнить ответы ИИ на разных инструкциях и сверить их с исходными данными.', result: 'Один проверенный сценарий работы с ИИ, который Вы можете повторить самостоятельно.', question: 'Умею дать ИИ рабочую задачу и проверить качество ответа.' },
  { id: 'VISIBILITY', title: 'Право быть заметным', human: 'Найти комфортную форму публичности и привыкнуть говорить о профессиональном опыте.', digital: 'Собрать темы из сделок и настроить редактора, который сохранит Ваш голос.', result: 'Контент-план и первые материалы на основе собственного опыта.', question: 'Регулярно показываю свою экспертизу в публичных материалах.' },
  { id: 'VALUE', title: 'Продажи с уверенностью', human: 'Разобрать денежные установки и потренировать разговор о цене своей работы.', digital: 'Подготовить с ИИ лид-магнит, бриф и сценарий переговоров, затем проверить их на реальном запросе.', result: 'Ясное предложение, сценарий консультации и критерии подходящего обращения.', question: 'Могу уверенно объяснить стоимость услуг и довести разговор до следующего шага.' },
  { id: 'POWER', title: 'Команда и масштаб', human: 'Выделить задачи, где нужно Ваше решение, и определить, что можно передать.', digital: 'Описать роли цифровых сотрудников, входные материалы и критерии проверки.', result: 'Карта цифровой команды и первый настроенный помощник под Ваш процесс.', question: 'Могу описать рабочий процесс так, чтобы его часть мог выполнить помощник.' },
  { id: 'BALANCE', title: 'Время для жизни', human: 'Понять, на что хотите направить время, которое сейчас занимает рутина.', digital: 'Выбрать процесс для автоматизации или делегирования и замерить время до и после.', result: 'Один пересобранный процесс и понятный способ оценить экономию времени.', question: 'Понимаю, где теряю время, и последовательно сокращаю повторяющуюся работу.' }
];

const unity = {
  human: ['Внутренняя эволюция', 'Определяете свои ориентиры, работаете с технологическими страхами и учитесь проявляться в профессии с опорой на свой опыт и ценности.'],
  digital: ['Эволюция профессиональных возможностей', 'Переносите свои принципы в рабочие сценарии, осваиваете ИИ, настраиваете помощников и делегируете задачи с понятными критериями качества.']
};
const unityArt = document.querySelector('.unity-art');
const unityButtons = document.querySelectorAll('[data-unity]');
function selectUnity(mode) {
  const [title, copy] = unity[mode];
  unityArt.dataset.mode = mode;
  document.querySelector('#unity-title').textContent = title;
  document.querySelector('#unity-copy').textContent = copy;
  for (const button of unityButtons) button.setAttribute('aria-pressed', String(button.dataset.unity === mode));
}
for (const button of unityButtons) button.addEventListener('click', () => selectUnity(button.dataset.unity));
unityArt.addEventListener('click', () => selectUnity(unityArt.dataset.mode === 'human' ? 'digital' : 'human'));
selectUnity('human');

const choices = document.querySelector('#method-choices');
const detail = document.querySelector('#method-detail');
choices.innerHTML = dimensions.map(({ id, title }) =>
  `<button type="button" data-dimension="${id}" aria-controls="method-detail" aria-pressed="false">${title}</button>`
).join('');
function selectDimension(dimension) {
  for (const button of choices.children) {
    button.setAttribute('aria-pressed', String(button.dataset.dimension === dimension.id));
  }
  detail.innerHTML = `<h3>${dimension.title}</h3>
    <p><strong>Внутренняя работа.</strong> ${dimension.human}</p>
    <p><strong>Цифровая практика.</strong> ${dimension.digital}</p>
    <p><strong>Результат обучения.</strong> ${dimension.result}</p>`;
}
for (const [index, button] of Array.from(choices.children).entries()) {
  button.addEventListener('click', () => selectDimension(dimensions[index]));
}
selectDimension(dimensions[0]);

const mapForm = document.querySelector('#map-form');
const mapResult = document.querySelector('#map-result');
const shareMap = document.querySelector('#share-map');
let priorities = [];
const levels = ['Пока не умею', 'Редко получается', 'Получается с опорой', 'Обычно справляюсь', 'Делаю уверенно'];
document.querySelector('#map-questions').innerHTML = dimensions.map(({ id, title, question }) =>
  `<label><strong>${title}</strong><span>${question}</span>
    <select name="${id}" required><option value="">Выберите оценку</option>
      ${levels.map((level, index) => `<option value="${index + 1}">${index + 1} — ${level}</option>`).join('')}
    </select></label>`
).join('');
mapForm.addEventListener('input', () => {
  mapResult.hidden = true;
  shareMap.hidden = true;
  shareMap.querySelector('input').checked = false;
  priorities = [];
});
mapForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const answers = new FormData(mapForm);
  const scores = dimensions.map(dimension => ({ ...dimension, score: Number(answers.get(dimension.id)) }));
  const ranked = [...scores].sort((a, b) => a.score - b.score);
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const maximum = scores.length * levels.length;
  const average = total / scores.length;
  const stage = average < 2 ? 'Собираете основу'
    : average < 3 ? 'Набираете уверенность'
    : average < 4 ? 'Переходите к системе'
    : 'Готовы к масштабированию';
  priorities = ranked.filter(item => item.score < levels.length).slice(0, 2);
  const colors = ['#c4a7ff', '#74d8ff', '#ff9bc2', '#ffcc82', '#a9ec95', '#80ead9'];
  const situation = String(answers.get('situation')).trim();
  mapResult.innerHTML = `<h3>Ваша карта эволюции</h3>
    <div class="map-summary">
      <div class="map-gauge" style="--progress:${total / maximum * 100}%"><div><strong>${total}</strong><span>из ${maximum} баллов</span></div></div>
      <div><p class="ev-kicker">Ваш уровень по самооценке</p><h4>${stage}</h4>
      <p class="map-current" hidden><strong>Ваша ситуация</strong><span></span></p></div>
    </div>
    <div class="map-scores">${scores.map((item, index) => `<div style="--skill-color:${colors[index]}">
      <p><strong>${item.title}</strong><span>${item.score} / 5</span></p>
      <div class="map-bar" aria-hidden="true"><i style="width:${item.score * 20}%"></i></div>
    </div>`).join('')}</div>
    <div class="map-coaching">
      <h4>${priorities.length ? 'Что проработать на курсе' : 'Как расти дальше'}</h4>
      <p>${priorities.length ? 'Начните с направлений, где у Вас больше всего пространства для роста. За 8 недель программы Вы сможете поработать над ними на своих задачах.' : 'Вы уверенно оценили себя по всем шести навыкам. На курсе можно взять более сложную задачу и собрать под неё цифровую команду.'}</p>
      ${priorities.length ? `<ul>${priorities.map(item => `<li><strong>${item.title}.</strong> ${item.result}</li>`).join('')}</ul>` : ''}
      <a href="#formats" class="ev-button ev-white">Посмотреть план курса</a>
      <a href="#apply" class="ev-button map-apply">Обсудить участие</a>
    </div>`;
  if (situation) {
    const current = mapResult.querySelector('.map-current');
    current.querySelector('span').textContent = situation;
    current.hidden = false;
  }
  mapResult.hidden = false;
  shareMap.hidden = priorities.length === 0;
  mapResult.focus({ preventScroll: true });
  mapResult.scrollIntoView({ block: 'start' });
});

const application = document.querySelector('#application');
application.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(application);
  const name = String(fields.get('name')).trim();
  if (!name) {
    application.elements.name.setCustomValidity('Введите Ваше имя.');
    application.elements.name.reportValidity();
    return;
  }
  const goal = String(fields.get('goal')).trim();
  const message = ['Здравствуйте! Хочу обсудить участие в совместной программе «Новый код развития риелтора».', `Меня зовут ${name}.`];
  if (goal) message.push(`Моя задача — ${goal}`);
  if (fields.has('map') && priorities.length) message.push(`Приоритеты из моей карты — ${priorities.map(item => item.title).join(', ')}.`);
  const target = new URL('https://t.me/Elena_Gumen');
  target.searchParams.set('text', message.join('\n'));
  window.location.assign(target.toString());
});
application.elements.name.addEventListener('input', () => application.elements.name.setCustomValidity(''));

function initSphereFallback() {
  const hero = document.querySelector('#hero');
  const shell = document.querySelector('.fallback-shell');
  const art = document.querySelector('#hero-art');
  const fill = document.querySelector('#hold-fill');
  const readout = document.querySelector('#sphere-readout');
  const hold = document.querySelector('#hold-trigger');
  let releaseTimer;
  for (let index = 0; index < 12; index++) {
    const angle = index * Math.PI / 6;
    const shard = document.createElement('i');
    shard.style.setProperty('--angle', `${index * 30}deg`);
    shard.style.setProperty('--x', `${Math.cos(angle) * 36}%`);
    shard.style.setProperty('--y', `${Math.sin(angle) * 36}%`);
    shell.append(shard);
  }
  function reveal(percent) {
    art.style.setProperty('--opening', percent / 100);
    readout.textContent = `СФЕРА: ${percent}% РАСКРЫТИЯ`;
    fill.style.width = `${percent}%`;
    if (percent) playCrystalChime(percent / 100);
  }
  function burst() {
    clearTimeout(releaseTimer);
    reveal(100);
    releaseTimer = setTimeout(release, 950);
  }
  function start() {
    clearTimeout(releaseTimer);
    reveal(80);
  }
  function release() {
    clearTimeout(releaseTimer);
    releaseTimer = undefined;
    reveal(0);
  }
  hero.classList.add('sphere-fallback');
  hold.addEventListener('pointerdown', start);
  hold.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!event.repeat) start();
    }
  });
  hold.addEventListener('keyup', release);
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  document.querySelector('#burst-btn').addEventListener('click', burst);
  hero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || event.buttons) return;
    const bounds = art.getBoundingClientRect();
    const within = event.clientX >= bounds.left && event.clientX <= bounds.right &&
      event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!releaseTimer || within) reveal(within ? 38 : 0);
  });
  hero.addEventListener('pointerleave', release);
}
