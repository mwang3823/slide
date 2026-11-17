/* Khởi động + điều khiển trình chiếu: chấm điều hướng, phím tắt, HUD, ghi chú */
(function () {
  const E = window.E;
  const $ = (s) => document.querySelector(s);

  const toastEl = $('#toast');
  let tt;
  E.toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  // Đồng bộ với màn người nói (presenter.html) qua BroadcastChannel.
  // ?embed=1: bản xem trước nằm trong màn người nói, chỉ đi theo, không nhận phím/chuột.
  const EMBED = new URLSearchParams(location.search).has('embed');
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('wao-slide') : null;
  const curT = () => E.yToT(scrollY);

  function startEmbed() {
    document.body.classList.add('embed');
    if (!bc) return;
    bc.onmessage = ({ data: m }) => {
      if (m.type === 'go') E.goT(m.T);
      else if (m.type === 'pos' || m.type === 'state') scrollTo(0, E.tToY(m.T));
    };
    bc.postMessage({ type: 'hello' });
  }

  function startSync() {
    if (!bc) return;
    const goT = E.goT;
    E.goT = (T) => { goT(T); bc.postMessage({ type: 'go', T }); };
    let st;
    addEventListener('scroll', () => {
      if (st) return;
      st = setTimeout(() => { st = 0; bc.postMessage({ type: 'pos', T: curT() }); }, 120);
    }, { passive: true });
    const meta = () => E.scenes.map((s) => ({ title: s.title, n: s.n, pause: s.pause }));
    let beat = [0, 1];
    E.beatChange.push((i, k) => { beat = [i, k]; bc.postMessage({ type: 'beat', beat }); });
    const state = () => bc.postMessage({ type: 'state', T: curT(), meta: meta(), beat });
    bc.onmessage = ({ data: m }) => {
      // có màn người nói → ẩn nút điều khiển và bảng lời nói trên màn chiếu cho khách
      if (m.type === 'hello' || m.type === 'presenter') document.body.classList.add('has-presenter');
      if (m.type === 'hello') state();
      else if (m.type === 'step') E.step(m.dir);
      else if (m.type === 'scene') E.goScene(m.i);
      else if (m.type === 'goT') E.goT(m.T);
    };
    state();
  }
  const openPresenter = () => {
    const w = window.open('presenter.html', 'wao-presenter', 'width=1280,height=800');
    if (!w) E.toast('Trình duyệt chặn cửa sổ mới — cho phép popup rồi bấm P lại');
  };

  function start() {
    document.body.classList.add('night');
    E.boot();
    if (EMBED) { startEmbed(); E.kick(); return; }
    startSync();

    // chấm điều hướng
    const dots = $('#dots');
    E.scenes.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${i + 1}. ${s.title}`);
      b.innerHTML = `<span>${String(i + 1).padStart(2, '0')} · ${s.title}</span>`;
      b.addEventListener('click', () => E.goScene(i));
      dots.appendChild(b);
    });

    const hudN = $('#hud-n'), hudT = $('#hud-t'), notes = $('#notes'), notesBody = $('#notes-body');
    // nội dung nói: toàn bộ lời nói của slide hiện tại
    let cur = [0, 1];
    const notesH = $('#notes-h');
    const renderNotes = () => {
      const [i, k] = cur;
      const pz = E.scenes[i].pause;
      const g = Math.max(0, pz.findIndex((p) => p >= k));
      const from = g ? pz[g - 1] : 0, to = pz[g] || E.scenes[i].n;
      notesH.textContent = `${String(i + 1).padStart(2, '0')} · ${E.scenes[i].title}`;
      // hiện toàn bộ lời nói của slide, phần đang trình bày được đánh dấu
      notesBody.innerHTML = (window.NOTES[i] || []).map((x, j) => `<p class="${j >= from && j < to ? 'on' : ''}">${x}</p>`).join('');
      const on = notesBody.querySelector('.on');
      if (on) notes.scrollTop = on.offsetTop - 48;
    };
    const toggleNotes = () => { notes.hidden = !notes.hidden; ctrl.querySelector('[data-act=notes]').classList.toggle('on', !notes.hidden); if (!notes.hidden) renderNotes(); };
    const toggleFull = () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
    };
    const ctrl = $('#ctrl');
    ctrl.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      ({ prev: () => E.step(-1), next: () => E.step(1), notes: toggleNotes, full: toggleFull, presenter: openPresenter })[b.dataset.act]();
      b.blur();
    });
    E.beatChange.push((i, k) => {
      cur = [i, k];
      hudN.textContent = `${String(i + 1).padStart(2, '0')}.${k}`;
      if (!notes.hidden) renderNotes();
    });
    E.sceneChange.push((i) => {
      [...dots.children].forEach((b, k) => {
        b.classList.toggle('on', k === i);
        b.toggleAttribute('aria-current', k === i);
      });
      hudN.textContent = String(i + 1).padStart(2, '0');
      hudT.textContent = E.scenes[i].title;
    });
    E.kick();

    addEventListener('scroll', () => document.body.classList.toggle('started', scrollY > 40), { passive: true });

    // click chuột: trái → bước kế tiếp, phải → bước trước (bỏ qua click trên nút / ghi chú)
    addEventListener('click', (e) => {
      if (e.button !== 0 || e.target.closest('button, a, #notes, #dots, #ctrl')) return;
      if (getSelection && String(getSelection()).length) return;
      E.step(1);
    });
    addEventListener('contextmenu', (e) => {
      if (e.target.closest('#notes')) return;
      e.preventDefault();
      E.step(-1);
    });

    addEventListener('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); E.step(e.shiftKey && k === ' ' ? -1 : 1); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); E.step(-1); }
      else if (k === 'Home') { e.preventDefault(); E.goT(0); }
      else if (k === 'End') { e.preventDefault(); E.goT(E.N - 1 + 0.9); }
      else if (k === 'f' || k === 'F') toggleFull();
      else if (k === 'p' || k === 'P') openPresenter();
      else if (k === 'n' || k === 'N') toggleNotes(); else if (k === 'l' || k === 'L') {
        E.setLite(!E.lite);
        E.toast(E.lite ? 'Chế độ nhẹ: BẬT' : 'Chế độ nhẹ: TẮT');
      } else if (/^[1-9]$/.test(k)) {
        const i = +k - 1;
        if (i < E.N) E.goScene(i);
      }
    });
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  ready.then(() => { scrollTo(0, 0); start(); });
})();
