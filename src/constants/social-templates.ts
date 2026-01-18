/**
 * Social Media Templates for Red Horse Oracle
 *
 * Three angles optimized for "Zombie" engagement:
 * 1. Destiny & Scarcity (FOMO)
 * 2. Rebellion & Privacy (Stick it to the Man)
 * 3. Direct Action (Short & Punchy)
 */

export type SharePlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'reddit'
  | 'discord'
  | 'copy';

export type ShareAngle = 'destiny' | 'privacy' | 'action';

export interface ShareTemplate {
  id: ShareAngle;
  name: string;
  description: string;
  bestFor: SharePlatform[];
  emoji: string;
  headline: string;
  getBlurb: (prophecy: { mainText: string; zodiacSign: string; zodiacElement: string }) => string;
  hashtags: string[];
}

// The share URL is ALWAYS just the homepage - never expose reveal URLs
export const SHARE_URL = 'https://redhorseoracle.com';

// ============================================================================
// HASHTAG VAULT
// ============================================================================

export const HASHTAG_VAULT = {
  // High Volume - Viral & Trending
  viral: [
    '#FireHorse2026',
    '#YearOfTheHorse',
    '#ChineseNewYear',
    '#CNY2026',
    '#LunarNewYear',
    '#2026Goals',
    '#Prophecy',
    '#Destiny',
    '#Zodiac',
    '#Horoscope',
    '#DailyInspiration',
  ],

  // Digital Art & Collector
  art: [
    '#DigitalArt',
    '#LimitedEdition',
    '#DigitalCollectible',
    '#RareArt',
    '#GenerativeArt',
    '#ArtCollector',
    '#DigitalAsset',
    '#Exclusive',
    '#ArtDrop',
    '#NewDrop',
    '#DigitalArtist',
  ],

  // Privacy & Tech Rebellion
  privacy: [
    '#PrivacyByDesign',
    '#NoTracking',
    '#DataPrivacy',
    '#TechEthics',
    '#OwnYourData',
    '#DigitalSovereignty',
    '#AdFree',
    '#EthicalTech',
  ],

  // Niche Fire Horse
  niche: [
    '#RedHorseOracle',
    '#FireHorseProphecy',
    '#888',
    '#LuckyNumber',
    '#SpiritualAwakening',
    '#EasternWisdom',
    '#AncientWisdom',
    '#ModernOracle',
    '#BetOnYourself',
  ],
} as const;

// ============================================================================
// SHARE TEMPLATES
// ============================================================================

