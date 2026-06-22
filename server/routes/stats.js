const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

function getSubTopic(title) {
  const lower = title.toLowerCase();
  if (lower.includes('window') || lower.includes('substring') || lower.includes('array') || lower.includes('subarray')) return 'Arrays & Strings';
  if (lower.includes('list')) return 'Linked Lists';
  if (lower.includes('stack') || lower.includes('parentheses') || lower.includes('deque')) return 'Stacks & Queues';
  if (lower.includes('tree') || lower.includes('ancestor')) return 'Trees & Heaps';
  if (lower.includes('graph') || lower.includes('island') || lower.includes('schedule')) return 'Graphs';
  if (lower.includes('distance') || lower.includes('coin') || lower.includes('sequence') || lower.includes('subsets') || lower.includes('permutations')) return 'Dynamic Programming & Backtracking';
  if (lower.includes('bit') || lower.includes('single number')) return 'Bit Manipulation';
  return 'Core DSA Principles';
}

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const solvedResult = await pool.query(
      `SELECT COUNT(DISTINCT problem_id) AS count
       FROM attempts
       WHERE user_id = $1 AND verdict = 'Solved'`,
      [userId]
    );
    const solved = parseInt(solvedResult.rows[0].count, 10);

    // Topics: count distinct subtopics derived from problem titles
    const titlesResult = await pool.query(
      `SELECT DISTINCT p.title
       FROM attempts a
       JOIN problems p ON p.id = a.problem_id
       WHERE a.user_id = $1 AND a.verdict = 'Solved'`,
      [userId]
    );
    const topics = new Set(titlesResult.rows.map(r => getSubTopic(r.title))).size;

    const datesResult = await pool.query(
      `SELECT DISTINCT submitted_at::date AS day
       FROM attempts
       WHERE user_id = $1
       ORDER BY day DESC`,
      [userId]
    );
    const days = datesResult.rows.map(r => r.day.toISOString().slice(0, 10));
    let streak = 0;
    if (days.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().slice(0, 10);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      let cursor;
      if (days[0] === todayStr) { streak = 1; cursor = new Date(today); }
      else if (days[0] === yesterdayStr) { streak = 1; cursor = new Date(yesterday); }
      if (streak > 0) {
        for (let i = 1; i < days.length; i++) {
          cursor.setDate(cursor.getDate() - 1);
          if (days[i] === cursor.toISOString().slice(0, 10)) streak++;
          else break;
        }
      }
    }

    const userResult = await pool.query(
      'SELECT days_left FROM users WHERE id = $1', [userId]
    );
    const daysLeft = userResult.rows[0]?.days_left ?? null;

    const dueResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM attempts
       WHERE user_id = $1 AND next_review_date <= CURRENT_DATE`,
      [userId]
    );
    const reviewsDue = parseInt(dueResult.rows[0].count, 10);

    res.json({ solved, streak, topics, daysLeft, reviewsDue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;