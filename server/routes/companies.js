const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const COMPANY_LIST = [
  "Adobe", "Airbnb", "Amazon", "Apple", "Atlassian", "Accenture",
  "Bloomberg", "Citadel", "Cisco", "Coinbase", "Cognizant",
  "Datadog", "DoorDash", "Delivery Hero",
  "Goldman Sachs", "Google", "Grab",
  "HubSpot", "IBM", "Infosys", "Instacart", "Intel",
  "Jane Street", "JPMorgan Chase", "LinkedIn", "Lyft",
  "Meta", "Microsoft", "Morgan Stanley",
  "Netflix", "NVIDIA", "Oracle",
  "PayPal", "Pinterest",
  "Reddit", "Snapchat", "Spotify", "Stripe", "ServiceNow", "Splunk", "Slack",
  "TCS", "TikTok / ByteDance", "Twilio", "Twitter / X",
  "Uber", "Wipro", "Zoom"
];

// Maps each company deterministically to 2 set numbers (1–15)
// so every company always returns real problems from the DB
function getSetsForCompany(company) {
  const idx = COMPANY_LIST.indexOf(company);
  const base = idx === -1 ? 0 : idx;
  const set1 = (base % 15) + 1;
  const set2 = ((base + 7) % 15) + 1;
  return [set1, set2];
}

// 1. GET /api/companies/list
router.get('/list', async (req, res) => {
  try {
    res.json(COMPANY_LIST);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve company list' });
  }
});

// 2. GET /api/companies/filter?company=X&difficulty=Y
router.get('/filter', authMiddleware, async (req, res) => {
  try {
    const { company, difficulty } = req.query;

    if (!company) {
      return res.status(400).json({ error: 'company parameter is required' });
    }

    const [set1, set2] = getSetsForCompany(company);

    // Extract set number from title pattern "(Set N)" and match it
    let query = `
      SELECT * FROM problems
      WHERE topic = 'Data Structures & Algorithms'
        AND (
          title ~ $1
          OR title ~ $2
        )
    `;
    const params = [
      `\\(Set ${set1}\\)`,
      `\\(Set ${set2}\\)`
    ];

    if (difficulty && difficulty !== 'All') {
      query += ` AND difficulty = $3`;
      params.push(difficulty);
    }

    query += ' ORDER BY difficulty, title LIMIT 60';

    const result = await pool.query(query, params);

    // If regex returns nothing (edge case), fall back to LIKE
    if (result.rows.length === 0) {
      const fallback = await pool.query(
        `SELECT * FROM problems
         WHERE topic = 'Data Structures & Algorithms'
           AND (title LIKE $1 OR title LIKE $2)
         ORDER BY difficulty, title LIMIT 60`,
        [`%(Set ${set1})%`, `%(Set ${set2})%`]
      );
      return res.json(fallback.rows);
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to filter problems' });
  }
});

module.exports = router;