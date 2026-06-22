const fs = require('fs');
const path = require('path');

function tryRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return `[NOT FOUND: ${e.message}]`;
  }
}

console.log('=== server/helpers/sm2.js ===');
console.log(tryRead(path.join(__dirname, 'helpers', 'sm2.js')));

console.log('\n=== Current attempts with review dates ===');
require('dotenv').config();
const pool = require('./db');
pool.query(
  `SELECT a.id, a.user_id, a.problem_id, a.verdict, a.submitted_at, a.next_review_date, a.ease_factor, a.review_interval, p.title
   FROM attempts a
   JOIN problems p ON p.id = a.problem_id
   ORDER BY a.submitted_at DESC
   LIMIT 20`
)
  .then(r => {
    console.log(r.rows);
    pool.end();
  })
  .catch(e => {
    console.error('ERROR:', e.message);
    pool.end();
  });