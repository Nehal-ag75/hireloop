const fs = require('fs');
const path = require('path');

function tryRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

console.log('=== server/middleware directory ===');
try {
  console.log(fs.readdirSync(path.join(__dirname, 'middleware')));
} catch (e) {
  console.log('No middleware/ folder found:', e.message);
}

console.log('\n=== routes directory ===');
console.log(fs.readdirSync(path.join(__dirname, 'routes')));

console.log('\n=== roadmap.js contents (likely uses auth) ===');
const roadmap = tryRead(path.join(__dirname, 'routes', 'roadmap.js'));
console.log(roadmap || 'roadmap.js not found');