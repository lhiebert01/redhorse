#!/usr/bin/env python3
"""
Script to copy and rename zodiac badge images with proper descriptive names.
Based on visual analysis of each image.
"""

import shutil
from pathlib import Path

SOURCE_DIR = Path("/mnt/c/src/redhorse/public/assets/zodiac-badge-source-images")
DEST_DIR = Path("/mnt/c/src/redhorse/public/assets/zodiac-badges")

# Ensure destination exists
DEST_DIR.mkdir(parents=True, exist_ok=True)

# Mapping: source filename -> new descriptive name
# Format: element-animal.jpeg for individuals, animal-collection.jpeg for panels

IMAGE_MAPPING = {
    # Already named files
    "Earth-Dog-Fire-Horse-Privacy-By-Design.jpeg": "earth-dog.jpeg",
    "Metal-Dragon-Fire-Horse-Privacy-By-Design.jpeg": "metal-dragon.jpeg",

    # RAT
    "Gemini_Generated_Image_76ik9m76ik9m76ik.jpeg": "wood-rat.jpeg",
    "Gemini_Generated_Image_vwpweevwpweevwpw.jpeg": "earth-rat.jpeg",
    "Gemini_Generated_Image_yfx7abyfx7abyfx7.jpeg": "metal-rat.jpeg",
    "Gemini_Generated_Image_bgp7debgp7debgp7.jpeg": "water-rat.jpeg",
    "Gemini_Generated_Image_1sifrs1sifrs1sif.jpeg": "rat-collection.jpeg",
    "Gemini_Generated_Image_1sifrs1sifrs1sif (1).jpeg": "rat-collection-2.jpeg",

    # OX
    "Gemini_Generated_Image_u6rcigu6rcigu6rc.jpeg": "wood-ox.jpeg",
    "Gemini_Generated_Image_w3jfdqw3jfdqw3jf.jpeg": "fire-ox.jpeg",
    "Gemini_Generated_Image_qvibfrqvibfrqvib.jpeg": "earth-ox.jpeg",
    "Gemini_Generated_Image_rlosr5rlosr5rlos.jpeg": "metal-ox.jpeg",
    "Gemini_Generated_Image_kax2ipkax2ipkax2.jpeg": "water-ox.jpeg",
    "Gemini_Generated_Image_w8qxfrw8qxfrw8qx.jpeg": "ox-collection.jpeg",
    "Gemini_Generated_Image_w8qxfrw8qxfrw8qx (1).jpeg": "ox-collection-2.jpeg",

    # TIGER
    "Gemini_Generated_Image_i3mvlui3mvlui3mv.jpeg": "wood-tiger.jpeg",
    "Gemini_Generated_Image_cvmp8ycvmp8ycvmp.jpeg": "fire-tiger.jpeg",
    "Gemini_Generated_Image_t22bqjt22bqjt22b.jpeg": "earth-tiger.jpeg",
    "Gemini_Generated_Image_uo0nbyuo0nbyuo0n.jpeg": "metal-tiger.jpeg",
    "Gemini_Generated_Image_yace0gyace0gyace.jpeg": "water-tiger.jpeg",
    "Gemini_Generated_Image_eq8xaheq8xaheq8x.jpeg": "tiger-collection.jpeg",
    "Gemini_Generated_Image_eq8xaheq8xaheq8x (1).jpeg": "tiger-collection-2.jpeg",

    # RABBIT
    "Gemini_Generated_Image_c8gvhnc8gvhnc8gv.jpeg": "wood-rabbit.jpeg",
    "Gemini_Generated_Image_tfl1kbtfl1kbtfl1.jpeg": "fire-rabbit.jpeg",
    "Gemini_Generated_Image_bg3sfxbg3sfxbg3s.jpeg": "fire-rabbit-2.jpeg",
    "Gemini_Generated_Image_6ojdd76ojdd76ojd.jpeg": "earth-rabbit.jpeg",
    "Gemini_Generated_Image_v53bgqv53bgqv53b.jpeg": "metal-rabbit.jpeg",
    "Gemini_Generated_Image_p7t25jp7t25jp7t2.jpeg": "water-rabbit.jpeg",
    "Gemini_Generated_Image_arphimarphimarph.jpeg": "rabbit-collection.jpeg",

    # DRAGON
    "Gemini_Generated_Image_uv3gjwuv3gjwuv3g.jpeg": "wood-dragon.jpeg",
    "Gemini_Generated_Image_505iil505iil505i.jpeg": "fire-dragon.jpeg",
    "Gemini_Generated_Image_tvdqcwtvdqcwtvdq.jpeg": "earth-dragon.jpeg",
    "Gemini_Generated_Image_gbaka7gbaka7gbak.jpeg": "metal-dragon-2.jpeg",
    "Gemini_Generated_Image_9afdcl9afdcl9afd.jpeg": "metal-dragon-3.jpeg",
    "Gemini_Generated_Image_xqaaczxqaaczxqaa.jpeg": "water-dragon.jpeg",
    "Gemini_Generated_Image_41e0cg41e0cg41e0.jpeg": "dragon-collection.jpeg",

    # SNAKE
    "Gemini_Generated_Image_ssmz9rssmz9rssmz.jpeg": "wood-snake.jpeg",
    "Gemini_Generated_Image_wh3yu2wh3yu2wh3y.jpeg": "fire-snake.jpeg",
    "Gemini_Generated_Image_dga4itdga4itdga4.jpeg": "earth-snake.jpeg",
    "Gemini_Generated_Image_gqn2gxgqn2gxgqn2.jpeg": "metal-snake.jpeg",
    "Gemini_Generated_Image_mm04yrmm04yrmm04.jpeg": "water-snake.jpeg",
    "Gemini_Generated_Image_9lxrwm9lxrwm9lxr.jpeg": "snake-collection.jpeg",

    # HORSE
    "Gemini_Generated_Image_bijwjfbijwjfbijw.jpeg": "wood-horse.jpeg",
    "Gemini_Generated_Image_z8sd32z8sd32z8sd.jpeg": "fire-horse.jpeg",
    "Gemini_Generated_Image_re8pvtre8pvtre8p.jpeg": "earth-horse.jpeg",
    "Gemini_Generated_Image_qbtfgrqbtfgrqbtf.jpeg": "metal-horse.jpeg",
    "Gemini_Generated_Image_j1km78j1km78j1km.jpeg": "water-horse.jpeg",
    "Gemini_Generated_Image_3vnsi23vnsi23vns.jpeg": "horse-collection.jpeg",
    "Gemini_Generated_Image_3vnsi23vnsi23vns (1).jpeg": "horse-collection-2.jpeg",
    "Gemini_Generated_Image_4nsfct4nsfct4nsf.jpeg": "horse-collection-3.jpeg",

    # GOAT
    "Gemini_Generated_Image_qe3p8gqe3p8gqe3p.jpeg": "wood-goat.jpeg",
    "Gemini_Generated_Image_xvoqktxvoqktxvoq.jpeg": "fire-goat.jpeg",
    "Gemini_Generated_Image_ufzvjuufzvjuufzv.jpeg": "earth-goat.jpeg",
    "Gemini_Generated_Image_9y1exf9y1exf9y1e.jpeg": "metal-goat.jpeg",
    "Gemini_Generated_Image_a8roxpa8roxpa8ro.jpeg": "water-goat.jpeg",
    "Gemini_Generated_Image_xkiavexkiavexkia.jpeg": "goat-collection.jpeg",

    # MONKEY
    "Gemini_Generated_Image_3dmg5k3dmg5k3dmg.jpeg": "wood-monkey.jpeg",
    "Gemini_Generated_Image_2kcy5f2kcy5f2kcy.jpeg": "fire-monkey.jpeg",
    "Gemini_Generated_Image_m7xi3um7xi3um7xi.jpeg": "earth-monkey.jpeg",
    "Gemini_Generated_Image_ove4xyove4xyove4.jpeg": "metal-monkey.jpeg",
    "Gemini_Generated_Image_1sz3bd1sz3bd1sz3.jpeg": "water-monkey.jpeg",
    "Gemini_Generated_Image_onc1luonc1luonc1.jpeg": "monkey-collection.jpeg",

    # ROOSTER
    "Gemini_Generated_Image_llncz3llncz3llnc.jpeg": "wood-rooster.jpeg",
    "Gemini_Generated_Image_r30wqgr30wqgr30w.jpeg": "fire-rooster.jpeg",
    "Gemini_Generated_Image_7zrgrs7zrgrs7zrg.jpeg": "earth-rooster.jpeg",
    "Gemini_Generated_Image_96cuvz96cuvz96cu.jpeg": "metal-rooster.jpeg",
    "Gemini_Generated_Image_y5z1nny5z1nny5z1.jpeg": "water-rooster.jpeg",
    "Gemini_Generated_Image_lnqj77lnqj77lnqj.jpeg": "rooster-collection.jpeg",

    # DOG
    "Gemini_Generated_Image_h8ztr9h8ztr9h8zt.jpeg": "wood-dog.jpeg",
    "Gemini_Generated_Image_jwrta1jwrta1jwrt.jpeg": "earth-dog-2.jpeg",
    "Gemini_Generated_Image_6glsmc6glsmc6gls.jpeg": "water-dog.jpeg",
    "Gemini_Generated_Image_s0928bs0928bs092.jpeg": "water-dog-2.jpeg",
    "Gemini_Generated_Image_n3rh2mn3rh2mn3rh.jpeg": "dog-collection.jpeg",

    # PIG
    "Gemini_Generated_Image_7h6pb37h6pb37h6p.jpeg": "wood-pig.jpeg",
    "Gemini_Generated_Image_c2w5jyc2w5jyc2w5.jpeg": "wood-pig-2.jpeg",
    "Gemini_Generated_Image_wf8gb5wf8gb5wf8g.jpeg": "fire-pig.jpeg",
    "Gemini_Generated_Image_vy0jmxvy0jmxvy0j.jpeg": "fire-pig-2.jpeg",
    "Gemini_Generated_Image_l9yvqul9yvqul9yv.jpeg": "fire-pig-3.jpeg",
    "Gemini_Generated_Image_95rkf095rkf095rk.jpeg": "earth-pig.jpeg",
    "Gemini_Generated_Image_d97wkdd97wkdd97w.jpeg": "earth-pig-2.jpeg",
    "Gemini_Generated_Image_9yf9mn9yf9mn9yf9.jpeg": "metal-pig.jpeg",
    "Gemini_Generated_Image_zhcthmzhcthmzhct.jpeg": "water-pig.jpeg",
    "Gemini_Generated_Image_qhx6cnqhx6cnqhx6.jpeg": "pig-collection.jpeg",
}

