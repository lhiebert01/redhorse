/**
 * Script to generate all 12 example talismans
 * Run with: npx ts-node scripts/generate-examples.ts
 */

const EXAMPLES = [
  { name: 'michael-johnson', dob: '03/15/1984', mode: 'wealth', zodiac: 'rat' },
  { name: 'jennifer-smith', dob: '07/22/1985', mode: 'power', zodiac: 'ox' },
  { name: 'david-williams', dob: '11/08/1986', mode: 'love', zodiac: 'tiger' },
  { name: 'sarah-davis', dob: '04/03/1987', mode: 'shield', zodiac: 'rabbit' },
  { name: 'james-miller', dob: '09/17/1988', mode: 'wealth', zodiac: 'dragon' },
  { name: 'emily-brown', dob: '02/28/1989', mode: 'power', zodiac: 'snake' },
  { name: 'robert-jones', dob: '06/12/1990', mode: 'love', zodiac: 'horse' },
  { name: 'lisa-anderson', dob: '08/25/1991', mode: 'shield', zodiac: 'goat' },
  { name: 'william-taylor', dob: '05/10/1980', mode: 'wealth', zodiac: 'monkey' },
  { name: 'maria-garcia', dob: '10/30/1993', mode: 'power', zodiac: 'rooster' },
  { name: 'christopher-lee', dob: '01/14/1994', mode: 'love', zodiac: 'dog' },
  { name: 'jessica-martinez', dob: '12/05/1995', mode: 'shield', zodiac: 'pig' },
];

const BASE_URL = 'https://redhorse-omega.vercel.app';
const PIN = '142857';

async function generateExample(example: typeof EXAMPLES[0], index: number) {
  console.log(`\n[${index + 1}/12] Generating ${example.name} (${example.zodiac} - ${example.mode})...`);

  try {
    // Call admin-test API
    const response = await fetch(`${BASE_URL}/api/admin-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: PIN,
        birthDate: example.dob,
        focusMode: example.mode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`  Error: ${data.error}`);
      return null;
    }

    console.log(`  Session ID: ${data.sessionId}`);
    console.log(`  Reveal URL: ${BASE_URL}/reveal?session_id=${data.sessionId}`);

    return {
      ...example,
      sessionId: data.sessionId,
      revealUrl: `${BASE_URL}/reveal?session_id=${data.sessionId}`,
    };
  } catch (error) {
    console.error(`  Failed: ${error}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Generating 12 Example Talismans for Fire Horse Oracle');
  console.log('='.repeat(60));

  const results = [];

  for (let i = 0; i < EXAMPLES.length; i++) {
    const result = await generateExample(EXAMPLES[i], i);
    if (result) {
      results.push(result);
    }

    // Wait between requests to avoid rate limiting
    if (i < EXAMPLES.length - 1) {
      console.log('  Waiting 5 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log('\nResults:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name}: ${r.revealUrl}`);
  });

  console.log('\nNext steps:');
  console.log('1. Wait ~60 seconds for all images to generate');
  console.log('2. Visit each reveal URL and click "Save Talisman"');
  console.log('3. Rename and place in /public/assets/examples/');
}

main().catch(console.error);
