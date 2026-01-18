#!/usr/bin/env python3
"""
Fire Horse 2026 - Zodiac Badge Image Generator
Generates 60 unique images (5 Elements x 12 Animals) using Google Gemini API

Usage:
    python generate_zodiac_badges.py

Requirements:
    pip install google-generativeai python-dotenv Pillow

Environment:
    Set GEMINI_API_KEY in environment or .env.local file
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
    # Look for .env.local in the project root
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment from {env_path}")
    else:
        # Try import.env as fallback
        env_path = Path(__file__).parent.parent / 'import.env'
        if env_path.exists():
            load_dotenv(env_path)
            print(f"Loaded environment from {env_path}")
except ImportError:
    print("python-dotenv not installed, using system environment variables")

import google.generativeai as genai

# Configuration
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in environment variables")
    print("Please set GEMINI_API_KEY or create a .env.local file with it")
    sys.exit(1)

# Configure the API
genai.configure(api_key=API_KEY)

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / 'public' / 'assets' / 'zodiac-badges'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Model for image generation
IMAGE_MODEL = 'gemini-2.0-flash-exp'  # Use imagen-3 capable model

# ============================================================================
# ZODIAC DATA - All 60 Element + Animal combinations
# ============================================================================

ZODIAC_PROMPTS = {
    # RAT (The Strategists)
    ("Wood", "Rat"): {
        "badge": "IDEA WEAVER GUARDIANS",
        "colors": "Emerald Green, Lime, Dark Brown, Gold",
        "description": "A Wood Rat made of interwoven fiber-optic roots and emerald neon light. The rat scurries through a landscape of traditional clouds and green digital circuitry."
    },
    ("Fire", "Rat"): {
        "badge": "CATALYST SPARK GUARDIANS",
        "colors": "Crimson, Bright Orange, Charcoal, Gold",
        "description": "A Fire Rat made of rapid sparks, plasma, and crimson light. The rat stands alert in a landscape of swirling smoke and red data streams."
    },
    ("Earth", "Rat"): {
        "badge": "STRATEGIC BASE GUARDIANS",
        "colors": "Terracotta, Ochre, Slate Grey, Gold",
        "description": "An Earth Rat made of polished geode stone and amber data lines. The rat is perched on a digital cliff of topographic lines."
    },
    ("Metal", "Rat"): {
        "badge": "PRECISION MIND GUARDIANS",
        "colors": "Silver, Platinum, Icy Blue, White",
        "description": "A Metal Rat made of sleek chrome and sharp silver circuitry. The rat analyzes a stream of floating binary code."
    },
    ("Water", "Rat"): {
        "badge": "INTUITIVE FLOW GUARDIANS",
        "colors": "Sapphire, Aqua, Midnight Blue, Gold",
        "description": "A Water Rat made of deep blue liquid glass and flowing data currents. The rat navigates through a mist of cyan codes."
    },

    # OX (The Builders)
    ("Wood", "Ox"): {
        "badge": "PATIENT GROWTH GUARDIANS",
        "colors": "Forest Green, Jade, Bronze, Gold",
        "description": "A Wood Ox made of ancient timber and glowing green energy veins. The ox plows through a field of digital matrix code."
    },
    ("Fire", "Ox"): {
        "badge": "DRIVEN FORCE GUARDIANS",
        "colors": "Red, Magma Orange, Black, Gold",
        "description": "A Fire Ox made of molten rock and burning embers. The ox charges forward with intense light eyes."
    },
    ("Earth", "Ox"): {
        "badge": "SOLID PILLAR GUARDIANS",
        "colors": "Brown, Beige, Granite Grey, Gold",
        "description": "An Earth Ox made of solid granite and golden seismic lines. The ox stands immovable against a storm of data."
    },
    ("Metal", "Ox"): {
        "badge": "IRON RESOLVE GUARDIANS",
        "colors": "Gunmetal, Silver, White, Gold",
        "description": "A Metal Ox made of heavy brushed steel and titanium plates. The ox reflects a futuristic city in its armor."
    },
    ("Water", "Ox"): {
        "badge": "SILENT WISDOM GUARDIANS",
        "colors": "Deep Indigo, Teal, Black, Gold",
        "description": "A Water Ox made of crushing dark waves and bioluminescent foam. The ox emerges from a digital ocean."
    },

    # TIGER (The Leaders)
    ("Wood", "Tiger"): {
        "badge": "EXPANSIVE VISION GUARDIANS",
        "colors": "Vivid Green, Brown, Chartreuse, Gold",
        "description": "A Wood Tiger made of vibrant vines and neon-green optical fibers. The tiger leaps through a digital jungle canopy."
    },
    ("Fire", "Tiger"): {
        "badge": "FEARLESS FLAME GUARDIANS",
        "colors": "Scarlet, Solar Yellow, Black, Gold",
        "description": "A Fire Tiger made of roaring flames and electric arcs. The tiger roars, surrounded by a halo of heat distortion."
    },
    ("Earth", "Tiger"): {
        "badge": "STEADY HUNTER GUARDIANS",
        "colors": "Sand, Bronze, Dark Earth, Gold",
        "description": "An Earth Tiger made of crystallized rock and shimmering sand. The tiger prowls low to the ground."
    },
    ("Metal", "Tiger"): {
        "badge": "SHARP STRIKE GUARDIANS",
        "colors": "Chrome, Steel Blue, White, Gold",
        "description": "A Metal Tiger made of polished robotic armor and razor-sharp blades. The tiger strikes a pose of absolute precision."
    },
    ("Water", "Tiger"): {
        "badge": "FLUID POWER GUARDIANS",
        "colors": "Ocean Blue, Turquoise, Black, Gold",
        "description": "A Water Tiger made of swirling whirlpools and liquid mercury. The tiger moves fluidly through a rain of code."
    },

    # RABBIT (The Diplomats)
    ("Wood", "Rabbit"): {
        "badge": "ARTISTIC SOUL GUARDIANS",
        "colors": "Soft Green, Sage, Brown, Gold",
        "description": "A Wood Rabbit made of soft moss and glowing green filaments. The rabbit sits peacefully in a grove of digital willows."
    },
    ("Fire", "Rabbit"): {
        "badge": "PASSION SPIRIT GUARDIANS",
        "colors": "Warm Red, Orange, Pink, Gold",
        "description": "A Fire Rabbit made of flickering candlelight and warm embers. The rabbit leaps quickly, leaving a trail of sparks."
    },
    ("Earth", "Rabbit"): {
        "badge": "STABLE HAVEN GUARDIANS",
        "colors": "Taupe, Cream, Stone Grey, Gold",
        "description": "An Earth Rabbit made of smooth river stones and soft clay. The rabbit creates a shelter of geometric shapes."
    },
    ("Metal", "Rabbit"): {
        "badge": "REFINED GRACE GUARDIANS",
        "colors": "Silver, Pearl, Pale Blue, Gold",
        "description": "A Metal Rabbit made of fine silver mesh and filigree. The rabbit stands alert with glowing blue eyes."
    },
    ("Water", "Rabbit"): {
        "badge": "INTUITIVE PEACE GUARDIANS",
        "colors": "Pale Blue, Lavender, White, Gold",
        "description": "A Water Rabbit made of mist and translucent droplets. The rabbit gazes into a reflecting pool of data."
    },

    # DRAGON (The Visionaries)
    ("Wood", "Dragon"): {
        "badge": "LEGACY BUILDER GUARDIANS",
        "colors": "Emerald, Forest Green, Gold, Brown",
        "description": "A Wood Dragon made of ancient bark scales and glowing green energy wings. The dragon coils around a digital skyscraper."
    },
    ("Fire", "Dragon"): {
        "badge": "COMMANDING FIRE GUARDIANS",
        "colors": "Intense Red, Orange, Gold, Black",
        "description": "A Fire Dragon made of explosive magma and radiant light. The dragon breathes a stream of golden code."
    },
    ("Earth", "Dragon"): {
        "badge": "STRATEGIC POWER GUARDIANS",
        "colors": "Terra Cotta, Bronze, Slate, Gold",
        "description": "An Earth Dragon made of mountain stone and precious gems. The dragon guards a treasure trove of data blocks."
    },
    ("Metal", "Dragon"): {
        "badge": "IRON WILL GUARDIANS",
        "colors": "Silver, White, Electric Blue, Gold",
        "description": "A Metal Dragon made of gleaming platinum scales and cybernetic circuitry. The dragon flies through a storm of lightning."
    },
    ("Water", "Dragon"): {
        "badge": "WISE CURRENT GUARDIANS",
        "colors": "Deep Blue, Teal, Aqua, Gold",
        "description": "A Water Dragon made of deep sea currents and bioluminescence. The dragon emerges from a vortex of fluid data."
    },

    # SNAKE (The Mystics)
    ("Wood", "Snake"): {
        "badge": "EVOLVING MIND GUARDIANS",
        "colors": "Leaf Green, Lime, Dark Wood, Gold",
        "description": "A Wood Snake made of braided vines and emerald laser light. The snake coils intelligently around a tree of knowledge."
    },
    ("Fire", "Snake"): {
        "badge": "MAGNETIC FLAME GUARDIANS",
        "colors": "Crimson, Magenta, Orange, Gold",
        "description": "A Fire Snake made of lava flow and hypnotizing heat waves. The snake strikes with a flash of light."
    },
    ("Earth", "Snake"): {
        "badge": "CALM STRATEGY GUARDIANS",
        "colors": "Sand, Beige, Bronze, Gold",
        "description": "An Earth Snake made of polished marble and sand. The snake blends perfectly into a desert landscape of data."
    },
    ("Metal", "Snake"): {
        "badge": "PRECISE STRIKE GUARDIANS",
        "colors": "Chrome, Silver, Grey, Gold",
        "description": "A Metal Snake made of flexible titanium segments and optical lenses. The snake observes from the shadows."
    },
    ("Water", "Snake"): {
        "badge": "DEEP INSIGHT GUARDIANS",
        "colors": "Ink Blue, Black, Indigo, Gold",
        "description": "A Water Snake made of dark ink and fluid ripples. The snake moves silently through a deep underwater canyon."
    },

    # HORSE (The Adventurers)
    ("Wood", "Horse"): {
        "badge": "BOUNDLESS GROWTH GUARDIANS",
        "colors": "Bright Green, Brown, Gold, Lime",
        "description": "A Wood Horse made of galloping roots and green energy trails. The horse races through a forest of vertical data lines."
    },
    ("Fire", "Horse"): {
        "badge": "BLAZING SPEED GUARDIANS",
        "colors": "Intense Crimson, Burnt Orange, Charcoal, Gold",
        "description": "A Fire Horse made of flowing magma, embers, and golden light. The horse gallops through a cloud landscape."
    },
    ("Earth", "Horse"): {
        "badge": "ENDURING SPIRIT GUARDIANS",
        "colors": "Rust, Ochre, Brown, Gold",
        "description": "An Earth Horse made of solid canyon rock and dust. The horse stands strong on a high peak."
    },
    ("Metal", "Horse"): {
        "badge": "DRIVEN AMBITION GUARDIANS",
        "colors": "Silver, Steel, White, Gold",
        "description": "A Metal Horse made of polished chrome machinery and pistons. The horse rears up, reflecting sparks."
    },
    ("Water", "Horse"): {
        "badge": "FLUID MOTION GUARDIANS",
        "colors": "Aqua, Blue, White, Gold",
        "description": "A Water Horse made of crashing waves and sea foam. The horse runs across the surface of a digital ocean."
    },

    # GOAT (The Artists)
    ("Wood", "Goat"): {
        "badge": "CREATIVE HARMONY GUARDIANS",
        "colors": "Pastel Green, Pink, Brown, Gold",
        "description": "A Wood Goat made of flowering vines and soft green light. The goat stands peacefully in a high digital meadow."
    },
    ("Fire", "Goat"): {
        "badge": "PASSIONATE HEART GUARDIANS",
        "colors": "Warm Orange, Peach, Red, Gold",
        "description": "A Fire Goat made of warm lantern light and soft flame. The goat radiates a welcoming glow."
    },
    ("Earth", "Goat"): {
        "badge": "STEADY CARE GUARDIANS",
        "colors": "Beige, Cream, Soft Brown, Gold",
        "description": "An Earth Goat made of carved wood and smooth stone. The goat climbs a structured path of data blocks."
    },
    ("Metal", "Goat"): {
        "badge": "REFINED QUALITY GUARDIANS",
        "colors": "Gold, Silver, Champagne, White",
        "description": "A Metal Goat made of fine gold wire and silver mesh. The goat stands with elegant posture."
    },
    ("Water", "Goat"): {
        "badge": "EMPATHIC HEALER GUARDIANS",
        "colors": "Pale Blue, Teal, White, Gold",
        "description": "A Water Goat made of healing spring water and mist. The goat is surrounded by a calming ripple effect."
    },

    # MONKEY (The Innovators)
    ("Wood", "Monkey"): {
        "badge": "INVENTIVE PLAY GUARDIANS",
        "colors": "Lime Green, Jungle Green, Brown, Gold",
        "description": "A Wood Monkey made of flexible branches and bright neon nodes. The monkey swings between floating data islands."
    },
    ("Fire", "Monkey"): {
        "badge": "CHARISMATIC SPARK GUARDIANS",
        "colors": "Electric Orange, Red, Purple, Gold",
        "description": "A Fire Monkey made of fireworks and kinetic energy. The monkey holds a glowing orb of light."
    },
    ("Earth", "Monkey"): {
        "badge": "CLEVER BUILDER GUARDIANS",
        "colors": "Bronze, Tan, Grey, Gold",
        "description": "An Earth Monkey made of engineered stone and gears. The monkey assembles a complex puzzle."
    },
    ("Metal", "Monkey"): {
        "badge": "STRATEGIC SHARP GUARDIANS",
        "colors": "Silver, Steel, Cyan, Gold",
        "description": "A Metal Monkey made of robotic limbs and chrome plating. The monkey calculates a trajectory with laser focus."
    },
    ("Water", "Monkey"): {
        "badge": "ADAPTIVE FLOW GUARDIANS",
        "colors": "Aqua, Blue, Indigo, Gold",
        "description": "A Water Monkey made of fluid ripples and rain. The monkey adapts its shape to flow through obstacles."
    },

    # ROOSTER (The Perfectionists)
    ("Wood", "Rooster"): {
        "badge": "DILIGENT GROWTH GUARDIANS",
        "colors": "Green, Gold, Brown, Orange",
        "description": "A Wood Rooster made of intricate plumage resembling leaves and fiber optics. The rooster stands tall, signaling dawn."
    },
    ("Fire", "Rooster"): {
        "badge": "RADIANT PRIDE GUARDIANS",
        "colors": "Red, Gold, Purple, Orange",
        "description": "A Fire Rooster made of brilliant plumage of fire and lasers. The rooster crows with a burst of light."
    },
    ("Earth", "Rooster"): {
        "badge": "PRECISE ORDER GUARDIANS",
        "colors": "Gold, Brown, Ochre, Bronze",
        "description": "An Earth Rooster made of gem-encrusted stone and solid geometry. The rooster inspects the ground for details."
    },
    ("Metal", "Rooster"): {
        "badge": "IRON PRINCIPLE GUARDIANS",
        "colors": "Silver, White, Metallic Blue, Gold",
        "description": "A Metal Rooster made of razor-sharp steel feathers and chrome. The rooster stands as a sentinel."
    },
    ("Water", "Rooster"): {
        "badge": "INSIGHTFUL VOICE GUARDIANS",
        "colors": "Iridescent Blue, Purple, Teal, Gold",
        "description": "A Water Rooster made of shimmering iridescent liquid. The rooster's call creates ripples in the air."
    },

    # DOG (The Protectors)
    ("Wood", "Dog"): {
        "badge": "LOYAL PACK GUARDIANS",
        "colors": "Forest Green, Brown, Gold, Earth",
        "description": "A Wood Dog made of sturdy roots and protective branches. The dog stands guard over a glowing green community."
    },
    ("Fire", "Dog"): {
        "badge": "BRAVE HEART GUARDIANS",
        "colors": "Warm Red, Orange, Amber, Gold",
        "description": "A Fire Dog made of warm hearth fire and protective light. The dog stands fearlessly between darkness and light."
    },
    ("Earth", "Dog"): {
        "badge": "LOYAL HEART GUARDS",
        "colors": "Terra Cotta, Brown, Slate, Gold",
        "description": "An Earth Dog made of solid bedrock and ancient stone. The dog sits immovably at a gate."
    },
    ("Metal", "Dog"): {
        "badge": "JUSTICE KEEPER GUARDIANS",
        "colors": "Silver, Iron, Grey, Gold",
        "description": "A Metal Dog made of armored plating and unbreakable steel. The dog watches with a keen, scanning eye."
    },
    ("Water", "Dog"): {
        "badge": "EMPATHIC SOUL GUARDIANS",
        "colors": "Blue, Teal, White, Gold",
        "description": "A Water Dog made of healing waters and soft mist. The dog offers a comforting presence."
    },

    # PIG (The Nurturers)
    ("Wood", "Pig"): {
        "badge": "ABUNDANT JOY GUARDIANS",
        "colors": "Rich Green, Pink, Gold, Brown",
        "description": "A Wood Pig made of lush vegetation and blooming flowers. The pig rests in a garden of abundance."
    },
    ("Fire", "Pig"): {
        "badge": "JOYFUL SPIRIT GUARDIANS",
        "colors": "Red, Pink, Orange, Gold",
        "description": "A Fire Pig made of festive lights and warm sparks. The pig radiates celebration and energy."
    },
    ("Earth", "Pig"): {
        "badge": "STEADY COMFORT GUARDIANS",
        "colors": "Terracotta, Beige, Brown, Gold",
        "description": "An Earth Pig made of comforting clay and warm soil. The pig builds a foundation of security."
    },
    ("Metal", "Pig"): {
        "badge": "REFINED VALUE GUARDIANS",
        "colors": "Gold, Platinum, White, Silver",
        "description": "A Metal Pig made of refined gold and polished luxury metals. The pig signifies high standards and wealth."
    },
    ("Water", "Pig"): {
        "badge": "LOVING TRUTH GUARDIANS",
        "colors": "Soft Blue, Aqua, White, Gold",
        "description": "A Water Pig made of gentle rain and flowing streams. The pig connects glowing emotional currents."
    },
}


def build_image_prompt(element: str, animal: str, data: dict) -> str:
    """Build the full image generation prompt for a zodiac combination."""

    prompt = f"""Create a mesmerizing digital art piece in 16:9 landscape aspect ratio for the Year of the Fire Horse 2026.

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
    return prompt


