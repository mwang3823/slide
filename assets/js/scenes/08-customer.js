/* 08 · Dịch vụ khách hàng — 4 ý
 * 1: khách hàng gọi hỏi vì sao hóa đơn tăng — nhân viên mới có thông tin danh bộ
 * 2: cần thêm lịch sử đồng hồ, tiêu thụ, hóa đơn, công nợ, phản ánh trước đây → gom về trợ lý số
 * 3: tổng hợp thành góc nhìn Customer 360 · 4: nhân viên tập trung hiểu vấn đề & phục vụ */
E.def(7, (S) => {
  const { t, $$ } = S, b = S.beat;
  const out = (sel, k = 0) => t(sel, [[0.945 + k * 0.006, { o: 1 }], [1.02 + k * 0.006, { o: 0 }]]);

  t('.head', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }]]);
  out('.head');

  // ý 1 — khách hàng gọi đến, nhân viên chỉ có danh bộ
  t('.cs-call', [[b(1, 0), { o: 0, x: '-6vw' }], [b(1, 0.3), { o: 1, x: 0 }, 'o']]);
  out('.cs-call');
  $$('.cs-qq').forEach((el, k) => t([el], [[b(1, 0.2 + k * 0.14), { o: 0, y: 14 }], [b(1, 0.4 + k * 0.14), { o: 1, y: 0 }, 'b']]));

  // ý 2 — các nguồn còn lại hiện ra và nối về trợ lý số (nguồn 0 = danh bộ, đã có từ ý 1)
  $$('.cs-src').forEach((el, k) => {
    const [kb, f] = k === 0 ? [1, 0.72] : [2, 0.05 + (k - 1) * 0.1];
    t([el], [[b(kb, f), { o: 0, s: 0.85 }], [b(kb, f + 0.2), { o: 1, s: 1 }, 'b']]);
    const u = b(2, 0.3 + k * 0.08);
    t([el], [[u - 0.001, { on: 0 }], [u, { on: 1 }]]);
    out([el], k);
  });
  $$('.cs-links .ln').forEach((el, k) => t([el], [[b(2, 0.12 + k * 0.08), { dash: 0 }], [b(2, 0.32 + k * 0.08), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]));
  $$('.cs-links .lp').forEach((el, k) => t([el], [[b(2, 0.32 + k * 0.08), { o: 0, flow: 0 }], [b(2, 0.42 + k * 0.08), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 4 }, 'l']]));
  t('.cs-core', [[b(2, 0.6), { o: 0, y: 10 }], [b(2, 0.8), { o: 1, y: 0 }]]);
  out('.cs-core');

  // ý 3 — một câu hỏi → Customer 360
  t('.cs-links .q1', [[b(3, 0), { dash: 0 }], [b(3, 0.12), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.cs-ask', [[b(3, 0.05), { o: 0, y: 16 }], [b(3, 0.15), { o: 1, y: 0 }]]);
  out('.cs-ask');
  t('.cs-ask .typed', [[b(3, 0.12), { txt: 0 }], [b(3, 0.4), { txt: 1 }, 'l']]);
  t('.cs-links .q2', [[b(3, 0.4), { dash: 0 }], [b(3, 0.52), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.cs-360', [[b(3, 0.45), { o: 0, x: '5vw' }], [b(3, 0.6), { o: 1, x: 0 }, 'o']]);
  out('.cs-360');
  $$('.cs-row:not(.ok)').forEach((el, k) => t([el], [[b(3, 0.55 + k * 0.1), { o: 0, y: 14 }], [b(3, 0.67 + k * 0.1), { o: 1, y: 0 }, 'b']]));

  // ý 4 — nhân viên hiểu vấn đề và phản hồi
  t('.cs-row.ok', [[b(4, 0.05), { o: 0, y: 14 }], [b(4, 0.25), { o: 1, y: 0 }, 'b'], [b(4, 0.3) - 0.001, { on: 0 }], [b(4, 0.3), { on: 1 }]]);
  t('.tag', [[b(4, 0.45), { o: 0, y: 20 }], [b(4, 0.8), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
