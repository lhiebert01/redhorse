/**
 * Zodiac Fun Facts, Famous People, Quotes & Mantras
 *
 * Complete data for all 60 Chinese Zodiac element-animal combinations
 * Used to enhance FREE and PAID oracle readings with engaging content
 */

export interface CelebrityInfo {
  name: string;
  description: string;
}

export interface ZodiacFunFact {
  years: number[];
  famousPeople: CelebrityInfo[];
  mantra: string;
  quote: string;
  quoteAuthor: string;
  quoteAuthorDescription: string;  // Brief description of who the quote author is
  funFact: string;
  emoji: string;
}

export type ZodiacKey = `${string}-${string}`;

export const ZODIAC_FUN_FACTS: Record<string, ZodiacFunFact> = {
  // ============================================
  // RAT 🐀
  // ============================================
  'wood-rat': {
    years: [1924, 1984],
    famousPeople: [
      { name: 'LeBron James', description: 'NBA legend, 4x champion' },
      { name: 'Katy Perry', description: 'Pop superstar, "Firework" singer' },
      { name: 'Marlon Brando', description: 'Legendary actor, The Godfather' }
    ],
    mantra: 'I create my own opportunities.',
    quote: 'You have to be able to accept failure to get better.',
    quoteAuthor: 'LeBron James',
    quoteAuthorDescription: 'NBA all-time leading scorer',
    funFact: 'Wood Rats are the most artistic and creative of the Rat cohort. The Wood element gives them a more cooperative and less competitive nature, making them excellent team players.',
    emoji: '🐀'
  },
  'earth-rat': {
    years: [1948, 2008],
    famousPeople: [
      { name: 'King Charles III', description: 'King of the United Kingdom' },
      { name: 'Samuel L. Jackson', description: 'Iconic actor, Marvel star' },
      { name: 'Ozzy Osbourne', description: 'Prince of Darkness, rock legend' }
    ],
    mantra: 'Stability is the foundation of success.',
    quote: 'I never worry about the problem. I worry about the solution.',
    quoteAuthor: 'Shaquille O\'Neal',
    quoteAuthorDescription: 'NBA Hall of Famer, 4x champion',
    funFact: 'Earth Rats are the most grounded and realistic of the Rats, often accumulating wealth slowly but surely. They prefer solid ground over high risks.',
    emoji: '🐀'
  },
  'water-rat': {
    years: [1912, 1972],
    famousPeople: [
      { name: 'Eminem', description: 'Rap legend, best-selling artist' },
      { name: 'Dwayne "The Rock" Johnson', description: 'Actor & entrepreneur' },
      { name: 'Gene Kelly', description: 'Dance icon, Singin\' in the Rain' }
    ],
    mantra: 'I flow around obstacles, not into them.',
    quote: 'Success isn\'t always about greatness. It\'s about consistency.',
    quoteAuthor: 'Dwayne Johnson',
    quoteAuthorDescription: 'Global movie star & WWE legend',
    funFact: 'Water Rats are incredibly adaptable and influential. Known for high intelligence and deep thinking, they are natural strategists who can talk their way out of anything.',
    emoji: '🐀'
  },
  'fire-rat': {
    years: [1936, 1996],
    famousPeople: [
      { name: 'Pope Francis', description: 'Head of the Catholic Church' },
      { name: 'Tom Holland', description: 'Spider-Man actor' },
      { name: 'Buddy Holly', description: 'Rock and roll pioneer' }
    ],
    mantra: 'My passion lights the way.',
    quote: 'The more you give, the more you receive.',
    quoteAuthor: 'Fire Rat Philosophy',
    quoteAuthorDescription: 'Ancient zodiac wisdom',
    funFact: 'Fire Rats are the most spontaneous of the group, often traveling far from home to find their fortune. Fire adds a dynamic, competitive edge to the Rat\'s natural charm.',
    emoji: '🐀'
  },
  'metal-rat': {
    years: [1960, 2020],
    famousPeople: [
      { name: 'Bono', description: 'U2 frontman, philanthropist' },
      { name: 'RuPaul', description: 'Drag icon, TV host' },
      { name: 'Sean Penn', description: 'Oscar-winning actor' }
    ],
    mantra: 'My will is iron; my path is clear.',
    quote: 'To be one, to be united is a great thing. But to respect the right to be different is maybe even greater.',
    quoteAuthor: 'Bono',
    quoteAuthorDescription: 'U2 lead singer, humanitarian',
    funFact: 'Metal Rats have a "silver tongue" and are often gifted speakers or public figures who command attention. They are known for their intense focus and occasional stubbornness.',
    emoji: '🐀'
  },

  // ============================================
  // OX 🐂
  // ============================================
  'wood-ox': {
    years: [1925, 1985],
    famousPeople: [
      { name: 'Malcolm X', description: 'Civil rights leader' },
      { name: 'Michael Phelps', description: 'Most decorated Olympian ever' },
      { name: 'Gal Gadot', description: 'Wonder Woman actress' }
    ],
    mantra: 'Growth requires patience and persistence.',
    quote: 'There will be obstacles. There will be doubters. But with hard work, there are no limits.',
    quoteAuthor: 'Michael Phelps',
    quoteAuthorDescription: '28-time Olympic medalist',
    funFact: 'The Wood Ox is less stubborn than other Oxen and is known for being a great team player who defends the pack.',
    emoji: '🐂'
  },
  'earth-ox': {
    years: [1949, 2009],
    famousPeople: [
      { name: 'Meryl Streep', description: '3x Oscar winner, acting legend' },
      { name: 'Bruce Springsteen', description: 'The Boss, rock icon' },
      { name: 'Sigourney Weaver', description: 'Sci-fi icon, Alien star' }
    ],
    mantra: 'I am the rock upon which others build.',
    quote: 'The great gift of human beings is that we have the power of empathy.',
    quoteAuthor: 'Meryl Streep',
    quoteAuthorDescription: 'Most nominated actor in Oscar history',
    funFact: 'Earth Oxen are the most reliable of the zodiac; they are often the "backbone" of their families and organizations.',
    emoji: '🐂'
  },
  'water-ox': {
    years: [1913, 1973],
    famousPeople: [
      { name: 'Rosa Parks', description: 'Mother of the civil rights movement' },
      { name: 'Tyra Banks', description: 'Supermodel, ANTM creator' },
      { name: 'Pharrell Williams', description: 'Producer, "Happy" singer' }
    ],
    mantra: 'Quiet strength moves mountains.',
    quote: 'I have learned over the years that when one\'s mind is made up, this diminishes fear.',
    quoteAuthor: 'Rosa Parks',
    quoteAuthorDescription: 'Civil rights icon',
    funFact: 'Water Oxen are more flexible and faster thinkers than their counterparts, often capable of managing complex logistics with ease.',
    emoji: '🐂'
  },
  'fire-ox': {
    years: [1937, 1997],
    famousPeople: [
      { name: 'Jane Fonda', description: 'Oscar winner, fitness guru' },
      { name: 'Kylie Jenner', description: 'Billionaire entrepreneur' },
      { name: 'Anthony Hopkins', description: 'Hannibal Lecter actor' }
    ],
    mantra: 'Power controlled is power multiplied.',
    quote: 'It\'s never too late... to be who you might have been.',
    quoteAuthor: 'Fire Ox Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'The Fire Ox is the most energetic and aggressive Ox; they are natural leaders who do not shy away from conflict to get results.',
    emoji: '🐂'
  },
  'metal-ox': {
    years: [1961, 2021],
    famousPeople: [
      { name: 'Barack Obama', description: '44th U.S. President' },
      { name: 'George Clooney', description: 'Oscar-winning actor/director' },
      { name: 'Princess Diana', description: 'The People\'s Princess' }
    ],
    mantra: 'Integrity is my shield.',
    quote: 'Change will not come if we wait for some other person or some other time.',
    quoteAuthor: 'Barack Obama',
    quoteAuthorDescription: '44th President of the United States',
    funFact: 'Metal Oxen are known for having "iron wills"; once they decide on a goal, it is nearly impossible to divert them.',
    emoji: '🐂'
  },

  // ============================================
  // TIGER 🐅
  // ============================================
  'wood-tiger': {
    years: [1914, 1974],
    famousPeople: [
      { name: 'Leonardo DiCaprio', description: 'Oscar winner, Titanic star' },
      { name: 'Victoria Beckham', description: 'Spice Girl, fashion designer' },
      { name: 'Jimmy Fallon', description: 'Tonight Show host' }
    ],
    mantra: 'Compassion is the truest form of strength.',
    quote: 'If you can do what you do best and be happy, you\'re further along in life than most people.',
    quoteAuthor: 'Leonardo DiCaprio',
    quoteAuthorDescription: 'Oscar-winning actor, environmentalist',
    funFact: 'Wood Tigers are more cooperative and less dominating than other Tigers, often working well in group creative endeavors.',
    emoji: '🐅'
  },
  'earth-tiger': {
    years: [1938, 1998],
    famousPeople: [
      { name: 'Christopher Lloyd', description: 'Doc Brown, Back to the Future' },
      { name: 'Shawn Mendes', description: 'Pop singer, "Stitches"' },
      { name: 'Jon Voight', description: 'Oscar-winning actor' }
    ],
    mantra: 'Focus and grounding tame the wild heart.',
    quote: 'Truth is the only safe ground to stand upon.',
    quoteAuthor: 'Earth Tiger Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Earth Tigers are the most logical and practical of the Tigers; they can suppress their emotional outbursts better than the Fire or Metal varieties.',
    emoji: '🐅'
  },
  'water-tiger': {
    years: [1962, 2022],
    famousPeople: [
      { name: 'Tom Cruise', description: 'Mission: Impossible star' },
      { name: 'Jim Carrey', description: 'Comedy legend, The Mask' },
      { name: 'Demi Moore', description: 'Actress, G.I. Jane' }
    ],
    mantra: 'I am the storm and the calm.',
    quote: 'I think everybody should get rich and famous and do everything they ever dreamed of so they can see that it\'s not the answer.',
    quoteAuthor: 'Jim Carrey',
    quoteAuthorDescription: 'Comedic genius, actor',
    funFact: 'Water Tigers are known for being intuitive and empathetic, often possessing a "sixth sense" about situations.',
    emoji: '🐅'
  },
  'fire-tiger': {
    years: [1926, 1986],
    famousPeople: [
      { name: 'Marilyn Monroe', description: 'Hollywood icon, 1950s legend' },
      { name: 'Lady Gaga', description: 'Pop superstar, Oscar winner' },
      { name: 'Usain Bolt', description: 'Fastest man alive, 8x Olympic gold' }
    ],
    mantra: 'I burn bright so the world can see.',
    quote: 'Don\'t you ever let a soul in the world tell you that you can\'t be exactly who you are.',
    quoteAuthor: 'Lady Gaga',
    quoteAuthorDescription: 'Global pop icon, actress',
    funFact: 'Fire Tigers are the most unpredictable and dramatic; they are born leaders who inspire others with their sheer charisma.',
    emoji: '🐅'
  },
  'metal-tiger': {
    years: [1950, 2010],
    famousPeople: [
      { name: 'Bill Murray', description: 'Comedy legend, Ghostbusters' },
      { name: 'Stevie Wonder', description: 'Music prodigy, 25 Grammys' },
      { name: 'Jay Leno', description: 'Tonight Show host, car collector' }
    ],
    mantra: 'My ambition knows no bounds.',
    quote: 'Just because you don\'t see it, doesn\'t mean it isn\'t there.',
    quoteAuthor: 'Stevie Wonder',
    quoteAuthorDescription: 'Musical genius, 25-time Grammy winner',
    funFact: 'Metal Tigers are competitive and sharp; they often have a striking presence and do not like to have their authority challenged.',
    emoji: '🐅'
  },

  // ============================================
  // RABBIT 🐇
  // ============================================
  'wood-rabbit': {
    years: [1915, 1975],
    famousPeople: [
      { name: 'Angelina Jolie', description: 'Oscar winner, humanitarian' },
      { name: 'David Beckham', description: 'Football legend, fashion icon' },
      { name: '50 Cent', description: 'Rapper, entrepreneur' }
    ],
    mantra: 'Kindness is a strategy, not a weakness.',
    quote: 'I\'ve learned that you can keep going long after you think you can\'t.',
    quoteAuthor: 'Wood Rabbit Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Wood Rabbits are known for being "double artists"—creative by sign and creative by element. They rarely have enemies.',
    emoji: '🐇'
  },
  'earth-rabbit': {
    years: [1939, 1999],
    famousPeople: [
      { name: 'Tina Turner', description: 'Queen of Rock \'n\' Roll' },
      { name: 'Ralph Lauren', description: 'Fashion empire founder' },
      { name: 'Francis Ford Coppola', description: 'Godfather director' }
    ],
    mantra: 'Balance in all things.',
    quote: 'I believe that if you\'ll just stand up and go, life will open up for you.',
    quoteAuthor: 'Tina Turner',
    quoteAuthorDescription: 'Rock and roll legend',
    funFact: 'Earth Rabbits are the most grounded and realistic of the Rabbits, often very successful in business due to their calculated risk-taking.',
    emoji: '🐇'
  },
  'water-rabbit': {
    years: [1963, 2023],
    famousPeople: [
      { name: 'Brad Pitt', description: 'Oscar winner, Fight Club star' },
      { name: 'Michael Jordan', description: 'Greatest basketball player ever' },
      { name: 'Johnny Depp', description: 'Captain Jack Sparrow actor' }
    ],
    mantra: 'Go with the flow, but steer the ship.',
    quote: 'I can accept failure, everyone fails at something. But I can\'t accept not trying.',
    quoteAuthor: 'Michael Jordan',
    quoteAuthorDescription: '6x NBA champion, cultural icon',
    funFact: 'Water Rabbits are known for their excellent memory and subconscious intuition; they are often very private despite public fame.',
    emoji: '🐇'
  },
  'fire-rabbit': {
    years: [1927, 1987],
    famousPeople: [
      { name: 'Lionel Messi', description: 'World Cup winner, 8x Ballon d\'Or' },
      { name: 'Zac Efron', description: 'High School Musical star' },
      { name: 'Kendrick Lamar', description: 'Pulitzer Prize-winning rapper' }
    ],
    mantra: 'Passion fueled by diplomacy.',
    quote: 'You have to fight to reach your dream.',
    quoteAuthor: 'Lionel Messi',
    quoteAuthorDescription: 'Greatest footballer of all time',
    funFact: 'Fire Rabbits are the most active and outgoing of the Rabbits; they can actually be quite temperamental compared to their calm cousins.',
    emoji: '🐇'
  },
  'metal-rabbit': {
    years: [1951, 2011],
    famousPeople: [
      { name: 'Robin Williams', description: 'Comedy legend, Oscar winner' },
      { name: 'Sting', description: 'The Police frontman, solo artist' },
      { name: 'Michael Keaton', description: 'Batman, Birdman star' }
    ],
    mantra: 'Resilience is hidden in softness.',
    quote: 'You\'re only given a little spark of madness. You mustn\'t lose it.',
    quoteAuthor: 'Robin Williams',
    quoteAuthorDescription: 'Beloved comedian, Oscar winner',
    funFact: 'Metal Rabbits are more robust and ambitious; they have a "steel velvet" personality—soft on the outside, unmovable on the inside.',
    emoji: '🐇'
  },

  // ============================================
  // DRAGON 🐉
  // ============================================
  'wood-dragon': {
    years: [1964, 2024],
    famousPeople: [
      { name: 'Keanu Reeves', description: 'John Wick, The Matrix star' },
      { name: 'Jeff Bezos', description: 'Amazon founder, space pioneer' },
      { name: 'Sandra Bullock', description: 'Oscar winner, Miss Congeniality' }
    ],
    mantra: 'I dream, therefore I build.',
    quote: 'The art of art, the glory of expression... is simplicity.',
    quoteAuthor: 'Walt Whitman',
    quoteAuthorDescription: 'Legendary American poet',
    funFact: 'Wood Dragons are the thinkers and philosophers of the Dragon clan; they are less likely to demand attention and more likely to earn it through logic.',
    emoji: '🐉'
  },
  'earth-dragon': {
    years: [1928, 1988],
    famousPeople: [
      { name: 'Adele', description: 'Grammy-winning British singer' },
      { name: 'Rihanna', description: 'Pop icon, Fenty Beauty founder' },
      { name: 'Shirley Temple', description: 'Legendary child star' }
    ],
    mantra: 'I stand firm on my own ground.',
    quote: 'I don\'t make music for eyes. I make music for ears.',
    quoteAuthor: 'Adele',
    quoteAuthorDescription: '16-time Grammy winner, "Hello" singer',
    funFact: 'Earth Dragons are known for being the most sociable and stable; they are builders who can manage large organizations and families effortlessly.',
    emoji: '🐉'
  },
  'water-dragon': {
    years: [1952, 2012],
    famousPeople: [
      { name: 'Vladimir Putin', description: 'President of Russia' },
      { name: 'Liam Neeson', description: 'Taken star, dramatic actor' },
      { name: 'Patrick Swayze', description: 'Dirty Dancing legend' }
    ],
    mantra: 'My power is fluid and adaptable.',
    quote: 'I don\'t look for trouble, but I\'m not afraid of it.',
    quoteAuthor: 'Water Dragon Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Water Dragons are less ego-driven than other Dragons; they are willing to step back and let others take the credit if it achieves the goal.',
    emoji: '🐉'
  },
  'fire-dragon': {
    years: [1916, 1976],
    famousPeople: [
      { name: 'Ryan Reynolds', description: 'Deadpool star, entrepreneur' },
      { name: 'Benedict Cumberbatch', description: 'Doctor Strange, Sherlock' },
      { name: 'Colin Farrell', description: 'Irish actor, The Batman' }
    ],
    mantra: 'I am the spark that starts the revolution.',
    quote: 'I don\'t expect success. I prepare for it.',
    quoteAuthor: 'Ryan Reynolds',
    quoteAuthorDescription: 'Actor, Aviation Gin founder',
    funFact: 'The Fire Dragon is the most competitive and ambitious. They are often looked up to as "superman" figures who seem to have endless energy.',
    emoji: '🐉'
  },
  'metal-dragon': {
    years: [1940, 2000],
    famousPeople: [
      { name: 'Bruce Lee', description: 'Martial arts legend, icon' },
      { name: 'John Lennon', description: 'Beatles co-founder, peace activist' },
      { name: 'Al Pacino', description: 'Godfather, Scarface legend' }
    ],
    mantra: 'Willpower is the ultimate weapon.',
    quote: 'Knowing is not enough, we must apply. Willing is not enough, we must do.',
    quoteAuthor: 'Bruce Lee',
    quoteAuthorDescription: 'Martial arts master, philosopher',
    funFact: 'Metal Dragons are the most strong-willed and intense. They are often viewed as "eccentric geniuses" who break all the rules.',
    emoji: '🐉'
  },

  // ============================================
  // SNAKE 🐍
  // ============================================
  'wood-snake': {
    years: [1965, 2025],
    famousPeople: [
      { name: 'Robert Downey Jr.', description: 'Iron Man, MCU legend' },
      { name: 'J.K. Rowling', description: 'Harry Potter creator' },
      { name: 'Shania Twain', description: 'Country pop superstar' }
    ],
    mantra: 'Creativity blooms in silence.',
    quote: 'Rock bottom became the solid foundation on which I rebuilt my life.',
    quoteAuthor: 'J.K. Rowling',
    quoteAuthorDescription: 'Billionaire author, Harry Potter creator',
    funFact: 'Wood Snakes are orderly, intelligent, and refined. They appreciate fine art and often have a collection of beautiful things.',
    emoji: '🐍'
  },
  'earth-snake': {
    years: [1929, 1989],
    famousPeople: [
      { name: 'Taylor Swift', description: '14x Grammy winner, Eras Tour' },
      { name: 'Audrey Hepburn', description: 'Hollywood icon, humanitarian' },
      { name: 'Grace Kelly', description: 'Actress turned Princess of Monaco' }
    ],
    mantra: 'Grace under pressure.',
    quote: 'People, even more than things, have to be restored, renewed, revived, reclaimed, and redeemed.',
    quoteAuthor: 'Audrey Hepburn',
    quoteAuthorDescription: 'Screen legend, UNICEF ambassador',
    funFact: 'Earth Snakes are the most relaxed of the Snakes. They are extremely charismatic and often have a "hypnotic" effect on people.',
    emoji: '🐍'
  },
  'water-snake': {
    years: [1953, 2013],
    famousPeople: [
      { name: 'Pierce Brosnan', description: 'James Bond actor' },
      { name: 'Tim Allen', description: 'Home Improvement, Buzz Lightyear' },
      { name: 'Hulk Hogan', description: 'Wrestling icon, 1980s legend' }
    ],
    mantra: 'I see what others miss.',
    quote: 'The only thing that scares me is myself.',
    quoteAuthor: 'Water Snake Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Water Snakes are influential and insightful; they are excellent at managing finances and often act as the "power behind the throne."',
    emoji: '🐍'
  },
  'fire-snake': {
    years: [1917, 1977],
    famousPeople: [
      { name: 'Kanye West', description: 'Rapper, producer, Yeezy founder' },
      { name: 'John Cena', description: 'WWE legend, Hollywood actor' },
      { name: 'Floyd Mayweather', description: 'Undefeated boxing champion' }
    ],
    mantra: 'I transform the world around me.',
    quote: 'My greatest pain in life is that I will never be able to see myself perform live.',
    quoteAuthor: 'Kanye West',
    quoteAuthorDescription: 'Grammy-winning artist, fashion designer',
    funFact: 'Fire Snakes are the most extroverted Snakes. They are opinionated, active, and love to be in the spotlight, unlike their quieter cousins.',
    emoji: '🐍'
  },
  'metal-snake': {
    years: [1941, 2001],
    famousPeople: [
      { name: 'Bob Dylan', description: 'Nobel Prize-winning songwriter' },
      { name: 'Bernie Sanders', description: 'U.S. Senator, political icon' },
      { name: 'Billie Eilish', description: 'Gen-Z pop phenomenon' }
    ],
    mantra: 'Silently, I strike.',
    quote: 'He not busy being born is busy dying.',
    quoteAuthor: 'Bob Dylan',
    quoteAuthorDescription: 'Voice of a generation, Nobel laureate',
    funFact: 'Metal Snakes are the most secretive and independent. They have nerves of steel and are rarely flustered by chaos.',
    emoji: '🐍'
  },

  // ============================================
  // HORSE 🐴
  // ============================================
  'wood-horse': {
    years: [1954, 2014],
    famousPeople: [
      { name: 'Jackie Chan', description: 'Martial arts legend, actor' },
      { name: 'Denzel Washington', description: '2x Oscar winner, Training Day' },
      { name: 'John Travolta', description: 'Grease, Pulp Fiction star' }
    ],
    mantra: 'Cooperation leads to freedom.',
    quote: 'I never wanted to be the next Bruce Lee. I just wanted to be the first Jackie Chan.',
    quoteAuthor: 'Jackie Chan',
    quoteAuthorDescription: 'Action superstar, stunt legend',
    funFact: 'Wood Horses are less impatient than other Horses; they are excellent conversationalists and have a great sense of humor.',
    emoji: '🐴'
  },
  'earth-horse': {
    years: [1918, 1978],
    famousPeople: [
      { name: 'Nelson Mandela', description: 'Anti-apartheid hero, Nobel Peace Prize' },
      { name: 'Kobe Bryant', description: 'NBA legend, 5x champion' },
      { name: 'Usher', description: 'R&B superstar, dancer' }
    ],
    mantra: 'I run the long race.',
    quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    quoteAuthor: 'Nelson Mandela',
    quoteAuthorDescription: 'Former President of South Africa, icon',
    funFact: 'Earth Horses are the most logical and slow-moving (relatively) of the Horses. They can look at a problem from all angles before acting.',
    emoji: '🐴'
  },
  'water-horse': {
    years: [1942, 2002],
    famousPeople: [
      { name: 'Paul McCartney', description: 'Beatles legend, knighted' },
      { name: 'Joe Biden', description: '46th U.S. President' },
      { name: 'Harrison Ford', description: 'Han Solo, Indiana Jones' }
    ],
    mantra: 'Adaptability is true liberty.',
    quote: 'And in the end, the love you take is equal to the love you make.',
    quoteAuthor: 'Paul McCartney',
    quoteAuthorDescription: 'Most successful songwriter in history',
    funFact: 'Water Horses are incredibly cheerful and sporting. They often have a nomadic spirit and change careers or homes frequently.',
    emoji: '🐴'
  },
  'fire-horse': {
    years: [1966, 2026],
    famousPeople: [
      { name: 'Mike Tyson', description: 'Heavyweight boxing champion' },
      { name: 'Gordon Ramsay', description: 'Celebrity chef, Hell\'s Kitchen' },
      { name: 'Janet Jackson', description: 'Pop icon, Jackson family' }
    ],
    mantra: 'I blaze my own trail.',
    quote: 'I\'m the best ever. I\'m the most brutal and vicious, and most ruthless champion there\'s ever been.',
    quoteAuthor: 'Mike Tyson',
    quoteAuthorDescription: 'Youngest heavyweight champion ever',
    funFact: 'The Fire Horse is a rare and volatile sign in Chinese astrology; they are rebellious, adventurous, and often destined for extreme success or extreme struggle.',
    emoji: '🔥🐴'
  },
  'metal-horse': {
    years: [1930, 1990],
    famousPeople: [
      { name: 'Clint Eastwood', description: 'Western icon, Oscar-winning director' },
      { name: 'Sean Connery', description: 'Original James Bond' },
      { name: 'Emma Watson', description: 'Hermione Granger, UN ambassador' }
    ],
    mantra: 'Freedom is non-negotiable.',
    quote: 'If you want a guarantee, buy a toaster.',
    quoteAuthor: 'Clint Eastwood',
    quoteAuthorDescription: 'Hollywood legend, director',
    funFact: 'Metal Horses are the most self-centered and stubborn of the breed, but also the most courageous. They are notorious for having many romantic partners.',
    emoji: '🐴'
  },

  // ============================================
  // GOAT 🐐
  // ============================================
  'wood-goat': {
    years: [1955, 2015],
    famousPeople: [
      { name: 'Bill Gates', description: 'Microsoft founder, philanthropist' },
      { name: 'Steve Jobs', description: 'Apple visionary, tech icon' },
      { name: 'Bruce Willis', description: 'Die Hard action star' }
    ],
    mantra: 'Innovation through compassion.',
    quote: 'The ones who are crazy enough to think they can change the world, are the ones who do.',
    quoteAuthor: 'Steve Jobs',
    quoteAuthorDescription: 'Apple co-founder, visionary',
    funFact: 'Wood Goats are exceptionally generous and trustworthy. They often succeed because people simply want to help them.',
    emoji: '🐐'
  },
  'earth-goat': {
    years: [1919, 1979],
    famousPeople: [
      { name: 'Chris Pratt', description: 'Guardians of the Galaxy, Jurassic World' },
      { name: 'Kevin Hart', description: 'Stand-up comedian, actor' },
      { name: 'Kourtney Kardashian', description: 'Reality TV star, Poosh founder' }
    ],
    mantra: 'Kindness is grounded in reality.',
    quote: 'I am who I am. That\'s why my friends and peers respect and appreciate me.',
    quoteAuthor: 'Kevin Hart',
    quoteAuthorDescription: 'Highest-grossing comedian',
    funFact: 'Earth Goats are more independent than other Goats. They don\'t just dream of art; they work hard to make their creativity profitable.',
    emoji: '🐐'
  },
  'water-goat': {
    years: [1943, 2003],
    famousPeople: [
      { name: 'Mick Jagger', description: 'Rolling Stones frontman, rock god' },
      { name: 'Robert De Niro', description: 'Legendary actor, Goodfellas' },
      { name: 'George Harrison', description: 'Beatles guitarist, songwriter' }
    ],
    mantra: 'I flow with the current of life.',
    quote: 'Anything worth doing is worth overdoing.',
    quoteAuthor: 'Mick Jagger',
    quoteAuthorDescription: 'Rock legend, 80+ years performing',
    funFact: 'Water Goats are very popular but can be easily influenced by others. They are known for being the most charming and diplomatic of the Goats.',
    emoji: '🐐'
  },
  'fire-goat': {
    years: [1967, 2027],
    famousPeople: [
      { name: 'Julia Roberts', description: 'Pretty Woman star, Oscar winner' },
      { name: 'Vin Diesel', description: 'Fast & Furious star, producer' },
      { name: 'Jason Statham', description: 'British action star, The Transporter' }
    ],
    mantra: 'My heart leads my actions.',
    quote: 'I\'m just a girl, standing in front of a boy, asking him to love her.',
    quoteAuthor: 'Julia Roberts',
    quoteAuthorDescription: 'America\'s Sweetheart, Oscar winner',
    funFact: 'Fire Goats are much more courageous and dramatic than other Goats. They will stand up for themselves and can be surprisingly fierce when cornered.',
    emoji: '🐐'
  },
  'metal-goat': {
    years: [1931, 1991],
    famousPeople: [
      { name: 'William Shatner', description: 'Captain Kirk, Star Trek legend' },
      { name: 'Ed Sheeran', description: 'British singer-songwriter, 10B+ streams' },
      { name: 'Leonard Nimoy', description: 'Spock, cultural icon' }
    ],
    mantra: 'Soft on the outside, steel on the inside.',
    quote: 'I have no idea what I am doing, but I know I am doing it really well.',
    quoteAuthor: 'Metal Goat Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Metal Goats have a tough exterior protecting a sensitive interior. They are culture lovers who often become collectors or critics.',
    emoji: '🐐'
  },

  // ============================================
  // MONKEY 🐵
  // ============================================
  'wood-monkey': {
    years: [1944, 2004],
    famousPeople: [
      { name: 'George Lucas', description: 'Star Wars creator, filmmaker' },
      { name: 'Diana Ross', description: 'Supremes legend, disco queen' },
      { name: 'Danny DeVito', description: 'Actor, director, producer' }
    ],
    mantra: 'Imagination creates reality.',
    quote: 'Dreams are extremely important. You can\'t do it unless you imagine it.',
    quoteAuthor: 'George Lucas',
    quoteAuthorDescription: 'Star Wars & Indiana Jones creator',
    funFact: 'Wood Monkeys are orderly and restless. They are constantly inventing new ways to do things and hate routine more than anything.',
    emoji: '🐵'
  },
  'earth-monkey': {
    years: [1968, 2028],
    famousPeople: [
      { name: 'Will Smith', description: 'Fresh Prince, Oscar winner' },
      { name: 'Hugh Jackman', description: 'Wolverine, Broadway star' },
      { name: 'Celine Dion', description: 'Voice of Titanic, vocal legend' }
    ],
    mantra: 'I build bridges with humor.',
    quote: 'Throughout life people will make you mad, disrespect you and treat you bad. Let God deal with the things they do.',
    quoteAuthor: 'Will Smith',
    quoteAuthorDescription: 'Multi-platform entertainer, Oscar winner',
    funFact: 'Earth Monkeys are the most honest and trustworthy of the Monkeys. They are less prone to the "trickster" antics and focused on charity and work.',
    emoji: '🐵'
  },
  'water-monkey': {
    years: [1932, 1992],
    famousPeople: [
      { name: 'Johnny Cash', description: 'The Man in Black, country icon' },
      { name: 'Elizabeth Taylor', description: 'Hollywood legend, 8 marriages' },
      { name: 'Selena Gomez', description: 'Singer, actress, mental health advocate' }
    ],
    mantra: 'I navigate the hidden paths.',
    quote: 'Success is beast, and it actually puts the emphasis on the wrong thing.',
    quoteAuthor: 'Johnny Cash',
    quoteAuthorDescription: 'Country music legend',
    funFact: 'Water Monkeys are extremely secretive and clever. They are master manipulators (in a good or bad way) and can achieve goals without anyone noticing their methods.',
    emoji: '🐵'
  },
  'fire-monkey': {
    years: [1956, 2016],
    famousPeople: [
      { name: 'Tom Hanks', description: 'America\'s Dad, 2x Oscar winner' },
      { name: 'Carrie Fisher', description: 'Princess Leia, author, icon' },
      { name: 'Bryan Cranston', description: 'Walter White, Breaking Bad' }
    ],
    mantra: 'I lead with energy and wit.',
    quote: 'Life is like a box of chocolates. You never know what you\'re gonna get.',
    quoteAuthor: 'Tom Hanks',
    quoteAuthorDescription: '2x Oscar winner, Forrest Gump star',
    funFact: 'Fire Monkeys are the most ambitious and bossy. They have high energy and often reach the top of their professional fields quickly.',
    emoji: '🐵'
  },
  'metal-monkey': {
    years: [1920, 1980],
    famousPeople: [
      { name: 'Kim Kardashian', description: 'Reality star, billionaire mogul' },
      { name: 'Ryan Gosling', description: 'The Notebook, La La Land star' },
      { name: 'Jake Gyllenhaal', description: 'Acclaimed actor, Donnie Darko' }
    ],
    mantra: 'I am the master of my fate.',
    quote: 'I\'m not perfect, but I\'m trying every day to be better.',
    quoteAuthor: 'Metal Monkey Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Metal Monkeys are fighters. They are independent, sophisticated, and prefer to work alone rather than in a team where they might lose control.',
    emoji: '🐵'
  },

  // ============================================
  // ROOSTER 🐓
  // ============================================
  'wood-rooster': {
    years: [1945, 2005],
    famousPeople: [
      { name: 'Eric Clapton', description: 'Guitar god, 18 Grammys' },
      { name: 'Steve Martin', description: 'Comedian, actor, banjo master' },
      { name: 'Goldie Hawn', description: 'Oscar winner, comedy icon' }
    ],
    mantra: 'Excellence is a habit.',
    quote: 'I believe that the only way to succeed is to not worry about what anyone else is doing.',
    quoteAuthor: 'Wood Rooster Wisdom',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Wood Roosters are the "team players" of the Roosters. They are less critical than others and genuinely enjoy helping their group succeed.',
    emoji: '🐓'
  },
  'earth-rooster': {
    years: [1969, 2029],
    famousPeople: [
      { name: 'Jennifer Aniston', description: 'Rachel Green, Emmy winner' },
      { name: 'Jay-Z', description: 'Rap mogul, billionaire' },
      { name: 'Matthew McConaughey', description: 'Oscar winner, "Alright alright"' }
    ],
    mantra: 'Truth is the only style that lasts.',
    quote: 'I\'m not afraid of dying, I\'m afraid of not trying.',
    quoteAuthor: 'Jay-Z',
    quoteAuthorDescription: 'Hip-hop billionaire, 24 Grammys',
    funFact: 'Earth Roosters are incredibly organized and efficient. They are the ones who color-code their bookshelves and have a plan for everything.',
    emoji: '🐓'
  },
  'water-rooster': {
    years: [1933, 1993],
    famousPeople: [
      { name: 'Ariana Grande', description: '4-octave vocal range, pop queen' },
      { name: 'Yoko Ono', description: 'Artist, peace activist' },
      { name: 'Michael Caine', description: 'British acting legend, 2x Oscar' }
    ],
    mantra: 'My voice can move the world.',
    quote: 'Be real, be you, be authentic.',
    quoteAuthor: 'Ariana Grande',
    quoteAuthorDescription: 'Pop superstar, vocal powerhouse',
    funFact: 'Water Roosters are the intellectuals. They are less flashy than other Roosters and more interested in cultural and academic pursuits.',
    emoji: '🐓'
  },
  'fire-rooster': {
    years: [1957, 2017],
    famousPeople: [
      { name: 'Daniel Day-Lewis', description: 'Only 3x Best Actor Oscar winner' },
      { name: 'Hans Zimmer', description: 'Legendary film composer' },
      { name: 'Dolph Lundgren', description: 'Ivan Drago, action star' }
    ],
    mantra: 'Precision and passion combined.',
    quote: 'I suppose I have a highly developed capacity for self-denial.',
    quoteAuthor: 'Daniel Day-Lewis',
    quoteAuthorDescription: 'Greatest method actor ever',
    funFact: 'Fire Roosters are the most flamboyant. They spend a lot of time on their appearance and are natural performers who love the stage.',
    emoji: '🐓'
  },
  'metal-rooster': {
    years: [1921, 1981],
    famousPeople: [
      { name: 'Beyoncé', description: 'Queen Bey, 32 Grammys' },
      { name: 'Britney Spears', description: 'Princess of Pop' },
      { name: 'Roger Federer', description: 'Tennis legend, 20 Grand Slams' }
    ],
    mantra: 'Perfection is my standard.',
    quote: 'I don\'t like to gamble, but if there\'s one thing I\'m willing to bet on, it\'s myself.',
    quoteAuthor: 'Beyoncé',
    quoteAuthorDescription: 'Most Grammy-winning artist ever',
    funFact: 'Metal Roosters are famous for their logic and analytical skills. They can be very sharp-tongued and do not suffer fools gladly.',
    emoji: '🐓'
  },

  // ============================================
  // DOG 🐕
  // ============================================
  'wood-dog': {
    years: [1934, 1994],
    famousPeople: [
      { name: 'Jane Goodall', description: 'Primatologist, environmentalist' },
      { name: 'Justin Bieber', description: 'Pop phenomenon, 2B+ streams' },
      { name: 'Harry Styles', description: 'One Direction to solo superstar' }
    ],
    mantra: 'Loyalty to the pack, loyalty to the planet.',
    quote: 'What you do makes a difference, and you have to decide what kind of difference you want to make.',
    quoteAuthor: 'Jane Goodall',
    quoteAuthorDescription: 'World\'s foremost primatologist',
    funFact: 'Wood Dogs are warm-hearted and collaborative. Unlike other Dogs who might be wary of strangers, Wood Dogs make friends easily.',
    emoji: '🐕'
  },
  'earth-dog': {
    years: [1958, 2018],
    famousPeople: [
      { name: 'Madonna', description: 'Queen of Pop, 300M+ sales' },
      { name: 'Michael Jackson', description: 'King of Pop, Thriller' },
      { name: 'Prince', description: 'Purple Rain genius, icon' }
    ],
    mantra: 'I stand for justice and rhythm.',
    quote: 'I am not a woman. I am not a man. I am something that you\'ll never understand.',
    quoteAuthor: 'Prince',
    quoteAuthorDescription: 'Musical genius, 7 Grammys',
    funFact: '1958 was a powerhouse year for musical icons. Earth Dogs are known for being non-judgmental and practical, often fighting for the underdog.',
    emoji: '🐕'
  },
  'water-dog': {
    years: [1922, 1982],
    famousPeople: [
      { name: 'Prince William', description: 'Future King of England' },
      { name: 'Anne Hathaway', description: 'Oscar winner, Les Misérables' },
      { name: 'Stan Lee', description: 'Marvel Comics creator, "Excelsior!"' }
    ],
    mantra: 'Intuition guides my loyalty.',
    quote: 'With great power comes great responsibility.',
    quoteAuthor: 'Stan Lee',
    quoteAuthorDescription: 'Creator of Spider-Man, X-Men, Avengers',
    funFact: 'Water Dogs are the most reflective and lenient. They are excellent counselors and listeners who can keep a secret forever.',
    emoji: '🐕'
  },
  'fire-dog': {
    years: [1946, 2006],
    famousPeople: [
      { name: 'Donald Trump', description: '45th & 47th U.S. President' },
      { name: 'Steven Spielberg', description: 'Greatest director ever, Jaws, E.T.' },
      { name: 'Dolly Parton', description: 'Country legend, philanthropist' }
    ],
    mantra: 'I lead with charisma and conviction.',
    quote: 'If you want the rainbow, you gotta put up with the rain.',
    quoteAuthor: 'Dolly Parton',
    quoteAuthorDescription: 'Country music queen, 47 Grammy noms',
    funFact: 'Fire Dogs are the most charismatic leaders of the Dog sign. They are magnetic and often gather a large following for their causes.',
    emoji: '🐕'
  },
  'metal-dog': {
    years: [1910, 1970],
    famousPeople: [
      { name: 'Matt Damon', description: 'Good Will Hunting, Jason Bourne' },
      { name: 'Mariah Carey', description: '5-octave vocal range, songbird' },
      { name: 'Mother Teresa', description: 'Saint, Nobel Peace Prize winner' }
    ],
    mantra: 'My word is my bond.',
    quote: 'Not all of us can do great things. But we can do small things with great love.',
    quoteAuthor: 'Mother Teresa',
    quoteAuthorDescription: 'Saint, Nobel Peace Prize laureate',
    funFact: 'Metal Dogs are extremely disciplined and serious. Once they commit to a cause or a person, they never waver, even in the face of disaster.',
    emoji: '🐕'
  },

  // ============================================
  // PIG 🐷
  // ============================================
  'wood-pig': {
    years: [1935, 1995],
    famousPeople: [
      { name: 'Elvis Presley', description: 'The King of Rock and Roll' },
      { name: 'Timothée Chalamet', description: 'Dune star, Gen-Z heartthrob' },
      { name: 'Kendall Jenner', description: 'Supermodel, reality star' }
    ],
    mantra: 'Kindness is the ultimate cool.',
    quote: 'Ambition is a dream with a V8 engine.',
    quoteAuthor: 'Elvis Presley',
    quoteAuthorDescription: 'The King, sold 1 billion records',
    funFact: 'Wood Pigs are known for being extremely jovial and persuasive. They are the "deal makers" who can get everyone to agree over a good dinner.',
    emoji: '🐷'
  },
  'earth-pig': {
    years: [1959, 2019],
    famousPeople: [
      { name: 'Magic Johnson', description: 'NBA legend, businessman' },
      { name: 'Simon Cowell', description: 'American Idol judge, mogul' },
      { name: 'Hugh Laurie', description: 'Dr. House, British comedy legend' }
    ],
    mantra: 'Happiness is a garden I tend.',
    quote: 'I don\'t mean to be rude, but...',
    quoteAuthor: 'Simon Cowell',
    quoteAuthorDescription: 'Music mogul, reality TV pioneer',
    funFact: 'Earth Pigs are the most organized and productive of the Pigs. They love food and luxury but are willing to work very hard to secure it.',
    emoji: '🐷'
  },
  'water-pig': {
    years: [1923, 1983],
    famousPeople: [
      { name: 'Chris Hemsworth', description: 'Thor, Australian heartthrob' },
      { name: 'Emily Blunt', description: 'A Quiet Place, Mary Poppins' },
      { name: 'Carrie Underwood', description: 'American Idol winner, country star' }
    ],
    mantra: 'I flow with generosity.',
    quote: 'I choose to be happy today.',
    quoteAuthor: 'Water Pig Philosophy',
    quoteAuthorDescription: 'Ancient zodiac teaching',
    funFact: 'Water Pigs are the most psychic and sensitive. They can read a room instantly and are known for their incredible generosity to friends.',
    emoji: '🐷'
  },
  'fire-pig': {
    years: [1947, 2007],
    famousPeople: [
      { name: 'Elton John', description: 'Rocket Man, 5 Grammys' },
      { name: 'Stephen King', description: 'Master of Horror, 60+ novels' },
      { name: 'Hillary Clinton', description: 'Secretary of State, Senator' }
    ],
    mantra: 'Life is a bold adventure.',
    quote: 'Get busy living or get busy dying.',
    quoteAuthor: 'Stephen King',
    quoteAuthorDescription: 'Best-selling horror author',
    funFact: 'Fire Pigs are risk-takers. Unlike the lazy stereotype of the Pig, Fire Pigs are constantly moving, starting new projects, and seeking excitement.',
    emoji: '🐷'
  },
  'metal-pig': {
    years: [1911, 1971],
    famousPeople: [
      { name: 'Elon Musk', description: 'Tesla/SpaceX CEO, richest person' },
      { name: 'Snoop Dogg', description: 'Rap legend, cultural icon' },
      { name: 'Mark Wahlberg', description: 'Actor, producer, entrepreneur' }
    ],
    mantra: 'I work hard, I play hard.',
    quote: 'When something is important enough, you do it even if the odds are not in your favor.',
    quoteAuthor: 'Elon Musk',
    quoteAuthorDescription: 'World\'s richest entrepreneur',
    funFact: 'Metal Pigs are the most ambitious and intense. They often have a "tough guy" exterior but a heart of gold for their inner circle.',
    emoji: '🐷'
  }
};

