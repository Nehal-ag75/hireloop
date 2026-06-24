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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SUB_TOPIC_ORDER = [
  'Arrays & Strings',
  'Linked Lists',
  'Stacks & Queues',
  'Trees & Heaps',
  'Graphs',
  'Dynamic Programming & Backtracking',
  'Bit Manipulation',
  'Core DSA Principles'
];

const WEAK_TOPIC_MAP = {
  'Arrays': 'Arrays & Strings',
  'Strings': 'Arrays & Strings',
  'Two Pointers': 'Arrays & Strings',
  'Sliding Window': 'Arrays & Strings',
  'Linked List': 'Linked Lists',
  'Stacks': 'Stacks & Queues',
  'Trees': 'Trees & Heaps',
  'Heap': 'Trees & Heaps',
  'Graphs': 'Graphs',
  'Dynamic Programming': 'Dynamic Programming & Backtracking',
  'Backtracking': 'Dynamic Programming & Backtracking',
  'Recursion': 'Dynamic Programming & Backtracking',
  'Binary Search': 'Core DSA Principles',
  'Greedy': 'Core DSA Principles',
};

// GET all problems
router.get('/problems', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM problems");
    const remappedRows = result.rows.map(row => ({
      ...row,
      topic: getSubTopic(row.title)
    }));
    const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
    remappedRows.sort((a, b) => diffWeight[a.difficulty] - diffWeight[b.difficulty]);
    res.json(remappedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// GENERATE a roadmap
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { targetCompany = null, days = 30, weakTopics = [] } = req.body;
    const totalDaysTarget = Number(days) || 30;
    const diffLevels = ['Easy', 'Medium', 'Hard'];

    // Fetch company-specific problems, fall back to all if too few
    let problemsResult;
    if (targetCompany) {
      problemsResult = await pool.query(
        "SELECT * FROM problems WHERE $1 = ANY(companies)",
        [targetCompany]
      );
      if (problemsResult.rows.length < 20) {
        problemsResult = await pool.query("SELECT * FROM problems");
      }
    } else {
      problemsResult = await pool.query("SELECT * FROM problems");
    }

    // Shuffle so company roadmaps are unique and different from each other
    const allProblems = shuffle(problemsResult.rows).map(p => ({
      ...p,
      subTopic: getSubTopic(p.title)
    }));

    // Map weak topics to internal subtopic names
    const mappedWeakTopics = [...new Set(
      weakTopics.map(t => WEAK_TOPIC_MAP[t]).filter(Boolean)
    )];

    // Weak topics first, then remaining
    const weakFirst = mappedWeakTopics.filter(t => SUB_TOPIC_ORDER.includes(t));
    const remaining = SUB_TOPIC_ORDER.filter(t => !weakFirst.includes(t));
    const orderedTopics = [...weakFirst, ...remaining];

    // Build per-topic per-difficulty queues
    const topicDiffQueues = {};
    const topicIndices = {};
    for (const topic of orderedTopics) {
      topicDiffQueues[topic] = {};
      topicIndices[topic] = { Easy: 0, Medium: 0, Hard: 0 };
      for (const diff of diffLevels) {
        topicDiffQueues[topic][diff] = allProblems
          .filter(p => p.subTopic === topic && p.difficulty === diff);
      }
    }

    const easyPool = [], mediumPool = [], hardPool = [];

    // First pass: drain weak topics completely
    for (const topic of weakFirst) {
      for (const diff of diffLevels) {
        const q = topicDiffQueues[topic][diff];
        for (const p of q) {
          if (diff === 'Easy') easyPool.push(p);
          else if (diff === 'Medium') mediumPool.push(p);
          else hardPool.push(p);
        }
        topicIndices[topic][diff] = q.length;
      }
    }

    // Second pass: round-robin remaining topics
    let hasMore = true;
    while (hasMore) {
      hasMore = false;
      for (const topic of remaining) {
        for (const diff of diffLevels) {
          const q = topicDiffQueues[topic][diff];
          const idx = topicIndices[topic][diff];
          if (idx < q.length) {
            if (diff === 'Easy') easyPool.push(q[idx]);
            else if (diff === 'Medium') mediumPool.push(q[idx]);
            else hardPool.push(q[idx]);
            topicIndices[topic][diff]++;
            hasMore = true;
          }
        }
      }
    }

    // Build daily batches: 2 Easy + 2 Medium + 2 Hard per day
    const roadmapProblems = [];
    let ei = 0, mi = 0, hi = 0;
    for (let day = 0; day < totalDaysTarget; day++) {
      const batch = [];
      for (let k = 0; k < 2 && ei < easyPool.length; k++) batch.push(easyPool[ei++]);
      for (let k = 0; k < 2 && mi < mediumPool.length; k++) batch.push(mediumPool[mi++]);
      for (let k = 0; k < 2 && hi < hardPool.length; k++) batch.push(hardPool[hi++]);
      if (batch.length === 0) break;
      roadmapProblems.push(...batch.map(p => ({ ...p, _day: day + 1 })));
    }

    await pool.query('DELETE FROM roadmap WHERE user_id = $1', [userId]);

    const insertedRoadmap = [];
    for (const problem of roadmapProblems) {
      const insertResult = await pool.query(
        `INSERT INTO roadmap (user_id, day_number, problem_id, status)
         VALUES ($1, $2, $3, 'pending') RETURNING *`,
        [userId, problem._day, problem.id]
      );
      insertedRoadmap.push({
        ...insertResult.rows[0],
        title: problem.title,
        topic: problem.subTopic,
        difficulty: problem.difficulty,
        platform_link: problem.platform_link,
      });
    }

    await pool.query(
      `UPDATE users SET target_company = COALESCE($1, target_company), days_left = COALESCE($2, days_left) WHERE id = $3`,
      [targetCompany, totalDaysTarget, userId]
    );

    const dayMap = {};
    insertedRoadmap.forEach((item) => {
      if (!dayMap[item.day_number]) {
        dayMap[item.day_number] = { day: item.day_number, topics: [], problems: [] };
      }
      if (!dayMap[item.day_number].topics.includes(item.topic)) {
        dayMap[item.day_number].topics.push(item.topic);
      }
      dayMap[item.day_number].problems.push({
        id: item.problem_id,
        title: item.title,
        topic: item.topic,
        difficulty: item.difficulty,
        platform_link: item.platform_link,
      });
    });

    const groupedDays = Object.values(dayMap)
      .map(d => ({ ...d, topic: d.topics.join(' + ') }))
      .sort((a, b) => a.day - b.day);

    res.json({
      message: 'Roadmap generated successfully.',
      totalDays: groupedDays.length,
      roadmap: insertedRoadmap,
      days: groupedDays,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// GET current user's saved roadmap
router.get('/my-roadmap', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT r.*, p.title, p.difficulty, p.platform_link, p.topic AS raw_topic
       FROM roadmap r
       JOIN problems p ON r.problem_id = p.id
       WHERE r.user_id = $1
       ORDER BY r.day_number ASC`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ days: [], totalDays: 0 });
    }

    const dayMap = {};
    result.rows.forEach(item => {
      const subTopic = getSubTopic(item.title);
      if (!dayMap[item.day_number]) {
        dayMap[item.day_number] = { day: item.day_number, topics: [], problems: [] };
      }
      if (!dayMap[item.day_number].topics.includes(subTopic)) {
        dayMap[item.day_number].topics.push(subTopic);
      }
      dayMap[item.day_number].problems.push({
        id: item.problem_id,
        title: item.title,
        topic: subTopic,
        difficulty: item.difficulty,
        platform_link: item.platform_link,
        status: item.status,
      });
    });

    const groupedDays = Object.values(dayMap)
      .map(d => ({ ...d, topic: d.topics.join(' + ') }))
      .sort((a, b) => a.day - b.day);

    res.json({ days: groupedDays, totalDays: groupedDays.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

module.exports = router;