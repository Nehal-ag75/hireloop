// server/fixOldAttempts.js
// Backfills old attempts with correct SM-2 intervals and fixes timezone issue
require('dotenv').config();
const pool = require('./db');
const { calculateSM2, verdictToQuality } = require('./helpers/sm2');

async function main() {
  console.log('Connected to PostgreSQL database ✅');

  // Get all attempts ordered by problem+user+time so we can replay SM-2 correctly
  const { rows: attempts } = await pool.query(`
    SELECT id, user_id, problem_id, verdict, time_taken_minutes, submitted_at
    FROM attempts
    ORDER BY user_id, problem_id, submitted_at ASC
  `);

  console.log(`Found ${attempts.length} attempts to backfill...`);

  // Group by user+problem so we can replay SM-2 sequence correctly
  const groups = {};
  attempts.forEach(a => {
    const key = `${a.user_id}_${a.problem_id}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  });

  let updated = 0;
  for (const [key, seq] of Object.entries(groups)) {
    let prevEaseFactor = 2.5;
    let prevInterval = 0; // 0 = no prior attempt (triggers first-attempt branch)

    for (const attempt of seq) {
      const quality = verdictToQuality(attempt.verdict, attempt.time_taken_minutes);
      const { easeFactor, interval, nextReviewDate } = calculateSM2(quality, prevEaseFactor, prevInterval);

      // Store as plain DATE string (no time component) to avoid timezone drift
      await pool.query(`
        UPDATE attempts
        SET ease_factor = $1, review_interval = $2, next_review_date = $3::date
        WHERE id = $4
      `, [easeFactor, interval, nextReviewDate, attempt.id]);

      prevEaseFactor = easeFactor;
      prevInterval = interval;
      updated++;
    }
  }

  console.log(`\nBackfilled ${updated} attempts with correct SM-2 values.`);

  // Show result
  const { rows: result } = await pool.query(`
    SELECT a.id, a.problem_id, a.verdict, a.review_interval,
           a.next_review_date::text, p.title
    FROM attempts a
    JOIN problems p ON p.id = a.problem_id
    ORDER BY a.user_id, a.problem_id, a.submitted_at
  `);

  console.log('\n=== Updated attempts ===');
  result.forEach(r => {
    console.log(`  id=${r.id} [${r.verdict}] "${r.title}" → interval=${r.review_interval}d, next_review=${r.next_review_date}`);
  });

  pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
