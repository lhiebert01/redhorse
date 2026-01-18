#!/usr/bin/env python3
"""
Fire Horse 2026 - Zodiac Badge Image Generator (TEST VERSION)
Tests with just 3 images: Metal Dragon, Earth Dog, Fire Horse

Uses google-genai package (same as TypeScript code)

Usage:
    python generate_zodiac_test.py

Requirements:
    pip install google-genai python-dotenv
"""

import os
import sys
import time
import base64
from pathlib import Path
from datetime import datetime

# Try to load from .env.local first
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment from {env_path}")
    else:
        env_path = Path(__file__).parent.parent / 'import.env'
        if env_path.exists():
            load_dotenv(env_path)
            print(f"Loaded environment from {env_path}")
except ImportError:
    print("python-dotenv not installed, using system environment variables")

# Use google-genai package (same as TypeScript @google/genai)
from google import genai
from google.genai import types

# Configuration
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in environment variables")
    print("Please set GEMINI_API_KEY or create a .env.local file with it")
    sys.exit(1)

# Initialize client
client = genai.Client(api_key=API_KEY)

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / 'public' / 'assets' / 'zodiac-badges'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Model for image generation - same as TypeScript code uses
# gemini-3-pro-image-preview is the high quality model
IMAGE_MODEL = 'gemini-3-pro-image-preview'

# ============================================================================
# TEST DATA - Just 3 images to test
# ============================================================================

TEST_PROMPTS = {
    ("Metal", "Dragon"): {
        "badge": "IRON WILL GUARDIANS",
        "colors": "Silver, White, Electric Blue, Gold",
        "description": "A Metal Dragon made of gleaming platinum scales and cybernetic circuitry. The dragon flies through a storm of lightning."
    },
    ("Earth", "Dog"): {
        "badge": "LOYAL HEART GUARDS",
        "colors": "Terra Cotta, Brown, Slate, Gold",
        "description": "An Earth Dog made of solid bedrock and ancient stone. The dog sits immovably at a gate."
    },
    ("Fire", "Horse"): {
        "badge": "BLAZING SPEED GUARDIANS",
        "colors": "Intense Crimson, Burnt Orange, Charcoal, Gold",
        "description": "A Fire Horse made of flowing magma, embers, and golden light. The horse gallops through a cloud landscape."
    },
}


def build_image_prompt(element: str, animal: str, data: dict) -> str:
    """Build the full image generation prompt for a zodiac combination."""
    return f"""Create a mesmerizing digital art piece in 16:9 landscape aspect ratio for the Year of the Fire Horse 2026.

=== SUBJECT ===
{data['description']}

=== ART STYLE ===
Mesmerizing digital art combining traditional Chinese cloud patterns with abstract data streams and futuristic tech aesthetics. The style should blend ancient Chinese mysticism with modern cyberpunk/digital art. High contrast, luminous effects, and ethereal glow.

=== COLOR PALETTE ===
Primary colors: {data['colors']}
With accent glows and luminous effects throughout.

=== MANDATORY COMPOSITION ELEMENTS ===

1. **TOP BORDER**: A sleek, futuristic metallic border with the text "PRIVACY BY DESIGN" prominently displayed at the top center. Include a small shield/security icon in the top left corner.

2. **LEFT SIDE BADGE**: A glowing ancient Chinese seal/badge with:
   - Chinese calligraphy characters (artistic/decorative)
   - The text "{data['badge']}" in elegant English underneath
   - The seal should have a warm golden glow emanating from it
   - Frame it in a subtle square border

3. **BOTTOM SUBTITLE**: The text "{element} {animal} Prophecy" displayed elegantly at the bottom center of the image.

4. **BACKGROUND**: Traditional Chinese cloud motifs seamlessly blended with flowing digital data streams, circuit patterns, and abstract technology elements. The clouds should have a mystical, ethereal quality while incorporating subtle tech elements.

5. **BORDER FRAME**: The entire image should be enclosed in a protective, glowing digital border that combines ancient Chinese decorative patterns with futuristic tech aesthetics.

=== TECHNICAL REQUIREMENTS ===
- 16:9 landscape aspect ratio
- High resolution, highly detailed
- Rich, saturated colors with luminous glowing effects
- Professional quality suitable for marketing materials
- The animal should be the dominant visual element
- All text must be clearly legible
- Balance between mystical Chinese aesthetics and modern digital art

=== IMPORTANT ===
- Do NOT generate random or incorrect text
- The seal badge text must read exactly: "{data['badge']}"
- The subtitle must read exactly: "{element} {animal} Prophecy"
- The top border must include "PRIVACY BY DESIGN"
- Make this look like a premium collectible digital card
"""


