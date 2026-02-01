# Fire Horse Trivia Party - Launch Documentation

## Updated: February 1, 2026

---

## Table of Contents
1. [New Features Summary](#new-features-summary)
2. [Technical Implementation Notes](#technical-implementation-notes)
3. [Blog Post Announcement](#blog-post-announcement)
4. [Social Media Plan](#social-media-plan)
5. [Marketing Copy & Taglines](#marketing-copy--taglines)
6. [Claude Max Notes](#claude-max-notes)

---

## New Features Summary

### Game Completion Celebration Experience

#### Bouncing Fire Horse Animation
- **Golden Ring Frame**: Beautiful rotating golden medallion frame (like payment processing page)
- **Fire Horse PNG**: Transparent bouncing horse inside the frame with glow effects
- **Duration**: 10 seconds (temporary, like confetti)
- **Sizes**: Small, Medium, Large depending on context

#### Rotating Messages (Random Selection)
- **24 Player Messages** - Fun, cute, encouraging
- **24 Host Messages** - Appreciation, celebration, encouragement
- **Random**: Never shows same message twice in a row
- **Refresh Rate**: New message every 2.5 seconds

**Sample Player Messages:**
- "When the pony dances, luck follows!"
- "Neigh! That means 'well done' in horse!"
- "Your trivia skills are on FIRE!"
- "2026 fortune loading... 100% complete!"
- "Fire Horse energy: ACTIVATED!"
- "The Oracle smiles upon you!"

**Sample Host Messages:**
- "You are doing a GREAT job hosting!"
- "Best. Host. Ever. Says the Oracle!"
- "Neigh-mazing hosting skills detected!"
- "The pony gives you a gold star!"
- "Legendary host status: UNLOCKED!"
- "You spread joy like confetti!"

#### Share with Friends Button
- Copy invite text to clipboard
- Includes party code
- Encourages viral sharing

#### Confetti Animation
- 2.5x longer duration than before
- 150-200 pieces for visual impact
- Synchronized with bouncing horse

### Party End Screen (PartyEndScreen)
- **Opaque Background**: Fixed overlapping text issue
- **Bouncing Horse**: 10-second celebration
- **Zodiac Card Download**: Free gift for players
- **Cross-Promotion**: Links to Red Horse Oracle ($8.88)
- **Social Sharing**: Copy text, Twitter, Facebook, WhatsApp

### Player Finished Screen
- **Champions (#1)**: Medium bouncing horse with frame
- **Other Players**: Small bouncing horse with frame
- **After Celebration**: Trophy/medal emoji
- **Sidebar Leaderboard**: Visible on large screens

### Host Finished Screen
- **Large Bouncing Horse**: With golden frame
- **Host-Specific Messages**: Different from player messages
- **Sidebar Leaderboard**: Full standings
- **Action Buttons**: View Results, Play Again, End Party

---

## Technical Implementation Notes

### Files Modified

| File | Changes |
|------|---------|
| `src/components/party/Celebration.tsx` | BouncingHorse with frame, random messages, isHost prop |
| `src/components/party/PartyEndScreen.tsx` | Opaque background, temporary horse |
| `src/app/party/host/[code]/page.tsx` | 10s celebration, isHost=true |
| `src/app/party/play/[code]/page.tsx` | 10s celebration, conditional horse |

### Key Props for BouncingHorse

```typescript
interface BouncingHorseProps {
  size?: 'small' | 'medium' | 'large';
  showFrame?: boolean;           // Golden ring frame
  showRotatingMessages?: boolean; // Random messages
  showShareButton?: boolean;      // Copy invite button
  partyCode?: string;            // For share text
  isHost?: boolean;              // Host vs player messages
}
```

### CSS Animations
- `animate-bounce-slow`: 1.2s bounce cycle
- `animate-spin-slow`: 60s rotation for frame
- `animate-flicker`: Fire emoji effect
- `animate-message-change`: Fade in/out for messages

### Assets Used
- `/assets/loading/fire-horse-bouncing-3.png` - Transparent horse
- `/assets/loading/fire-frame.png` - Rotating golden ring
- `/assets/zodiac-badges/*.jpeg` - Zodiac cards for gifts

---

## Blog Post Announcement

### Title Options:
1. "Host Your Own Fire Horse Trivia Party - CNY 2026 Edition!"
2. "888 Your Luck: Fire Horse Trivia + Limited Edition Oracle Art"
3. "The Fire Horse Dances! New Party Game Features for CNY 2026"

---

### Blog Post Draft:

# Host Your Own Fire Horse Trivia Party This CNY 2026!

**The Fire Horse only gallops once every 60 years. This is YOUR year.**

We're thrilled to announce major upgrades to **Fire Horse Trivia** - the ultimate Chinese New Year party game that combines trivia fun with the magic of the Year of the Fire Horse!

## What's New?

### The Dancing Fire Horse Celebration
When you finish a game, watch the **Fire Horse dance** inside a beautiful golden medallion! Our bouncing pony celebrates with you for 10 magical seconds, showing fun messages like:

- "When the pony dances, luck follows!"
- "Neigh! That means 'well done' in horse!"
- "Fire Horse energy: ACTIVATED!"

### Host Appreciation
Hosts get special recognition with dedicated messages:
- "Legendary host status: UNLOCKED!"
- "Best. Host. Ever. Says the Oracle!"
- "Neigh-mazing hosting skills detected!"

### Free Zodiac Card Gift
Every player receives their personalized **Zodiac Digital Art Card** as a free gift! Download your Earth Dragon, Metal Rooster, Water Pig, or any of the 60 zodiac combinations.

## 888 Your Luck This CNY!

The number 888 represents ultimate prosperity in Chinese culture. Here's how to **888 your luck**:

### Step 1: Play Fire Horse Trivia (FREE)
Host a party with friends and family. Test your knowledge, celebrate together, and share the joy!

### Step 2: Get Your Limited Edition Oracle ($8.88)
Take your luck to the next level with an **Authenticated Limited Edition Fire Horse Oracle**:

- **Only 888 per zodiac sign** - Once they're gone, they're GONE
- **Privacy by Design** - Your birth date is NEVER stored
- **Two Versions Included**:
  - Authenticated Stamped Edition (with certificate & maker's mark)
  - Clean Shareable Version (perfect for social media)
- **AI-Generated Masterpiece** - Google Gemini 3 Pro creates unique art
- **Numbered & Certified** - Like fine art lithographs

## Why Host a Fire Horse Party?

1. **Once in 60 Years** - The Fire Horse returns in 2086. Will you even be there?
2. **Bring People Together** - Trivia is the perfect icebreaker
3. **Spread Good Fortune** - The Oracle rewards good deeds
4. **Create Memories** - Photos, laughs, and friendly competition

## Surprise Your Friends & Family!

**Imagine the joy on their faces** when you announce: "We're playing Fire Horse Trivia tonight!"

Whether you're celebrating CNY dinner, hosting a virtual reunion, or just having a casual game night - Fire Horse Trivia turns any gathering into an unforgettable experience.

### Play ANYWHERE - Virtual or In-Person!

**Same Room:**
- Display questions on the big screen (TV, projector)
- Everyone plays on their phones
- Cheer, laugh, and celebrate together!

**Virtual (Remote):**
- Share your screen on Zoom, FaceTime, or Google Meet
- Friends & family join from anywhere in the world
- Perfect for long-distance CNY celebrations!

### Perfect For ANY Social Event

- **Family Reunions** - Get the whole clan involved
- **CNY Dinners** - Entertainment between courses
- **Office Parties** - Team building with a twist
- **Birthday Celebrations** - Add some Fire Horse luck!
- **Virtual Hangouts** - Connect across time zones
- **Game Nights** - Fresh alternative to board games
- **Lunar New Year Events** - Cultural education + fun

### Scale for ANY Size Event!

**ONE Host = Up to 20 Players!**
- A single host controls the game
- Up to 20 players can join with one party code
- Host advances questions, reveals answers, controls the pace

**Small Gatherings (2-20 players):**
- One host, one party code, instant fun!
- Perfect for family dinners and game nights

**Large Events (40, 60, 100+ players):**
- Create MULTIPLE party rooms!
- Each room has ONE host managing up to 20 players
- Run simultaneous games for huge crowds
- Perfect for corporate events, community centers, school celebrations

**Example: 100-Person CNY Celebration**
- Create 5 party rooms (5 hosts needed)
- Each host manages their group of 20
- Everyone plays at the same time
- Compare winners across rooms for ultimate champion!

## How It Works

1. **Get a Party Pass** - Starting at just a few dollars
2. **Share Your Code** - Guests join on their phones
3. **Play Trivia** - 20 questions about Chinese culture, zodiac, and Fire Horse lore
4. **Celebrate** - Watch the dancing pony, see the leaderboard, share results!

## Ready to 888 Your Luck?

**[HOST A PARTY NOW]** - redhorseoracle.com/party

**[GET YOUR ORACLE]** - redhorseoracle.com - $8.88

---

*The Fire Horse dances only for those bold enough to play. Are you ready?*

🐴🔥 **2026 is YOUR year** 🔥🐴

---

## Social Media Plan

### Platform Strategy

| Platform | Content Type | Frequency | Best Time |
|----------|-------------|-----------|-----------|
| Twitter/X | Quick updates, GIFs | 2-3x daily | 12pm, 6pm, 9pm |
| Instagram | Stories, Reels | 1-2x daily | 11am, 7pm |
| TikTok | Short videos | 1x daily | 7pm-10pm |
| Facebook | Events, longer posts | 1x daily | 1pm, 8pm |
| LinkedIn | Professional angle | 2x weekly | 9am, 12pm |

### Content Calendar (Pre-CNY Week)

#### Day 1: Teaser
**Twitter:** "The Fire Horse is learning new dance moves... 🐴💃 Something BIG is coming to Fire Horse Trivia! #FireHorse2026 #CNY2026"

**Instagram Story:** GIF of bouncing horse with "Coming Soon" text

#### Day 2: Feature Reveal - Dancing Horse
**Twitter:** "When the pony dances, luck follows! 🐴✨ Watch our new celebration animation - the Fire Horse now dances in a golden ring when you win! #FireHorse2026"

**Instagram Reel:** Screen recording of the bouncing horse celebration

#### Day 3: Host Appreciation
**Twitter:** "Hosting a Fire Horse party? The Oracle sees you! 👀 Our new host messages will make you feel like royalty:
- 'Legendary host status: UNLOCKED!'
- 'Neigh-mazing hosting skills detected!'
Host your party: redhorseoracle.com/party 🐴🔥"

#### Day 4: Player Fun
**Twitter:** "New player messages are absolutely adorable 🥹
'Neigh! That means well done in horse!'
'2026 fortune loading... 100% complete!'
'Fire Horse energy: ACTIVATED!'
Play now: redhorseoracle.com/party #FireHorse2026"

#### Day 5: 888 Campaign
**Twitter:** "888 YOUR LUCK this CNY! 🔥
Step 1: Play Fire Horse Trivia (FREE)
Step 2: Get your Limited Edition Oracle ($8.88)
Step 3: Watch fortune find YOU
Only 888 per zodiac sign. Forever.
redhorseoracle.com #888Luck"

#### Day 6: Urgency
**Twitter:** "⚠️ REMINDER: The Fire Horse year ends Feb 2027. After that? 2086.
Will you even be alive then? 😳
Get your LIMITED EDITION Oracle NOW.
Only 888 per sign. #FireHorse2026"

#### Day 7: CNY Eve
**Twitter:** "HAPPY CHINESE NEW YEAR EVE! 🧧🔥🐴
The Fire Horse is READY to party!
Host your trivia game tonight: redhorseoracle.com/party
Get your Oracle: redhorseoracle.com
888 your luck! 恭喜发财!"

### Bonus Social Posts - Family & Friends Angle

**Surprise Your Friends:**
"Imagine their faces when you say: 'We're playing Fire Horse Trivia tonight!' 🐴🔥

Surprise your friends & family with the most fun CNY game!
✅ Works in-person OR virtual
✅ Up to 20 players per game
✅ Dancing pony celebration!

redhorseoracle.com/party"

**Virtual Reunions:**
"Can't be together for CNY? 🥺

Fire Horse Trivia works on Zoom, FaceTime, Google Meet!

1. Host shares screen
2. Everyone joins on their phones
3. Play from ANYWHERE in the world!

Connect with family across time zones 🌍
redhorseoracle.com/party #CNY2026"

**Family Game Night:**
"This CNY, be the HERO of family game night! 🦸

Fire Horse Trivia:
👨‍👩‍👧‍👦 2-20 players
📱 Everyone plays on their phone
🏆 Real-time leaderboard
🐴 Dancing pony celebration!

Your family will LOVE you for this.
redhorseoracle.com/party"

**Office Party:**
"Planning the office CNY party? 🏢

Fire Horse Trivia = Team Building + Fun!

• ONE host controls the game
• Up to 20 players compete
• Perfect icebreaker activity
• Everyone gets a free zodiac card!

Make HR happy. Make everyone happy.
redhorseoracle.com/party"

**Large Event:**
"Hosting a BIG CNY event? 100+ people? 🎊

Fire Horse Trivia scales!

• 20 players per game room
• Run 5 rooms simultaneously for 100 people
• Each room needs ONE host
• Compare winners across rooms!

Corporate events ✅
Community centers ✅
School celebrations ✅

redhorseoracle.com/party"

**Multiplayer Magic:**
"MULTIPLAYER trivia for families, friends, ANY social event! 🎮

Fire Horse Trivia:
🏠 Same room = display on TV, play on phones
💻 Virtual = share screen on Zoom
🌍 Works worldwide!

ONE host. Up to 20 players. INFINITE fun.
redhorseoracle.com/party #FireHorse2026"

### Hashtag Strategy

**Primary:**
- #FireHorse2026
- #CNY2026
- #YearOfTheHorse

**Secondary:**
- #ChineseNewYear
- #ChineseZodiac
- #LimitedEdition
- #888Luck

**Engagement:**
- #TriviaParty
- #PartyGames
- #FireHorseTrivia

### Video Content Ideas

1. **"How to Host" Tutorial** (60 sec)
   - Show party setup, code sharing, gameplay

2. **"Dancing Pony" Compilation** (30 sec)
   - Multiple celebration animations with messages

3. **"888 Your Luck" Explainer** (45 sec)
   - What 888 means, how to get it

4. **"Player Reactions"** (30 sec)
   - Capture real players seeing their results

5. **"Host vs Player Messages"** (30 sec)
   - Side-by-side comparison of different messages

---

## Marketing Copy & Taglines

### Hero Taglines

**Primary:**
> "When the pony dances, luck follows."

**Secondary:**
> "888 Your Luck This CNY"

> "The Fire Horse Only Gallops Once Every 60 Years"

> "Host Your Fortune. Play Your Destiny."

### Call-to-Action Variations

**For Party:**
- "HOST YOUR PARTY NOW"
- "GET YOUR PARTY CODE"
- "BRING THE FIRE HORSE TO YOUR GATHERING"

**For Oracle:**
- "888 YOUR LUCK — $8.88"
- "CLAIM YOUR LIMITED EDITION"
- "GET YOUR AUTHENTICATED ORACLE"

### Urgency Messaging

- "Only 888 per zodiac sign. Forever."
- "Next Fire Horse year: 2086. Will you be there?"
- "Limited Edition means LIMITED. Act now."
- "The Oracle is watching. Are you playing?"

### Value Propositions

**For Trivia Game:**
1. FREE to play with Party Pass
2. Works on any device (phone, tablet, computer)
3. 20 questions per game
4. Real-time leaderboard
5. Beautiful celebration animations
6. Free Zodiac Card gift for players

**For Oracle:**
1. Authenticated Limited Edition (#X of 888)
2. Privacy by Design (birth date never stored)
3. TWO versions: Stamped + Shareable
4. AI-generated unique artwork
5. Certificate of authenticity
6. Maker's mark seal

### Emotional Triggers

**FOMO:**
- "Only 888 will ever exist"
- "Next chance in 60 years"
- "Your friends already have theirs"

**Pride:**
- "Show off your zodiac"
- "Authenticated artwork"
- "Numbered like fine art"

**Fun:**
- "The pony dances for you!"
- "Neigh means well done!"
- "Fire Horse energy: ACTIVATED!"

**Connection:**
- "Bring people together"
- "Share with friends"
- "Celebrate as a group"

---

## Claude Max Notes

### For Future Development Sessions

#### What Was Built (Jan-Feb 2026)

**Fire Horse Trivia Party Game:**
- Real-time multiplayer trivia using Supabase broadcasts
- Party Pass system (1-hour, 2-day weekend, etc.)
- Pre-generated question sets for consistent gameplay
- Host and Player separate interfaces
- Leaderboard with rankings

**Celebration System:**
- BouncingHorse component with golden frame
- Random rotating messages (player vs host)
- Confetti with configurable duration
- 10-second temporary celebration
- Share functionality

**Red Horse Oracle:**
- AI-generated talisman artwork (Gemini 3 Pro)
- Limited Edition system (888 per sign)
- Maker's mark and certificate
- Two image versions (stamped + shareable)
- Privacy by Design architecture

#### Key Technical Decisions

1. **Supabase Broadcasts** for real-time sync (not database polling)
2. **Pre-generated Questions** at pass purchase (not runtime)
3. **Session Storage** for player state (not database)
4. **CSS Animations** over JS for performance
5. **Random Message Selection** for variety

#### Known Issues / Future Work

1. **Node.js Warning**: Supabase shows deprecation warning for Node 18
2. **Confetti Performance**: May lag on older devices with 200 pieces
3. **Mobile Safari**: Test share functionality thoroughly

#### Important File Locations

```
/src/components/party/Celebration.tsx    - All celebration components
/src/components/party/PartyEndScreen.tsx - Thank you screen
/src/app/party/host/[code]/page.tsx      - Host interface
/src/app/party/play/[code]/page.tsx      - Player interface
/src/app/party/page.tsx                  - Party home/purchase
/src/constants/party-questions.ts        - Question bank
/src/types/party.ts                      - TypeScript types
```

#### Message Arrays Location

Both message arrays are in `/src/components/party/Celebration.tsx`:
- `PARTY_COMPLETE_MESSAGES` - 24 player messages
- `HOST_COMPLETE_MESSAGES` - 24 host messages

#### How to Add More Messages

Just add strings to the arrays. They're randomly selected, so order doesn't matter.

#### Testing Party Code

Active test pass: `8478JL` (Weekend 2-Day Pass, Jan 31 - Feb 2, 2026)

#### Admin Access

- Admin Test Console: `/admin-test` (PIN: 142857)
- SuperAdmin: `/superadmin` (PIN: 142857)

---

## Quick Links

| Resource | URL |
|----------|-----|
| Production | https://redhorseoracle.com |
| Party Home | https://redhorseoracle.com/party |
| Free Reading | https://redhorseoracle.com/free |
| Examples | https://redhorseoracle.com/examples |
| Privacy | https://redhorseoracle.com/privacy |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.6.0 | Feb 1, 2026 | Bouncing horse celebration, random messages, host appreciation |
| 1.5.0 | Jan 19 | Landing page redesign, marquee ticker |
| 1.4.0 | Jan 19 | Celebrity quotes, viral share content |
| 1.3.0 | Jan 18 | Rotating backgrounds, marketing grids |
| 1.2.0 | Jan 17 | Branded image generation |
| 1.1.0 | Jan 16 | Limited Edition system |
| 1.0.0 | Jan 14 | Production launch |

---

*Documentation maintained for Red Horse Oracle team and Claude Max sessions.*

*火马年 2026 - Year of the Fire Horse*
