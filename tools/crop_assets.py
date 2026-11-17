"""Cắt ảnh từ pptx gốc, làm mờ viền (feather) và xuất PNG có alpha.
Dùng: python crop_assets.py <thư_mục_media_pptx> <thư_mục_out>"""
import sys
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
K = 1672 / 1400  # toạ độ đo trên ảnh 1400px


def sc(*v):
    return [round(x * K) for x in v]


def save(img, mask, box, name, blur):
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    img = img.convert("RGBA")
    img.putalpha(mask)
    img.crop(box).save(f"{OUT}/{name}.png")


# 1. Giọt nước hero (slide 1)
im = Image.open(f"{SRC}/image1.png")
m = Image.new("L", im.size, 0)
d = ImageDraw.Draw(m)
d.polygon([tuple(sc(1075, 22)), tuple(sc(905, 340)), tuple(sc(1245, 340))], fill=255)
d.ellipse(sc(900, 230, 1250, 545), fill=255)
d.ellipse(sc(830, 500, 1320, 640), fill=255)
save(im, m, sc(800, 10, 1350, 660), "hero-drop", 14)

# 2. Sóng trái hero (slide 1)
m = Image.new("L", im.size, 0)
d = ImageDraw.Draw(m)
d.ellipse(sc(-260, 470, 700, 700), fill=255)
save(im, m, sc(0, 440, 720, 690), "wave-left", 26)

# 3. Sóng phải (slide 8)
im = Image.open(f"{SRC}/image8.png")
m = Image.new("L", im.size, 0)
d = ImageDraw.Draw(m)
d.ellipse(sc(1120, 640, 1700, 900), fill=255)
save(im, m, sc(1080, 620, 1400, 788), "wave-right", 22)
