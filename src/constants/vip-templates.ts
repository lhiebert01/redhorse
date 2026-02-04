// VIP Outreach Message Templates
// Placeholders: {{CODE}}, {{NAME}}, {{PLATFORM}}

import { MessageTemplate } from '@/types/vip';

export const VIP_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'instagram_local',
    name: 'Instagram DM - Local Influencer',
    description: 'Friendly local angle for KC/local influencers',
    platform: 'instagram',
    body: `Hi! I'm a local KC developer. I built a multiplayer party game (Fire Horse Trivia) specifically for the rare overlap of Super Bowl LX and the Year of the Fire Horse.

It's like "Kahoot" for your watch party—perfect for killing time before kickoff this Sunday or for Lunar New Year dinners next week.

I created a free VIP Host Pass just for you. I'd love for you to use it to host a game for your actual friends this weekend.

Your VIP Code: {{CODE}}
Redeem here: redhorseoracle.com/vip

If you have fun with it, a mention on your page would mean the world to a local dev.

Cheers!`,
  },
  {
    id: 'instagram_creator',
    name: 'Instagram DM - Content Creator',
    description: 'Pitch angle for content creators with budget mention',
    platform: 'instagram',
    body: `Hey {{NAME}} - huge fan of your content!

I built a brutally hard trivia game for the "Year of the Fire Horse" (which overlaps with the Super Bowl this year).

The Pitch: You play a Solo Round and try to beat the AI's leaderboard. If you fail, you have to roast yourself. 😂

Here's a free VIP pass to test it:
Code: {{CODE}}
Link: redhorseoracle.com/vip (Select Solo Play)

If you vibe with the chaos, I have budget for a quick Skit/Challenge video. Let me know!`,
  },
  {
    id: 'email_pitch',
    name: 'Email - Business Pitch',
    description: 'Professional email pitch for content creators',
    platform: 'email',
    subject: 'Paid Content Idea: Man vs. The Impossible Quiz 🤖',
    body: `Hey {{NAME}} - huge fan.

I built a brutally hard trivia game for the "Year of the Fire Horse" (which overlaps with the Super Bowl this year).

The Pitch: You play a Solo Round and try to beat the AI's leaderboard. If you fail, you have to roast yourself.

Here is a free pass to test it:
VIP Code: {{CODE}}
Link: redhorseoracle.com/vip (Select Solo Play)

If you vibe with the chaos, I have budget for a quick Skit/Challenge video for this Sunday. Let me know!

Best,
Lindsay`,
  },
  {
    id: 'cny_followup',
    name: 'Follow-up - CNY Angle',
    description: 'Follow-up message pivoting to Chinese New Year',
    platform: 'universal',
    body: `Hope you survived the Super Bowl! 🏈

Just a reminder that the code I sent also works for Chinese New Year (Feb 17) if you need a fun activity for next week.

Your VIP Code: {{CODE}}
Link: redhorseoracle.com/vip

The Fire Horse only comes around every 60 years, so this is a rare content opportunity!`,
  },
  {
    id: 'custom',
    name: 'Custom Message',
    description: 'Start with a blank template',
    platform: 'universal',
    body: `Hi {{NAME}}!

I'd love to invite you to try Red Horse Oracle - a Fire Horse themed experience for 2026.

Your exclusive VIP Code: {{CODE}}
Redeem at: redhorseoracle.com/vip

This gives you free access to:
• Generate 1 AI Oracle ($8.88 value)
• Play 1 Solo Trivia Game ($2.88 value)
• Host 1 Party Trivia Game ($8.88 value)

Let me know what you think!`,
  },
];

// Generate code formats
export function generateVIPCode(style: 'word' | 'random' | 'custom', customCode?: string): string {
  if (style === 'custom' && customCode) {
    return customCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
  }

  if (style === 'word') {
    // Memorable word-based codes
    const words = [
      'FIRE', 'HORSE', 'DRAGON', 'TIGER', 'ZODIAC', 'LUNAR', 'GOLD', 'FLAME',
      'PHOENIX', 'JADE', 'RUBY', 'STAR', 'MOON', 'SUN', 'LUCK', 'WIN',
      'VIP', 'ELITE', 'ROYAL', 'PRIME', 'ULTRA', 'MEGA', 'SUPER', 'TOP'
    ];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${word1}${num}`;
  }

  // Random alphanumeric
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Fill template with values
export function fillTemplate(template: string, values: { code: string; name?: string; platform?: string }): string {
  let filled = template;
  filled = filled.replace(/\{\{CODE\}\}/g, values.code);
  filled = filled.replace(/\{\{NAME\}\}/g, values.name || '[Name]');
  filled = filled.replace(/\{\{PLATFORM\}\}/g, values.platform || 'social media');
  return filled;
}