def generate_image(prompt: str, element: str, animal: str) -> bytes | None:
    """Generate an image using the Google GenAI SDK with image output."""
    try:
        print(f"  Generating image with google-genai SDK...")
        print(f"  (This may take 30-60 seconds)")

        # Use the same approach as TypeScript code
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE', 'TEXT'],
            )
        )

        # Debug: Print response structure
        print(f"  Response received, checking for image data...")

        if response.candidates:
            for idx, candidate in enumerate(response.candidates):
                print(f"  Candidate {idx}")
                if candidate.content and candidate.content.parts:
                    for pidx, part in enumerate(candidate.content.parts):
                        print(f"    Part {pidx}: type={type(part).__name__}")

                        # Check for inline data (image)
                        if hasattr(part, 'inline_data') and part.inline_data:
                            mime_type = getattr(part.inline_data, 'mime_type', 'unknown')
                            print(f"    Found inline_data! MIME type: {mime_type}")
                            data = part.inline_data.data
                            if data:
                                # Data might be base64 string or bytes
                                if isinstance(data, str):
                                    image_bytes = base64.b64decode(data)
                                else:
                                    image_bytes = data
                                print(f"    Image data: {len(image_bytes)} bytes")
                                return image_bytes

                        # Check for text part
                        elif hasattr(part, 'text') and part.text:
                            text_preview = part.text[:100].replace('\n', ' ')
                            print(f"    Text part: {text_preview}...")

        print(f"  WARNING: No image data found in response")
        return None

    except Exception as e:
        print(f"  ERROR generating image: {e}")
        import traceback
        traceback.print_exc()
        return None


def save_image(image_data: bytes, element: str, animal: str) -> Path:
    """Save the image data to a file."""
    filename = f"{element}-{animal}-Fire-Horse-Privacy-By-Design-TEST.png"
    filepath = OUTPUT_DIR / filename

    with open(filepath, 'wb') as f:
        f.write(image_data)

    print(f"  Saved to: {filepath}")
    return filepath


def main():
    """Main function to test generating 3 zodiac badge images."""

    print("=" * 60)
    print("Fire Horse 2026 - Zodiac Badge Image Generator (TEST)")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Testing with {len(TEST_PROMPTS)} images")
    print(f"Using model: {IMAGE_MODEL}")
    print()

    # Track progress
    successful = 0
    failed = 0

    start_time = datetime.now()

    for i, ((element, animal), data) in enumerate(TEST_PROMPTS.items(), 1):
        print(f"[{i}/{len(TEST_PROMPTS)}] {element} {animal} ({data['badge']})")

        # Build prompt
        prompt = build_image_prompt(element, animal, data)

        # Generate image
        image_data = generate_image(prompt, element, animal)

        if image_data:
            save_image(image_data, element, animal)
            successful += 1
        else:
            failed += 1

        # Wait between requests
        if i < len(TEST_PROMPTS):
            print("  Waiting 5 seconds before next request...")
            time.sleep(5)

        print()

    # Summary
    end_time = datetime.now()
    duration = end_time - start_time

    print("=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    print(f"Successful: {successful}")
    print(f"Failed:     {failed}")
    print(f"Total time: {duration}")
    print(f"Output dir: {OUTPUT_DIR}")
    print("=" * 60)

    if successful > 0:
        print("\nTest images saved to:")
        for element, animal in TEST_PROMPTS.keys():
            filepath = OUTPUT_DIR / f"{element}-{animal}-Fire-Horse-Privacy-By-Design-TEST.png"
            if filepath.exists():
                print(f"  {filepath}")


if __name__ == "__main__":
    main()