def generate_image(model, prompt: str, element: str, animal: str) -> bytes | None:
    """Generate an image using the Gemini API."""
    try:
        print(f"  Generating image...")

        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 1.0,
            }
        )

        # Check for image data in the response
        if response.candidates:
            for candidate in response.candidates:
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        if hasattr(part, 'inline_data') and part.inline_data:
                            print(f"  Image generated successfully!")
                            return base64.b64decode(part.inline_data.data)

        print(f"  WARNING: No image data in response")
        return None

    except Exception as e:
        print(f"  ERROR generating image: {e}")
        return None


def save_image(image_data: bytes, element: str, animal: str) -> Path:
    """Save the image data to a file."""
    filename = f"{element}-{animal}-Fire-Horse-Privacy-By-Design.png"
    filepath = OUTPUT_DIR / filename

    with open(filepath, 'wb') as f:
        f.write(image_data)

    print(f"  Saved to: {filepath}")
    return filepath


def main():
    """Main function to generate all 60 zodiac badge images."""

    print("=" * 60)
    print("Fire Horse 2026 - Zodiac Badge Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total images to generate: {len(ZODIAC_PROMPTS)}")
    print()

    # Initialize the model
    # Using gemini-2.0-flash-exp which supports image generation
    print("Initializing Gemini model...")
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("Model initialized!")
    print()

    # Track progress
    successful = 0
    failed = 0
    skipped = 0

    elements = ["Wood", "Fire", "Earth", "Metal", "Water"]
    animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
               "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]

    start_time = datetime.now()

    for i, (element, animal) in enumerate([(e, a) for e in elements for a in animals], 1):
        key = (element, animal)
        data = ZODIAC_PROMPTS.get(key)

        if not data:
            print(f"[{i}/60] {element} {animal}: No data found, skipping")
            skipped += 1
            continue

        # Check if image already exists
        filename = f"{element}-{animal}-Fire-Horse-Privacy-By-Design.png"
        filepath = OUTPUT_DIR / filename
        if filepath.exists():
            print(f"[{i}/60] {element} {animal}: Already exists, skipping")
            skipped += 1
            continue

        print(f"[{i}/60] {element} {animal} ({data['badge']})")

        # Build prompt
        prompt = build_image_prompt(element, animal, data)

        # Generate image
        image_data = generate_image(model, prompt, element, animal)

        if image_data:
            save_image(image_data, element, animal)
            successful += 1
        else:
            failed += 1

        # Rate limiting - wait between requests to avoid API limits
        if i < len(ZODIAC_PROMPTS):
            print("  Waiting 5 seconds before next request...")
            time.sleep(5)

        print()

    # Summary
    end_time = datetime.now()
    duration = end_time - start_time

    print("=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Successful: {successful}")
    print(f"Failed:     {failed}")
    print(f"Skipped:    {skipped}")
    print(f"Total time: {duration}")
    print(f"Output dir: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
