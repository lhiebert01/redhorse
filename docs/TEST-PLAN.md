# Red Horse Oracle - Test Plan

## Overview

This document outlines all test scenarios for Red Horse Oracle before marketing launch.

**Test Environment:**
- Production: https://redhorseoracle.com
- Local: http://localhost:3000
- Stripe: LIVE mode (real payments)

---

## Test Scenarios

### 1. Landing Page Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Page Load** | Visit https://redhorseoracle.com | Page loads with hero image, value prop, pricing | ☐ |
| **Value Prop Display** | Check badges under title | Shows "NUMBERED EDITIONS", "VERIFIABLE ART", "PROVENANCE" | ☐ |
| **Free CTA Button** | Click green "FREE: DISCOVER YOUR 2026 DESTINY" | Navigates to /free | ☐ |
| **Paid CTA Button** | Click gold "UNLOCK YOUR PROPHECY - $8.88" | Opens Stripe checkout | ☐ |
| **Privacy Section** | Check green privacy box | Shows Privacy by Design messaging + "LEARN MORE" button | ☐ |
| **Examples Link** | Click "See Examples from All 12 Zodiac Signs" | Navigates to /examples | ☐ |
| **Admin Gear Icon** | Click subtle gear icon (top-right) | Navigates to /admin-test | ☐ |
| **Mobile Responsive** | View on mobile device/emulator | All elements stack properly, buttons tappable | ☐ |

---

### 2. Free Reading Flow Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Privacy Display** | Visit /free | Shows "100% PII-FREE" badge and privacy message | ☐ |
| **Birth Date Entry** | Enter any valid date | Date picker accepts input | ☐ |
| **Submit Form** | Click "REVEAL MY 2026 DESTINY" | Shows zodiac result page | ☐ |
| **Zodiac Calculation** | Test with known dates | Correct zodiac animal + element displayed | ☐ |
| **Chinese Characters** | Check zodiac display | Shows correct Chinese character for sign | ☐ |
| **Strengths Display** | Check "Core Strengths" section | Shows 4 strengths as badges | ☐ |
| **Fire Horse Forecast** | Check forecast section | Shows compatibility and 2026 forecast | ☐ |
| **Limited Edition Certificate** | Scroll to certificate section | Shows edition count, days remaining, maker's mark | ☐ |
| **Courage CTA** | Check courage section | Shows urgency messaging and edition-specific closing date | ☐ |
| **Sample Talisman** | Check talisman preview | Shows sample image for user's zodiac | ☐ |
| **Purchase CTA** | Click "I HAVE THE COURAGE - GET MY ORACLE" | Opens Stripe checkout | ☐ |
| **Privacy Reinforcement** | Check after-results privacy section | Shows "YOUR DATA? ALREADY GONE." | ☐ |
| **Try Again** | Click "Try a different birth date" | Resets form | ☐ |

#### Zodiac Calculation Test Cases

| Birth Date | Expected Animal | Expected Element |
|------------|-----------------|------------------|
| 01/15/1984 | Rat | Wood |
| 03/20/1990 | Horse | Metal |
| 07/04/1988 | Dragon | Earth |
| 11/22/1995 | Pig | Wood |
| 05/10/2000 | Dragon | Metal |
| 09/01/1966 | Horse | Fire |

---

### 3. Payment Flow Tests (LIVE - Real $8.88)

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Checkout Opens** | Click purchase button | Stripe checkout loads | ☐ |
| **Custom Fields** | Check checkout form | Birth Date + Oracle Path fields visible | ☐ |
| **Birth Date Entry** | Enter DOB in MM/DD/YYYY format | Field accepts input | ☐ |
| **Oracle Path Selection** | Select each dropdown option | All 4 options selectable (Wealth/Power/Love/Shield) | ☐ |
| **Payment Methods** | Check available methods | Card, Apple Pay, Klarna, Link, Cash App, Amazon Pay | ☐ |
| **Complete Payment** | Use real card, complete purchase | Payment succeeds, redirects to reveal page | ☐ |
| **Redirect URL** | Check redirect after payment | Goes to redhorseoracle.com/reveal?session_id=... | ☐ |
| **Webhook Received** | Check Stripe dashboard | Webhook shows 200 OK response | ☐ |

---

### 4. Oracle Generation Tests (All 4 Modes)

#### Test each mode with a real $8.88 purchase:

| Mode | Oracle Path Selection | Expected Main Text Format | Status |
|------|----------------------|---------------------------|--------|
| **Wealth** | "🎲 Wealth - 6 Lucky Numbers" | 6 numbers: XX-XX-XX-XX-XX-XX | ☐ |
| **Power** | "⚔️ Power - Strategic Battle Motto" | 3-word motto in ALL CAPS | ☐ |
| **Love** | "❤️ Love - Destiny Decree" | 4-word phrase in CAPS | ☐ |
| **Shield** | "🛡️ Shield - Protective Mantra" | 3-word mantra in ALL CAPS | ☐ |

