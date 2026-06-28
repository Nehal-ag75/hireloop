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
  "Uber", "Wipro", "Zoom", "Zomato"
];

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

    const diffFilter = difficulty && difficulty !== 'All';

    // First try company-specific problems
    let query = `SELECT * FROM problems WHERE $1 = ANY(companies)`;
    const params = [company];
    if (diffFilter) {
      query += ` AND difficulty = $2`;
      params.push(difficulty);
    }
    query += ' ORDER BY difficulty, title';

    const specificResult = await pool.query(query, params);

    // If company has enough problems (>=15), return them
    if (specificResult.rows.length >= 15) {
      return res.json(specificResult.rows.slice(0, 60));
    }

    const specificIds = specificResult.rows.map(r => r.id);

    if (diffFilter) {
      // Single difficulty requested - fill up to 20
      const needed = Math.max(0, 20 - specificResult.rows.length);
      let fillResult = { rows: [] };
      if (needed > 0) {
        const fillQuery = specificIds.length > 0
          ? `SELECT * FROM problems WHERE difficulty = $1 AND id != ALL($2::int[]) ORDER BY RANDOM() LIMIT $3`
          : `SELECT * FROM problems WHERE difficulty = $1 ORDER BY RANDOM() LIMIT $2`;
        const fillParams = specificIds.length > 0
          ? [difficulty, specificIds, needed]
          : [difficulty, needed];
        fillResult = await pool.query(fillQuery, fillParams);
      }
      return res.json([...specificResult.rows, ...fillResult.rows]);
    }

    // No difficulty filter - get balanced 20 Easy + 25 Medium + 15 Hard
    const targets = { Easy: 20, Medium: 25, Hard: 15 };
    const specificByDiff = { Easy: [], Medium: [], Hard: [] };
    specificResult.rows.forEach(r => {
      if (specificByDiff[r.difficulty]) specificByDiff[r.difficulty].push(r);
    });

    const allRows = [...specificResult.rows];

    for (const diff of ['Easy', 'Medium', 'Hard']) {
      const have = specificByDiff[diff].length;
      const need = Math.max(0, targets[diff] - have);
      if (need === 0) continue;

      const existingIds = allRows.map(r => r.id);
      const fillResult = await pool.query(
        `SELECT * FROM problems 
         WHERE difficulty = $1 
         AND id != ALL($2::int[])
         ORDER BY RANDOM() 
         LIMIT $3`,
        [diff, existingIds.length > 0 ? existingIds : [0], need]
      );
      allRows.push(...fillResult.rows);
    }

    // Sort: Easy first, then Medium, then Hard
    const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
    allRows.sort((a, b) => diffWeight[a.difficulty] - diffWeight[b.difficulty]);

    res.json(allRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to filter problems' });
  }
});

module.exports = router;