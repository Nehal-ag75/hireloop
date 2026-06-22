const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDirectReview, getSocraticHint } = require('../helpers/aiService');
const pool = require('../db');

// DIRECT REVIEW endpoint
router.post('/review', authMiddleware, async (req, res) => {
  try {
    const { code, problem_id, problem_title } = req.body;

    if (!code || !problem_title) {
      return res.status(400).json({ error: 'code and problem_title are required' });
    }

    const review = await getDirectReview(code, problem_title);

    // Save AI feedback to most recent attempt for this problem, if one exists
    if (problem_id) {
      await pool.query(
        `UPDATE attempts SET ai_feedback = $1
         WHERE user_id = $2 AND problem_id = $3
         AND id = (SELECT id FROM attempts WHERE user_id = $2 AND problem_id = $3 ORDER BY submitted_at DESC LIMIT 1)`,
        [JSON.stringify(review), req.userId, problem_id]
      );
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI review failed', details: err.message });
  }
});

// SOCRATIC HINT endpoint
router.post('/hint', authMiddleware, async (req, res) => {
  try {
    const { code, problem_title, hint_level } = req.body;

    if (!problem_title) {
      return res.status(400).json({ error: 'problem_title is required' });
    }

    const hint = await getSocraticHint(code || '', problem_title, hint_level || 1);
    res.json(hint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI hint generation failed', details: err.message });
  }
});

module.exports = router;