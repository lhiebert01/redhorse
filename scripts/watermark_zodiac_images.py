#!/usr/bin/env python3
"""
Watermark Zodiac Badge Images for FREE Page

This script takes the original zodiac badge images and creates watermarked
"proof" versions for use on the FREE page. This prevents users from downloading
clean images by right-clicking or long-pressing.

Usage:
    python scripts/watermark_zodiac_images.py

Requirements:
    pip install Pillow
"""

import os
from PIL import Image, ImageDraw, ImageFont
import math

# Configuration
SOURCE_DIR = "public/assets/zodiac-badges"
OUTPUT_DIR = "public/assets/zodiac-badges-free"
WATERMARK_TEXT = "FREE ORACLE • redhorseoracle.com"

# Watermark styling
WATERMARK_OPACITY = 100  # 0-255 (100 = ~40% visible)
WATERMARK_ANGLE = -30  # Diagonal angle in degrees
WATERMARK_SPACING = 150  # Pixels between watermark repetitions
FONT_SIZE = 28


def create_watermarked_image(input_path, output_path):
    """
    Add tiled diagonal watermark to an image.
    """
    try:
        # Open the original image
        original = Image.open(input_path).convert("RGBA")
        width, height = original.size

        # Create a transparent overlay for the watermark
        watermark_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark_layer)

        # Try to use a nice font, fall back to default if not available
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", FONT_SIZE)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", FONT_SIZE)
            except:
                try:
                    font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", FONT_SIZE)
                except:
                    font = ImageFont.load_default()

        # Get text size for spacing calculations
        bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Create a larger canvas for rotation (to avoid clipping)
        diagonal = int(math.sqrt(width**2 + height**2))
        temp_layer = Image.new("RGBA", (diagonal * 2, diagonal * 2), (0, 0, 0, 0))
        temp_draw = ImageDraw.Draw(temp_layer)

        # Draw tiled watermark text
        y = 0
        row = 0
        while y < diagonal * 2:
            x = -text_width if row % 2 == 0 else -text_width // 2  # Offset alternate rows
            while x < diagonal * 2:
                # White text with specified opacity
                temp_draw.text(
                    (x, y),
                    WATERMARK_TEXT,
                    font=font,
                    fill=(255, 255, 255, WATERMARK_OPACITY)
                )
                x += text_width + WATERMARK_SPACING
            y += text_height + WATERMARK_SPACING
            row += 1

        # Rotate the watermark layer
        temp_layer = temp_layer.rotate(WATERMARK_ANGLE, resample=Image.BICUBIC, expand=False)

        # Crop to original size (centered)
        center_x = temp_layer.width // 2
        center_y = temp_layer.height // 2
        left = center_x - width // 2
        top = center_y - height // 2
        temp_layer = temp_layer.crop((left, top, left + width, top + height))

        # Composite the watermark onto the original
        watermarked = Image.alpha_composite(original, temp_layer)

        # Convert back to RGB for JPEG output
        if output_path.lower().endswith('.jpeg') or output_path.lower().endswith('.jpg'):
            watermarked = watermarked.convert("RGB")

        # Save the watermarked image
        watermarked.save(output_path, quality=90)
        return True

    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def main():
    print("=" * 60)
    print("ZODIAC BADGE WATERMARKING SCRIPT")
    print("=" * 60)
    print(f"\nSource: {SOURCE_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Watermark: '{WATERMARK_TEXT}'")
    print(f"Opacity: {WATERMARK_OPACITY}/255 ({int(WATERMARK_OPACITY/255*100)}%)")
    print(f"Angle: {WATERMARK_ANGLE}°")
    print()

    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Get list of image files
    if not os.path.exists(SOURCE_DIR):
        print(f"ERROR: Source directory not found: {SOURCE_DIR}")
        return

    image_files = [f for f in os.listdir(SOURCE_DIR)
                   if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

    if not image_files:
        print("ERROR: No image files found in source directory")
        return

    print(f"Found {len(image_files)} images to watermark\n")

    success_count = 0
    fail_count = 0

    for filename in sorted(image_files):
        input_path = os.path.join(SOURCE_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)

        print(f"Processing: {filename}...", end=" ")

        if create_watermarked_image(input_path, output_path):
            print("✓")
            success_count += 1
        else:
            print("✗")
            fail_count += 1

    print()
    print("=" * 60)
    print(f"COMPLETE: {success_count} watermarked, {fail_count} failed")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