---

### 5. Reveal Page Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Page Load** | Navigate to reveal page after payment | Shows "YOUR 2026 DECREE" header | ☐ |
| **Generating State** | Watch during AI generation | Shows animated loading state | ☐ |
| **Talisman Image** | Check image display | AI-generated talisman loads properly | ☐ |
| **Edition Badge** | Check below header | Shows "LIMITED EDITION #X of 888" | ☐ |
| **Maker's Mark** | Check top-right corner | Shows circular seal (RED HORSE 馬 2026) | ☐ |
| **Main Prophecy** | Check prophecy text | Displays correctly formatted based on mode | ☐ |
| **Zodiac Info** | Check zodiac line | Shows sign, element, and Fire Horse relation | ☐ |
| **Full Reading** | Check reading box | Shows italicized prophecy paragraph | ☐ |
| **Certificate Footer** | Check bottom of talisman card | Shows "AUTHENTIC • VERIFIED • [ZODIAC]" + certificate ID | ☐ |
| **Save Talisman** | Click "Save Talisman" button | Downloads PNG with full talisman card | ☐ |
| **Share Buttons** | Check share options | Share buttons functional | ☐ |
| **ZodiacSummary** | Scroll below talisman | Shows zodiac forecast, strengths, compatibility | ☐ |
| **Navigation** | Check nav buttons | "Return to Home" and "Get Another Reading" work | ☐ |

---

### 6. Admin Test Console Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Access** | Click gear icon on landing page | Navigates to /admin-test | ☐ |
| **PIN Entry** | Enter PIN: 142857 | Grants access to console | ☐ |
| **Wrong PIN** | Enter wrong PIN | Shows error, stays on PIN screen | ☐ |
| **Date Selection** | Use date picker | Accepts birth date | ☐ |
| **Mode Selection** | Select each mode | All 4 modes selectable | ☐ |
| **Generate** | Click generate button | Creates prophecy, redirects to reveal | ☐ |
| **Loop Feature** | On reveal page, click "Generate Another Test" | Returns to admin console without re-entering PIN | ☐ |

---

### 7. Examples Gallery Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Page Load** | Visit /examples | Gallery loads with 12 zodiac cards | ☐ |
| **Card Display** | Check each card | Shows zodiac name, image, sample talisman | ☐ |
| **Modal Open** | Click any example card | Modal opens with detailed view | ☐ |
| **Full Size Image** | Click "VIEW FULL SIZE IMAGE" | Lightbox opens with high-res image | ☐ |
| **Modal Close** | Click X or outside modal | Modal closes | ☐ |
| **Zodiac Finder** | Check zodiac chart section | Shows year lookup grid | ☐ |
| **CTA Buttons** | Click purchase CTAs | Opens Stripe checkout | ☐ |

---

### 8. Privacy & Legal Pages Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Privacy Page** | Visit /privacy | Full privacy policy loads | ☐ |
| **Terms Page** | Visit /terms | Terms of service loads | ☐ |
| **Footer Links** | Click footer links | Navigate correctly | ☐ |
| **Contact Email** | Check contact email | Shows privacy@redhorseoracle.com (links to lindsay.hiebert@gmail.com) | ☐ |

---

### 9. Error Handling Tests

| Test | Steps | Expected Result | Status |
|------|-------|-----------------|--------|
| **Invalid Session ID** | Visit /reveal?session_id=invalid | Shows error message with return home link | ☐ |
| **No Session ID** | Visit /reveal (no params) | Shows error message | ☐ |
| **Payment Cancelled** | Cancel Stripe checkout | Returns to previous page | ☐ |
| **Network Error** | Disconnect network during generation | Shows appropriate error state | ☐ |

---

### 10. Mobile Responsiveness Tests

Test on various screen sizes:

| Device | Resolution | Status |
|--------|------------|--------|
| iPhone SE | 375x667 | ☐ |
| iPhone 14 | 390x844 | ☐ |
| iPad | 768x1024 | ☐ |
| Desktop | 1920x1080 | ☐ |

---

### 11. Performance Tests

| Test | Expected | Status |
|------|----------|--------|
| Landing page load time | < 3 seconds | ☐ |
| Free reading calculation | Instant | ☐ |
| Oracle generation time | 30-60 seconds | ☐ |
| Image load time | < 5 seconds | ☐ |

---

## Test Execution Log

### Session 1: [Date]

| Time | Test | Result | Notes |
|------|------|--------|-------|
| | | | |

---

## Known Issues

1. **Stripe webhook timeout** - Expected; AI generation takes 30-60 seconds
2. **50% webhook error rate** - Historical; should clear with new transactions

---

## Sign-Off

- [ ] All critical paths tested
- [ ] All 4 oracle modes verified
- [ ] Payment flow confirmed
- [ ] Mobile responsiveness verified
- [ ] Ready for marketing launch

**Tested By:** _________________________ **Date:** _____________
