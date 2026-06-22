require('dotenv').config();
const pool = require('./db');

async function main() {
  console.log('\n=== ALL ATTEMPTS (raw) ===');
  const all = await pool.query(`
    SELECT a.id as attempt_id, a.problem_id, a.user_id, a.verdict, 
           a.next_review_date, a.review_interval, a.ease_factor,
           p.title
    FROM attempts a
    JOIN problems p ON p.id = a.problem_id
    ORDER BY a.submitted_at DESC
  `);
  console.log(JSON.stringify(all.rows, null, 2));

  console.log('\n=== DUE TODAY (what due-today route returns) ===');
  const due = await pool.query(`
    SELECT DISTINCT ON (a.problem_id) a.*, p.title, p.topic, p.difficulty, p.platform_link
    FROM attempts a
    JOIN problems p ON a.problem_id = p.id
    WHERE a.next_review_date <= CURRENT_DATE
    ORDER BY a.problem_id, a.submitted_at DESC
  `);
  console.log('Count:', due.rows.length);
  due.rows.forEach(r => {
    console.log(`  attempt.id=${r.id}  problem_id=${r.problem_id}  title="${r.title}"  next_review=${r.next_review_date}  verdict=${r.verdict}`);
  });

  console.log('\n=== FIELD NAMES on a due-today row ===');
  if (due.rows.length > 0) console.log(Object.keys(due.rows[0]));

  pool.end();
}
main().catch(e => { console.error(e); pool.end(); });