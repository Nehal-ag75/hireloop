const express = require('express');
const router = express.Router();
router.get('/ping', (req, res) => {
  res.json({ message: 'resume router is alive' });
});
console.log('Ping route registered on resume router');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { extractTextFromPDF } = require('../helpers/resumeParser');
const { analyzeResume } = require('../helpers/aiService');
const pool = require('../db');

// Configure multer to store uploaded files in memory (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// ANALYZE a resume PDF
router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded. Use field name "resume".' });
    }

    const { job_description, target_role } = req.body;

    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract readable text from this PDF' });
    }

    const analysis = await analyzeResume(resumeText, job_description, target_role);

    // Save the analysis as a note for the user
    await pool.query(
      `INSERT INTO notes (user_id, content, ai_generated) VALUES ($1, $2, true)`,
      [req.userId, `Resume Analysis (Score: ${analysis.matchScore}/100): ${analysis.overallFeedback}`]
    );

    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume analysis failed', details: err.message });
  }
});

module.exports = router;