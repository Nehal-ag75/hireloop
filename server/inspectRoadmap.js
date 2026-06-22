const fs = require('fs');
const path = require('path');

function tryRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return `[NOT FOUND: ${e.message}]`;
  }
}

console.log('=== server/routes/roadmap.js ===');
console.log(tryRead(path.join(__dirname, 'routes', 'roadmap.js')));

console.log('\n=== server/helpers/topologicalSort.js ===');
console.log(tryRead(path.join(__dirname, 'helpers', 'topologicalSort.js')));

console.log('\n=== distinct prerequisite_topic values in problems table ===');
require('dotenv').config();
const pool = require('./db');
pool.query('SELECT DISTINCT topic, prerequisite_topic FROM problems ORDER BY topic')
  .then(r => {
    console.log(r.rows);
    pool.end();
  })
  .catch(e => {
    console.error('ERROR:', e.message);
    pool.end();
  });