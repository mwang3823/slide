/* 09 · Lãnh đạo — 5 ý
 * 1: không phải "thêm một báo cáo" mà là "Hôm nay có gì cần chú ý?"
 * 2: Trợ lý Điều hành tổng hợp kinh doanh, KTKS, kỹ thuật, tài chính, nhiệm vụ → bất thường, việc chậm, xu hướng
 * 3: hỏi tiếp để đi sâu nguyên nhân, dữ liệu cơ sở, nguồn · 4: AI không quyết định thay · 5: rút ngắn từ nhiều báo cáo → điều cần quan tâm */
E.def(8, (S) => {
  const { t, $$ } = S, b = S.beat;
  const out = (sel, k = 0) => t(sel, [[0.945 + k * 0.006, { o: 1 }], [1.02 + k * 0.006, { o: 0 }]]);

  t('.head', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }]]);
  out('.head');

  // ý 1 — "thêm một báo cáo" bị gạch → câu hỏi thật của lãnh đạo
  t('.ex-rpt', [[b(1, 0), { o: 0, y: 16 }], [b(1, 0.2), { o: 1, y: 0 }], [b(1, 0.55), { o: 1 }], [b(1, 0.7), { o: 0.5 }], [b(2, 0), { o: 0.5, y: 0 }], [b(2, 0.15), { o: 0, y: -20 }]]);
  t('.ex-rpt > i', [[b(1, 0.3), { sx: 0 }], [b(1, 0.5), { sx: 1 }]]);
  t('.ex-q', [[b(1, 0.5), { o: 0, s: 0.8, x: 0, y: 0 }], [b(1, 0.75), { o: 1, s: 1.3 }, 'b'], [b(2, 0), { s: 1.3, x: 0, y: 0 }], [b(2, 0.3), { s: 0.85, x: '25vw', y: '-36vh' }]]);
  out('.ex-q');

  // ý 2 — gom 5 nguồn về Trợ lý Điều hành → điều cần chú ý
  $$('.ex-src').forEach((el, k) => {
    t([el], [[b(2, 0.1 + k * 0.07), { o: 0, x: '-4vw' }], [b(2, 0.25 + k * 0.07), { o: 1, x: 0 }, 'o']]);
    const u = b(2, 0.4 + k * 0.05);
    t([el], [[u - 0.001, { on: 0 }], [u, { on: 1 }]]);
    out([el], k);
  });
  $$('.ex-links .ln').forEach((el, k) => t([el], [[b(2, 0.2 + k * 0.06), { dash: 0 }], [b(2, 0.4 + k * 0.06), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]));
  $$('.ex-links .lp').forEach((el, k) => t([el], [[b(2, 0.4 + k * 0.06), { o: 0, flow: 0 }], [b(2, 0.5 + k * 0.06), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 4 }, 'l']]));
  t('.ex-core', [[b(2, 0.45), { o: 0, y: 10 }], [b(2, 0.6), { o: 1, y: 0 }]]);
  out('.ex-core');
  $$('.ex-chips span').forEach((el, k) => {
    t([el], [[b(2, 0.5 + k * 0.06), { o: 0, y: 12 }], [b(2, 0.62 + k * 0.06), { o: 1, y: 0 }, 'b']]);
    out([el], k);
  });
  t('.ex-links .out', [[b(2, 0.62), { dash: 0 }], [b(2, 0.72), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.ex-att', [[b(2, 0.65), { o: 0, x: '5vw' }], [b(2, 0.8), { o: 1, x: 0 }, 'o']]);
  out('.ex-att');
  const rows = $$('.ex-row');
  t([rows[0]], [[b(2, 0.8), { o: 0, y: 12 }], [b(2, 0.95), { o: 1, y: 0 }, 'b'], [b(2, 0.95) - 0.001, { on: 0 }], [b(2, 0.95), { on: 1 }]]);

  // ý 3 — hỏi tiếp: nguyên nhân, dữ liệu cơ sở, nguồn
  rows.slice(1).forEach((el, k) => {
    t([el], [[b(2, 0.85), { o: 0 }], [b(2, 0.95), { o: 0.3 }], [b(3, 0.1 + k * 0.12), { o: 0.3 }], [b(3, 0.25 + k * 0.12), { o: 1 }]]);
    const u = b(3, 0.25 + k * 0.12);
    t([el], [[u - 0.001, { on: 0 }], [u, { on: 1 }]]);
  });
  $$('.ex-fqs span').forEach((el, k) => {
    t([el], [[b(3, 0.4 + k * 0.12), { o: 0, y: 14 }], [b(3, 0.55 + k * 0.12), { o: 1, y: 0 }, 'b']]);
    out([el], k);
  });

  // ý 4 — AI không quyết định thay lãnh đạo
  t('.ex-dec .no', [[b(4, 0.1), { o: 0, y: 16 }], [b(4, 0.35), { o: 1, y: 0 }, 'b']]);
  t('.ex-dec .yes', [[b(4, 0.4), { o: 0, s: 0.8 }], [b(4, 0.7), { o: 1, s: 1 }, 'b']]);
  out('.ex-dec');

  // ý 5 — từ nhiều báo cáo → điều cần quan tâm
  t('.tag', [[b(5, 0.2), { o: 0, y: 20 }], [b(5, 0.6), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
