const fs = require('fs');
const content = fs.readFileSync('src/constants/party-questions.ts', 'utf8');

let md = '# Fire Horse Trivia - Master Question List\n\n';
md += '**Total Questions:** 400\n\n';
md += '---\n\n';

// Find all question blocks - skip the first one (interface definition)
const blocks = content.split(/\{\s*id:/g).slice(2);

let currentCategory = '';
let count = 0;

blocks.forEach(block => {
  // Extract fields using more flexible regex
  const idMatch = block.match(/^\s*(\d+)/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  const diffMatch = block.match(/difficulty:\s*'([^']+)'/);
  // Extract question - find content between question: ' and ', options
  const qMatch = block.match(/question:\s*['"](.+?)['"],?\s*\n\s*options:/s);
  const optMatch = block.match(/options:\s*\[([\s\S]*?)\]/);
  // Answer - find content after correctAnswer:, handle escaped quotes
  const ansMatch = block.match(/correctAnswer:\s*'((?:[^'\\]|\\.)*)'/);
  const expMatch = block.match(/explanation:\s*'((?:[^'\\]|\\.)*)'/)

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
  if (!optionsRaw) return;
  const options = optionsRaw.map(o => o.slice(1, -1).replace(/\\'/g, "'"));

  // Add category header if changed
  if (category !== currentCategory) {
    currentCategory = category;
    md += '## ' + category + '\n\n';
  }

  md += '### Q' + id + ' (' + difficulty + ')\n';
  md += '**' + question + '**\n\n';

  options.forEach((opt, i) => {
    const letter = String.fromCharCode(65 + i);
    const isCorrect = opt === correctAnswer;
    md += letter + '. ' + opt + (isCorrect ? ' ✅' : '') + '\n';
  });

  if (explanation) {
    md += '\n_' + explanation + '_\n';
  }

  md += '\n---\n\n';
  count++;
});

fs.writeFileSync('docs/MASTER-QUESTION-LIST.md', md);
console.log('Generated ' + count + ' questions to docs/MASTER-QUESTION-LIST.md');
