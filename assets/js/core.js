/* Phần tử dùng chung xuyên suốt: "lõi trợ lý số" (giọt nước + khối 3 lớp) và nền.
 * Lõi đổi vị trí / tỉ lệ theo từng cảnh, từng ý → các cảnh nối liền nhau như một cảnh quay.
 * Toạ độ x/y tính từ tâm màn hình. E.B(cảnh, ý, tiến độ) → T toàn cục. */
(function () {
  const E = window.E;
  const P = (x, y, s, o = 1) => ({ x, y, s, o });
  E.coreKeys = [];   // các cảnh có thể push thêm (vd. lộ trình)

  E.buildCore = function () {
    const B = E.B;
    const keys = E.coreKeys.concat([
      [-0.4, P('22vw', '2vh', 0.7, 0)],
      // 1 · giọt nước hoá thành lõi ở cuối ý 2
      [B(0, 2, 0.72), P('2vw', '6vh', 0.72, 0)],
      [B(0, 2, 1), P(0, '6vh', 0.95, 1)],
      [1.03, P(0, '4vh', 0.14, 0)],                     // vỡ thành 13 hệ thống
      // 3 · lõi trượt vào cùng thẻ AI Agent (ý 3)
      [B(2, 3, 0), P('62vw', '-6vh', 0.5, 0)],
      [B(2, 3, 0.02), P('60vw', '-6vh', 0.5, 1)],
      [B(2, 3, 0.35), P('14vw', '-6vh', 0.5, 1)],
      [2.95, P('14vw', '-6vh', 0.5, 1)],
      // 4 · IWA: lõi ẩn khi nói về white paper & 3 bước AI, hiện ở tâm vòng giá trị (ý 5)
      [3.1, P('34vw', '6vh', 0.3, 0)],
      [B(3, 5, 0.05), P('34vw', '6vh', 0.3, 0)],
      [B(3, 5, 0.3), P('34vw', '6vh', 0.34, 1), 'b'],
      [3.95, P('34vw', '6vh', 0.34, 1)],
      // 5 · "một AI biết tất cả?" → nền tảng
      [4.1, P(0, '4vh', 1.15, 1)],
      [B(4, 2, 0), P(0, '4vh', 1.15, 1)],
      [B(4, 2, 0.3), P(0, '4vh', 0.95, 1)],
      [4.95, P(0, '4vh', 0.95, 1)],
      [5.1, P(0, '4vh', 0.6, 1)],
      [5.95, P(0, '4vh', 0.6, 1)],
      [6.1, P(0, '6vh', 0.72, 1)],
      [6.95, P(0, '6vh', 0.72, 1)],
      // 8 · hành chính: lõi đứng trong luồng xử lý công văn
      [7.12, P('-27vw', '7vh', 0.3, 1)],
      [7.95, P('-27vw', '7vh', 0.3, 1)],
      // 9 · dịch vụ khách hàng: lõi là trung tâm danh bộ tập trung, sáng lên khi gom nguồn (ý 2)
      [8.12, P('-3vw', '2vh', 0.42, 0.35)],
      [B(8, 2, 0), P('-3vw', '2vh', 0.42, 0.35)],
      [B(8, 2, 0.3), P('-3vw', '2vh', 0.42, 1)],
      [8.95, P('-3vw', '2vh', 0.42, 1)],
      // 10 · lãnh đạo: ẩn khi câu hỏi ở giữa (ý 1), hiện thành Trợ lý điều hành (ý 2)
      [9.1, P('-8vw', '2vh', 0.5, 0)],
      [B(9, 2, 0.05), P('-8vw', '2vh', 0.5, 0)],
      [B(9, 2, 0.35), P('-8vw', '2vh', 0.5, 1)],
      [9.95, P('-8vw', '2vh', 0.5, 1)],
      // 11 · kiến trúc: lõi chờ mờ bên trái tới khi lớp Agent xuất hiện
      [10.12, P('-33vw', '-4vh', 0.45, 0.35)],
      [B(10, 2, 0.2), P('-33vw', '-4vh', 0.45, 0.35)],
      [B(10, 2, 0.4), P('-33vw', '-4vh', 0.45, 1)],
      [10.95, P('-33vw', '-4vh', 0.45, 1)],
      [11.12, P(0, '4vh', 0.5, 1)],
      [11.95, P(0, '4vh', 0.5, 1)],
      // 13 · giá trị → khác biệt: lõi thành "WAO AI Agent Platform" ở giữa
      [12.1, P(0, '2vh', 0.9, 1)],
      [B(12, 7, 0), P(0, '2vh', 0.9, 1)],
      [B(12, 7, 0.5), P(0, '2vh', 0.5, 0.35)],
      [B(12, 8, 0), P(0, '2vh', 0.5, 0.35)],
      [B(12, 8, 0.3), P(0, '2vh', 0.58, 1), 'b'],
      [12.95, P(0, '2vh', 0.58, 1)],
      // 14 · đi theo đường lộ trình (thêm ở 14-roadmap.js)
      [14.12, P(0, '4vh', 0.95, 1)],
      [B(14, 4, 0), P(0, '4vh', 0.95, 1)],
      [B(14, 4, 0.35), P(0, '-20vh', 0.55, 1)],
    ]).sort((a, b) => a[0] - b[0]);
    E.track('#core', keys.map(([t, p, e]) => [t, { x: p.x, y: p.y, s: p.s, o: p.o }, e]));

    // chi tiết bên trong lõi
    E.track('#core .rings', [
      [3.95, { s: 1 }], [4.12, { s: 1.35 }], [4.92, { s: 1.35 }], [5.08, { s: 1 }],
      [13.95, { s: 1 }], [14.15, { s: 1.4 }],
    ]);
    const x0 = B(10, 2, 0.25), x1 = B(10, 2, 0.5);
    E.track('#core .sl1', [[x0, { y: 0 }], [x1, { y: -46 }, 'b'], [10.945, { y: -46 }], [11, { y: 0 }]]);
    E.track('#core .sl3', [[x0, { y: 0 }], [x1, { y: 40 }, 'b'], [10.945, { y: 40 }], [11, { y: 0 }]]);
    E.track('#core .drop', [[x0, { y: 0 }], [x1, { y: -70 }, 'b'], [10.945, { y: -70 }], [11, { y: 0 }]]);
    E.track('#core .badge', [[B(11, 6, 0.3), { o: 0, s: 0.3 }], [B(11, 6, 0.55), { o: 1, s: 1 }, 'b'], [11.95, { o: 1, s: 1 }], [12.02, { o: 0, s: 0.3 }]]);
    E.track('#core .halo', [[13.9, { o: 1, s: 1 }], [14.15, { o: 1, s: 1.25 }]]);

    // nền: parallax nhẹ + tông xanh đậm dần theo bài (tắt ở chế độ nhẹ) + nền tối cảnh cuối
    E.track('.b1', [[0, { x: 0, y: 0 }, 'l'], [15, { x: '30vw', y: '40vh' }, 'l']]);
    E.track('.b2', [[0, { x: 0, y: 0 }, 'l'], [15, { x: '-25vw', y: '-30vh' }, 'l']]);
    E.track('.bg-wave', [[0, { o: 0, y: '6vh' }], [0.6, { o: 0.4, y: 0 }], [13.85, { o: 0.4 }], [14.05, { o: 0 }]]);
  };
})();
