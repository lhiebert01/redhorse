# Red Horse Oracle - Feature Documentation

## Table of Contents

1. [The Fire Horse Oracle Concept](#the-fire-horse-oracle-concept)
2. [Oracle Modes](#oracle-modes)
3. [AI-Generated Talismans](#ai-generated-talismans)
4. [User Journey](#user-journey)
5. [Examples Gallery](#examples-gallery)
6. [Technical Features](#technical-features)

---

## The Fire Horse Oracle Concept

### The Once-in-60-Year Event

The Chinese zodiac operates on a 60-year cycle, combining 12 animals with 5 elements (Wood, Fire, Earth, Metal, Water). The **Fire Horse (火马)** appears only once every 60 years:

- Last occurrence: **1966**
- Current occurrence: **2026**
- Next occurrence: **2086**

The Fire Horse is the most powerful and auspicious combination in Chinese astrology — a blazing steed of fortune, passion, and transformation.

### The Oracle's Purpose

Red Horse Oracle channels the Fire Horse's energy to deliver personalized prophecies across four life domains:

1. **Wealth** - Financial fortune and prosperity
2. **Power** - Career success and strategic advantage
3. **Love** - Romantic destiny and relationships
4. **Shield** - Protection from negativity and harm

---

## Oracle Modes

### Wealth Mode 🎲

**Prophecy Type:** 6 Personal Lucky Numbers

The Fire Horse channels six fortune numbers unique to the recipient's zodiac energy. These numbers are:

- Derived from the user's birth date and zodiac sign
- Generated through AI interpretation of Fire Horse numerology
- Formatted as `XX-XX-XX-XX-XX-XX`
- Can be used for lottery, significant dates, or personal numerology

**Example:** `04-15-28-38-68-84` (Michael Johnson, Rat)

### Power Mode ⚔️

**Prophecy Type:** 3-Word Strategic Battle Motto

A commanding three-word phrase that serves as a strategic mantra for 2026:

- ALL CAPS for authority and impact
- Action-oriented and empowering
- Designed to be memorable and quotable
- Tailored to the recipient's zodiac characteristics

**Examples:**
- `BREAK THE RANK` (Jennifer Smith, Ox)
- `STRIKE FROM SILENCE` (Emily Brown, Snake)
- `DROWN ALL RIVALS` (Maria Garcia, Rooster)

### Love Mode ❤️

**Prophecy Type:** 4-Word Relationship Destiny Decree

A romantic prophecy in exactly four words:

- ALL CAPS for mystical authority
- Speaks to the heart's deepest desires
- Combines Fire Horse passion with zodiac romance traits
- Can apply to finding love, deepening bonds, or self-love

**Examples:**
- `FIERCE LOVE CLAIMS YOU` (David Williams, Tiger)
- `WILD HEARTS BECOME ONE` (Robert Jones, Horse)
- `FAITHFUL HEART FINDS HOME` (Christopher Lee, Dog)

### Shield Mode 🛡️

**Prophecy Type:** 3-Word Protective Sacred Mantra

A protective mantra for spiritual defense:

- ALL CAPS for strength and authority
- Designed for meditation and daily affirmation
- Channels Fire Horse's protective energy
- Guards against negativity, envy, and misfortune

**Examples:**
- `FLAME SHIELDS PEACE` (Sarah Davis, Rabbit)
- `PEACE IS ARMOR` (Lisa Anderson, Goat)
- `ROOTS ANCHOR PEACE` (Jessica Martinez, Pig)

---

## AI-Generated Talismans

### Image Generation Technology

Talismans are generated using **Google Gemini 3 Pro** with advanced image generation capabilities:

- **Resolution:** High-resolution masterpiece artwork
- **Style:** Authentic Chinese zodiac artistic traditions
- **Randomization:** Each image uses randomized art styles for uniqueness

### Art Styles

The AI randomly selects from traditional Chinese art styles:

1. **Ink Wash (水墨画)** - Classic black ink on rice paper aesthetic
2. **Song Dynasty** - Refined, elegant court painting style
3. **Dunhuang Murals** - Vibrant Buddhist cave painting influence
4. **Tang Dynasty** - Bold, colorful imperial art

### Talisman Components

Each generated talisman includes:

1. **Header Banner** - "YEAR OF THE FIRE HORSE 2026" with Chinese characters
2. **Central Artwork** - The Fire Horse with the user's zodiac animal
3. **Prophecy Text** - The lucky numbers, motto, decree, or mantra
4. **Zodiac Label** - "[Element] [Animal], Fire Horse [Year]"
5. **Decorative Elements** - Flames, clouds, traditional motifs

### Personalization

Each talisman is unique because it incorporates:

- The user's exact birth date
- Their calculated Chinese zodiac animal
- Their zodiac element (Wood, Fire, Earth, Metal, Water)
- Their chosen oracle mode
- Randomized art style and visual elements
- Fire Horse compatibility reading

---

## User Journey

### 1. Landing Page

The user arrives at the mystical landing page featuring:

- Dramatic Fire Horse hero imagery
- "2026: Year of the Fire Horse" headline
- Four mode selection cards (Wealth, Power, Love, Shield)
- $8.88 price point (auspicious in Chinese culture)
- Link to Examples Gallery

### 2. Payment Flow

After selecting a mode:

1. User clicks "Get Your Prophecy - $8.88"
2. Redirected to Stripe Payment Link
3. Enters birth date (MM/DD/YYYY)
4. Confirms oracle mode selection
5. Completes payment

### 3. Generation Loading Experience

After payment, users see an immersive animated loading page while the AI generates their talisman:

**Visual Elements:**
- **Dark Cloud Background** - Mystical dark cloud/flame pattern at 50% opacity
- **Bouncing Fire Horse** - Animated PNG horse inside rotating fire frame (580x580px)
- **Floating Embers** - 20 fire particles floating upward with transparency
- **Red Horse Oracle Logo** - Branded header image

**Information Display:**
- **Zodiac Title** - "Fire Dragon × Fire Horse" (element + sign) in gold with glow
- **Status Messages** - Two lines of styled text:
  - "Your personalized Fire Horse talisman is being crafted." (white)
  - "This typically takes 30-60 seconds." (gold)
- **Generating For Button** - Shows zodiac image + "Fire [Animal]" label
- **Rotating Oracle Messages** - Cycling mystical messages like "Summoning the Fire Horse Oracle..."
- **Progress Dots** - Bouncing gold dots indicating activity
- **Did You Know Box** - Fun fact about Fire Horse rarity (once every 60 years)

**Animations:**
- `bounce-horse` - Gentle vertical bounce (2s cycle)
- `spin-slow` - Frame rotates 360° over 60 seconds
- `float-ember` - Embers rise from bottom with fade in/out

### 4. Reveal Experience

After generation completes:

1. **Prophecy Revealed** - Talisman image appears with:
   - Full masterpiece artwork
   - Prophecy decree prominently displayed
   - Mystical Fire Horse reading
   - Zodiac compatibility message

### 4. Save & Share

Users can:

- **Save Talisman** - Download complete card as image
- **Share** - Native share menu or copy link
- **Share to X** - Pre-formatted tweet with link
- **View Full Size** - Lightbox for high-resolution viewing

### 5. Permanent Link

The reveal link persists forever:
```
https://redhorse-omega.vercel.app/reveal?session_id=[unique_id]
```

Users can return anytime to view their talisman.

---

## Examples Gallery

### Purpose

The Examples Gallery (`/examples`) showcases:

- All 12 Chinese zodiac animals
- All 4 oracle modes
- Real generated talismans
- The quality and beauty of Fire Horse Oracle prophecies

### Gallery Structure

1. **Hero Section**
   - "2026 is the Year of the Fire Horse"
   - "A Once-in-60-Year Opportunity"
   - Marketing copy for the four modes

2. **CTA Section**
   - Stripe graphic showing all modes
   - $8.88 pricing
   - "Get Your Prophecy" button

3. **Examples Grid**
   - 12 cards (one per zodiac animal)
   - Each shows: name, zodiac, mode, prophecy preview
   - "CLICK TO EXPAND" button

4. **Zodiac Finder**
   - Master zodiac chart
   - Year finder grid for all 12 animals
   - Birth year ranges (1936-2024)

### Example Modal

Clicking an example opens a two-column modal:

**Left Column:**
- Full talisman image
- "VIEW FULL SIZE IMAGE" button
- Click to open lightbox

**Right Column (Sidebar):**
- "Personalized Fire Horse Oracle" header
- Value proposition box
- Zodiac info with animal image
- Mode explanation
- Prophecy highlight
- Testimonial quote
- Action buttons

### Full-Size Lightbox

Clicking the talisman image opens:

- Nearly full-screen image view (85% viewport)
- Gold close button
- Back button
- Person's name caption
- Click anywhere to close

---

## Technical Features

### Real-Time Generation

- Webhook receives Stripe payment instantly
- Background job generates prophecy and image
- Polling on reveal page shows live status
- Typical generation time: 30-60 seconds

### Database Schema

```sql
prophecies (
  id: uuid
  stripe_session_id: text
  birth_date: text
  zodiac_sign: text
  zodiac_element: text
  focus_mode: text (wealth/power/love/shield)
  main_text: text (the prophecy)
  sub_text: text (mystical reading)
  image_url: text
  status: text (pending/generating/completed/failed)
  created_at: timestamp
)
```

### Image Storage

- Generated images stored in Supabase Storage
- Public bucket for direct access
- Permanent URLs for sharing
- High-resolution PNG format

### Error Handling

- Graceful fallback for failed generations
- Retry mechanisms for AI API calls
- User-friendly error messages
- Admin console for manual testing

### Analytics & Tracking

**Google Analytics 4 (GA4):**
- Measurement ID: `G-EV6LX78YP1`
- Stream Name: `RedHorseOracle.Com`
- Realtime tracking of page views and sessions
- Privacy-compliant implementation

**Internal Analytics:**
- Tracks FREE and PAID oracle generations
- Aggregates by Year, Sign, Element, Mode
- No PII collected (birth year only, not full date)
- CSV export for reporting
- Admin dashboard at `/admin-test` → Analytics tab

**Data Validation:**
- Birth date validation (1910-2027 range)
- Friendly error messages for invalid dates
- Prevents spoofing/hacking attempts

---

## Summary

Red Horse Oracle delivers a complete mystical experience:

1. **Compelling Concept** - Once-in-60-year Fire Horse event
2. **Four Oracle Paths** - Wealth, Power, Love, Shield
3. **Masterpiece Artwork** - AI-generated Chinese zodiac talismans
4. **Seamless UX** - From landing to reveal in minutes
5. **Permanent Value** - Downloadable, shareable, printable art
6. **Social Proof** - Examples gallery with all 12 zodiac signs

*"The Fire Horse returns. Your Oracle awaits."*
