/**
 * Comprehensive Zodiac Forecasts for Year of the Fire Horse 2026
 *
 * 60 unique Element + Animal combinations, each with:
 * - Tagline (Ally/Harm/Catalyst relationship to Fire Horse)
 * - Core Strengths (4 traits)
 * - Characteristics (temperament description)
 * - 2026 Fire Horse Forecast (specific guidance)
 * - Oracle Wisdom (quote)
 * - Four Modes: Wealth, Power, Love, Shield
 */

export type ZodiacElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type ZodiacAnimalType =
  | 'Rat'
  | 'Ox'
  | 'Tiger'
  | 'Rabbit'
  | 'Dragon'
  | 'Snake'
  | 'Horse'
  | 'Goat'
  | 'Monkey'
  | 'Rooster'
  | 'Dog'
  | 'Pig';

export type FireHorseRelation =
  | 'Ally (Harmony)'
  | 'Ally (Stability)'
  | 'Ally (Growth)'
  | 'Ally (Victory)'
  | 'Ally (Clarity)'
  | 'Ally (Healing)'
  | 'Ally (Abundance)'
  | 'Harm (Friction)'
  | 'Catalyst (Change)';

export interface WealthMode {
  numbers: string; // e.g., "07-12-26-34-58-88"
  note: string; // e.g., "network gains; pick 1–2 strong alliances"
  explanation: string;
}

export interface PowerMode {
  motto: string; // e.g., "PLAN • PIVOT • ADVANCE"
  explanation: string;
}

export interface LoveMode {
  decree: string; // e.g., "TRUST GROWS THROUGH HONESTY"
  explanation: string;
}

export interface ShieldMode {
  mantra: string; // e.g., "CALM GUIDES ME"
  explanation: string;
}

export interface ZodiacForecast {
  element: ZodiacElement;
  animal: ZodiacAnimalType;
  chineseCharacter: string;
  tagline: FireHorseRelation;
  coreStrengths: [string, string, string, string];
  characteristics: string;
  forecast: string;
  oracleWisdom: string;
  modes: {
    wealth: WealthMode;
    power: PowerMode;
    love: LoveMode;
    shield: ShieldMode;
  };
}

// Mode Explainers (shown to users)
export const MODE_EXPLAINERS = {
  wealth: {
    title: 'Wealth Mode - Your 6 Lucky Numbers',
    whatItMeans:
      'These six numbers are your wealth compass for 2026 — they point you toward the kind of actions that create opportunity for your sign in a Fire Horse year.',
    howToUse: [
      'Daily: Pick one number as your "money focus" and take one aligned action (follow-up, pitch, ask, save, negotiate, create).',
      'Weekly: Pick two numbers and set two outcomes (a revenue goal + a relationship/system goal).',
      'Decision filter: When stuck, choose the option that best matches the short note.',
    ],
    practicalPlacements:
      'Reminders, milestone dates, checklists (6 steps), quote/invoice IDs, tracking tags — anything that keeps your attention aligned.',
  },
  power: {
    title: 'Power Mode - Your Battle Motto',
    whatItMeans:
      'This 3-word motto is your battle rhythm — a sequence you can follow when you need courage, leadership, or momentum.',
    howToUse: [
      'Say it out loud before a meeting/call/pitch.',
      'Use it as a 3-step plan: do word #1 first, then #2, then #3.',
      'When stressed: repeat it once to reset your behavior.',
    ],
    fireHorseTip: 'Speed without sequence creates mistakes — this is your sequence.',
  },
  love: {
    title: 'Love Mode - Your Relationship Decree',
    whatItMeans:
      'This 4-word decree is your relationship destiny theme — the behavior that attracts, strengthens, or repairs love for your sign in 2026.',
    howToUse: [
      'Start one conversation per week with this theme.',
      'Turn it into a question: "How can we live this decree today?"',
      'Pair it with one action: appreciation, apology, invitation, boundary, or commitment.',
    ],
    fireHorseTip: 'Love thrives when you act quickly on truth and kindness, not assumption.',
  },
  shield: {
    title: 'Shield Mode - Your Protection Mantra',
    whatItMeans:
      'This mantra is your protection code — it shields your time, energy, reputation, and emotional stability in a high-intensity year.',
    howToUse: [
      'Use it before entering stressful spaces (calls, crowds, family, negotiations).',
      'Use it during overwhelm to choose a boundary (tone, time, topic, exit).',
      'Use it after to release energy (breathe, walk, journal 3 lines).',
    ],
    fireHorseTip: 'Your shield is not avoidance — it is clean boundaries and recovery.',
  },
};

// ============================================================================
// RAT FORECASTS (Wood, Fire, Earth, Metal, Water)
// ============================================================================

