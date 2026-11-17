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
    document.body.classList.add('night');
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
      ({ prev: () => E.step(-1), next: () => E.step(1), notes: toggleNotes, full: toggleFull })[b.dataset.act]();
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
