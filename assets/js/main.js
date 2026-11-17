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

  function start() {
    E.boot();

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
    let cur = [0, 1];
    const renderNotes = () => {
      const [i, k] = cur;
      notesBody.innerHTML = '<ol>' + (window.NOTES[i] || []).map((x, j) => `<li class="${j + 1 === k ? 'on' : ''}">${x}</li>`).join('') + '</ol>';
      const on = notesBody.querySelector('.on');
      if (on) on.scrollIntoView({ block: 'nearest' });
    };
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
      document.body.classList.toggle('night', i === E.N - 1);
    });
    E.kick();

    addEventListener('scroll', () => document.body.classList.toggle('started', scrollY > 40), { passive: true });

    // click chuột: trái → bước kế tiếp, phải → bước trước (bỏ qua click trên nút / ghi chú)
    addEventListener('click', (e) => {
      if (e.button !== 0 || e.target.closest('button, a, #notes, #dots')) return;
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
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
      } else if (k === 'n' || k === 'N') {
        notes.hidden = !notes.hidden;
        if (!notes.hidden) renderNotes();
      } else if (k === 'l' || k === 'L') {
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
