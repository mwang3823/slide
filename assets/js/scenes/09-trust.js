/* 08 · Tin tưởng — 6 ý
 * ý 1: làm sao biết nó đúng? · ý 2–5: 4 lớp đúng (dữ liệu, số liệu, suy luận, quyền) · ý 6: cơ chế kiểm chứng */
E.def(8, (S) => {
  const { t, $$ } = S, b = S.beat;
  const num = (el, v) => parseFloat(getComputedStyle(el).getPropertyValue(v)) || 0;

  t('.head:not(.head2)', [[-0.06, { o: 0, y: 30 }], [0.06, { o: 1, y: 0 }], [b(6, 0.3), { o: 1, y: 0 }], [b(6, 0.6), { o: 0, y: '-3vh' }]]);
  t('.head2', [[b(6, 0.5), { o: 0, y: '3vh' }], [b(6, 0.85), { o: 1, y: 0 }], [0.95, { o: 1 }], [1.03, { o: 0 }]]);

  $$('.pil').forEach((el, k) => {
    const X = num(el, '--x'), Y = num(el, '--y'), B = k + 2;
    t([el], [[b(B, 0), { o: 0, x: -X + 'vw', y: 4 - Y + 'vh', s: 0.2 }], [b(B, 0.5), { o: 1, x: 0, y: 0, s: 1 }, 'o'], [0.945, { o: 1, s: 1 }], [1.02, { o: 0, s: 0.9 }]]);
    t([el.querySelector('.ck circle')], [[b(B, 0.5), { dash: 0 }], [b(B, 0.8), { dash: 1 }]]);
    t([el.querySelector('.ck path')], [[b(B, 0.7), { dash: 0 }], [b(B, 0.95), { dash: 1 }]]);
  });
  $$('.tlinks .base').forEach((el, k) => t([el], [[b(k + 2, 0), { dash: 0 }], [b(k + 2, 0.35), { dash: 1 }], [0.945, { dash: 1 }], [1.0, { dash: 0 }]]));

  t('.guard', [[b(6, 0), { s: 0.8, o: 0 }], [b(6, 0.1), { o: 1 }], [b(6, 0.45), { s: 1 }, 'o'], [0.945, { o: 1 }], [1.02, { o: 0 }]]);
  t('.guard circle', [[b(6, 0), { dash: 0 }], [b(6, 0.45), { dash: 1 }]]);
  $$('.badges li').forEach((el, k) => t([el], [[b(6, 0.2 + k * 0.1), { o: 0, y: 20 }], [b(6, 0.4 + k * 0.1), { o: 1, y: 0 }, 'b'], [0.945, { o: 1 }], [1.02, { o: 0 }]]));
});
