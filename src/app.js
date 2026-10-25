(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const agree = $('agree'), err = $('err'), dlg = $('agreeDlg');
  const startBtn = $('startBtn'), taunt = $('taunt'), bigbon = $('bigbon');
  let read = false, fed = false, escapes = 0;

  // Если картинки нет в src/Images — показываем заглушку
  document.querySelectorAll('img[data-img]').forEach(img => {
    img.addEventListener('error', () => {
      const ph = document.createElement('div');
      ph.className = 'ph';
      ph.textContent = 'Положи картинку сюда: ' + img.dataset.img;
      img.replaceWith(ph);
    }, { once: true });
  });

  const showErr = msg => { err.hidden = false; err.textContent = msg; err.style.animation = 'none'; void err.offsetWidth; err.style.animation = ''; };

  // ---- соглашение ----
  const TEXT = 'Вы соглашаетесь с соглашением о неразглашении соглашения до соглашения с соглашением, предшествующим соглашению о неразглашении соглашения о соглашении, заключённому в рамках соглашения, которое не подлежит разглашению до момента согласования соглашения о согласовании соглашений.\n\n' +
    'Пункт 2. Сторона, прочитавшая соглашение, обязуется забыть, что она его читала, а сторона, не читавшая соглашение, обязуется сделать вид, что прочитала, и тоже забыть.\n\n' +
    'Пункт 3. Все чаи, выпитые в ходе чтения настоящего соглашения, считаются выпитыми добровольно, но не обязательно вами.\n\n' +
    'Пункт 4. Если соглашение разгласит само себя, стороны соглашаются не соглашаться с этим, но молча.\n\n' +
    'Пункт 5. Бигбон является стороной соглашения и обладает правом вето на любое соглашение, включающее слово «соглашение».\n\n' +
    'Пункт 6. Время, потраченное на чтение, не возвращается ни при каких обстоятельствах, включая письменное согласие с соглашением о возврате времени.\n\n' +
    'Пункт 7. Далее по тексту — смотрите пункт 7.\n\n' +
    'Ниже приложены три картинки, имеющие юридическую силу лишь в нетрезвом состоянии рассудка. Прокрутите вниз и примите соглашение, с которым вы уже согласились.';
  let typedOnce = false, timer = null;

  function openAgreement() {
    dlg.showModal();
    if (typedOnce) return;
    typedOnce = true;
    const p = $('typed'), box = $('scroll');
    let i = 0;
    timer = setInterval(() => {
      p.textContent = TEXT.slice(0, ++i);
      if (i >= TEXT.length) { clearInterval(timer); $('after').hidden = false; }
    }, 14);
  }
  $('openAgree').addEventListener('click', e => { e.preventDefault(); openAgreement(); });

  agree.addEventListener('click', e => {
    if (!read) { e.preventDefault(); showErr('вы не прочитали соглашение, прочитайте соглашение кликнув на слово «соглашением»'); }
    else err.hidden = true;
  });

  $('acceptBtn').addEventListener('click', () => {
    read = true; agree.checked = true; err.hidden = true; dlg.close();
  });

  // ---- убегающая кнопка ----
  const TAUNTS = ['Не поймаешь!', 'Мимо 😏', 'Ой, я тут!', 'Кнопка на связи, но не для тебя', 'Бегу-бегу-бегу', 'Это я, твой экзамен по ловкости'];

  function dodge() {
    const w = startBtn.offsetWidth, h = startBtn.offsetHeight;
    const x = Math.random() * Math.max(10, innerWidth - w - 20) + 10;
    const y = Math.random() * Math.max(10, innerHeight - h - 20) + 10;
    startBtn.classList.add('running');
    startBtn.style.left = x + 'px';
    startBtn.style.top = y + 'px';
    escapes++;
    taunt.textContent = TAUNTS[escapes % TAUNTS.length];
    if (escapes === 4) callBigbon();
  }

  // Чем остановить: кнопку надо покормить бигбоном
  function callBigbon() {
    taunt.textContent = 'Кнопка проголодалась. Покорми её бигбоном 🍜';
    startBtn.textContent = 'Хочу бигбон';
    bigbon.hidden = false;
    bigbon.classList.remove('fly');
    bigbon.style.left = Math.max(10, Math.random() * (innerWidth - 80)) + 'px';
    bigbon.style.top = Math.max(10, Math.random() * (innerHeight - 80)) + 'px';
  }

  bigbon.addEventListener('click', () => {
    const r = startBtn.getBoundingClientRect();
    bigbon.classList.add('fly');
    bigbon.style.left = r.left + r.width / 2 - 24 + 'px';
    bigbon.style.top = r.top + r.height / 2 - 24 + 'px';
    setTimeout(() => {
      bigbon.hidden = true;
      fed = true;
      startBtn.classList.add('fed');
      startBtn.textContent = 'Начать';
      taunt.textContent = 'Ням-ням. Теперь кнопка добрая 💙';
    }, 620);
  });

  startBtn.addEventListener('click', () => {
    if (!agree.checked) { showErr('Сначала согласитесь с соглашением. Увы.'); return; }
    if (!fed) { dodge(); return; }
    $('s-welcome').classList.remove('active');
    $('s-task').classList.add('active');
    startBtn.classList.remove('running');
  });
  // ---- Задание 1: пак-ман ----
  const pac = $('pac'), question = $('question'), hint = $('hint');
  const verdict = $('verdict'), eatenLbl = $('eaten');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const VERDICTS = {
    pancakes: 'Блины. Вкусно, но это не Алиса.',
    speaker: 'Колонка. Хрустит, но это тоже не Алиса.',
    model: 'Пак-ман откусил Алису… но это была не та Алиса.'
  };

  function run(from, to, ms, frame) {
    return new Promise(res => {
      const t0 = performance.now();
      (function step(now) {
        const k = Math.min(1, Math.max(0, (now - t0) / ms));
        frame(from.x + (to.x - from.x) * k, from.y + (to.y - from.y) * k);
        k < 1 ? requestAnimationFrame(step) : res();
      })(t0);
    });
  }

  // Пак-ман пролетает через элемент и «съедает» его (clip-path следует за ртом)
  async function eat(el, dir) {
    const r = el.getBoundingClientRect();
    const horiz = dir === 'right' || dir === 'left';
    const s = Math.max(60, Math.min(150, (horiz ? r.height : r.width) + 10));
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const W = innerWidth + s, H = innerHeight + s;
    const path = {
      right: [{ x: -s, y: cy }, { x: W, y: cy }, 0],
      left:  [{ x: W, y: cy }, { x: -s, y: cy }, 180],
      down:  [{ x: cx, y: -s }, { x: cx, y: H }, 90],
      up:    [{ x: cx, y: H }, { x: cx, y: -s }, 270]
    }[dir];
    const half = s / 2, px = n => Math.max(0, n) + 'px';
    pac.style.setProperty('--s', s + 'px');
    pac.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    const dist = Math.hypot(path[1].x - path[0].x, path[1].y - path[0].y);
    await run(path[0], path[1], dist / 0.7, (x, y) => {
      pac.style.transform = `translate(${x}px,${y}px) rotate(${path[2]}deg)`;
      if (dir === 'right') el.style.clipPath = `inset(0 0 0 ${px(x + half - r.left)})`;
      if (dir === 'left')  el.style.clipPath = `inset(0 ${px(r.right - (x - half))} 0 0)`;
      if (dir === 'down')  el.style.clipPath = `inset(${px(y + half - r.top)} 0 0 0)`;
      if (dir === 'up')    el.style.clipPath = `inset(0 0 ${px(r.bottom - (y - half))} 0)`;
    });
    pac.hidden = true;
    document.documentElement.style.overflow = '';
  }

  let phase = 0, busy = false, eatenCnt = 0;
  document.querySelectorAll('.pick').forEach(card => card.addEventListener('click', async () => {
    if (busy || card.dataset.gone) return;
    busy = true;
    if (phase === 0) {
      await eat(question, Math.random() < 0.5 ? 'right' : 'left');
      question.style.clipPath = '';
      question.textContent = '*рыг*';
      question.classList.add('burp');
      hint.hidden = false;
      hint.textContent = 'Пак-ман съел вопрос и всё ещё голоден. Он не откажется от добавки — тыкай в карточки.';
      phase = 1;
    } else {
      await eat(card, Math.random() < 0.5 ? 'down' : 'up');
      card.dataset.gone = '1';
      card.style.visibility = 'hidden';
      card.style.clipPath = '';
      eatenCnt++;
      eatenLbl.textContent = `Съедено: ${eatenCnt} / 3`;
      verdict.textContent = VERDICTS[card.dataset.kind];
      if (eatenCnt === 3) {
        await sleep(900);
        hint.hidden = true;
        $('picks').hidden = true;
        verdict.textContent = '';
        $('mirror').hidden = false;
      }
    }
    busy = false;
  }));

  $('itsMe').addEventListener('click', () => {
    $('s-task').classList.remove('active');
    $('s-task2').classList.add('active');
  });
  // ---- Задание 2 (заглушка) и Задание 3: дата через насос ----
  $('to3').addEventListener('click', () => {
    $('s-task2').classList.remove('active');
    $('s-task3').classList.add('active');
    startPump();
  });

  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  // gain — прирост за полный ход рычага, leak — потеря в секунду (день быстро, год почти незаметно)
  const F = {
    day:   { v: 5,    min: -99,  max: 31,   gain: 4.0,  leak: 1.1,  id: 'Day' },
    month: { v: 3,    min: -99,  max: 12,   gain: 0.7,  leak: 0.22, id: 'Month' },
    year:  { v: 2009, min: 1900, max: 2030, gain: 0.15, leak: 0.04, id: 'Year' }
  };
  let sel = 'day', pos = 0, grab = 0, dragging = false, done = false, pumpOn = false, lastT = 0;
  const shown = {};
  const track = $('track'), handle = $('handle'), rod = $('rod'), pumpMsg = $('pumpMsg');
  const clamp = v => Math.min(1, Math.max(0, v));
  const range = () => track.clientHeight - handle.offsetHeight;
  const whole = f => Math.floor(F[f].v);
  const fmt = f => (f === 'month' && whole(f) >= 1 && whole(f) <= 12) ? MONTHS[whole(f) - 1] : String(whole(f));

  function render() {
    for (const f in F) {
      const n = whole(f), id = F[f].id;
      $('v' + id).textContent = fmt(f);
      $('m' + id).style.width = ((F[f].v - n) * 100) + '%';
      if (shown[f] !== undefined && shown[f] !== n) {
        const el = document.querySelector(`.dfield[data-f="${f}"]`);
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      }
      shown[f] = n;
    }
  }
  function setPos(p) {
    pos = clamp(p);
    handle.style.top = pos * range() + 'px';
    rod.style.height = pos * range() + handle.offsetHeight / 2 + 'px';
  }
  function shake() { const r = $('rig'); r.classList.remove('shake'); void r.offsetWidth; r.classList.add('shake'); }

  handle.addEventListener('pointerdown', e => {
    if (done) return;
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    grab = e.clientY - handle.getBoundingClientRect().top;
    e.preventDefault();
  });
  handle.addEventListener('pointermove', e => {
    if (!dragging) return;
    const np = clamp((e.clientY - track.getBoundingClientRect().top - grab - 4) / range());
    const f = F[sel];
    f.v = Math.min(f.max, f.v + Math.abs(np - pos) * f.gain);
    setPos(np);
  });
  const release = () => { dragging = false; };
  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);

  document.querySelectorAll('.dfield').forEach(b => b.addEventListener('click', () => {
    sel = b.dataset.f;
    document.querySelectorAll('.dfield').forEach(x => x.classList.toggle('active', x === b));
  }));

  $('lockBtn').addEventListener('click', () => {
    if (done) return;
    if (whole('day') === 13 && whole('month') === 9 && whole('year') === 2012) {
      done = true;
      $('dateWin').hidden = false;
      $('lockBtn').hidden = true;
      pumpMsg.textContent = '';
    } else {
      pumpMsg.textContent = `Сейчас ${fmt('day')} ${fmt('month')} ${fmt('year')}, а нужно 13 сентября 2012.`;
      shake();
    }
  });
  $('to4').addEventListener('click', () => {
    $('s-task3').classList.remove('active');
    $('s-next').classList.add('active');
  });

  function tick(now) {
    if (!$('s-task3').classList.contains('active')) { pumpOn = false; return; }
    const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
    if (!done) for (const f in F) F[f].v = Math.max(F[f].min, F[f].v - F[f].leak * dt);
    render();
    requestAnimationFrame(tick);
  }
  function startPump() {
    setPos(0);
    render();
    if (pumpOn) return;
    pumpOn = true; lastT = performance.now();
    requestAnimationFrame(tick);
  }
})();