def main():
    print("=" * 60)
    print("Zodiac Badge Image Renamer")
    print("=" * 60)
    print(f"Source: {SOURCE_DIR}")
    print(f"Destination: {DEST_DIR}")
    print()

    # Get all source files
    source_files = list(SOURCE_DIR.glob("*.jpeg"))
    print(f"Found {len(source_files)} source files")
    print()

    copied = 0
    skipped = 0
    unmapped = []

    for src_file in source_files:
        filename = src_file.name

        if filename in IMAGE_MAPPING:
            new_name = IMAGE_MAPPING[filename]
            dest_path = DEST_DIR / new_name

            print(f"  {filename}")
            print(f"    -> {new_name}")

            shutil.copy2(src_file, dest_path)
            copied += 1
        else:
            unmapped.append(filename)
            skipped += 1

    print()
    print("=" * 60)
    print(f"Copied: {copied}")
    print(f"Skipped (unmapped): {skipped}")
    print("=" * 60)

    if unmapped:
        print("\nUnmapped files:")
        for f in unmapped:
            print(f"  - {f}")

    # List final destination contents
    print("\nFinal contents of zodiac-badges:")
    dest_files = sorted(DEST_DIR.glob("*.jpeg"))
    for f in dest_files:
        print(f"  {f.name}")
    print(f"\nTotal: {len(dest_files)} files")

if __name__ == "__main__":
    main()
