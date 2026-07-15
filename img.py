
from PIL import Image

img = Image.open(r"E:\New folder (3)\ChatGPT Image Jul 15, 2026, 06_21_51 PM.png")

w, h = img.size

# Crop the 3rd image (bottom-left quadrant)
fourth = img.crop((w//2, h//2, w, h))

fourth.save("fourth_image.png")




