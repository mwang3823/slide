/* Scroll-linked keyframe engine
 * - Toàn bộ animation là hàm của T (vị trí timeline toàn cục = chỉ số cảnh + tiến độ trong cảnh)
 * - Chỉ ghi transform / opacity (+ clip-path, dashoffset cho SVG), không đụng layout
 * - Một vòng rAF duy nhất, chỉ chạy khi có thay đổi; làm mượt bằng lerp, trình chiếu bằng glide
 */
(function () {
  'use strict';

  const root = document.documentElement;
  const E = (window.E = {
    T: 0, vw: innerWidth, vh: innerHeight, lite: false, reduced: false,
    scenes: [], tracks: [], defs: [], resizeHooks: [], sceneChange: [], beatChange: [],
  });

  /* ---------- easing ---------- */
  const EASE = {
    l: (t) => t,
    s: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    i: (t) => t * t * t,
    o: (t) => 1 - Math.pow(1 - t, 3),
    io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    b: (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  };
  E.EASE = EASE;

  /* ---------- units ---------- */
  function unit(v) {
    if (typeof v === 'function') return v;
    if (typeof v === 'number') return () => v;
    const n = parseFloat(v);
    if (v.endsWith('vmin')) return () => (n * Math.min(E.vw, E.vh)) / 100;
    if (v.endsWith('vw')) return () => (n * E.vw) / 100;
    if (v.endsWith('vh')) return () => (n * E.vh) / 100;
    return () => n;
  }

  /* ---------- tracks ---------- */
  const byEl = new Map();
  const TF = ['x', 'y', 's', 'sx', 'sy', 'r'];

  function getTrack(el, scene) {
    let tr = byEl.get(el);
    if (!tr) {
      const pre = el.classList.contains('c') ? 'translate(-50%,-50%) '
        : el.matches('.tag,.cx,.badges,.vwords,.head.center') ? 'translateX(-50%) ' : '';
      tr = { el, scene, props: {}, cache: {}, pre };
      if (el.dataset.full === undefined && el.classList.contains('typed')) {
        el.dataset.full = el.textContent.trim();
        el.textContent = '';
      }
      byEl.set(el, tr);
      E.tracks.push(tr);
    }
    return tr;
  }

  /** kfs: [[t, {prop: value}, ease?], ...]  (t: T toàn cục) */
  E.track = function (target, kfs, scene = -1, offset = 0) {
    const els = typeof target === 'string' ? document.querySelectorAll(target)
      : target instanceof Element ? [target] : target;
    els.forEach((el) => {
      const tr = getTrack(el, scene);
      kfs.forEach(([t, props, e]) => {
        for (const k in props) {
          (tr.props[k] || (tr.props[k] = [])).push({ t: t + offset, f: unit(props[k]), v: 0, e: e || 'io' });
        }
      });
      for (const k in tr.props) tr.props[k].sort((a, b) => a.t - b.t);
    });
  };

  function resolve() {
    E.tracks.forEach((tr) => {
      for (const k in tr.props) tr.props[k].forEach((p) => (p.v = p.f()));
    });
  }

  function valAt(arr, T) {
    const n = arr.length;
    if (T <= arr[0].t) return arr[0].v;
    if (T >= arr[n - 1].t) return arr[n - 1].v;
    let k = 0;
    while (k < n - 1 && arr[k + 1].t <= T) k++;
    const a = arr[k], b = arr[k + 1];
    const p = (T - a.t) / (b.t - a.t || 1);
    return a.v + (b.v - a.v) * EASE[b.e](p);
  }

  const r3 = (v) => Math.round(v * 1000) / 1000;

  function apply(tr, T) {
    const P = tr.props, el = tr.el, st = el.style, c = tr.cache;
    const g = (k, d) => (P[k] ? valAt(P[k], T) : d);

    if (P.x || P.y || P.s || P.sx || P.sy || P.r) {
      const s = g('s', 1);
      const tf = tr.pre +
        `translate(${r3(g('x', 0))}px,${r3(g('y', 0))}px) rotate(${r3(g('r', 0))}deg) scale(${r3(s * g('sx', 1))},${r3(s * g('sy', 1))})`;
      if (tf !== c.tf) { st.transform = tf; c.tf = tf; }
    }
    if (P.o) {
      const o = Math.max(0, Math.min(1, r3(g('o', 1))));
      if (o !== c.o) {
        st.opacity = o;
        const vis = o < 0.004 ? 'hidden' : '';
        if (vis !== c.vis) { st.visibility = vis; c.vis = vis; }
        c.o = o;
      }
    }
    if (P.blur) {
      const b = E.lite ? 0 : r3(g('blur', 0));
      if (b !== c.blur) { st.filter = b > 0.05 ? `blur(${b}px)` : ''; c.blur = b; }
    }
    if (P.cx || P.cy || P.cr) {
      let cp;
      if (P.cr) cp = `circle(${r3(g('cr', 150))}% at 50% 50%)`;
      else cp = `inset(${r3((1 - g('cy', 1)) * 100)}% ${r3((1 - g('cx', 1)) * 100)}% 0 0 round 0)`;
      if (cp !== c.cp) { st.clipPath = cp; c.cp = cp; }
    }
    if (P.dash) {
      const d = r3(1 - g('dash', 1));
      if (d !== c.dash) { st.strokeDashoffset = d; c.dash = d; }
    }
    if (P.flow) {
      const f = r3(-g('flow', 0));
      if (f !== c.flow) { st.strokeDashoffset = f; c.flow = f; }
    }
    if (P.txt) {
      const full = el.dataset.full, v = g('txt', 1);
      const n = Math.round(v * full.length);
      if (n !== c.txt) {
        el.textContent = full.slice(0, n);
        el.classList.toggle('typing', n > 0 && n < full.length);
        c.txt = n;
      }
    }
    if (P.on) {
      const on = g('on', 0) >= 0.5;
      if (on !== c.on) { el.classList.toggle('on', on); c.on = on; }
    }
  }

  /* ---------- scenes ---------- */
  /** Đăng ký cảnh: fn(S) với S.t(target, kfs) dùng thời gian cục bộ u (0..1) */
  E.def = function (i, fn) { E.defs.push([i, fn]); };

  const BA = 0.06, BB = 0.94;            // vùng chứa các ý trong một cảnh (ngoài vùng này là chuyển cảnh)
  function buildScenes() {
    const secs = document.querySelectorAll('#scroller .scene');
    const stages = document.querySelectorAll('.stage');
    secs.forEach((sec, i) => {
      const n = +sec.dataset.beats || 1;
      const seg = (BB - BA) / n;
      const stops = [];
      for (let k = 1; k <= n; k++) stops.push(BA + k * seg);
      if (i === 0) stops.unshift(0);
      E.scenes.push({ i, sec, stage: stages[i], n, seg, len: 60 + n * 75, title: sec.dataset.title, stops, y: 0, h: 0, vis: null });
    });
    E.N = E.scenes.length;
    E.defs.forEach(([i, fn]) => {
      const stage = E.scenes[i].stage;
      const S = {
        i, stage,
        $: (s) => stage.querySelector(s),
        $$: (s) => [...stage.querySelectorAll(s)],
        beat: (k, f = 0) => E.B(i, k, f) - i,
        t: (target, kfs) => {
          const els = typeof target === 'string' ? stage.querySelectorAll(target) : target;
          E.track(els, kfs, i, i);
        },
      };
      fn(S);
    });
  }
  /** T toàn cục của "ý thứ k (1..n), tiến độ f (0..1)" trong cảnh i */
  E.B = (i, k, f = 0) => i + BA + (k - 1 + f) * E.scenes[i].seg;
  E.beatAt = (T) => {
    const i = Math.max(0, Math.min(E.N - 1, Math.floor(T + 0.05)));
    const s = E.scenes[i];
    const k = Math.max(1, Math.min(s.n, Math.ceil((T - i - BA) / s.seg - 0.04)));
    return [i, k];
  };

  /* ---------- layout & mapping ---------- */
  let total = 0;
  const endSpacer = document.getElementById('scroll-end');

  function layoutOverlays() {
    document.querySelectorAll('svg.ov').forEach((svg) => {
      svg.setAttribute('viewBox', `0 0 ${E.vw} ${E.vh}`);
      svg.querySelectorAll('[data-d]').forEach((p) => {
        let k = 0;
        const d = p.dataset.d.replace(/-?\d*\.?\d+/g, (m) => {
          const v = parseFloat(m);
          return r3(k++ % 2 === 0 ? (v * E.vw) / 100 : (v * E.vh) / 100);
        });
        p.setAttribute('d', d);
      });
    });
  }

  function layout() {
    E.vw = innerWidth; E.vh = innerHeight;
    let acc = 0;
    E.scenes.forEach((s) => {
      s.y = acc; s.h = (s.len * E.vh) / 100;
      s.sec.style.height = s.h + 'px';
      acc += s.h;
    });
    total = acc;
    endSpacer.style.height = E.vh + 'px';
    layoutOverlays();
    E.resizeHooks.forEach((f) => f());
    resolve();
    E.tracks.forEach((tr) => (tr.cache = {}));
  }

  E.yToT = function (y) {
    const sc = E.scenes;
    for (let i = sc.length - 1; i >= 0; i--) {
      if (y >= sc[i].y) return i + Math.min(1, (y - sc[i].y) / sc[i].h);
    }
    return 0;
  };
  E.tToY = function (T) {
    const i = Math.max(0, Math.min(E.N - 1, Math.floor(T)));
    return E.scenes[i].y + (T - i) * E.scenes[i].h;
  };

  /* ---------- render ---------- */
  const bar = document.querySelector('#progress i');
  let active = -1, activeBeat = -1;

  function render(T) {
    E.T = T;
    E.scenes.forEach((s) => {
      const vis = T >= s.i - 0.32 && T <= s.i + 1.32;
      if (vis !== s.vis) { s.stage.classList.toggle('vis', vis); s.vis = vis; }
    });
    for (let k = 0; k < E.tracks.length; k++) {
      const tr = E.tracks[k];
      if (tr.heavy && E.lite) continue;
      if (tr.scene < 0 || E.scenes[tr.scene].vis) apply(tr, T);
    }
    bar.style.transform = `scaleX(${r3(Math.max(0, T) / E.N)})`;
    const [a, bk] = E.beatAt(T);
    if (a !== active) { active = a; E.sceneChange.forEach((f) => f(a)); }
    if (a * 100 + bk !== activeBeat) { activeBeat = a * 100 + bk; E.beatChange.forEach((f) => f(a, bk)); }
  }

  /* ---------- loop: lerp + glide + intro ---------- */
  let cur = 0, target = 0, raf = 0, last = 0, glide = null;
  let intro = 0, introStart = 0;
  const INTRO_MS = 1900, INTRO_T = 0.36;

  function frame(now) {
    const dt = Math.min(64, now - (last || now)); last = now;
    let busy = false;

    if (glide) {
      const p = Math.min(1, (now - glide.t0) / glide.dur);
      cur = glide.from + (glide.to - glide.from) * EASE.s(p);
      if (p >= 1) glide = null; else busy = true;
    } else {
      const k = E.reduced ? 1 : 1 - Math.pow(1 - (E.lite ? 0.14 : 0.075), dt / 16.67);
      cur += (target - cur) * k;
      if (Math.abs(target - cur) < 0.4) cur = target; else busy = true;
    }

    if (intro < 1) {
      intro = E.reduced ? 1 : Math.min(1, (now - introStart) / INTRO_MS);
      busy = busy || intro < 1;
    }
    const T = E.yToT(cur) - INTRO_T * (1 - EASE.o(intro));
    render(T);
    raf = busy ? requestAnimationFrame(frame) : 0;
    if (!busy) last = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  E.kick = kick;

  addEventListener('scroll', () => { target = scrollY; kick(); }, { passive: true });
  const cancelGlide = () => { if (glide) { glide = null; cur = scrollY; } };
  addEventListener('wheel', cancelGlide, { passive: true });
  addEventListener('touchstart', cancelGlide, { passive: true });

  /* ---------- navigation ---------- */
  E.goT = function (T) {
    const y = Math.round(E.tToY(Math.max(0, Math.min(E.N, T))));
    const from = cur, dist = Math.abs(E.yToT(y) - E.yToT(from));
    if (E.reduced) { scrollTo(0, y); return; }
    let start = from;
    if (dist > 1.6) start = E.tToY(E.yToT(y) + (y > from ? -0.55 : 0.55));
    glide = { from: start, to: y, t0: performance.now(), dur: Math.min(2800, 1500 + Math.min(dist, 1.6) * 800) };
    target = y;
    scrollTo(0, y);
    kick();
  };
  function stops() {
    const out = [];
    E.scenes.forEach((s) => s.stops.forEach((u) => out.push(s.i + u)));
    return out;
  }
  E.step = function (dir) {
    const now = glide ? E.yToT(glide.to) : E.yToT(target);
    const all = stops();
    let t;
    if (dir > 0) t = all.find((x) => x > now + 0.015);
    else t = [...all].reverse().find((x) => x < now - 0.015);
    if (t !== undefined) E.goT(t);
  };
  E.goScene = (i) => E.goT(i + E.scenes[i].stops[0]);

  /* ---------- lite mode ---------- */
  E.setLite = function (on) {
    E.lite = on;
    root.classList.toggle('lite', on);
    E.tracks.forEach((tr) => (tr.cache = {}));
    render(E.T);
  };
  function probeFps() {
    let n = 0; const t0 = performance.now();
    (function tick(now) {
      n++;
      if (now - t0 < 1000) requestAnimationFrame(tick);
      else if (n < 38 && !E.lite) { E.setLite(true); E.toast && E.toast('Đã bật chế độ nhẹ (máy cấu hình thấp) · phím L để đổi'); }
    })(t0);
  }

  /* ---------- boot ---------- */
  E.boot = function () {
    E.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const weak = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;
    const forced = new URLSearchParams(location.search).get('lite');
    if (forced === '1' || weak || E.reduced) { E.lite = true; root.classList.add('lite'); }
    if (E.reduced) root.classList.add('reduced');

    buildScenes();
    if (E.buildCore) E.buildCore();
    E.tracks.forEach((tr) => (tr.heavy = tr.el.matches('.bg-blob,.bg-tint,.fx')));
    layout();
    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { layout(); target = cur = scrollY; render(E.yToT(cur)); }, 120);
    });
    target = cur = scrollY;
    introStart = performance.now();
    if (scrollY > 10) intro = 1;
    kick();
    if (!E.lite && forced !== '0') setTimeout(probeFps, 2200);
  };
})();
