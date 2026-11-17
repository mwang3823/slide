/* 07 · Hành chính văn phòng — 4 ý
 * 1: không chỉ dữ liệu lớn — khối hành chính có giá trị sớm (4 năng lực)
 * 2: một công văn đến → đọc, trích yêu cầu & hạn, tìm tài liệu, dự thảo → người phụ trách duyệt
 * 3: sau cuộc họp → biên bản, kết luận, nhiệm vụ, nhắc việc · 4: AI không ký, không phát hành, không quyết định thay */
E.def(7, (S) => {
  const { t, $$ } = S, b = S.beat;
  const out = (sel, k = 0) => t(sel, [[0.945 + k * 0.006, { o: 1 }], [1.02 + k * 0.006, { o: 0 }]]);

  t('.head', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }]]);
  out('.head');

  // ý 1
  $$('.cap').forEach((el, k) => {
    t([el], [[b(1, 0.1 + k * 0.12), { o: 0, y: 30, s: 0.9 }], [b(1, 0.4 + k * 0.12), { o: 1, y: 0, s: 1 }, 'b']]);
    out([el], k);
  });

  // ý 2 — công văn đến
  t('.env', [[b(2, 0), { o: 0, x: '-6vw' }], [b(2, 0.15), { o: 1, x: 0 }, 'o']]);
  t('.env .ico', [[b(2, 0.15), { s: 1 }], [b(2, 0.22), { s: 1.15 }], [b(2, 0.3), { s: 1 }]]);
  out('.env');
  t('.core-l2', [[b(2, 0.15), { o: 0, y: 10 }], [b(2, 0.3), { o: 1, y: 0 }]]);
  out('.core-l2');
  t('.aline .base', [[b(2, 0.1), { dash: 0 }], [b(2, 0.85), { dash: 1 }, 'l'], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.aline .pulse', [[b(2, 0.8), { o: 0, flow: 0 }], [b(2, 0.9), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 4 }, 'l']]);
  $$('.af').forEach((el, k) => {
    const u = b(2, 0.3 + k * 0.13);
    t([el], [[u - 0.03, { o: 0, y: 20 }], [u, { o: 1, y: 0 }, 'b'], [u - 0.001, { on: 0 }], [u + 0.01, { on: 1 }]]);
    out([el], k);
  });
  t('.appr', [[b(2, 0.82), { o: 0, s: 0.7 }], [b(2, 1), { o: 1, s: 1 }, 'b']]);
  out('.appr');

  // ý 3 — cuộc họp
  t('.mtg', [[b(3, 0), { o: 0, y: 30 }], [b(3, 0.2), { o: 1, y: 0 }, 'o']]);
  out('.mtg');
  $$('.mi').forEach((el, k) => {
    const u = b(3, 0.25 + k * 0.14);
    t([el], [[u - 0.001, { on: 0, s: 1 }], [u, { on: 1 }], [u + 0.015, { s: 1.08 }], [u + 0.03, { s: 1 }]]);
  });
  t('.mi.gold .i', [[b(3, 0.85), { r: 0 }], [b(3, 0.88), { r: 18 }], [b(3, 0.91), { r: -18 }], [b(3, 0.94), { r: 10 }], [b(3, 0.97), { r: 0 }]]);

  // ý 4 — giới hạn của AI
  $$('.nos span').forEach((el, k) => {
    t([el], [[b(4, 0.05 + k * 0.15), { o: 0, y: 16 }], [b(4, 0.25 + k * 0.15), { o: 1, y: 0 }, 'b']]);
    out([el], k);
  });
  t('.tag', [[b(4, 0.6), { o: 0, y: 20 }], [b(4, 0.9), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