const RAT_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Rat',
    chineseCharacter: '鼠',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Clever', 'Adaptable', 'Curious', 'Social'],
    characteristics:
      'Wood Rats thrive on ideas, connections, and fast learning. You spot opportunity early and move before others see the opening.',
    forecast:
      'Fire Horse accelerates your networking power. A new ally or community unlocks doors—choose quality over quantity. Keep agreements written and timelines realistic. Mid-year favors launches, pitches, and public visibility. Protect sleep and boundaries so momentum doesn\'t become anxiety.',
    oracleWisdom: 'Your words open gates—choose them with care.',
    modes: {
      wealth: {
        numbers: '07-12-26-34-58-88',
        note: 'Network gains; pick 1–2 strong alliances',
        explanation:
          'Your best financial luck in 2026 comes through people—referrals, partnerships, clients, allies, community.',
      },
      power: {
        motto: 'PLAN • PIVOT • ADVANCE',
        explanation:
          'Your strategic power comes from flexibility and quick adaptation. Plan your moves, pivot when needed, then advance decisively.',
      },
      love: {
        decree: 'TRUST GROWS THROUGH HONESTY',
        explanation:
          'Love deepens when you share your true thoughts and feelings openly. Transparency builds the foundation for lasting connection.',
      },
      shield: {
        mantra: 'CALM GUIDES ME',
        explanation:
          'Your protection is inner peace. When chaos surrounds you, return to calm and let it guide your decisions.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Rat',
    chineseCharacter: '鼠',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Bold', 'Charismatic', 'Fast', 'Competitive'],
    characteristics:
      'Fire Rats act decisively and thrive under pressure. You ignite projects and persuade others to follow.',
    forecast:
      'This year amplifies your fire—wins come from leading, presenting, and selling. But impulsive moves can cost you. Slow down for one "verification step" before every big yes. Recognition arrives when you focus on one mission. Don\'t burn bridges—burn distractions.',
    oracleWisdom: 'Speed is power only when your aim is true.',
    modes: {
      wealth: {
        numbers: '03-18-26-41-67-92',
        note: 'Visibility money; avoid impulse spending',
        explanation:
          'Earnings come through being seen and heard. Public presence creates opportunity, but watch impulsive purchases.',
      },
      power: {
        motto: 'LEAD • SELL • WIN',
        explanation:
          'Your power sequence: take the lead position, sell your vision with passion, then claim victory.',
      },
      love: {
        decree: 'PASSION NEEDS CLEAR BOUNDARIES',
        explanation:
          'Your intense energy attracts, but lasting love requires clear agreements about space and expectations.',
      },
      shield: {
        mantra: 'PAUSE BEFORE ACTION',
        explanation:
          'Your protection is the brief moment between impulse and action. That pause prevents costly mistakes.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Rat',
    chineseCharacter: '鼠',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Practical', 'Strategic', 'Reliable', 'Resourceful'],
    characteristics:
      'Earth Rats build security through smart planning and steady execution. You quietly win through consistency.',
    forecast:
      'Fire Horse chaos makes your steadiness valuable. You\'ll be trusted with responsibility—ask for fair terms. Financial structure is your fortune: document, budget, negotiate. Mid-year brings an offer if you can prove results. Watch digestive stress and tension—routine is medicine.',
    oracleWisdom: 'In a rushing year, the grounded one prospers.',
    modes: {
      wealth: {
        numbers: '05-14-26-33-60-81',
        note: 'Steady income; document results',
        explanation:
          'Your wealth comes through consistent, provable output. Track everything and let your results speak for you.',
      },
      power: {
        motto: 'BUILD • MEASURE • SCALE',
        explanation:
          'Your power comes from systematic growth. Build the foundation, measure what works, then scale what succeeds.',
      },
      love: {
        decree: 'LOYALTY EARNS REAL SAFETY',
        explanation:
          'Your consistent devotion creates the security that allows love to flourish and deepen over time.',
      },
      shield: {
        mantra: 'STRUCTURE SAVES ME',
        explanation:
          'Your protection is routine and organization. When life feels chaotic, return to your systems.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Rat',
    chineseCharacter: '鼠',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Precise', 'Ambitious', 'Determined', 'Sharp'],
    characteristics:
      'Metal Rats value excellence and control. You see flaws instantly and demand high standards.',
    forecast:
      'Fire Horse may trigger impatience with slower people. Choose diplomacy over correction. Your advantage is precision—tighten systems, contracts, and workflows. A rivalry may appear; win by performance, not argument. Avoid overwork; your nervous system needs calm intervals.',
    oracleWisdom: 'Polish your craft—silence your critics.',
    modes: {
      wealth: {
        numbers: '09-16-26-52-73-90',
        note: 'Precision pays; tighten contracts',
        explanation:
          'Your wealth comes through excellence and attention to detail. Tight contracts and precise work command premium value.',
      },
      power: {
        motto: 'CUT • FOCUS • EXECUTE',
        explanation:
          'Your power is surgical precision. Cut what doesn\'t serve, focus on what matters, execute flawlessly.',
      },
      love: {
        decree: 'SOFTEN WITHOUT LOSING STANDARDS',
        explanation:
          'Love asks you to be gentle while maintaining your values. Softness and standards can coexist.',
      },
      shield: {
        mantra: 'SILENCE THE NOISE',
        explanation:
          'Your protection is selective attention. Filter out distractions and critics to preserve your focus.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Rat',
    chineseCharacter: '鼠',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Intuitive', 'Persuasive', 'Observant', 'Flexible'],
    characteristics:
      'Water Rats read the room and navigate change gracefully. You excel at negotiation and timing.',
    forecast:
      'Your intuition is unusually accurate this year—trust it. Partnerships bring gains, but only with clear boundaries. Fire Horse energy can scatter you; build a simple weekly plan and stick to it. Mid-year favors travel, deals, and creative collaboration. Guard your emotions from other people\'s fires.',
    oracleWisdom: 'Flow around chaos—then choose your moment.',
    modes: {
      wealth: {
        numbers: '02-21-26-44-69-87',
        note: 'Deals through diplomacy; choose clean partners',
        explanation:
          'Your wealth flows through negotiation and well-chosen partnerships. Diplomatic skill is your currency.',
      },
      power: {
        motto: 'LISTEN • NEGOTIATE • MOVE',
        explanation:
          'Your power sequence: gather intelligence by listening, negotiate the best terms, then move decisively.',
      },
      love: {
        decree: 'EMOTIONS DESERVE TRUE WORDS',
        explanation:
          'Your feelings are valid and deserve to be expressed clearly. Honest emotional communication deepens love.',
      },
      shield: {
        mantra: 'BOUNDARIES PROTECT PEACE',
        explanation:
          'Your protection is knowing where you end and others begin. Good boundaries preserve your inner calm.',
      },
    },
  },
];

// ============================================================================
// OX FORECASTS
// ============================================================================

const OX_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Ox',
    chineseCharacter: '牛',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Reliable', 'Patient', 'Determined', 'Honest'],
    characteristics:
      'Wood Oxen build success through persistent effort and methodical progress. You value trust and long-term outcomes.',
    forecast:
      'Fire Horse pushes speed; you prefer certainty—this creates friction. Your work may feel overlooked early, so document achievements and track results. Mid-year brings recognition if you stay the course. Avoid resentment; ask directly for what you need. Health improves when you reduce load and simplify commitments.',
    oracleWisdom: 'Your proof becomes your power.',
    modes: {
      wealth: {
        numbers: '08-12-26-44-85-88',
        note: 'Slow wealth; proof beats hype',
        explanation:
          'Your wealth builds gradually through documented results. Let your track record speak louder than promises.',
      },
      power: {
        motto: 'ENDURE • DOCUMENT • PREVAIL',
        explanation:
          'Your power comes from outlasting challenges. Endure the difficulty, document your progress, and you will prevail.',
      },
      love: {
        decree: 'STEADY HEARTS WIN TOGETHER',
        explanation:
          'Love thrives when both partners commit to consistent effort. Your reliability is deeply attractive.',
      },
      shield: {
        mantra: 'PATIENCE SHIELDS ME',
        explanation:
          'Your protection is the long view. What feels urgent today often resolves itself with time.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Ox',
    chineseCharacter: '牛',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Strong-willed', 'Courageous', 'Protective', 'Driven'],
    characteristics:
      'Fire Oxen combine endurance with intensity. You can move mountains—but you dislike being rushed or challenged.',
    forecast:
      'Big responsibilities arrive fast. Choose the projects you truly believe in and decline the rest. If conflict arises, stay calm—your authority grows when you lead with steadiness. Mid-year can bring a promotion or public win. Watch inflammation and burnout; pace your strength.',
    oracleWisdom: 'Power grows when you do not force it.',
    modes: {
      wealth: {
        numbers: '06-20-26-39-71-95',
        note: 'Big responsibility; demand fair terms',
        explanation:
          'Major opportunities come with major responsibilities. Negotiate fair compensation for what you carry.',
      },
      power: {
        motto: 'STAND • LEAD • HOLD',
        explanation:
          'Your power sequence: stand firm in your position, lead with conviction, hold the line under pressure.',
      },
      love: {
        decree: 'RESPECT MAKES LOVE SAFE',
        explanation:
          'Love flourishes when both partners feel genuinely respected. Your protective nature creates security.',
      },
      shield: {
        mantra: 'TEMPER MY FIRE',
        explanation:
          'Your protection is emotional regulation. Cool your intensity before it burns what you love.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Ox',
    chineseCharacter: '牛',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Grounded', 'Loyal', 'Patient', 'Consistent'],
    characteristics:
      'Earth Oxen are pillars: steady, practical, and dependable. You thrive in structured environments and clear plans.',
    forecast:
      'This is a builder\'s year for you. While others chase sparks, you secure foundations—savings, systems, property, credentials. Fire Horse brings noise; you bring results. Mid-year rewards consistent output. Prioritize joints, posture, and recovery.',
    oracleWisdom: 'The field yields to the one who tills it daily.',
    modes: {
      wealth: {
        numbers: '10-22-26-40-62-84',
        note: 'Stability year; systems compound',
        explanation:
          'Your wealth comes through building lasting systems. What you establish now compounds over time.',
      },
      power: {
        motto: 'ROUTINE • RESULTS • REWARD',
        explanation:
          'Your power comes from consistency. Follow your routine, produce results, and rewards follow naturally.',
      },
      love: {
        decree: 'HOME BECOMES OUR FORTRESS',
        explanation:
          'Love deepens when you create a stable sanctuary together. Your reliability is the foundation of intimacy.',
      },
      shield: {
        mantra: 'GROUND MY BODY',
        explanation:
          'Your protection is physical stability. When stressed, ground yourself through movement, breath, or nature.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Ox',
    chineseCharacter: '牛',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Reliable', 'Patient', 'Determined', 'Honest'],
    characteristics:
      'Metal Oxen are steadfast and serious. You endure what others abandon and earn trust through effort.',
    forecast:
      'Fire Horse agitates your steady nature—work may feel underappreciated. Do not lose heart. Document achievements carefully and let results speak. Mid-year brings recognition if you stay the course. Health matters need attention; choose routines that outlast stress.',
    oracleWisdom: 'Patience is your shield—records are your sword.',
    modes: {
      wealth: {
        numbers: '08-12-26-61-68-88',
        note: 'Recognition mid-year; track achievements',
        explanation:
          'Your wealth comes when others finally see your value. Keep meticulous records of your contributions.',
      },
      power: {
        motto: 'PROVE • PERSIST • ASCEND',
        explanation:
          'Your power sequence: prove your worth through work, persist through doubt, and you will rise.',
      },
      love: {
        decree: 'LOYALTY DESERVES REAL PRAISE',
        explanation:
          'Your devotion is a gift that deserves recognition. Seek partners who appreciate your steadfastness.',
      },
      shield: {
        mantra: 'STILLNESS RESTORES ME',
        explanation:
          'Your protection is rest and recovery. Quiet moments rebuild what the rushing world depletes.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Ox',
    chineseCharacter: '牛',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Calm', 'Wise', 'Supportive', 'Observant'],
    characteristics:
      'Water Oxen are steady but emotionally intelligent. You protect what you love and make decisions carefully.',
    forecast:
      'Your calm becomes magnetic this year. People seek you for guidance—set boundaries so you\'re not carrying others. A relationship strengthens through honest communication. Financially, steady gains beat risky leaps. Mid-year favors contracts and long-term commitments.',
    oracleWisdom: 'Quiet strength outlasts loud fire.',
    modes: {
      wealth: {
        numbers: '11-24-26-46-63-79',
        note: 'Steady deals; say no to chaos',
        explanation:
          'Your wealth comes through calm, well-considered agreements. Decline opportunities that feel frantic.',
      },
      power: {
        motto: 'CALM • GUIDE • WIN',
        explanation:
          'Your power is serene leadership. Stay calm, guide others with wisdom, and victory follows.',
      },
      love: {
        decree: 'HONEST TALK DEEPENS BONDS',
        explanation:
          'Love grows through sincere conversation. Your willingness to communicate builds unshakeable connection.',
      },
      shield: {
        mantra: 'I CHOOSE PEACE',
        explanation:
          'Your protection is the conscious choice of peace over drama. You decide what enters your world.',
      },
    },
  },
];

// ============================================================================
// TIGER FORECASTS
// ============================================================================

const TIGER_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Tiger',
    chineseCharacter: '虎',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Brave', 'Expansive', 'Visionary', 'Energetic'],
    characteristics:
      'Wood Tigers grow through adventure and leadership. You\'re built for forward motion and bold choices.',
    forecast:
      'Fire Horse fuels your ambition—excellent for launches, travel, and reinvention. Choose one big goal and give it your full heart. Avoid ego battles; win by moving first and delivering. Mid-year brings a powerful ally. Guard sleep and overstimulation.',
    oracleWisdom: 'Lead with purpose, not impulse.',
    modes: {
      wealth: {
        numbers: '04-19-26-55-72-88',
        note: 'Expansion pays; commit to one flagship',
        explanation:
          'Your wealth comes through bold expansion, but focused on a single flagship project or mission.',
      },
      power: {
        motto: 'DARE • LEAD • LAUNCH',
        explanation:
          'Your power sequence: dare to take the risk, lead the charge, then launch into action.',
      },
      love: {
        decree: 'ADVENTURE NEEDS REAL TRUST',
        explanation:
          'Your love of adventure thrives when built on a foundation of genuine trust and reliability.',
      },
      shield: {
        mantra: 'FOCUS MY ENERGY',
        explanation:
          'Your protection is concentration. Scattered energy depletes you; focused energy makes you unstoppable.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Tiger',
    chineseCharacter: '虎',
    tagline: 'Ally (Victory)',
    coreStrengths: ['Charismatic', 'Fearless', 'Competitive', 'Inspiring'],
    characteristics:
      'Fire Tigers thrive in high-stakes arenas. You attract attention naturally and can rally a crowd.',
    forecast:
      'A peak year for visibility: leadership, performance, sales, and influence. But Fire Horse can make you reckless—test before you leap. Mid-year favors major wins if you stay disciplined. Watch conflict; choose strategy over dominance.',
    oracleWisdom: 'Your fire wins when it is guided.',
    modes: {
      wealth: {
        numbers: '01-17-26-49-76-93',
        note: 'Spotlight money; test before leaping',
        explanation:
          'Your wealth comes through visibility and performance, but verify opportunities before committing.',
      },
      power: {
        motto: 'ATTACK • INSPIRE • DOMINATE',
        explanation:
          'Your power sequence: attack your goals with full force, inspire others to follow, dominate your arena.',
      },
      love: {
        decree: 'PASSION THRIVES WITH RESPECT',
        explanation:
          'Your intense passion flourishes when paired with genuine mutual respect and admiration.',
      },
      shield: {
        mantra: 'DISCIPLINE MY SPEED',
        explanation:
          'Your protection is controlled velocity. Channel your intensity through deliberate choices.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Tiger',
    chineseCharacter: '虎',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Strong', 'Practical', 'Protective', 'Persistent'],
    characteristics:
      'Earth Tigers blend courage with realism. You want results, not drama, and you dislike wasted effort.',
    forecast:
      'Fire Horse tries to rush you; don\'t let it. Build structure around your ambition: schedule, budgets, measurable milestones. Mid-year brings an opportunity that rewards patience. Reduce stress on knees/hips—movement plus recovery.',
    oracleWisdom: 'The steady hunter catches the prize.',
    modes: {
      wealth: {
        numbers: '13-26-37-58-70-82',
        note: 'Structure profits; avoid rushed risks',
        explanation:
          'Your wealth comes through methodical planning, not hasty gambles. Build before you leap.',
      },
      power: {
        motto: 'PLAN • HUNT • FINISH',
        explanation:
          'Your power comes from strategic pursuit. Plan your approach, hunt methodically, finish what you start.',
      },
      love: {
        decree: 'SAFETY COMES FROM CONSISTENCY',
        explanation:
          'Love feels safe when built on reliable patterns. Your steadiness creates lasting security.',
      },
      shield: {
        mantra: 'SLOW IS STRONG',
        explanation:
          'Your protection is deliberate pacing. In a rushing year, your measured approach becomes an advantage.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Tiger',
    chineseCharacter: '虎',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Decisive', 'Strategic', 'Powerful', 'Focused'],
    characteristics:
      'Metal Tigers are commanding and precise. You act with force when you know the target.',
    forecast:
      'This year invites high authority—use it wisely. Choose your arena and dominate through skill, not intimidation. Mid-year may bring a rival; respond with excellence. Health improves when you balance intensity with calm rituals.',
    oracleWisdom: 'Strike once—strike clean.',
    modes: {
      wealth: {
        numbers: '15-26-45-64-78-91',
        note: 'Competitive wins; precision beats noise',
        explanation:
          'Your wealth comes through outperforming competition with precision and excellence.',
      },
      power: {
        motto: 'CHOOSE • STRIKE • HOLD',
        explanation:
          'Your power sequence: choose your target carefully, strike with precision, hold your position.',
      },
      love: {
        decree: 'POWER SOFTENS INTO DEVOTION',
        explanation:
          'Your strength becomes most beautiful when expressed as gentle devotion to those you love.',
      },
      shield: {
        mantra: 'CONTROL MY TEMPER',
        explanation:
          'Your protection is emotional mastery. Controlled intensity is far more powerful than reactive anger.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Tiger',
    chineseCharacter: '虎',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Intuitive', 'Creative', 'Flexible', 'Persuasive'],
    characteristics:
      'Water Tigers are bold yet emotionally aware. You can shift direction quickly without losing power.',
    forecast:
      'A reinvention year: rebrand, relocate, redesign your life. Fire Horse opens doors through people—collaborate. Mid-year is favorable for publishing, speaking, and creative output. Avoid escapism; choose truth and clarity.',
    oracleWisdom: 'Change becomes fate when you choose it.',
    modes: {
      wealth: {
        numbers: '12-26-43-57-69-86',
        note: 'New alliances; storytelling sells',
        explanation:
          'Your wealth comes through compelling narratives and strategic partnerships.',
      },
      power: {
        motto: 'FLOW • ADAPT • WIN',
        explanation:
          'Your power is fluid intelligence. Flow with circumstances, adapt quickly, and you will win.',
      },
      love: {
        decree: 'TRUTH OPENS NEW HEARTS',
        explanation:
          'Authentic self-expression attracts the right people. Your honesty is magnetically attractive.',
      },
      shield: {
        mantra: 'CLEAR MY MIND',
        explanation:
          'Your protection is mental clarity. When thoughts race, pause and create space for wisdom.',
      },
    },
  },
];

// ============================================================================
// RABBIT FORECASTS
// ============================================================================

const RABBIT_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Rabbit',
    chineseCharacter: '兔',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Kind', 'Artistic', 'Diplomatic', 'Gentle'],
    characteristics:
      'Wood Rabbits grow through community, beauty, and supportive relationships. You create peace and connection.',
    forecast:
      'Fire Horse is loud; your softness becomes rare and valuable. A supportive circle brings luck—curate your people. Mid-year favors romance, collaboration, and creative work. Avoid people who drain you. Prioritize rest and nervous-system calm.',
    oracleWisdom: 'Your sanctuary becomes your strength.',
    modes: {
      wealth: {
        numbers: '07-26-38-52-66-88',
        note: 'Community luck; curate your circle',
        explanation:
          'Your wealth flows through carefully chosen relationships and supportive communities.',
      },
      power: {
        motto: 'GENTLE • SMART • STEADY',
        explanation:
          'Your power is soft strength. Be gentle in approach, smart in strategy, steady in execution.',
      },
      love: {
        decree: 'KINDNESS BUILDS LASTING LOVE',
        explanation:
          'Your genuine kindness is the foundation for love that endures through all seasons.',
      },
      shield: {
        mantra: 'PROTECT MY PEACE',
        explanation:
          'Your protection is curating your environment. Guard your peace from chaos and negativity.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Rabbit',
    chineseCharacter: '兔',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Passionate', 'Expressive', 'Brave', 'Warm'],
    characteristics:
      'Fire Rabbits feel deeply and speak honestly. You can be courageous, but emotions can flare fast.',
    forecast:
      'Fire Horse can trigger reactivity. Choose pause over impulse, especially in relationships. Your voice matters—share your work and ask for support. Mid-year brings a chance to be seen if you don\'t hide. Protect heart and sleep; reduce stress triggers.',
    oracleWisdom: 'Gentle does not mean silent.',
    modes: {
      wealth: {
        numbers: '09-26-41-53-75-89',
        note: 'Visibility gains; avoid reactive decisions',
        explanation:
          'Your wealth comes through being seen and heard, but avoid making financial choices when emotional.',
      },
      power: {
        motto: 'SPEAK • CENTER • RISE',
        explanation:
          'Your power sequence: speak your truth, find your center, then rise above the noise.',
      },
      love: {
        decree: 'HEART NEEDS SOFT TRUTH',
        explanation:
          'Your passionate heart thrives when truth is delivered with gentleness and care.',
      },
      shield: {
        mantra: 'PAUSE BEFORE REPLY',
        explanation:
          'Your protection is the moment between stimulus and response. Pause before reacting.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Rabbit',
    chineseCharacter: '兔',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Patient', 'Grounded', 'Loyal', 'Caring'],
    characteristics:
      'Earth Rabbits create stable beauty: a safe home, steady relationships, and thoughtful routines.',
    forecast:
      'A strong year for home, comfort, and practical progress. Fire Horse brings change around you; you anchor what matters. Mid-year can bring a beneficial move or financial improvement. Avoid over-caretaking; receive as much as you give.',
    oracleWisdom: 'Stability is a blessing you build.',
    modes: {
      wealth: {
        numbers: '14-26-40-59-63-77',
        note: 'Home/base camp wins; steady upgrades',
        explanation:
          'Your wealth comes through improvements to your foundation—home, routines, core relationships.',
      },
      power: {
        motto: 'BUILD • NURTURE • BLOOM',
        explanation:
          'Your power sequence: build solid foundations, nurture what you\'ve planted, watch it bloom.',
      },
      love: {
        decree: 'COMFORT BECOMES OUR PROMISE',
        explanation:
          'Love deepens when you create comfort together. Your nurturing nature is a precious gift.',
      },
      shield: {
        mantra: 'REST IS SACRED',
        explanation:
          'Your protection is treating rest as non-negotiable. Recovery time is not laziness—it is wisdom.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Rabbit',
    chineseCharacter: '兔',
    tagline: 'Ally (Clarity)',
    coreStrengths: ['Refined', 'Disciplined', 'Principled', 'Calm'],
    characteristics:
      'Metal Rabbits are elegant and selective. You value boundaries and choose quality over chaos.',
    forecast:
      'Your boundaries protect your luck. Fire Horse energy tempts overcommitment—decline quickly. Mid-year favors professional respect and a cleaner path forward. Keep finances tidy and avoid lending impulsively.',
    oracleWisdom: 'What you refuse shapes your future.',
    modes: {
      wealth: {
        numbers: '16-26-47-60-72-85',
        note: 'Quality over quantity; refine commitments',
        explanation:
          'Your wealth comes through selective excellence. Less but better is your formula for success.',
      },
      power: {
        motto: 'EDIT • ELEVATE • ADVANCE',
        explanation:
          'Your power is curation. Edit out the unnecessary, elevate what remains, then advance.',
      },
      love: {
        decree: 'BOUNDARIES INVITE TRUE INTIMACY',
        explanation:
          'Clear boundaries create the safety that allows genuine intimacy to flourish.',
      },
      shield: {
        mantra: 'NO IS PROTECTION',
        explanation:
          'Your protection is the power of refusal. Every no to the wrong thing is a yes to the right thing.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Rabbit',
    chineseCharacter: '兔',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Intuitive', 'Empathic', 'Imaginative', 'Peaceful'],
    characteristics:
      'Water Rabbits sense undercurrents and seek gentle, meaningful living. You excel at healing and harmony.',
    forecast:
      'Trust your instincts about people. Fire Horse brings rapid shifts—choose environments that feel clean and supportive. Mid-year brings new friendship or love that restores your spirit. Keep your schedule spacious; you thrive with room to breathe.',
    oracleWisdom: 'Your intuition is your compass.',
    modes: {
      wealth: {
        numbers: '02-26-44-56-68-90',
        note: 'Intuition deals; avoid confusing offers',
        explanation:
          'Your wealth comes through trusting your gut. If an opportunity feels confusing, it probably isn\'t right.',
      },
      power: {
        motto: 'SENSE • CHOOSE • MOVE',
        explanation:
          'Your power is intuitive action. Sense the truth, choose your direction, then move with confidence.',
      },
      love: {
        decree: 'SOUL FEELS SAFE HERE',
        explanation:
          'Love flourishes when souls feel genuinely safe together. Your sensitivity creates that sanctuary.',
      },
      shield: {
        mantra: 'I TRUST SIGNS',
        explanation:
          'Your protection is paying attention to subtle signals. Trust what your intuition reveals.',
      },
    },
  },
];

// ============================================================================
// DRAGON FORECASTS
// ============================================================================

const DRAGON_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Dragon',
    chineseCharacter: '龙',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Visionary', 'Generous', 'Expansive', 'Inspiring'],
    characteristics:
      'Wood Dragons build legacy through growth, teaching, and leadership. You elevate others by raising standards.',
    forecast:
      'Fire Horse rewards bold leadership—publish, present, and build in public. Choose one flagship project and make it undeniable. Mid-year brings a major opening if you\'re visible. Watch ego and overextension.',
    oracleWisdom: 'Greatness grows when shared.',
    modes: {
      wealth: {
        numbers: '06-26-42-58-74-88',
        note: 'Leadership pays; build in public',
        explanation:
          'Your wealth comes through visible leadership and sharing your vision with the world.',
      },
      power: {
        motto: 'CREATE • TEACH • LEAD',
        explanation:
          'Your power sequence: create something valuable, teach others your knowledge, lead with vision.',
      },
      love: {
        decree: 'GROWTH NEEDS SHARED PURPOSE',
        explanation:
          'Love deepens when you grow together toward a common vision and shared goals.',
      },
      shield: {
        mantra: 'HUMILITY GUARDS POWER',
        explanation:
          'Your protection is humility. The strongest leaders know when to listen and learn.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Dragon',
    chineseCharacter: '龙',
    tagline: 'Ally (Victory)',
    coreStrengths: ['Magnetic', 'Fearless', 'Commanding', 'Energetic'],
    characteristics:
      'Fire Dragons are intense, brilliant, and powerful. You lead naturally—but must master impatience.',
    forecast:
      'A peak "spotlight" year. Success comes fast if you stay ethical and consistent. Mid-year can bring recognition, money, and influence. Avoid burning bridges; your words carry lasting impact. Health: prevent burnout with recovery rituals.',
    oracleWisdom: 'Rule your fire—do not let it rule you.',
    modes: {
      wealth: {
        numbers: '03-26-51-67-80-99',
        note: 'Spotlight earnings; avoid burning bridges',
        explanation:
          'Your wealth comes through being in the spotlight, but preserve relationships for long-term success.',
      },
      power: {
        motto: 'IGNITE • COMMAND • WIN',
        explanation:
          'Your power sequence: ignite enthusiasm, command attention, win decisively.',
      },
      love: {
        decree: 'LOYAL HEARTS RESPECT FLAME',
        explanation:
          'Those who truly love you will honor your intensity while helping you channel it wisely.',
      },
      shield: {
        mantra: 'COOL MY PRIDE',
        explanation:
          'Your protection is humility in moments of success. Pride is the flame that can consume you.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Dragon',
    chineseCharacter: '龙',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Strategic', 'Reliable', 'Builder', 'Protective'],
    characteristics:
      'Earth Dragons turn ambition into systems. You\'re a long-game leader who values real outcomes.',
    forecast:
      'While others sprint, you build durable power. Fire Horse brings opportunities to consolidate—teams, products, assets. Mid-year favors a big contract or operational win. Don\'t isolate; choose one trusted advisor.',
    oracleWisdom: 'What you fortify cannot be taken.',
    modes: {
      wealth: {
        numbers: '18-26-39-62-71-83',
        note: 'Consolidation year; contracts strengthen',
        explanation:
          'Your wealth comes through building lasting structures—teams, systems, agreements.',
      },
      power: {
        motto: 'FORTIFY • SYSTEMIZE • SCALE',
        explanation:
          'Your power comes from infrastructure. Fortify your foundation, systemize operations, then scale.',
      },
      love: {
        decree: 'STABILITY MAKES LOVE BLOOM',
        explanation:
          'Love flourishes in the secure garden you create. Your reliability is deeply romantic.',
      },
      shield: {
        mantra: 'ANCHOR MY DAY',
        explanation:
          'Your protection is daily structure. Routines anchor you when the world feels chaotic.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Dragon',
    chineseCharacter: '龙',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Decisive', 'Disciplined', 'Ambitious', 'Precise'],
    characteristics:
      'Metal Dragons are formidable and exact. You demand excellence and can transform environments quickly.',
    forecast:
      'Expect higher authority and stronger tests. Fire Horse increases competition—win by clarity and execution. Mid-year brings a decisive turning point; commit. Avoid control battles in relationships; soften without surrendering standards.',
    oracleWisdom: 'Precision makes destiny.',
    modes: {
      wealth: {
        numbers: '20-26-48-65-78-92',
        note: 'Competition rises; precision wins',
        explanation:
          'Your wealth comes through outperforming competitors with meticulous excellence.',
      },
      power: {
        motto: 'DECIDE • CUT • RULE',
        explanation:
          'Your power is decisive action. Make the call, cut what doesn\'t serve, rule your domain.',
      },
      love: {
        decree: 'SOFT WORDS KEEP POWER',
        explanation:
          'In love, your strength is most powerful when expressed through gentle communication.',
      },
      shield: {
        mantra: 'SILENCE THE EGO',
        explanation:
          'Your protection is putting results above recognition. Let your work speak for itself.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Dragon',
    chineseCharacter: '龙',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Wise', 'Diplomatic', 'Intuitive', 'Influential'],
    characteristics:
      'Water Dragons lead through timing, insight, and subtle persuasion. You move powerfully without force.',
    forecast:
      'A strategic year: partnerships, negotiations, and influence rise. Fire Horse tempts dramatic moves; you win with timing. Mid-year favors travel, expansion, and meaningful connections. Protect your energy from chaotic people.',
    oracleWisdom: 'The patient current shapes the stone.',
    modes: {
      wealth: {
        numbers: '11-26-46-57-69-84',
        note: 'Diplomacy gains; timing is fortune',
        explanation:
          'Your wealth comes through patient diplomacy and impeccable timing.',
      },
      power: {
        motto: 'WAIT • INFLUENCE • MOVE',
        explanation:
          'Your power is strategic patience. Wait for the right moment, influence wisely, then move.',
      },
      love: {
        decree: 'TRUST IS BUILT SLOWLY',
        explanation:
          'Deep love is constructed gradually through consistent trustworthy behavior.',
      },
      shield: {
        mantra: 'PATIENT HEART STRONG',
        explanation:
          'Your protection is patience. A calm, patient heart endures what rushing cannot.',
      },
    },
  },
];

// ============================================================================
// SNAKE FORECASTS
// ============================================================================

const SNAKE_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Snake',
    chineseCharacter: '蛇',
    tagline: 'Ally (Growth)',
    coreStrengths: ['Strategic', 'Curious', 'Elegant', 'Analytical'],
    characteristics:
      'Wood Snakes evolve through learning and refinement. You pivot intelligently and read patterns well.',
    forecast:
      'Fire Horse favors reinvention—upgrade your skills and reposition your work. Mid-year brings an invitation if you\'re prepared. Avoid secrecy that creates misunderstandings. Health improves with consistent movement and hydration.',
    oracleWisdom: 'Shed what is old—keep what is true.',
    modes: {
      wealth: {
        numbers: '05-26-37-54-68-88',
        note: 'Smart pivot; skill upgrades pay',
        explanation:
          'Your wealth comes through strategic evolution and continuous skill development.',
      },
      power: {
        motto: 'LEARN • SHIFT • WIN',
        explanation:
          'Your power is adaptive intelligence. Learn constantly, shift when needed, win through evolution.',
      },
      love: {
        decree: 'MYSTERY NEEDS HONEST WORDS',
        explanation:
          'Your alluring mystery deepens love when balanced with clear, honest communication.',
      },
      shield: {
        mantra: 'CLARITY SAVES ME',
        explanation:
          'Your protection is transparency. Confusion breeds problems; clarity resolves them.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Snake',
    chineseCharacter: '蛇',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Magnetic', 'Passionate', 'Focused', 'Intense'],
    characteristics:
      'Fire Snakes desire deeply and pursue relentlessly. You can become single-minded when inspired.',
    forecast:
      'Fire meets Fire—powerful but volatile. Channel obsession into craft, not control. Mid-year brings a romance or opportunity that tests boundaries. Avoid triangles, gossip, and impulsive spending. Prioritize calm rituals to prevent burnout.',
    oracleWisdom: 'Desire becomes wisdom when disciplined.',
    modes: {
      wealth: {
        numbers: '08-26-49-61-73-95',
        note: 'Magnetism pays; avoid obsession spending',
        explanation:
          'Your wealth comes through magnetic attraction, but watch for compulsive purchases.',
      },
      power: {
        motto: 'DESIRE • DISCIPLINE • DOMINATE',
        explanation:
          'Your power is focused desire. Want deeply, discipline yourself fiercely, dominate your field.',
      },
      love: {
        decree: 'PASSION MUST STAY CLEAN',
        explanation:
          'Your intense passion thrives when kept pure—free from manipulation or possessiveness.',
      },
      shield: {
        mantra: 'I RELEASE CONTROL',
        explanation:
          'Your protection is letting go of what you cannot control. Release creates freedom.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Snake',
    chineseCharacter: '蛇',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Patient', 'Practical', 'Steady', 'Discerning'],
    characteristics:
      'Earth Snakes are calm strategists. You build quietly and choose carefully.',
    forecast:
      'A strong year for slow wealth and steady progress. Fire Horse chaos around you highlights your reliability. Mid-year rewards consistent work with recognition or money. Keep legal/contract details precise.',
    oracleWisdom: 'Quiet plans create loud results.',
    modes: {
      wealth: {
        numbers: '12-26-40-58-72-81',
        note: 'Quiet wealth; details matter',
        explanation:
          'Your wealth grows silently through careful planning and attention to fine print.',
      },
      power: {
        motto: 'PLAN • PATIENCE • PROFIT',
        explanation:
          'Your power is strategic patience. Plan thoroughly, wait for the right moment, profit.',
      },
      love: {
        decree: 'LOYALTY PROVES TRUE LOVE',
        explanation:
          'Your steady devotion over time proves the depth of your love better than grand gestures.',
      },
      shield: {
        mantra: 'STEADY BREATH CALM',
        explanation:
          'Your protection is breath. A few deep breaths restore your center and clarity.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Snake',
    chineseCharacter: '蛇',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Precise', 'Clever', 'Controlled', 'Ambitious'],
    characteristics:
      'Metal Snakes are sharp and private. You win through planning and impeccable execution.',
    forecast:
      'Your advantage is precision and timing. Fire Horse brings sudden openings—act fast, but only after checking details. Mid-year favors promotions, deals, and strategic wins. Don\'t weaponize silence; communicate cleanly.',
    oracleWisdom: 'Control your story—or others will.',
    modes: {
      wealth: {
        numbers: '16-26-45-63-79-90',
        note: 'Contracts favor you; verify everything',
        explanation:
          'Your wealth comes through well-crafted agreements, but verify every detail before signing.',
      },
      power: {
        motto: 'PRECISION • TIMING • STRIKE',
        explanation:
          'Your power is calculated action. Perfect your precision, wait for timing, then strike.',
      },
      love: {
        decree: 'TRUST REQUIRES TRANSPARENCY',
        explanation:
          'Deep trust in love requires you to be more transparent than feels comfortable.',
      },
      shield: {
        mantra: 'TRUTH PROTECTS ME',
        explanation:
          'Your protection is honesty. The truth, clearly spoken, prevents future complications.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Snake',
    chineseCharacter: '蛇',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Intuitive', 'Reflective', 'Persuasive', 'Wise'],
    characteristics:
      'Water Snakes sense what is hidden. You\'re a deep thinker who moves with emotional intelligence.',
    forecast:
      'Trust your intuition about alliances. Fire Horse speeds things up—keep your pace and don\'t be pressured. Mid-year brings clarity on love and purpose. Avoid escapism; choose truth and action.',
    oracleWisdom: 'Your inner knowing is the real oracle.',
    modes: {
      wealth: {
        numbers: '02-26-43-55-70-88',
        note: 'Intuition deals; avoid secrecy misunderstandings',
        explanation:
          'Your wealth comes through trusting your intuition, but be clear in communication to avoid misreadings.',
      },
      power: {
        motto: 'SENSE • GUIDE • WIN',
        explanation:
          'Your power is intuitive leadership. Sense the truth, guide others wisely, win through insight.',
      },
      love: {
        decree: 'DEPTH CREATES REAL BONDS',
        explanation:
          'Your capacity for emotional depth creates connections that surface relationships cannot match.',
      },
      shield: {
        mantra: 'QUIET MY FEARS',
        explanation:
          'Your protection is calming your anxious mind. Fear distorts reality; quiet reveals truth.',
      },
    },
  },
];

// ============================================================================
// HORSE FORECASTS
// ============================================================================

const HORSE_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Horse',
    chineseCharacter: '马',
    tagline: 'Ally (Growth)',
    coreStrengths: ['Adventurous', 'Optimistic', 'Social', 'Energetic'],
    characteristics:
      'Wood Horses thrive on movement, people, and possibility. You grow through new horizons.',
    forecast:
      'Your year supports expansion—travel, launches, public visibility. But don\'t confuse motion with progress: choose a destination. Mid-year brings a golden opportunity if you commit. Watch burnout; schedule recovery.',
    oracleWisdom: 'Run toward a purpose, not away from stillness.',
    modes: {
      wealth: {
        numbers: '04-26-38-60-71-88',
        note: 'Travel/launch money; pick a destination',
        explanation:
          'Your wealth comes through movement and expansion, but requires a clear destination.',
      },
      power: {
        motto: 'MOVE • COMMIT • WIN',
        explanation:
          'Your power is decisive momentum. Move toward your goal, commit fully, win through action.',
      },
      love: {
        decree: 'FREEDOM NEEDS TRUE CARE',
        explanation:
          'Your love of freedom flourishes when balanced with genuine care for your partner.',
      },
      shield: {
        mantra: 'PACE MY FIRE',
        explanation:
          'Your protection is sustainable energy. Pace yourself so your fire burns long, not just bright.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Horse',
    chineseCharacter: '马',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Fearless', 'Charismatic', 'Fast', 'Independent'],
    characteristics:
      'Fire Horses are pure momentum. You inspire others by living boldly and refusing to shrink.',
    forecast:
      'Double-fire intensity: massive potential and real burnout risk. Choose one north star and make everything else secondary. Mid-year brings spotlight and breakthroughs if you\'ve protected your energy. Guard relationships—your speed can feel like distance to others.',
    oracleWisdom: 'Your flame is sacred—feed it wisely.',
    modes: {
      wealth: {
        numbers: '01-26-49-66-77-99',
        note: 'Breakthroughs; avoid burnout leaks',
        explanation:
          'Your wealth comes through major breakthroughs, but protect your energy to avoid costly burnout.',
      },
      power: {
        motto: 'BURN • FOCUS • CONQUER',
        explanation:
          'Your power is intense focus. Burn with passion, focus on one target, conquer your goal.',
      },
      love: {
        decree: 'HEART RUNS TOWARD HOME',
        explanation:
          'Even your wild heart seeks a home. Let love be the destination your freedom runs toward.',
      },
      shield: {
        mantra: 'REST SAVES ME',
        explanation:
          'Your protection is recovery. Rest is not weakness—it is the fuel for your next run.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Horse',
    chineseCharacter: '马',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Practical', 'Enduring', 'Loyal', 'Responsible'],
    characteristics:
      'Earth Horses blend freedom with reliability. You want movement, but you also respect commitments.',
    forecast:
      'Build a sustainable life while the world speeds up. Mid-year favors income stability and a strong "base camp" (home, routines, health). Avoid risky leaps; choose durable wins.',
    oracleWisdom: 'Freedom lasts when your foundation is strong.',
    modes: {
      wealth: {
        numbers: '10-26-41-62-80-84',
        note: 'Stable income; build base camp',
        explanation:
          'Your wealth comes through building lasting infrastructure—home, savings, reliable systems.',
      },
      power: {
        motto: 'BUILD • BALANCE • ADVANCE',
        explanation:
          'Your power is sustainable progress. Build foundations, maintain balance, advance steadily.',
      },
      love: {
        decree: 'LOYALTY MAKES FREEDOM SAFE',
        explanation:
          'Loyal love creates the security that allows you both to be free within the relationship.',
      },
      shield: {
        mantra: 'GROUND BEFORE SPEED',
        explanation:
          'Your protection is grounding before action. Connect to earth before you run.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Horse',
    chineseCharacter: '马',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Driven', 'Bold', 'Ambitious', 'Strong-minded'],
    characteristics:
      'Metal Horses are powerful and demanding. You chase excellence and can resist compromise.',
    forecast:
      'Fire Horse amplifies intensity—conflict can arise if you push too hard. Win through systems: plan, delegate, document. Mid-year brings leadership gains if you stay disciplined. Protect heart and nervous system—rest is strategy.',
    oracleWisdom: 'Discipline turns fire into mastery.',
    modes: {
      wealth: {
        numbers: '15-26-50-64-78-91',
        note: 'Leadership money; systems prevent conflict',
        explanation:
          'Your wealth comes through leading, but smart systems prevent the conflicts that drain resources.',
      },
      power: {
        motto: 'DISCIPLINE • DRIVE • RULE',
        explanation:
          'Your power is channeled ambition. Discipline yourself, drive forward, rule your domain.',
      },
      love: {
        decree: 'RESPECT KEEPS FIRE SWEET',
        explanation:
          'Your passionate nature stays beautiful in love when wrapped in genuine mutual respect.',
      },
      shield: {
        mantra: 'CONTROL MY SPEED',
        explanation:
          'Your protection is pacing. Control your velocity so you don\'t crash what you\'re building.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Horse',
    chineseCharacter: '马',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Intuitive', 'Flexible', 'Social', 'Creative'],
    characteristics:
      'Water Horses move with emotion and imagination. You adapt quickly and connect easily.',
    forecast:
      'Emotional renewal and creative expansion. Mid-year brings new relationships and supportive communities. Avoid running from discomfort—face it, then move forward. Your best luck comes through honest conversations and aligned partnerships.',
    oracleWisdom: 'Let your heart set the pace.',
    modes: {
      wealth: {
        numbers: '12-26-44-57-69-88',
        note: 'Creative gains; aligned partners help',
        explanation:
          'Your wealth comes through creative expression and partnerships that feel emotionally aligned.',
      },
      power: {
        motto: 'FLOW • CONNECT • RISE',
        explanation:
          'Your power is emotional intelligence. Flow with circumstances, connect authentically, rise naturally.',
      },
      love: {
        decree: 'TRUTH BRINGS US CLOSER',
        explanation:
          'Honest emotional expression is the bridge that brings you and your partner closer together.',
      },
      shield: {
        mantra: 'I CHOOSE CALM',
        explanation:
          'Your protection is choosing peace over reaction. Calm is always available to you.',
      },
    },
  },
];

// ============================================================================
// GOAT FORECASTS
// ============================================================================

const GOAT_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Goat',
    chineseCharacter: '羊',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Creative', 'Kind', 'Cooperative', 'Imaginative'],
    characteristics:
      'Wood Goats thrive in supportive environments and create beauty through collaboration.',
    forecast:
      'Fire Horse sparks creative opportunities—collaborate and share your work. Mid-year favors art, design, community, and meaningful projects. Avoid isolation; your luck lives in your people. Protect your peace from chaotic demands.',
    oracleWisdom: 'Your gift grows when shared.',
    modes: {
      wealth: {
        numbers: '07-26-36-58-73-88',
        note: 'Collaboration money; don\'t isolate',
        explanation:
          'Your wealth comes through creative partnerships. Isolation limits your financial potential.',
      },
      power: {
        motto: 'CREATE • SUPPORT • GROW',
        explanation:
          'Your power is collaborative creativity. Create with others, support their vision, grow together.',
      },
      love: {
        decree: 'KIND HEARTS FIND HOME',
        explanation:
          'Your gentle, kind nature attracts love that feels like coming home.',
      },
      shield: {
        mantra: 'PROTECT MY ENERGY',
        explanation:
          'Your protection is energy management. Guard your creative spirit from those who drain it.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Goat',
    chineseCharacter: '羊',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Passionate', 'Warm', 'Expressive', 'Loyal'],
    characteristics:
      'Fire Goats love deeply and feel intensely. You can inspire—but may get pulled into drama.',
    forecast:
      'Fire Horse can inflame emotions. Choose calm communication, not reactive words. Mid-year brings romance or social expansion—keep boundaries. Health improves with grounding habits and consistent sleep.',
    oracleWisdom: 'Warmth heals—drama burns.',
    modes: {
      wealth: {
        numbers: '09-26-47-60-75-92',
        note: 'Social luck; avoid drama costs',
        explanation:
          'Your wealth comes through social connections, but drama can be financially expensive.',
      },
      power: {
        motto: 'WARMTH • COURAGE • BOUNDARIES',
        explanation:
          'Your power is warm courage. Lead with warmth, act with courage, maintain clear boundaries.',
      },
      love: {
        decree: 'PASSION NEEDS GENTLE RULES',
        explanation:
          'Your passionate heart thrives within gentle guidelines that prevent emotional chaos.',
      },
      shield: {
        mantra: 'I REFUSE DRAMA',
        explanation:
          'Your protection is declining invitations to chaos. You can be warm without being pulled into drama.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Goat',
    chineseCharacter: '羊',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Practical', 'Caring', 'Patient', 'Steady'],
    characteristics:
      'Earth Goats build quiet prosperity through daily effort and responsible choices.',
    forecast:
      'This year rewards your consistency. Mid-year brings financial improvement or recognition for steady work. Avoid comparing your pace to others—your path is correct. Prioritize digestion and stress reduction.',
    oracleWisdom: 'Small steps become mountains.',
    modes: {
      wealth: {
        numbers: '14-26-40-59-66-81',
        note: 'Steady gains; small steps compound',
        explanation:
          'Your wealth grows through consistent small actions that compound over time.',
      },
      power: {
        motto: 'ROUTINE • CARE • BUILD',
        explanation:
          'Your power is daily dedication. Follow your routines, care for what matters, build steadily.',
      },
      love: {
        decree: 'SAFETY IS OUR TREASURE',
        explanation:
          'The emotional safety you create together is more valuable than any excitement.',
      },
      shield: {
        mantra: 'SLOW STEADY STRONG',
        explanation:
          'Your protection is your pace. Slow and steady makes you stronger than the rushing world.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Goat',
    chineseCharacter: '羊',
    tagline: 'Ally (Clarity)',
    coreStrengths: ['Discerning', 'Refined', 'Responsible', 'Strong'],
    characteristics:
      'Metal Goats value quality and integrity. You set standards and keep your world well-chosen.',
    forecast:
      'Cut what drains you—your luck increases when your life is cleaner. Mid-year favors a professional upgrade or new role. Avoid perfection paralysis; ship the work.',
    oracleWisdom: 'Refinement is a form of power.',
    modes: {
      wealth: {
        numbers: '16-26-45-63-72-85',
        note: 'Quality upgrades pay; ship the work',
        explanation:
          'Your wealth comes through raising quality standards, but perfectionism can block revenue.',
      },
      power: {
        motto: 'REFINE • COMMIT • DELIVER',
        explanation:
          'Your power is refined excellence. Polish your work, commit to completion, deliver results.',
      },
      love: {
        decree: 'STANDARDS ATTRACT TRUE LOVE',
        explanation:
          'Your high standards attract partners who match your level of integrity and care.',
      },
      shield: {
        mantra: 'NO KEEPS PEACE',
        explanation:
          'Your protection is selective commitment. Every no to something wrong brings peace.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Goat',
    chineseCharacter: '羊',
    tagline: 'Ally (Healing)',
    coreStrengths: ['Empathic', 'Gentle', 'Intuitive', 'Artistic'],
    characteristics:
      'Water Goats are sensitive and spiritually strong. You heal through beauty, care, and reflection.',
    forecast:
      'A restorative year if you protect your energy. Mid-year brings a supportive friend or mentor. Avoid overgiving; your compassion must include yourself.',
    oracleWisdom: 'Your softness is not weakness—it is wisdom.',
    modes: {
      wealth: {
        numbers: '02-26-43-56-68-90',
        note: 'Healing year; choose supportive patrons',
        explanation:
          'Your wealth comes through supportive relationships and healing environments.',
      },
      power: {
        motto: 'HEAL • CREATE • BLOOM',
        explanation:
          'Your power is restorative creativity. Heal what is wounded, create beauty, bloom naturally.',
      },
      love: {
        decree: 'SOFTNESS DRAWS SAFE LOVE',
        explanation:
          'Your gentle nature attracts love that feels safe and nurturing.',
      },
      shield: {
        mantra: 'I PROTECT HEART',
        explanation:
          'Your protection is heart-guarding. Your sensitive heart deserves careful protection.',
      },
    },
  },
];

// ============================================================================
// MONKEY FORECASTS
// ============================================================================

const MONKEY_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Monkey',
    chineseCharacter: '猴',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Inventive', 'Playful', 'Curious', 'Clever'],
    characteristics:
      'Wood Monkeys innovate fast and learn through experimentation. You thrive in dynamic environments.',
    forecast:
      'A brilliant year for prototypes, new products, and creative problem-solving. Mid-year favors a breakthrough if you commit to shipping. Avoid endless tinkering—finish. Partnerships amplify your results.',
    oracleWisdom: 'Create, test, refine—then leap.',
    modes: {
      wealth: {
        numbers: '05-26-37-55-71-88',
        note: 'Innovation money; finish what you start',
        explanation:
          'Your wealth comes through innovation, but only completed projects generate revenue.',
      },
      power: {
        motto: 'TEST • BUILD • SHIP',
        explanation:
          'Your power is iterative creation. Test your ideas, build what works, ship the finished product.',
      },
      love: {
        decree: 'PLAYFUL HEARTS NEED TRUST',
        explanation:
          'Your playful nature thrives in love when built on a foundation of genuine trust.',
      },
      shield: {
        mantra: 'FOCUS ENDS CHAOS',
        explanation:
          'Your protection is concentration. When you focus, the chaos of options resolves into clarity.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Monkey',
    chineseCharacter: '猴',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Charismatic', 'Bold', 'Fast', 'Persuasive'],
    characteristics:
      'Fire Monkeys can charm anyone and move ideas quickly into action—but may overdo risk.',
    forecast:
      'Fire Horse boosts your social power—great for sales and visibility. But watch impulsive spending and dramatic choices. Mid-year offers a big win if you stay disciplined. Keep your word; reputation is currency.',
    oracleWisdom: 'Charm is a tool—integrity is the crown.',
    modes: {
      wealth: {
        numbers: '03-26-49-61-74-93',
        note: 'Viral luck; avoid impulse buys',
        explanation:
          'Your wealth comes through social influence and sales, but impulsive purchases drain gains.',
      },
      power: {
        motto: 'CHARM • STRIKE • WIN',
        explanation:
          'Your power is magnetic action. Charm your audience, strike at opportunity, win decisively.',
      },
      love: {
        decree: 'LOYALTY MAKES SPARKS LAST',
        explanation:
          'Your exciting energy attracts, but loyal commitment makes the sparks turn into lasting flame.',
      },
      shield: {
        mantra: 'DISCIPLINE MY DESIRES',
        explanation:
          'Your protection is desire management. Not every want deserves action.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Monkey',
    chineseCharacter: '猴',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Practical', 'Resourceful', 'Smart', 'Organized'],
    characteristics:
      'Earth Monkeys turn clever ideas into real outcomes. You\'re a builder disguised as a trickster.',
    forecast:
      'Systems are your fortune. Mid-year rewards you for documentation, repeatable workflows, and operational excellence. Avoid gossip and scattered commitments. Health improves when you simplify.',
    oracleWisdom: 'Make it repeatable—and you become unstoppable.',
    modes: {
      wealth: {
        numbers: '12-26-40-58-70-82',
        note: 'Systems profit; repeatable wins',
        explanation:
          'Your wealth comes through creating systems that can be repeated and scaled.',
      },
      power: {
        motto: 'SYSTEMIZE • MEASURE • SCALE',
        explanation:
          'Your power is operational intelligence. Create systems, measure results, scale what works.',
      },
      love: {
        decree: 'CONSISTENCY EARNS REAL LOVE',
        explanation:
          'Your reliable presence over time earns the deep love that charm alone cannot buy.',
      },
      shield: {
        mantra: 'ORDER PROTECTS ME',
        explanation:
          'Your protection is organization. A well-ordered life prevents most crises.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Monkey',
    chineseCharacter: '猴',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Strategic', 'Sharp', 'Competitive', 'Precise'],
    characteristics:
      'Metal Monkeys win through skill and timing. You can outthink opponents and thrive in competition.',
    forecast:
      'Expect rivalry—use it to sharpen mastery. Mid-year favors promotions and high-stakes deals. Don\'t cut corners; details decide outcomes.',
    oracleWisdom: 'Mastery ends arguments.',
    modes: {
      wealth: {
        numbers: '15-26-45-64-78-90',
        note: 'Competitive advantage; details decide',
        explanation:
          'Your wealth comes through outperforming competition with superior skill and attention to detail.',
      },
      power: {
        motto: 'OUTTHINK • OUTPLAY • WIN',
        explanation:
          'Your power is mental superiority. Outthink the competition, outplay them tactically, win.',
      },
      love: {
        decree: 'TRUST BEATS CLEVER GAMES',
        explanation:
          'In love, genuine trust creates more intimacy than any clever strategy.',
      },
      shield: {
        mantra: 'TRUTH OVER TRICKS',
        explanation:
          'Your protection is choosing honesty over manipulation. Truth has no maintenance cost.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Monkey',
    chineseCharacter: '猴',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Social', 'Intuitive', 'Persuasive', 'Creative'],
    characteristics:
      'Water Monkeys connect people and ideas. You\'re adaptable, charming, and emotionally intelligent.',
    forecast:
      'Partnerships bring luck—choose collaborators who honor you. Mid-year favors travel, public speaking, and creative expansion. Avoid manipulative dynamics (yours or theirs).',
    oracleWisdom: 'Use your voice to build, not to bend.',
    modes: {
      wealth: {
        numbers: '11-26-44-57-69-87',
        note: 'Partnership profits; choose ethical allies',
        explanation:
          'Your wealth comes through partnerships with ethical people who match your values.',
      },
      power: {
        motto: 'CONNECT • NEGOTIATE • RISE',
        explanation:
          'Your power is relational intelligence. Connect authentically, negotiate wisely, rise together.',
      },
      love: {
        decree: 'HONEST WORDS SPARK LOVE',
        explanation:
          'Your words have power. Use them honestly and they spark genuine love.',
      },
      shield: {
        mantra: 'BOUNDARIES KEEP JOY',
        explanation:
          'Your protection is knowing limits. Good boundaries preserve the joy in relationships.',
      },
    },
  },
];

// ============================================================================
// ROOSTER FORECASTS
// ============================================================================

const ROOSTER_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Rooster',
    chineseCharacter: '鸡',
    tagline: 'Ally (Growth)',
    coreStrengths: ['Organized', 'Improving', 'Honest', 'Diligent'],
    characteristics:
      'Wood Roosters refine, optimize, and elevate quality. You fix what others ignore.',
    forecast:
      'Fire Horse rewards polish and presentation. Upgrade your brand, portfolio, or product—mid-year brings recognition. Avoid harsh criticism; your truth lands better with warmth.',
    oracleWisdom: 'Refinement turns work into art.',
    modes: {
      wealth: {
        numbers: '06-26-42-58-72-88',
        note: 'Polish pays; improve what exists',
        explanation:
          'Your wealth comes through improving and refining existing work to higher standards.',
      },
      power: {
        motto: 'REFINE • ORGANIZE • WIN',
        explanation:
          'Your power is optimization. Refine your approach, organize your resources, win through excellence.',
      },
      love: {
        decree: 'KIND TRUTH BUILDS TRUST',
        explanation:
          'Your honest observations build trust when delivered with kindness and care.',
      },
      shield: {
        mantra: 'CALM MY TONGUE',
        explanation:
          'Your protection is verbal restraint. Pause before speaking to ensure words serve rather than wound.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Rooster',
    chineseCharacter: '鸡',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Confident', 'Visible', 'Bold', 'Inspiring'],
    characteristics:
      'Fire Roosters thrive in the spotlight and can lead through example.',
    forecast:
      'A recognition year—present, teach, speak. Mid-year brings a public win if you stay consistent. Watch conflict; choose diplomacy. Health: avoid overstimulation and late nights.',
    oracleWisdom: 'Be seen for what you\'ve built.',
    modes: {
      wealth: {
        numbers: '01-26-49-66-76-92',
        note: 'Recognition money; avoid harsh conflict',
        explanation:
          'Your wealth comes through being recognized and visible, but conflict drains resources.',
      },
      power: {
        motto: 'SPEAK • LEAD • SHINE',
        explanation:
          'Your power is confident presence. Speak your truth, lead by example, shine in the spotlight.',
      },
      love: {
        decree: 'RESPECT MAKES PASSION SAFE',
        explanation:
          'Your passionate nature thrives when surrounded by genuine mutual respect.',
      },
      shield: {
        mantra: 'PAUSE BEFORE CRITIQUE',
        explanation:
          'Your protection is thoughtful response. Pause before offering criticism to ensure it helps.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Rooster',
    chineseCharacter: '鸡',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Responsible', 'Accurate', 'Reliable', 'Steady'],
    characteristics:
      'Earth Roosters keep life orderly and real. You make standards that protect outcomes.',
    forecast:
      'Fire Horse creates mess; you become indispensable. Mid-year favors promotions tied to operations, quality, or leadership. Avoid becoming rigid; adapt without losing principles.',
    oracleWisdom: 'Order is your superpower.',
    modes: {
      wealth: {
        numbers: '10-26-41-62-70-84',
        note: 'Operations profit; you\'re indispensable',
        explanation:
          'Your wealth comes through being the reliable person who keeps things running smoothly.',
      },
      power: {
        motto: 'ORDER • EXECUTE • ADVANCE',
        explanation:
          'Your power is reliable execution. Create order, execute consistently, advance steadily.',
      },
      love: {
        decree: 'STABILITY IS MY LOVE LANGUAGE',
        explanation:
          'You show love through creating stability and reliability for those you care about.',
      },
      shield: {
        mantra: 'ROUTINE SAVES ME',
        explanation:
          'Your protection is consistent routine. Good habits prevent most problems.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Rooster',
    chineseCharacter: '鸡',
    tagline: 'Ally (Clarity)',
    coreStrengths: ['Precise', 'Principled', 'Disciplined', 'Strong'],
    characteristics:
      'Metal Roosters are exacting and proud. You thrive in roles where integrity and detail matter.',
    forecast:
      'Excellent for audits, security, compliance, and high-standard work. Mid-year brings respect if you document and deliver. Avoid perfection paralysis; release the work.',
    oracleWisdom: 'Perfection is a direction, not a prison.',
    modes: {
      wealth: {
        numbers: '16-26-45-63-79-91',
        note: 'High standards pay; don\'t freeze perfection',
        explanation:
          'Your wealth comes through exceptional standards, but perfectionism can block completion.',
      },
      power: {
        motto: 'PRECISION • INTEGRITY • RESULTS',
        explanation:
          'Your power is principled excellence. Be precise, maintain integrity, deliver results.',
      },
      love: {
        decree: 'SOFTEN WHILE STAYING TRUE',
        explanation:
          'In love, you can be gentle and warm while maintaining your core values.',
      },
      shield: {
        mantra: 'RELEASE PERFECTIONISM',
        explanation:
          'Your protection is accepting good enough. Done is better than perfect.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Rooster',
    chineseCharacter: '鸡',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Insightful', 'Communicative', 'Empathic', 'Sharp'],
    characteristics:
      'Water Roosters read people well and speak with impact. But emotions can sharpen words.',
    forecast:
      'Choose kindness in communication—Fire Horse can make conversations volatile. Mid-year favors relationship repair and new alliances. Protect your peace; do not argue with chaos.',
    oracleWisdom: 'Your words can heal—choose them.',
    modes: {
      wealth: {
        numbers: '12-26-44-56-68-88',
        note: 'Communication gains; choose warmth',
        explanation:
          'Your wealth comes through communication and connection, but warmth increases your impact.',
      },
      power: {
        motto: 'LISTEN • SPEAK • HEAL',
        explanation:
          'Your power is compassionate communication. Listen deeply, speak wisely, heal through words.',
      },
      love: {
        decree: 'WORDS BECOME OUR BOND',
        explanation:
          'In love, your words create the bond. Choose them with care and intention.',
      },
      shield: {
        mantra: 'KINDNESS GUARDS ME',
        explanation:
          'Your protection is leading with kindness. Gentle words prevent most conflicts.',
      },
    },
  },
];

// ============================================================================
// DOG FORECASTS
// ============================================================================

const DOG_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Dog',
    chineseCharacter: '狗',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Loyal', 'Honest', 'Protective', 'Steady'],
    characteristics:
      'Wood Dogs build strong communities and defend what matters. You value trust, fairness, and belonging.',
    forecast:
      'Fire Horse rewards loyalty and teamwork. A trusted ally helps you advance—ask for support. Mid-year brings unexpected benefits through friendship and community. Avoid carrying everyone; protect your energy.',
    oracleWisdom: 'Guard your allies—and they guard your future.',
    modes: {
      wealth: {
        numbers: '07-26-40-58-69-88',
        note: 'Allies bring fortune; protect your pack',
        explanation:
          'Your wealth comes through the people you\'ve been loyal to. Your network is your net worth.',
      },
      power: {
        motto: 'GUARD • BUILD • WIN',
        explanation:
          'Your power is protective leadership. Guard what matters, build community, win together.',
      },
      love: {
        decree: 'LOYAL HEARTS STAY TOGETHER',
        explanation:
          'Your devoted loyalty creates love that endures through every season and challenge.',
      },
      shield: {
        mantra: 'I TRUST ALLIES',
        explanation:
          'Your protection is your trusted circle. You don\'t have to face everything alone.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Dog',
    chineseCharacter: '狗',
    tagline: 'Catalyst (Change)',
    coreStrengths: ['Brave', 'Devoted', 'Passionate', 'Protective'],
    characteristics:
      'Fire Dogs defend loved ones fiercely and act with heart. You can become intense when values are challenged.',
    forecast:
      'Stand up for what\'s right, but choose battles wisely. Mid-year brings leadership chances through advocacy and reliability. Watch burnout from over-responsibility. Health improves when you rest without guilt.',
    oracleWisdom: 'Courage with calm becomes leadership.',
    modes: {
      wealth: {
        numbers: '03-26-49-60-73-95',
        note: 'Leadership money; avoid righteous burnout',
        explanation:
          'Your wealth comes through leadership and advocacy, but over-responsibility drains resources.',
      },
      power: {
        motto: 'DEFEND • LEAD • ENDURE',
        explanation:
          'Your power is principled persistence. Defend what matters, lead with courage, endure.',
      },
      love: {
        decree: 'PASSION SERVES TRUE DEVOTION',
        explanation:
          'Your passionate nature becomes most beautiful when channeled into devoted service to love.',
      },
      shield: {
        mantra: 'CALM MY FIRE',
        explanation:
          'Your protection is temperature control. Cool your intensity before it burns you or others.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Dog',
    chineseCharacter: '狗',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Loyal', 'Honest', 'Protective', 'Faithful'],
    characteristics:
      'Earth Dogs have a strong moral compass and steady devotion. You become an invaluable ally and trusted companion.',
    forecast:
      'An excellent year for Dogs. Fire Horse recognizes your loyalty and rewards it. Career advancement comes through trusted connections; new friendships bring unexpected benefits. Guard your allies and they will make you prosper. Your faithful nature attracts fortune—don\'t doubt it.',
    oracleWisdom: 'Your loyalty will be rewarded handsomely.',
    modes: {
      wealth: {
        numbers: '04-26-41-62-74-88',
        note: 'Excellent year; connections lift you',
        explanation:
          'This is your year. Your loyal nature attracts abundance through trusted relationships.',
      },
      power: {
        motto: 'LOYAL • STRONG • READY',
        explanation:
          'Your power is prepared devotion. Stay loyal, stay strong, stay ready for opportunity.',
      },
      love: {
        decree: 'LOVE HONORS MY LOYALTY',
        explanation:
          'You deserve love that recognizes and honors your faithful, devoted nature.',
      },
      shield: {
        mantra: 'HOME KEEPS ME',
        explanation:
          'Your protection is your home base. Return to your sanctuary to restore your spirit.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Dog',
    chineseCharacter: '狗',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Principled', 'Strong', 'Watchful', 'Determined'],
    characteristics:
      'Metal Dogs value truth and justice. You can be uncompromising when integrity is on the line.',
    forecast:
      'Fire Horse can provoke conflict if you become rigid. Choose strategy over confrontation. Mid-year brings a chance to formalize agreements—get everything in writing. Protect joints, teeth, and tension; reduce stress.',
    oracleWisdom: 'Justice wins best with patience.',
    modes: {
      wealth: {
        numbers: '15-26-45-64-78-90',
        note: 'Contracts matter; justice through paperwork',
        explanation:
          'Your wealth is protected through proper documentation and formal agreements.',
      },
      power: {
        motto: 'STAND • CLARIFY • WIN',
        explanation:
          'Your power is principled clarity. Stand for what\'s right, clarify terms, win through integrity.',
      },
      love: {
        decree: 'RESPECT KEEPS LOVE CLEAN',
        explanation:
          'Mutual respect is the foundation that keeps your love relationships healthy and honest.',
      },
      shield: {
        mantra: 'TRUTH SHIELDS ME',
        explanation:
          'Your protection is honesty. Living in truth prevents the complications lies create.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Dog',
    chineseCharacter: '狗',
    tagline: 'Ally (Healing)',
    coreStrengths: ['Empathic', 'Loyal', 'Intuitive', 'Supportive'],
    characteristics:
      'Water Dogs love deeply and sense emotional truth. You nurture loyalty through compassion.',
    forecast:
      'Relationships deepen if you speak honestly. Mid-year brings supportive allies and potential romance. Avoid rescuing people who refuse to change. Your fortune grows when your boundaries are kind but firm.',
    oracleWisdom: 'Love with boundaries becomes destiny.',
    modes: {
      wealth: {
        numbers: '11-26-44-57-68-87',
        note: 'Supportive allies; avoid rescuing drains',
        explanation:
          'Your wealth comes through supportive relationships, but rescuing the unwilling drains you.',
      },
      power: {
        motto: 'CARE • BOUNDARIES • STRENGTH',
        explanation:
          'Your power is compassionate strength. Care deeply, maintain boundaries, stay strong.',
      },
      love: {
        decree: 'SAFE LOVE FINDS ME',
        explanation:
          'Your nurturing nature attracts love that feels safe and emotionally secure.',
      },
      shield: {
        mantra: 'I RELEASE GUILT',
        explanation:
          'Your protection is letting go of guilt. You cannot save everyone, and that is okay.',
      },
    },
  },
];

// ============================================================================
// PIG FORECASTS
// ============================================================================

const PIG_FORECASTS: ZodiacForecast[] = [
  {
    element: 'Wood',
    animal: 'Pig',
    chineseCharacter: '猪',
    tagline: 'Ally (Abundance)',
    coreStrengths: ['Generous', 'Kind', 'Warm', 'Steady'],
    characteristics:
      'Wood Pigs create abundance through goodwill and sincere relationships. You thrive when life feels meaningful.',
    forecast:
      'Fire Horse opens doors through people. Mid-year brings prosperity via collaboration and community. Don\'t overgive; invest in mutual relationships. Health improves with moderation and joyful movement.',
    oracleWisdom: 'Give wisely—and you receive greatly.',
    modes: {
      wealth: {
        numbers: '06-26-42-55-71-88',
        note: 'Abundance through people; give wisely',
        explanation:
          'Your wealth comes through generous relationships, but balanced giving creates more than sacrifice.',
      },
      power: {
        motto: 'NURTURE • BUILD • BLOOM',
        explanation:
          'Your power is generous creation. Nurture relationships, build with others, bloom in abundance.',
      },
      love: {
        decree: 'KINDNESS ATTRACTS TRUE LOVE',
        explanation:
          'Your genuine kindness draws love that matches your generous spirit.',
      },
      shield: {
        mantra: 'MODERATION PROTECTS ME',
        explanation:
          'Your protection is balance. Moderate indulgence keeps you healthy and prosperous.',
      },
    },
  },
  {
    element: 'Fire',
    animal: 'Pig',
    chineseCharacter: '猪',
    tagline: 'Harm (Friction)',
    coreStrengths: ['Passionate', 'Joyful', 'Bold', 'Loving'],
    characteristics:
      'Fire Pigs live big and love fully. You can indulge when life is exciting.',
    forecast:
      'A high-appetite year: fun, romance, and spending temptations. Mid-year brings opportunities, but avoid excess. Choose discipline that still feels joyful. Protect sleep and digestion.',
    oracleWisdom: 'Enjoy the feast—do not become the feast.',
    modes: {
      wealth: {
        numbers: '09-26-49-61-75-93',
        note: 'Fun luck; watch excess spending',
        explanation:
          'Your wealth comes through joyful engagement, but excessive indulgence drains resources.',
      },
      power: {
        motto: 'ENJOY • DISCIPLINE • WIN',
        explanation:
          'Your power is disciplined enjoyment. Savor life, maintain discipline, win through balance.',
      },
      love: {
        decree: 'PASSION NEEDS SAFE LIMITS',
        explanation:
          'Your passionate love nature thrives within agreed-upon boundaries that prevent chaos.',
      },
      shield: {
        mantra: 'I CHOOSE BALANCE',
        explanation:
          'Your protection is conscious moderation. Balance prevents the regrets of excess.',
      },
    },
  },
  {
    element: 'Earth',
    animal: 'Pig',
    chineseCharacter: '猪',
    tagline: 'Ally (Stability)',
    coreStrengths: ['Practical', 'Caring', 'Calm', 'Reliable'],
    characteristics:
      'Earth Pigs build comfort and security. You\'re steady, supportive, and quietly strong.',
    forecast:
      'Fire Horse chaos makes your steadiness attractive. Mid-year favors steady income growth and home improvements. Avoid taking on others\' burdens.',
    oracleWisdom: 'Simple habits create rich life.',
    modes: {
      wealth: {
        numbers: '10-26-41-62-70-81',
        note: 'Steady gains; comfort upgrades',
        explanation:
          'Your wealth grows through consistent effort and investments in comfort and stability.',
      },
      power: {
        motto: 'STEADY • PRACTICAL • STRONG',
        explanation:
          'Your power is reliable strength. Stay steady, remain practical, be quietly strong.',
      },
      love: {
        decree: 'COMMITMENT CREATES REAL PEACE',
        explanation:
          'Your committed nature creates the deep peace that comes from secure, lasting love.',
      },
      shield: {
        mantra: 'SIMPLE HABITS SAVE',
        explanation:
          'Your protection is simplicity. Good simple habits prevent complicated problems.',
      },
    },
  },
  {
    element: 'Metal',
    animal: 'Pig',
    chineseCharacter: '猪',
    tagline: 'Ally (Clarity)',
    coreStrengths: ['High-standards', 'Disciplined', 'Honest', 'Strong'],
    characteristics:
      'Metal Pigs refine life through quality and self-respect. You upgrade environments and routines.',
    forecast:
      'A year of elevating standards—work, relationships, and self-care. Mid-year brings a professional upgrade if you show your value. Avoid harsh judgment; lead with example.',
    oracleWisdom: 'Raise your standard—and reality rises.',
    modes: {
      wealth: {
        numbers: '16-26-45-63-72-90',
        note: 'Upgrade year; standards create wealth',
        explanation:
          'Your wealth comes through raising standards in everything you do and offer.',
      },
      power: {
        motto: 'REFINE • RESPECT • RISE',
        explanation:
          'Your power is elevated standards. Refine your approach, respect yourself, rise naturally.',
      },
      love: {
        decree: 'HIGH STANDARDS DRAW DEVOTION',
        explanation:
          'Your commitment to quality attracts partners who match your level of self-respect.',
      },
      shield: {
        mantra: 'NO TO EXCESS',
        explanation:
          'Your protection is refusal. Say no to excess before it compromises your standards.',
      },
    },
  },
  {
    element: 'Water',
    animal: 'Pig',
    chineseCharacter: '猪',
    tagline: 'Ally (Harmony)',
    coreStrengths: ['Empathic', 'Loving', 'Intuitive', 'Peaceful'],
    characteristics:
      'Water Pigs bond deeply and value emotional truth. You heal with gentleness and sincerity.',
    forecast:
      'Love and friendships deepen if you avoid avoidance. Mid-year brings a meaningful connection or reconciliation. Your fortune grows through emotional maturity and honest communication.',
    oracleWisdom: 'Truth spoken softly becomes a blessing.',
    modes: {
      wealth: {
        numbers: '12-26-44-57-69-88',
        note: 'Relationships prosper; speak honestly',
        explanation:
          'Your wealth comes through authentic relationships and honest emotional communication.',
      },
      power: {
        motto: 'FEEL • SPEAK • HEAL',
        explanation:
          'Your power is emotional intelligence. Feel deeply, speak honestly, heal through connection.',
      },
      love: {
        decree: 'TRUTH DEEPENS OUR LOVE',
        explanation:
          'Honest emotional expression is the path to the deep love you desire and deserve.',
      },
      shield: {
        mantra: 'HEART STAYS CLEAR',
        explanation:
          'Your protection is emotional clarity. A clear heart makes wise choices.',
      },
    },
  },
];

// ============================================================================
// COMBINED FORECAST DATA
// ============================================================================

export const ALL_FORECASTS: ZodiacForecast[] = [
  ...RAT_FORECASTS,
  ...OX_FORECASTS,
  ...TIGER_FORECASTS,
  ...RABBIT_FORECASTS,
  ...DRAGON_FORECASTS,
  ...SNAKE_FORECASTS,
  ...HORSE_FORECASTS,
  ...GOAT_FORECASTS,
  ...MONKEY_FORECASTS,
  ...ROOSTER_FORECASTS,
  ...DOG_FORECASTS,
  ...PIG_FORECASTS,
];

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get forecast for a specific element + animal combination
 */
export function getForecast(
  element: ZodiacElement,
  animal: ZodiacAnimalType
): ZodiacForecast | undefined {
  return ALL_FORECASTS.find(
    f => f.element === element && f.animal === animal
  );
}

/**
 * Get all forecasts for a specific animal (all 5 elements)
 */
export function getForecastsByAnimal(animal: ZodiacAnimalType): ZodiacForecast[] {
  return ALL_FORECASTS.filter(f => f.animal === animal);
}

/**
 * Get all forecasts for a specific element (all 12 animals)
 */
export function getForecastsByElement(element: ZodiacElement): ZodiacForecast[] {
  return ALL_FORECASTS.filter(f => f.element === element);
}

/**
 * Get forecast with FREE user limitations (subset of info)
 */
export function getFreeForecast(
  element: ZodiacElement,
  animal: ZodiacAnimalType
): Partial<ZodiacForecast> | undefined {
  const full = getForecast(element, animal);
  if (!full) return undefined;

  // FREE users get: tagline, strengths, shortened characteristics, wisdom
  // They DON'T get: full forecast, modes
  return {
    element: full.element,
    animal: full.animal,
    chineseCharacter: full.chineseCharacter,
    tagline: full.tagline,
    coreStrengths: full.coreStrengths,
    characteristics: full.characteristics.split('.')[0] + '.', // Just first sentence
    oracleWisdom: full.oracleWisdom,
    // forecast is omitted (PAID only)
    // modes are omitted (PAID only)
  };
}

/**
 * Get the Fire Horse relation description
 */
export function getFireHorseRelationDescription(tagline: FireHorseRelation): string {
  const descriptions: Record<FireHorseRelation, string> = {
    'Ally (Harmony)':
      'You are in harmony with the Fire Horse energy. This year flows with you, bringing opportunities through alignment and cooperation.',
    'Ally (Stability)':
      'Your grounded nature provides stability in the Fire Horse year. While others chase sparks, you build lasting foundations.',
    'Ally (Growth)':
      'The Fire Horse fuels your expansion. This is a year for bold moves, new horizons, and accelerated growth.',
    'Ally (Victory)':
      'You are positioned for victory this year. The Fire Horse energy amplifies your natural strengths and competitive edge.',
    'Ally (Clarity)':
      'Your discernment is your advantage. The Fire Horse year rewards those who know what to keep and what to release.',
    'Ally (Healing)':
      'This is a restorative year for you. The Fire Horse energy supports healing, renewal, and emotional restoration.',
    'Ally (Abundance)':
      'Abundance flows toward you this year. The Fire Horse opens doors through generosity and meaningful connections.',
    'Harm (Friction)':
      'The Fire Horse creates friction with your nature—but friction creates diamonds. Transform challenges into strength through patience.',
    'Catalyst (Change)':
      'You are a catalyst for transformation this year. The Fire Horse amplifies your power to create significant change.',
  };
  return descriptions[tagline];
}
