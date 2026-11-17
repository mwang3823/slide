/* 04 · Góc nhìn ngành nước (IWA) — 6 ý
 * 1: không chỉ là xu hướng công nghệ — IWA có white paper GenAI & Agentic AI cho đơn vị cấp nước
 * 2: Traditional AI (phát hiện · dự báo) · 3: Generative AI (hiểu · giải thích · tổng hợp)
 * 4: Agentic AI (lập kế hoạch · dùng công cụ · tham gia quy trình, trong phạm vi được cấp quyền)
 * 5: giá trị không chỉ ở công nghệ → năng suất, nhân sự, ra quyết định, nguồn lực, lãnh đạo
 * 6: AI ngành nước dịch chuyển từ phân tích dữ liệu → hỗ trợ công việc & điều hành */
E.def(3, (S) => {
  const { t, $$ } = S, b = S.beat;
  const out = (sel, to = {}) => {
    const id = Object.fromEntries(Object.keys(to).map((k) => [k, k === 's' ? 1 : 0]));
    t(sel, [[0.945, { o: 1, ...id }], [1.04, { o: 0, ...to }]]);
  };
  const flag = (el, u0, u1) => t([el], [[u0 - 0.001, { on: 0 }], [u0, { on: 1 }], ...(u1 ? [[u1 - 0.001, { on: 1 }], [u1, { on: 0 }]] : [])]);

  t('.head', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }]]);
  out('.head', { y: '-4vh' });

  // ý 1 — white paper IWA
  t('.iw-book', [[0.02, { o: 0, x: '-8vw', r: -6, s: 0.9 }], [b(1, 0.45), { o: 1, x: 0, r: 0, s: 1 }, 'o']]);
  out('.iw-book', { s: 0.92 });
  ['.iw-wp', '.iw-org', '.iw-prog', '.iw-title'].forEach((sel, k) => t(sel, [[b(1, 0.3 + k * 0.12), { o: 0, y: 12 }], [b(1, 0.48 + k * 0.12), { o: 1, y: 0 }]]));
  t('.iw-rule', [[b(1, 0.45), { sx: 0 }], [b(1, 0.65), { sx: 1 }]]);
  t('.iw-drop', [[b(1, 0.7), { o: 0, s: 0.4 }], [b(1, 0.95), { o: 1, s: 1 }, 'b']]);
  t('.iw-src', [[b(1, 0.75), { o: 0 }], [b(1, 0.95), { o: 1 }]]);
  out('.iw-src');

  // ý 2–4 — ba bước phát triển, bước sau cao hơn bước trước
  t('.iw-evo-h', [[b(2, 0), { o: 0, y: 14 }], [b(2, 0.2), { o: 1, y: 0 }]]);
  out('.iw-evo-h');
  const st = $$('.iw-st'), arr = $$('.iw-arr');
  st.forEach((el, k) => {
    const n = k + 2;
    t([el], [[b(n, 0.15), { o: 0, y: '5vh', s: 0.9 }], [b(n, 0.45), { o: 1, y: 0, s: 1 }, 'b']]);
    out([el]);
    flag(el, b(n, 0.45), k < 2 ? b(n + 1, 0.15) : 0);
    $$(`.st${k + 1} li`).forEach((li, j) => t([li], [[b(n, 0.45 + j * 0.12), { o: 0, x: -14 }], [b(n, 0.6 + j * 0.12), { o: 1, x: 0 }]]));
    if (k) {
      t([arr[k - 1]], [[b(n, 0), { o: 0, x: -14, r: -28 }], [b(n, 0.2), { o: 1, x: 0, r: -28 }]]);
      out([arr[k - 1]]);
    }
  });
  t('.iw-perm', [[b(4, 0.82), { o: 0, s: 1.15 }], [b(4, 1), { o: 1, s: 1 }, 'b']]);

  // ý 5 — giá trị của AI (lõi hiện ở tâm vòng, core.js)
  t('.iw-vh', [[b(5, 0), { o: 0, y: 16 }], [b(5, 0.2), { o: 1, y: 0 }]]);
  out('.iw-vh');
  t('.iw-ring .base', [[b(5, 0.05), { dash: 0 }], [b(5, 0.45), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.iw-ring .pulse', [[b(5, 0.45), { o: 0, flow: 0 }], [b(5, 0.55), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 3 }, 'l']]);
  $$('.iw-v').forEach((el, k) => {
    t([el], [[b(5, 0.2 + k * 0.1), { o: 0, s: 0.4 }], [b(5, 0.38 + k * 0.1), { o: 1, s: 1 }, 'b']]);
    out([el]);
    flag(el, b(5, 0.4 + k * 0.1));
  });

  // ý 6 — dịch chuyển: phân tích dữ liệu → hỗ trợ công việc & điều hành
  t('.iw-shift', [[b(6, 0), { o: 0, y: 16 }], [b(6, 0.2), { o: 1, y: 0 }]]);
  out('.iw-shift');
  t('.iw-shift .ln i', [[b(6, 0.2), { sx: 0 }], [b(6, 0.55), { sx: 1 }]]);
  t('.iw-shift .ah', [[b(6, 0.5), { o: 0, x: -10 }], [b(6, 0.6), { o: 1, x: 0 }]]);
  t('.iw-shift .to', [[b(6, 0.55), { o: 0, s: 0.8 }], [b(6, 0.75), { o: 1, s: 1 }, 'b']]);
  t('.tag', [[b(6, 0.6), { o: 0, y: 20 }], [b(6, 0.9), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