/**
 * Get fun facts by element and animal
 */
export function getZodiacFunFacts(element: string, animal: string): ZodiacFunFact | null {
  const key = `${element.toLowerCase()}-${animal.toLowerCase()}`;
  return ZODIAC_FUN_FACTS[key] || null;
}

/**
 * Get element colors for styling
 */
export const ELEMENT_COLORS = {
  wood: {
    primary: '#22c55e',    // Green
    secondary: '#86efac',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-500/20',
    border: 'border-green-500',
    text: 'text-green-400'
  },
  fire: {
    primary: '#ef4444',    // Red
    secondary: '#fca5a5',
    gradient: 'from-red-500 to-orange-600',
    bg: 'bg-red-500/20',
    border: 'border-red-500',
    text: 'text-red-400'
  },
  earth: {
    primary: '#eab308',    // Yellow/Gold
    secondary: '#fde047',
    gradient: 'from-yellow-500 to-amber-600',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500',
    text: 'text-yellow-400'
  },
  metal: {
    primary: '#94a3b8',    // Silver/Gray
    secondary: '#cbd5e1',
    gradient: 'from-slate-400 to-zinc-500',
    bg: 'bg-slate-400/20',
    border: 'border-slate-400',
    text: 'text-slate-300'
  },
  water: {
    primary: '#3b82f6',    // Blue
    secondary: '#93c5fd',
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500',
    text: 'text-blue-400'
  }
};

/**
 * Get element color scheme
 */
export function getElementColors(element: string) {
  return ELEMENT_COLORS[element.toLowerCase() as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.fire;
}
