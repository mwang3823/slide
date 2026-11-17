/* 10 · Giá trị (ý 1–6) → Khác biệt WAO (ý 7–11)
 * 1 câu hỏi giá trị · 2–5 bốn giá trị · 6 "không phải có AI"
 * 7 nhiều nền tảng đã tạo được Agent · 8 WAO bắt đầu từ nghiệp vụ cấp nước · 9 kinh nghiệm dùng chung · 10 kiểm chứng được là đúng · 11 đóng gói thành Trợ lý số */
E.def(12, (S) => {
  const { t, $$ } = S, b = S.beat;
  const num = (el, v) => parseFloat(getComputedStyle(el).getPropertyValue(v)) || 0;
  const end = (sel) => t(sel, [[0.945, { o: 1 }], [1.03, { o: 0 }]]);

  // — Giá trị —
  t('.hA', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }], [b(7, 0), { o: 1, y: 0 }], [b(7, 0.3), { o: 0, y: '-3vh' }]]);
  $$('.val').forEach((el, k) => {
    const sx = Math.sign(num(el, '--x')), sy = Math.sign(num(el, '--y'));
    const far = { o: 0, x: sx * 22 + 'vw', y: sy * 26 + 'vh', r: sx * 8, s: 1 };
    t([el], [[b(k + 2, 0), far], [b(k + 2, 0.6), { o: 1, x: 0, y: 0, r: 0 }, 'o'],
      [b(7, 0), { o: 1, x: 0, y: 0, s: 1 }], [b(7, 0.4), { ...far, s: 0.9, r: 0 }, 'i']]);
  });
  t('.vflow', [[b(6, 0), { o: 0, y: 20 }], [b(6, 0.3), { o: 1, y: 0 }], [b(7, 0), { o: 1 }], [b(7, 0.3), { o: 0 }]]);
  $$('.vf-l b').forEach((el, k) => t([el], [[b(6, 0.25 + k * 0.25), { sx: 0 }], [b(6, 0.5 + k * 0.25), { sx: 1 }]]));
  t('.vflow .gold', [[b(6, 0.7), { s: 0.85 }], [b(6, 0.85), { s: 1 }, 'b']]);
  t('.vwords', [[b(6, 0.5), { o: 0, y: 16 }], [b(6, 0.85), { o: 1, y: 0 }], [b(7, 0), { o: 1 }], [b(7, 0.25), { o: 0 }]]);

  // — Khác biệt WAO —
  t('.hB', [[b(7, 0.15), { o: 0, y: '3vh' }], [b(7, 0.45), { o: 1, y: 0 }]]);
  end('.hB');

  // ý 7 — nhiều nền tảng đã làm được: tạo Agent, API, phân quyền… nhưng bộ công cụ trống
  t('.gen', [[b(7, 0.3), { o: 0, x: '-5vw' }], [b(7, 0.6), { o: 1, x: 0 }, 'o'], [b(8, 0), { o: 1 }], [b(8, 0.3), { o: 0.4 }], [b(11, 0), { o: 0.4 }], [b(11, 0.2), { o: 0 }]]);
  $$('.gchips span').forEach((el, k) => t([el], [[b(7, 0.5 + k * 0.1), { o: 0, s: 0.6 }], [b(7, 0.65 + k * 0.1), { o: 1, s: 1 }, 'b']]));
  t('.empty', [[b(7, 0.8), { o: 0, y: 10 }], [b(7, 0.95), { o: 1, y: 0 }]]);

  // ý 8 — 01: bắt đầu từ nghiệp vụ cấp nước — năng lực theo từng bài toán bay vào nền tảng
  t('.d1l', [[b(8, 0), { o: 0, y: 14 }], [b(8, 0.2), { o: 1, y: 0 }]]);
  end('.d1l');
  t('.plat-cap', [[b(8, 0.05), { o: 0 }], [b(8, 0.25), { o: 1 }]]);
  end('.plat-cap');
  $$('.dm').forEach((el, k) => {
    const X = num(el, '--x'), Y = num(el, '--y');
    t([el], [[b(8, 0.15 + k * 0.07), { o: 0, x: -33 - X + 'vw', y: -1 - Y + 'vh', s: 0.5 }], [b(8, 0.4 + k * 0.07), { o: 1, x: 0, y: 0, s: 1 }, 'o']]);
    end([el]);
  });
  t('.dout .base', [[b(8, 0.75), { dash: 0 }], [b(8, 0.88), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]);
  t('.dout .pulse', [[b(8, 0.85), { o: 0, flow: 0 }], [b(8, 0.92), { o: 1 }], [0.945, { o: 1 }], [0.98, { o: 0, flow: 6 }, 'l']]);
  t('.outp', [[b(8, 0.8), { o: 0, x: '4vw', s: 0.9 }], [b(8, 1), { o: 1, x: 0, s: 1 }, 'b']]);
  end('.outp');

  // ý 9 — 02: kinh nghiệm của người giỏi thành năng lực dùng chung
  t('.d2', [[b(9, 0), { o: 0, y: 30 }], [b(9, 0.25), { o: 1, y: 0 }, 'o']]);
  end('.d2');
  t('.xe', [[b(9, 0.25), { s: 0.4, o: 0 }], [b(9, 0.38), { s: 1, o: 1 }, 'b']]);
  t('.xs', [[b(9, 0.42), { s: 0.4, o: 0 }], [b(9, 0.55), { s: 1, o: 1 }, 'b']]);
  $$('.ppl i').forEach((el, k) => t([el], [[b(9, 0.6 + k * 0.08), { s: 0, o: 0 }], [b(9, 0.7 + k * 0.08), { s: 1, o: 1 }, 'b']]));

  // ý 10 — 03: kiểm chứng được là trả lời đúng
  t('.d3', [[b(10, 0), { o: 0, y: 30 }], [b(10, 0.25), { o: 1, y: 0 }, 'o']]);
  end('.d3');
  $$('.vchk li').forEach((el, k) => {
    const u = b(10, 0.35 + k * 0.13);
    t([el], [[u - 0.001, { on: 0 }], [u, { on: 1 }], [u, { s: 1 }], [u + 0.015, { s: 1.06 }], [u + 0.03, { s: 1 }]]);
  });

  // ý 11 — kết luận: nền tảng đóng gói nghiệp vụ, tri thức, kinh nghiệm
  t('.outp', [[b(11, 0.1), { s: 1 }], [b(11, 0.3), { s: 1.08 }, 'b'], [b(11, 0.5), { s: 1.04 }]]);
  t('.tag', [[b(11, 0.35), { o: 0, y: 20 }], [b(11, 0.7), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.02, { o: 0 }]]);
});
