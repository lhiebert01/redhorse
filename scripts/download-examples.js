const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase config
const SUPABASE_URL = 'https://ykptxslgxlsbvpbeujfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcHR4c2xneGxzYnZwYmV1amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDY0MTYsImV4cCI6MjA1MjMyMjQxNn0.aO0qOSkYXcHvJi-dRcapitvFWmZv2k0X8GjcTLlHXqA';

// Prophecy IDs from generation
const PROPHECIES = [
  { id: 'eb06d158-98c3-4ae1-b342-57f0b817413b', name: 'michael-johnson-rat-wealth' },
  { id: 'c9765f8d-aeaa-4089-85e8-c40dc59c8c27', name: 'jennifer-smith-ox-power' },
  { id: 'ab0d8007-cebb-40e8-88a2-213d605bbfab', name: 'david-williams-tiger-love' },
  { id: 'bc242479-f4ac-426d-98bd-38948b91f972', name: 'sarah-davis-rabbit-shield' },
  { id: '2d8f9020-fdf1-4db3-aae5-ba60d2790482', name: 'james-miller-dragon-wealth' },
  { id: '1efb1aba-d47e-47f9-a5f1-2c266d2c37c7', name: 'emily-brown-snake-power' },
  { id: '79a26d53-9a60-43ae-b503-9e2de6fc4879', name: 'robert-jones-horse-love' },
  { id: '739f940f-96c2-47fd-b45e-188fad5eb52f', name: 'lisa-anderson-goat-shield' },
  { id: 'd833df4c-a7b4-4855-8f25-28e35da2aa01', name: 'william-taylor-monkey-wealth' },
  { id: '619be9c0-b89e-4a88-a7a2-d5e2ca3248ff', name: 'maria-garcia-rooster-power' },
  { id: '62facd3c-ebd4-4610-8868-199fb60b68f0', name: 'christopher-lee-dog-love' },
  { id: '3be92e4a-835a-43a3-84d1-145dde7d9681', name: 'jessica-martinez-pig-shield' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'examples');

async function fetchProphecy(id) {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/prophecies?id=eq.${id}&select=*`;
    const options = {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0] || null);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Fetching prophecies and downloading images...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const p of PROPHECIES) {
    console.log(`Processing ${p.name}...`);

    try {
      const prophecy = await fetchProphecy(p.id);

      if (!prophecy) {
        console.log(`  Not found!`);
        continue;
      }

      if (prophecy.status !== 'completed') {
        console.log(`  Status: ${prophecy.status} (not ready yet)`);
        continue;
      }

      if (!prophecy.image_url) {
        console.log(`  No image URL!`);
        continue;
      }

      console.log(`  Image URL: ${prophecy.image_url}`);

      const outputPath = path.join(OUTPUT_DIR, `${p.name}.png`);
      await downloadImage(prophecy.image_url, outputPath);
      console.log(`  Saved to: ${outputPath}`);

    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
