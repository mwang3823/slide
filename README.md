# Từ Chuyển đổi số đến Trợ lý số

Bài thuyết trình web, animation gắn với scroll, gồm 15 cảnh nối liền nhau qua "lõi trợ lý số" (giọt nước + khối 3 lớp).

## Chạy local
```bash
python3 -m http.server 5178   # mở http://localhost:5178
```
Mở thẳng `index.html` (file://) cũng chạy được: không có ES module, không cần build, font và ảnh đều lưu sẵn trong repo.

## Trình chiếu
| Phím | Tác dụng |
|---|---|
| `→` `↓` `Space` `PageDown` | Bước kế tiếp (dùng được với bút trình chiếu) |
| Click chuột trái | Bước kế tiếp |
| `←` `↑` `PageUp` · click chuột phải | Bước trước |
| `1`–`9`, `Home`, `End` | Nhảy tới cảnh |
| `F` | Toàn màn hình |
| `P` | Mở màn người nói |
| `N` · nút 💬 | Nội dung nói của lần bấm hiện tại |

Cụm nút ◀ ▶ 💬 ⛶ ở góc phải dưới mờ 15%, rê chuột vào thì rõ. Mỗi lần bấm chạy trọn phần nội dung tới điểm dừng kế tiếp (`data-pause` trong `index.html`).
| `L` | Bật/tắt chế độ nhẹ (máy yếu) · hoặc thêm `?lite=1` vào URL |

## Màn người nói (2 màn hình)
1. Mở `index.html`, bấm `P` (hoặc nút 💻 trong cụm nút góc phải) → mở cửa sổ `presenter.html`.
2. Kéo cửa sổ trình chiếu sang máy chiếu, bấm `F` để toàn màn hình. Màn người nói để lại trên laptop.
3. Bấm ←/→ ở cửa sổ nào cũng được, hai cửa sổ luôn đồng bộ (BroadcastChannel, cần chạy qua http/GitHub Pages).

Màn người nói gồm: xem trước slide đang chiếu (chạy animation thật), phần tiếp theo, đồng hồ 15 phút, danh sách slide, toàn bộ lời nói của slide.

## Deploy GitHub Pages
Push lên GitHub, vào **Settings → Pages**, chọn *Deploy from branch*, nhánh `main`, thư mục `/ (root)`.

## Cấu trúc
```
index.html                 markup 15 cảnh + sprite icon + lõi SVG
assets/css/fonts.css       Be Vietnam Pro (self-host, subset tiếng Việt)
assets/css/base.css        token màu, component, UI chrome, chế độ nhẹ
assets/css/scenes.css      bố cục từng cảnh
assets/js/engine.js        engine keyframe theo scroll (lerp, glide, lite, điều hướng)
assets/js/core.js          quỹ đạo lõi dùng chung giữa các cảnh + nền
assets/js/scenes/*.js      animation từng cảnh (thời gian cục bộ u = 0..1)
assets/js/notes.js         ghi chú người nói
tools/crop_assets.py       cắt ảnh từ pptx gốc (cần Pillow)
```

## Hiệu năng (máy không có GPU)
- Chỉ animate `transform`, `opacity` (cộng `clip-path` và `stroke-dashoffset` cho phần tử nhỏ). Không dùng `backdrop-filter`, không dùng filter SVG.
- Một vòng `requestAnimationFrame` duy nhất, chỉ chạy khi có thay đổi. Cảnh nằm ngoài vùng nhìn thì bị ẩn và không cập nhật.
- Tự bật chế độ nhẹ khi FPS < 38 hoặc máy có ≤ 2 nhân CPU / ≤ 2GB RAM. Hỗ trợ `prefers-reduced-motion`.
- Sửa CSS/JS thì tăng `?v=` trong `index.html` để trình duyệt không dùng bản cache.
