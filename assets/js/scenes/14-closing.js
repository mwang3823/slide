/* 11 · Tầm nhìn — 5 ý
 * 1: không thay thế người làm cấp nước · 2: nhiều trợ lý → hệ sinh thái nhân sự số
 * 3: nền tảng WAO (dữ liệu · API · MCP) · 4: ba câu kết · 5: AI không phải đích đến + cảm ơn */
E.def(13, (S) => {
  const { t, $$ } = S, b = S.beat;

  t('.head:not(.h3c)', [[-0.04, { o: 0, y: 30 }], [b(1, 0.25), { o: 1, y: 0 }], [b(3, 0), { o: 1, y: 0 }], [b(3, 0.25), { o: 0, y: '-3vh' }]]);
  t('.h3c', [[b(3, 0.2), { o: 0, y: '3vh' }], [b(3, 0.5), { o: 1, y: 0 }], [b(4, 0), { o: 1 }], [b(4, 0.25), { o: 0, y: '-3vh' }]]);

  const sp = $$('.eq-line > *');
  t([sp[0]], [[b(1, 0.3), { o: 0, y: 16 }], [b(1, 0.7), { o: 1, y: 0 }]]);
  t([sp[1], sp[2]], [[b(2, 0.6), { o: 0, y: 16 }], [b(2, 0.9), { o: 1, y: 0 }]]);
  t(sp, [[b(4, 0), { o: 1 }], [b(4, 0.25), { o: 0 }]]);

  // trợ lý hội tụ thành quỹ đạo quanh lõi, xoay theo scroll, rồi thu vào lõi
  const U0 = b(2, 0) - 0.02, U1 = b(4, 0.35);
  const ease = (p) => 1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3);
  $$('.ea').forEach((el, k) => {
    const th0 = (-90 + k * 45) * Math.PI / 180;
    const start = b(2, 0) + k * 0.012, land = b(2, 0.6) + k * 0.012;
    const kfs = [];
    for (let u = U0; u <= U1 + 1e-6; u += 0.015) {
      let f = u < land ? 2.6 - 1.6 * ease((u - start) / (land - start)) : 1;
      if (u > b(4, 0)) f = 1 - 0.8 * ease((u - b(4, 0)) / (U1 - b(4, 0)));
      const th = th0 + ((u - U0) / (U1 - U0)) * 0.9;
      const c = Math.cos(th), s = Math.sin(th);
      kfs.push([u, { x: () => c * 0.34 * E.vw * f, y: () => s * 0.27 * E.vh * f }, 'l']);
    }
    t([el], kfs);
    t([el], [[start, { o: 0, blur: 8, s: 1.3 }], [start + 0.08, { o: 1, blur: 0, s: 1 }], [b(4, 0), { o: 1, s: 1 }], [U1, { o: 0, s: 0.4 }]]);
  });

  $$('.fl').forEach((el, k) => t([el], [[b(4, 0.3 + k * 0.2), { o: 0, y: 20 }], [b(4, 0.5 + k * 0.2), { o: 1, y: 0 }], [b(5, 0), { o: 1 }], [b(5, 0.3), { o: 0, y: -16 }]]));
  t('.f2', [[b(5, 0.25), { o: 0, y: 30, blur: 6 }], [b(5, 0.6), { o: 1, y: 0, blur: 0 }, 'o']]);
  t('.f3', [[b(5, 0.6), { o: 0, y: 16 }], [b(5, 0.9), { o: 1, y: 0 }]]);
});
