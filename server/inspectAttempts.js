const fs = require('fs');
const path = require('path');

function tryRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return `[NOT FOUND: ${e.message}]`;
  }
}

console.log('=== server/routes/attempts.js ===');
console.log(tryRead(path.join(__dirname, 'routes', 'attempts.js')));

console.log('\n=== server.js — checking if attempts route is registered ===');
const serverJs = tryRead(path.join(__dirname, 'server.js'));
const attemptsLines = serverJs.split('\n').filter(l => l.toLowerCase().includes('attempts'));
console.log(attemptsLines.length ? attemptsLines : '[no mention of "attempts" in server.js]');

console.log('\n=== client/src/pages/Problems.jsx ===');
console.log(tryRead(path.join(__dirname, '..', 'client', 'src', 'pages', 'Problems.jsx')));