export const SHARE_TEMPLATES: ShareTemplate[] = [
  // OPTION 1: Destiny & Scarcity (High FOMO)
  {
    id: 'destiny',
    name: 'Destiny & Scarcity',
    description: 'High FOMO - Visual & Emotional',
    bestFor: ['instagram', 'tiktok', 'facebook'],
    emoji: '🔮',
    headline: 'Warning: Only 888 Will Ever Exist. Secure your Fire Horse Oracle before the 2026 rush.',
    getBlurb: ({ mainText, zodiacSign, zodiacElement }) => `Are you watching history, or making it?

2026 is the Year of the Fire Horse—a cosmic event that happens only once every 60 years. To celebrate, we are releasing the world's first Privacy-First Oracle.

🚫 No Ads. No Tracking. No Algorithms.
✅ Just 100% Authentic Prophecy & Digital Art.

My ${zodiacElement} ${zodiacSign} prophecy: "${mainText}"

This isn't for everyone. It is strictly limited to 888 owners worldwide. Once they are gone, the gate closes for another cycle.

Don't let 2026 be just "another year." Make it the year you bet on yourself.

👇 Claim your destiny before the 888 run out:
${SHARE_URL}`,
    hashtags: [...HASHTAG_VAULT.viral.slice(0, 5), ...HASHTAG_VAULT.art.slice(0, 3)],
  },

  // OPTION 2: Rebellion & Privacy (Stick it to the Man)
  {
    id: 'privacy',
    name: 'Rebellion & Privacy',
    description: 'Intellectual & Ethical',
    bestFor: ['twitter', 'linkedin', 'reddit'],
    emoji: '🛡️',
    headline: 'Your Data is Yours. The only Oracle built with Privacy by Design. No tracking. Just Destiny.',
    getBlurb: ({ mainText, zodiacSign, zodiacElement }) => `Stop trading your soul for free content. 🛑

Most apps treat you like a product. They harvest your data, track your clicks, and sell your attention. We don't.

Introducing Red Horse Oracle: The world's first Authenticated Fire Horse Oracle built on Privacy by Design.

✗ Zero Facebook Tracking
✗ Zero Data Harvesting
✗ Zero Noise

My ${zodiacElement} ${zodiacSign} prophecy: "${mainText}"

We are offering a pure, unfiltered connection to the Year of the Fire Horse (2026). Will you choose the status quo, or will you choose to be Healthy, Wealthy, and Wise on your terms?

Join the rare 888 who value privacy as much as prophecy.

🔥 Break the cycle here:
${SHARE_URL}`,
    hashtags: [...HASHTAG_VAULT.privacy, ...HASHTAG_VAULT.niche.slice(0, 3)],
  },

  // OPTION 3: Direct Action (Short & Punchy)
  {
    id: 'action',
    name: 'Direct Action',
    description: 'Short & Punchy - Fast Scrollers',
    bestFor: ['twitter', 'discord', 'copy'],
    emoji: '⚡',
    headline: 'Reveal Your 2026 Prophecy. (Limited to 888 Spots)',
    getBlurb: ({ mainText, zodiacSign, zodiacElement }) => `"${mainText}" 🐎🔥

I just revealed my ${zodiacElement} ${zodiacSign} prophecy for the upcoming Year of the Fire Horse. It's powerful, it's private, and it's rare.

The hard truth: 99% of people will sleepwalk through 2026. The other 1% are securing one of the 888 Limited Edition Oracles right now.

Which one are you?

👉 Get your free zodiac reading + secure your art:
${SHARE_URL}`,
    hashtags: [...HASHTAG_VAULT.viral.slice(0, 3), ...HASHTAG_VAULT.niche.slice(0, 2)],
  },
];

// ============================================================================
// PLATFORM-SPECIFIC CONFIGURATIONS
// ============================================================================

export interface PlatformConfig {
  id: SharePlatform;
  name: string;
  emoji: string;
  maxLength: number | null; // null = no limit
  supportsHashtags: boolean;
  hashtagLimit: number;
  linkInCaption: boolean; // false = put link in first comment
  recommendedAngle: ShareAngle;
  shareMethod: 'native' | 'url' | 'copy';
  shareUrl?: string; // Template for sharing URL
}

