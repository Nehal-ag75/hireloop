const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { calculateSM2, verdictToQuality } = require('../helpers/sm2');

// SUBMIT an attempt
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { problem_id, verdict, time_taken_minutes, code_submitted } = req.body;
    if (!problem_id || !verdict)
      return res.status(400).json({ error: 'problem_id and verdict are required' });

    const prevAttempt = await pool.query(
      `SELECT ease_factor, review_interval FROM attempts
       WHERE user_id = $1 AND problem_id = $2
       ORDER BY submitted_at DESC LIMIT 1`,
      [userId, problem_id]
    );
    const prevEaseFactor = prevAttempt.rows[0]?.ease_factor ?? 2.5;
    const prevInterval   = prevAttempt.rows[0]?.review_interval ?? 0;

    const quality = verdictToQuality(verdict, time_taken_minutes);
    const { easeFactor, interval, nextReviewDate } = calculateSM2(quality, prevEaseFactor, prevInterval);

    const result = await pool.query(
      `INSERT INTO attempts
        (user_id, problem_id, verdict, time_taken_minutes, code_submitted,
         next_review_date, ease_factor, review_interval)
       VALUES ($1,$2,$3,$4,$5,$6::date,$7,$8)
       RETURNING *`,
      [userId, problem_id, verdict, time_taken_minutes||null,
       code_submitted||null, nextReviewDate, easeFactor, interval]
    );

    res.status(201).json({
      message: 'Attempt recorded',
      attempt: result.rows[0],
      sm2: { quality, easeFactor, interval, nextReviewDate },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record attempt' });
  }
});

// GET problems due for review today (or overdue)
// Uses ::date cast on both sides so timezone can't shift the comparison
router.get('/due-today', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT DISTINCT ON (a.problem_id)
         a.id            AS attempt_id,
         a.problem_id,
         a.verdict,
         a.next_review_date::text AS next_review_date,
         a.ease_factor,
         a.review_interval,
         a.submitted_at,
         p.title, p.topic, p.difficulty, p.platform_link, p.companies
       FROM attempts a
       JOIN problems p ON a.problem_id = p.id
       WHERE a.user_id = $1
         AND a.next_review_date::date <= CURRENT_DATE
       ORDER BY a.problem_id, a.submitted_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch due reviews' });
  }
});

// GET full attempt history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT a.id AS attempt_id,
              a.problem_id,
              a.verdict,
              a.next_review_date::text AS next_review_date,
              a.ease_factor,
              a.review_interval,
              a.submitted_at,
              p.title, p.topic, p.difficulty
       FROM attempts a
       JOIN problems p ON a.problem_id = p.id
       WHERE a.user_id = $1
       ORDER BY a.submitted_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attempt history' });
  }
});

module.exports = router;
