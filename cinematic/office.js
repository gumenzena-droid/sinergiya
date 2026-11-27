(() => {
  const paths = {4:'brand.webp', 2:'content.webp', 1:'lead.webp', 0:'sales.webp', 3:'office-analytics.webp', 5:'office-control.webp'};
  const scene = document.querySelector('.scene');
  const room = document.querySelector('dialog');
  const image = room.querySelector('.room-image');
  const reading = room.querySelector('.reading');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const preloaded = Object.fromEntries(Object.entries(paths).map(([floor, path]) => {
    const candidate = new Image();
    candidate.src = path;
    return [floor, candidate];
  }));
  let opener;
  let moving = false;
  let previousOverflow = '';
  const delay = ms => new Promise(resolve => setTimeout(resolve, reduced.matches ? 0 : ms));

  const benefits = {
    4:['Клиенту трудно понять, чем Вы отличаетесь от других риелторов.','Соберите из реальных кейсов позиционирование и темы, которые показывают Ваш подход.','Карта бренда, несколько тем для публикаций и тон общения.'],
    2:['На каждый объект приходится заново писать, снимать и адаптировать материалы.','Передайте один бриф редактору, дизайнеру и видеопродюсеру.','Черновики объявления, поста и сценария видео для Вашей проверки.'],
    1:['Потенциальный клиент читает посты, но у него нет понятного повода обратиться.','Дайте полезную памятку и подготовьте сообщения для дальнейшего диалога.','Памятка, схема воронки и текст первого сообщения.'],
    0:['Условия покупки и отличия объектов приходится собирать вручную к каждому разговору.','Сведите данные и отмечайте условия, которые нужно подтвердить.','Таблица сравнения, аргументы для клиента и список уточнений.']
  };
  const support = {
    3:{en:'Тренажёры для риелтора',ru:'Переговорный полигон',description:`
      <p>Отрепетируйте сложный разговор до встречи с клиентом. Выберите ответ на реплику и получите разбор выбранного подхода.</p>
      <h3>Практика переговоров</h3>
      <details><summary>Собственник не хочет обсуждать комиссию</summary>
        <p><strong>Клиент.</strong> «Я и сам могу разместить объявление. За что мне платить?»</p>
        <details><summary>Предложить скидку на комиссию</summary><p>Скидка отвечает на вопрос о цене, но оставляет вопрос о ценности. Сначала уточните, на каком этапе собственнику нужна помощь.</p></details>
        <details><summary>Уточнить задачу собственника</summary><p>Хорошее начало. Спросите, что ему важнее: срок, цена или минимум показов. Затем объясните, какие действия Вы берёте на себя и как будете отчитываться о результате.</p></details>
      </details>
      <details><summary>Покупатель сомневается в цене</summary>
        <p><strong>Клиент.</strong> «В соседнем ЖК дешевле. Зачем переплачивать?»</p>
        <details><summary>Сказать, что этот ЖК лучше</summary><p>Общая оценка не даёт клиенту критерия выбора. Проверьте, какие различия для него имеют значение.</p></details>
        <details><summary>Предложить сравнить условия покупки</summary><p>Уточните, какой вариант клиент видел, и сопоставьте полную стоимость, отделку и сроки. Отдельно отметьте условия, которые нужно подтвердить у застройщика.</p></details>
      </details>
      <p>В демо используются готовые сценарии и комментарии к вариантам ответа.</p>` },
    5:{en:'Координация цифровой команды',ru:'Пульт управления',description:'<p>Цифровой руководитель EVA сводит задачи и результаты отделов, помогает планировать поручения и расставлять приоритеты. На сайте представлен демонстрационный кабинет.</p>'}
  };
  function populate(profile, floor) {
    room.querySelector('.room-code').textContent = profile.en === profile.ru ? '' : profile.en;
    room.querySelector('h2').textContent = profile.ru;
    if (!benefits[floor]) {
      room.querySelector('.room-copy').innerHTML = profile.description;
      return;
    }
    const [problem, solution, output] = benefits[floor];
    room.querySelector('.room-copy').innerHTML = `
      <p><strong>Задача.</strong> ${problem}</p><p><strong>Решение.</strong> ${solution}</p><p class="tagline"><strong>На выходе.</strong> ${output}</p>${profile.description}
      <h3>Цифровые сотрудники</h3>
      ${profile.agents.map(agent => `<details><summary>${agent.name}</summary><p><strong>Исходные данные.</strong> ${agent.input}</p>${agent.details}</details>`).join('')}
      <h3>Примеры задач</h3>
      ${profile.cases.map(([task,input,team,process,output]) => `<section class="case"><h4>${task}</h4><dl><dt>Что Вы предоставляете</dt><dd>${input}</dd><dt>Кто участвует</dt><dd>${team}</dd><dt>Что происходит</dt><dd>${process}</dd><dt>Что Вы получаете</dt><dd>${output}</dd></dl></section>`).join('')}
      <h3>Результат для риелтора</h3>${profile.results}`;
  }

  async function enter(button) {
    if (moving || room.open) return;
    moving = true;
    opener = button;
    const floor = button.dataset.department;
    const profile = departmentProfiles[floor] || support[floor];
    populate(profile, floor);
    const department = ({3:'negotiation',5:'eva'})[floor] || paths[floor].split('.')[0];
    if (window.parent !== window) window.parent.postMessage({event:'department_open', department}, location.origin);
    else window.konturTrack('department_open', {department});
    scene.style.setProperty('--focus-y', button.style.getPropertyValue('--floor'));
    scene.classList.add('entering');
    await Promise.all([delay(950), preloaded[floor].decode().catch(() => {})]);
    image.src = preloaded[floor].src;
    image.alt = profile.ru + ' — люди и цифровые сотрудники за рабочими станциями';
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    room.showModal();
    reading.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => room.classList.add('ready')));
    await delay(350);
    moving = false;
  }

  async function leave() {
    if (moving || !room.open) return;
    moving = true;
    room.classList.remove('ready');
    scene.classList.remove('entering');
    await delay(330);
    room.close();
    document.body.style.overflow = previousOverflow;
    opener.focus({preventScroll:true});
    moving = false;
  }

  scene.querySelector('.floors').addEventListener('click', event => {
    const button = event.target.closest('[data-department]');
    if (button) enter(button);
  });
  room.querySelector('.cta').addEventListener('click', event => {
    if (window.parent === window) { window.konturTrack('consultation_click', {placement:'department'}); return; }
    event.preventDefault();
    window.parent.postMessage({event:'consultation_click'}, location.origin);
    leave().then(() => window.parent.location.hash = 'formats');
  });
  room.querySelector('.back').addEventListener('click', leave);
  room.addEventListener('cancel', event => { event.preventDefault(); leave(); });
})();
