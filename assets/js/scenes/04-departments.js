/* 04 · Mỗi phòng ban — 3 ý
 * ý 1: thay vì một AI biết tất cả · ý 2: mỗi phòng ban một trợ lý · ý 3: chung nền tảng, mỗi trợ lý đúng phạm vi */
E.def(3, (S) => {
  const { t, $$ } = S, b = S.beat;
  const num = (el, v) => parseFloat(getComputedStyle(el).getPropertyValue(v)) || 0;

  t('.head', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }], [0.945, { o: 1 }], [1.02, { o: 0 }]]);

  // ý 1
  t('.allai', [[0.02, { o: 0, y: 20 }], [b(1, 0.3), { o: 1, y: 0 }], [b(2, 0), { o: 1, y: 0 }], [b(2, 0.25), { o: 0, y: -20 }]]);
  t('.allai i', [[b(1, 0.5), { sx: 0 }], [b(1, 0.85), { sx: 1 }]]);

  // ý 2
  $$('.dept').forEach((el, k) => {
    const X = num(el, '--x'), Y = num(el, '--y');
    const from = { x: -X + 'vw', y: 4 - Y + 'vh', s: 0.2, o: 0 };
    t([el], [
      [b(2, 0.05 + k * 0.08), from], [b(2, 0.3 + k * 0.08), { x: 0, y: 0, s: 1, o: 1 }, 'o'],
      [0.945 + k * 0.006, { x: 0, y: 0, s: 1, o: 1 }], [1.03 + k * 0.006, from, 'i'],
    ]);
    const on = b(2, 0.32 + k * 0.08);
    t([el], [[on - 0.001, { on: 0 }], [on, { on: 1 }], [on + 0.03, { on: 1 }], [on + 0.031, { on: 0 }]]);
  });
  $$('.links .base').forEach((el, k) => t([el], [[b(2, 0.15 + k * 0.08), { dash: 0 }], [b(2, 0.4 + k * 0.08), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]));

  // ý 3
  t('.plat-label', [[b(3, 0), { o: 0, y: 20 }], [b(3, 0.25), { o: 1, y: 0 }], [0.945, { o: 1 }], [1.02, { o: 0 }]]);
  $$('.pc').forEach((el, k) => t([el], [[b(3, 0.15 + k * 0.08), { o: 0, s: 0.4 }], [b(3, 0.35 + k * 0.08), { o: 1, s: 1 }, 'b'], [0.945, { o: 1, s: 1 }], [1.02, { o: 0, s: 0.4 }]]));
  $$('.links .pulse').forEach((el, k) => t([el], [
    [b(3, 0.3), { o: 0, flow: 0 }], [b(3, 0.4), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 2.4 + k * 0.13 }, 'l'],
  ]));
  t('.tag', [[b(3, 0.6), { o: 0, y: 20 }], [b(3, 0.9), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
