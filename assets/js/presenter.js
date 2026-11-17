/* Màn người nói: xem trước slide đang chiếu (iframe ?embed=1, chạy animation thật), phần tiếp theo,
 * đồng hồ, danh sách slide và toàn bộ lời nói. Đồng bộ với cửa sổ trình chiếu qua BroadcastChannel.
 * Không có cửa sổ trình chiếu → tự điều khiển bản xem trước. */
(function () {
  const $ = (s) => document.getElementById(s);
  const view = $('view'), frame = $('frame');
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('wao-slide') : null;
  const NOTES = window.NOTES || [];
  const pad = (n) => String(n).padStart(2, '0');
  let PE = null;          // engine trong iframe
  let master = false;     // có cửa sổ trình chiếu đang mở
  let cur = [0, 1];
  const link = $('link');

  // iframe render ở 1280×720 rồi thu nhỏ cho vừa khung
  const fit = () => {
    const s = Math.min(frame.clientWidth / 1280, frame.clientHeight / 720);
    view.style.transform = `scale(${s})`;
    view.style.left = (frame.clientWidth - 1280 * s) / 2 + 'px';
    view.style.top = (frame.clientHeight - 720 * s) / 2 + 'px';
  };
  addEventListener('resize', fit);

  // ---- điều khiển ----
  const send = (m) => {
    startTimer();
    if (master && bc) { bc.postMessage(m); return; }
    if (!PE) return;
    if (m.type === 'step') PE.step(m.dir);
    else if (m.type === 'scene') PE.goScene(m.i);
  };
  $('prev').onclick = () => send({ type: 'step', dir: -1 });
  $('next').onclick = () => send({ type: 'step', dir: 1 });
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); send({ type: 'step', dir: 1 }); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); send({ type: 'step', dir: -1 }); }
    else if (/^[1-9]$/.test(k)) send({ type: 'scene', i: +k - 1 });
  });

  // ---- đồng hồ ----
  let t0 = 0, acc = 0, run = false;
  const LIMIT = 15 * 60;
  const tick = () => {
    const sec = Math.floor((acc + (run ? Date.now() - t0 : 0)) / 1000);
    $('timer').textContent = `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
    $('timer').classList.toggle('over', sec > LIMIT);
  };
  function startTimer() { if (!run) { run = true; t0 = Date.now(); $('t-toggle').textContent = 'Tạm dừng'; } }
  $('t-toggle').onclick = () => {
    if (run) { acc += Date.now() - t0; run = false; $('t-toggle').textContent = 'Tiếp tục'; }
    else startTimer();
  };
  $('t-reset').onclick = () => { acc = 0; t0 = Date.now(); tick(); };
  setInterval(tick, 500);

  // ---- nội dung ----
  // META: [{title, n, pause}] — nhận từ cửa sổ trình chiếu hoặc đọc từ bản xem trước
  let META = null;
  const BA = 0.06, BB = 0.94;
  const B = (i, k, f) => i + BA + (k - 1 + f) * (BB - BA) / META[i].n;
  const group = (i, k) => {
    const s = META[i], pz = s.pause;
    const g = Math.max(0, pz.findIndex((p) => p >= k));
    return { g, from: g ? pz[g - 1] : 0, to: pz[g] || s.n, total: pz.length };
  };
  const allStops = () => {
    const out = [];
    META.forEach((s, i) => s.pause.forEach((k) => out.push(B(i, k, 1))));
    return out;
  };

  function render() {
    if (!META) return;
    const [i, k] = cur, s = META[i], gr = group(i, k);
    $('now-t').textContent = `${pad(i + 1)} · ${s.title} — phần ${gr.g + 1}/${gr.total}`;
    $('notes-t').textContent = `${pad(i + 1)} · ${s.title}`;
    const box = $('notes');
    box.innerHTML = (NOTES[i] || []).map((x, j) => `<p class="${j >= gr.from && j < gr.to ? 'on' : ''}">${x}</p>`).join('');
    const on = box.querySelector('.on');
    if (on) box.scrollTop = on.offsetTop - box.offsetTop - 12;

    // phần tiếp theo = điểm dừng kế tiếp
    const stops = allStops();
    const T = B(i, gr.to, 1) + 0.001;   // điểm dừng hiện tại
    const idx = stops.findIndex((x) => x > T);
    $('count').textContent = `${Math.max(1, idx === -1 ? stops.length : idx)} / ${stops.length}`;
    if (idx === -1) { $('next-t').textContent = 'Hết bài'; $('next-x').textContent = 'Đây là phần cuối.'; }
    else {
      const nT = stops[idx], ni = Math.floor(nT + 0.05), ns = META[ni];
      const nk = Math.round((nT - ni - BA) / ((BB - BA) / ns.n));
      const ng = group(ni, nk);
      $('next-t').textContent = `${pad(ni + 1)} · ${ns.title}${ni !== i ? ' (slide mới)' : ''}`;
      const txt = (NOTES[ni] || []).slice(ng.from, ng.to).join(' ');
      $('next-x').textContent = txt.length > 220 ? txt.slice(0, 217) + '…' : txt;
    }
    [...$('list').children].forEach((li, j) => li.firstChild.classList.toggle('on', j === i));
  }

  function setMeta(meta) {
    if (META) return;
    META = meta;
    $('list').innerHTML = '';
    META.forEach((s, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = `${pad(i + 1)} · ${s.title}`;
      b.onclick = () => send({ type: 'scene', i });
      li.appendChild(b);
      $('list').appendChild(li);
    });
    render();
  }
  const setBeat = (i, k) => { if (cur[0] === i && cur[1] === k) return; cur = [i, k]; render(); };

  // bản xem trước: thử đọc engine (cùng origin) — không chờ sự kiện load vì iframe có thể đã tải xong trước
  const poll = setInterval(() => {
    let E = null;
    try { E = view.contentWindow && view.contentWindow.E; } catch (e) { /* file:// chặn truy cập iframe */ }
    if (!E || !E.scenes || !E.scenes.length) return;
    clearInterval(poll);
    PE = E;
    setMeta(E.scenes.map((s) => ({ title: s.title, n: s.n, pause: s.pause })));
    E.beatChange.push(setBeat);
    fit();
  }, 150);
  setTimeout(() => {
    if (!META) { link.textContent = 'Không đọc được dữ liệu slide — hãy mở qua GitHub Pages hoặc server local (không mở trực tiếp file).'; link.className = 'link warn'; }
  }, 4000);

  // ---- tìm cửa sổ trình chiếu ----
  if (!bc) { link.textContent = 'Trình duyệt không hỗ trợ đồng bộ — màn này tự điều khiển bản xem trước.'; link.className = 'link warn'; }
  else {
    bc.addEventListener('message', ({ data: m }) => {
      if (m.meta) setMeta(m.meta);
      if (m.beat) setBeat(m.beat[0], m.beat[1]);
      if (m.type === 'state' && !master) { master = true; link.textContent = '● Đã kết nối màn chiếu cho khách'; link.className = 'link'; }
    });
    bc.postMessage({ type: 'hello' });
    setTimeout(() => {
      if (!master) { link.textContent = 'Chưa thấy màn chiếu cho khách — mở trang trình chiếu rồi bấm P, hoặc dùng màn này để tự điều khiển.'; link.className = 'link warn'; }
    }, 800);
  }
  fit();
  tick();
})();