export const PLATFORM_CONFIGS: Record<SharePlatform, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    maxLength: 2200,
    supportsHashtags: true,
    hashtagLimit: 30,
    linkInCaption: false, // Link in bio or first comment
    recommendedAngle: 'destiny',
    shareMethod: 'copy',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    emoji: '🎵',
    maxLength: 2200,
    supportsHashtags: true,
    hashtagLimit: 5,
    linkInCaption: false, // Link in bio
    recommendedAngle: 'destiny',
    shareMethod: 'copy',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    emoji: '👥',
    maxLength: null,
    supportsHashtags: true,
    hashtagLimit: 5,
    linkInCaption: false, // Algo penalizes links
    recommendedAngle: 'destiny',
    shareMethod: 'url',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}',
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    emoji: '𝕏',
    maxLength: 280,
    supportsHashtags: true,
    hashtagLimit: 3,
    linkInCaption: true,
    recommendedAngle: 'action',
    shareMethod: 'url',
    shareUrl: 'https://twitter.com/intent/tweet?text={text}&url={url}',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    emoji: '💼',
    maxLength: 3000,
    supportsHashtags: true,
    hashtagLimit: 5,
    linkInCaption: false, // Algo penalizes links
    recommendedAngle: 'privacy',
    shareMethod: 'url',
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    emoji: '🤖',
    maxLength: 40000,
    supportsHashtags: false,
    hashtagLimit: 0,
    linkInCaption: true,
    recommendedAngle: 'privacy',
    shareMethod: 'url',
    shareUrl: 'https://reddit.com/submit?url={url}&title={title}',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    emoji: '🎮',
    maxLength: 2000,
    supportsHashtags: false,
    hashtagLimit: 0,
    linkInCaption: true,
    recommendedAngle: 'action',
    shareMethod: 'copy',
  },
  copy: {
    id: 'copy',
    name: 'Copy Text',
    emoji: '📋',
    maxLength: null,
    supportsHashtags: true,
    hashtagLimit: 10,
    linkInCaption: true,
    recommendedAngle: 'action',
    shareMethod: 'copy',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the recommended template for a given platform
 */
export function getRecommendedTemplate(platform: SharePlatform): ShareTemplate {
  const config = PLATFORM_CONFIGS[platform];
  return SHARE_TEMPLATES.find(t => t.id === config.recommendedAngle) || SHARE_TEMPLATES[0];
}

/**
 * Get a random selection of hashtags for a template, respecting platform limits
 */
export function getHashtagsForPlatform(
  template: ShareTemplate,
  platform: SharePlatform
): string[] {
  const config = PLATFORM_CONFIGS[platform];
  if (!config.supportsHashtags || config.hashtagLimit === 0) {
    return [];
  }

  // Shuffle and take up to the limit
  const shuffled = [...template.hashtags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.hashtagLimit);
}

/**
 * Generate the complete share text for a platform
 */
export function generateShareText(
  template: ShareTemplate,
  platform: SharePlatform,
  prophecy: { mainText: string; zodiacSign: string; zodiacElement: string }
): { text: string; hashtags: string[]; linkNote: string | null } {
  const config = PLATFORM_CONFIGS[platform];
  let text = template.getBlurb(prophecy);
  const hashtags = getHashtagsForPlatform(template, platform);

  // Add hashtags if supported
  if (hashtags.length > 0) {
    text += '\n\n' + hashtags.join(' ');
  }

  // Truncate if needed
  if (config.maxLength && text.length > config.maxLength) {
    // For Twitter, use a much shorter version
    if (platform === 'twitter') {
      text = `🐎🔥 My Fire Horse Oracle: "${prophecy.mainText}"

Fire Horse returns once every 60 years. Get yours!

${SHARE_URL}

${hashtags.slice(0, 2).join(' ')}`;
    } else {
      text = text.slice(0, config.maxLength - 3) + '...';
    }
  }

  // Note about link placement
  const linkNote = !config.linkInCaption
    ? '💡 Pro tip: Post this first, then add the link in the first comment for better reach!'
    : null;

  return { text, hashtags, linkNote };
}

/**
 * Get the share URL for a platform (for platforms that support direct sharing)
 */
export function getShareUrl(
  platform: SharePlatform,
  text: string,
  title?: string
): string | null {
  const config = PLATFORM_CONFIGS[platform];
  if (config.shareMethod !== 'url' || !config.shareUrl) {
    return null;
  }

  return config.shareUrl
    .replace('{url}', encodeURIComponent(SHARE_URL))
    .replace('{text}', encodeURIComponent(text))
    .replace('{title}', encodeURIComponent(title || 'Fire Horse Oracle 2026'));
}

/**
 * Get all available platforms grouped by recommended template
 */
export function getPlatformsByTemplate(): Record<ShareAngle, PlatformConfig[]> {
  const result: Record<ShareAngle, PlatformConfig[]> = {
    destiny: [],
    privacy: [],
    action: [],
  };

  Object.values(PLATFORM_CONFIGS).forEach(config => {
    result[config.recommendedAngle].push(config);
  });

  return result;
}
