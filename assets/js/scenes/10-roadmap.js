/* 10 · Lộ trình — 6 ý
 * 1: đừng bắt đầu bằng AI toàn công ty · 2–5: lõi đi trên đường, dừng ở từng mốc · 6: 3 mức tự động hoá + nguyên tắc */
E.def(9, (S) => {
  const { t, $, $$ } = S, b = S.beat;
  const path = $('.road .rdraw');
  const MS = [0.14, 0.4, 0.66, 0.9];
  const ABOVE = [true, true, true, false];
  const io = E.EASE.io;
  let pathLen = 0;

  // đoạn đường cho từng ý: [ý, f từ, f tới]
  const SEG = [[2, 0, MS[0]], [3, MS[0], MS[1]], [4, MS[1], MS[2]], [5, MS[2], MS[3]], [6, MS[3], 1]];
  const samples = [];          // [u, f]
  samples.push([b(1, 0.6), 0]);
  SEG.forEach(([k, f0, f1]) => {
    for (let j = 1; j <= 8; j++) samples.push([b(k, 0.05 + 0.8 * j / 8), f0 + (f1 - f0) * io(j / 8)]);
  });

  const pt = (f) => (pathLen ? path.getPointAtLength(pathLen * f) : { x: E.vw / 2, y: E.vh / 2 });
  E.resizeHooks.push(() => {
    pathLen = path.getTotalLength ? path.getTotalLength() : 0;
    const mk = $$('.mk'), ms = $$('.ms');
    MS.forEach((f, k) => {
      const p = pt(f);
      mk[k].style.left = p.x + 'px'; mk[k].style.top = p.y + 'px';
      const half = (E.vw * 0.19) / 2 + 12;
      ms[k].style.left = Math.min(E.vw - half - E.vw * 0.03, Math.max(half, p.x)) + 'px';
      ms[k].style.top = p.y + (ABOVE[k] ? -0.15 : 0.14) * E.vh + 'px';
    });
  });

  // lõi đi theo đường (giá trị toạ độ tính lại khi resize)
  samples.forEach(([u, f], j) => {
    E.coreKeys.push([9 + u, { x: () => pt(f).x - E.vw / 2, y: () => pt(f).y - E.vh / 2, s: 0.28, o: 1 }, j === 0 ? 'io' : 'l']);
  });
  E.coreKeys.push([9.95, { x: () => pt(1).x - E.vw / 2, y: () => pt(1).y - E.vh / 2, s: 0.28, o: 1 }]);
  t('.road .rdraw', samples.map(([u, f], j) => [u, { dash: f }, j === 0 ? 'io' : 'l']).concat([[0.95, { dash: 1 }], [1.03, { dash: 0 }]]));

  t('.hA', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }], [b(6, 0.3), { o: 1, y: 0 }], [b(6, 0.55), { o: 0, y: '-3vh' }]]);
  t('.hB', [[b(6, 0.5), { o: 0, y: '3vh' }], [b(6, 0.85), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.03, { o: 0 }]]);
  t('.road .rbase', [[0, { o: 0 }], [b(1, 0.3), { o: 1 }], [0.95, { o: 1 }], [1.03, { o: 0 }]]);

  $$('.mk').forEach((el, k) => t([el], [[b(k + 2, 0.75), { s: 0, o: 0 }], [b(k + 2, 0.92), { s: 1, o: 1 }, 'b'], [0.95, { o: 1 }], [1.03, { o: 0 }]]));
  $$('.ms').forEach((el, k) => t([el], [[b(k + 2, 0.78), { o: 0, y: ABOVE[k] ? 24 : -24, s: 0.9 }], [b(k + 2, 1), { o: 1, y: 0, s: 1 }, 'b'], [0.95, { o: 1 }], [1.03, { o: 0 }]]));
  t('.levels', [[b(6, 0.1), { o: 0, y: 30 }], [b(6, 0.4), { o: 1, y: 0 }, 'o'], [0.95, { o: 1 }], [1.03, { o: 0 }]]);
  $$('.lvl').forEach((el, k) => t([el], [[b(6, 0.2 + k * 0.15), { o: 0, x: -20 }], [b(6, 0.45 + k * 0.15), { o: 1, x: 0 }]]));
});
