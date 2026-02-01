const fs = require('fs');
const content = fs.readFileSync('src/constants/party-questions.ts', 'utf8');

let sql = `-- Migration: Create party_questions table and insert all 400 questions
-- Run this in Supabase SQL Editor
-- Generated: ${new Date().toISOString()}

-- Drop existing table if needed (uncomment if you want to reset)
-- DROP TABLE IF EXISTS party_questions;

-- Create the party_questions table
CREATE TABLE IF NOT EXISTS party_questions (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_party_questions_category ON party_questions(category);
CREATE INDEX IF NOT EXISTS idx_party_questions_difficulty ON party_questions(difficulty);

-- Enable RLS but allow public read access
ALTER TABLE party_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to questions" ON party_questions;
CREATE POLICY "Allow public read access to questions"
  ON party_questions FOR SELECT
  USING (true);

-- Clear existing questions (if re-running)
TRUNCATE TABLE party_questions;

-- Insert all 400 questions
`;

// Find all question blocks - skip the first one (interface definition)
const blocks = content.split(/\{\s*id:/g).slice(2);

let count = 0;
const values = [];

blocks.forEach(block => {
  const idMatch = block.match(/^\s*(\d+)/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
  const qMatch = block.match(/question:\s*['"](.+?)['"],?\s*\n\s*options:/s);
  const optMatch = block.match(/options:\s*\[([\s\S]*?)\]/);
  const ansMatch = block.match(/correctAnswer:\s*'((?:[^'\\]|\\.)*)'/);
  const expMatch = block.match(/explanation:\s*'((?:[^'\\]|\\.)*)'/);

  if (!idMatch || !catMatch || !qMatch || !optMatch || !ansMatch) {
    return;
  }

  const id = idMatch[1];
  const category = catMatch[1];
  const difficulty = diffMatch ? diffMatch[1] : 'medium';
  const question = qMatch[1].replace(/\\'/g, "'").replace(/\n/g, ' ');
  const correctAnswer = ansMatch[1].replace(/\\'/g, "'");
  const explanation = expMatch ? expMatch[1].replace(/\\'/g, "'") : null;

  // Parse options - handle escaped quotes
  const optionsRaw = optMatch[1].match(/'((?:[^'\\]|\\.)*)'/g);
  if (!optionsRaw || optionsRaw.length < 4) return;
  const options = optionsRaw.map(o => o.slice(1, -1).replace(/\\'/g, "'"));

  // Escape single quotes for SQL
  const esc = (s) => s ? s.replace(/'/g, "''") : null;

  const row = `(${id}, '${esc(category)}', '${esc(difficulty)}', '${esc(question)}', '${esc(options[0])}', '${esc(options[1])}', '${esc(options[2])}', '${esc(options[3])}', '${esc(correctAnswer)}', ${explanation ? `'${esc(explanation)}'` : 'NULL'})`;

  values.push(row);
  count++;
});

// Split into batches of 50 for better SQL execution
const batchSize = 50;
for (let i = 0; i < values.length; i += batchSize) {
  const batch = values.slice(i, i + batchSize);
  sql += `\nINSERT INTO party_questions (id, category, difficulty, question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES\n`;
  sql += batch.join(',\n') + ';\n';
}

sql += `
-- Verify the insert
SELECT COUNT(*) as total_questions FROM party_questions;
SELECT category, COUNT(*) as count FROM party_questions GROUP BY category ORDER BY category;
`;

fs.writeFileSync('docs/migrations/003_party_questions_table.sql', sql);
console.log(`Generated SQL migration with ${count} questions`);
console.log('Output: docs/migrations/003_party_questions_table.sql');
