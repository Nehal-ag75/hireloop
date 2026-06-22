const fs = require('fs');
const path = require('path');

function tryRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return `[NOT FOUND: ${e.message}]`;
  }
}

const sm2 = tryRead(path.join(__dirname, 'helpers', 'sm2.js'));
const attempts = tryRead(path.join(__dirname, 'routes', 'attempts.js'));

console.log('=== sm2.js has firstIntervalByQuality fix? ===');
console.log(sm2.includes('firstIntervalByQuality') ? 'YES - fix is present' : 'NO - still old version');

console.log('\n=== attempts.js uses ?? 0 (not || 1) for prevInterval? ===');
console.log(attempts.includes('review_interval ?? 0') ? 'YES - fix is present' : 'NO - still old version');

console.log('\n=== Full sm2.js content ===');
console.log(sm2);