const express = require('express');
const router = express.Router();

const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { getInterviewerResponse, generateScorecard } = require('../helpers/aiService');

// START a new randomized mock interview session
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { company, difficulty, topic } = req.body;
    
    // Construct a dynamic descriptive title for the database record
    const interviewContextTitle = `${company || 'General'} ${difficulty || 'Mixed'} Interview (${topic || 'General CS'})`;

    // Map core domains to deep, specific technical system instruction contexts
    let domainDirectives = '';
    if (topic === 'Data Structures & Algorithms') {
      domainDirectives = 'Focus intensely on algorithmic complexity, spatial efficiency, array mutations, graph traversals, dynamic programming, and data structure constraints.';
    } else if (topic === 'Object-Oriented Programming (OOPS)') {
      domainDirectives = 'Test core OOPS design concepts deeply: Polymorphism, Inheritance, Encapsulation, Abstraction, SOLID principles, and common structural/behavioral design patterns.';
    } else if (topic === 'Operating Systems (OS)') {
      domainDirectives = 'Focus on core OS mechanics: Process vs Threads, CPU Scheduling, Memory Management (Paging/Segmentation), Deadlocks, Semaphores/Mutexes, and Virtual Memory.';
    } else if (topic === 'Computer Networks (CN)') {
      domainDirectives = 'Focus heavily on networking architectures: The OSI Model layers, TCP vs UDP handshakes, IP Addressing & Subnetting (VLSM), routing protocols, DNS resolution, and application layer protocols (HTTP, FTP, TELNET).';
    } else if (topic === 'Database Management Systems (DBMS)') {
      domainDirectives = 'Focus on relational mechanics: Normalization forms, Functional Dependencies, ACID properties, indexing optimization, data integrity, and complex relational SQL query logic.';
    } else if (topic === 'Software Engineering & System Design') {
      domainDirectives = 'Focus on high-level system architecture, scalability, distributed systems, caching tiers, software maintenance lifecycles, and reengineering models.';
    } else {
      domainDirectives = 'Test structural computer science fundamentals, logic design, and architectural engineering rules.';
    }

    // Combine parameters into the definitive system instruction prompt for your AI adapter
    const promptInstructions = `System Interview Mode: Act as a strict technical interviewer for ${company || 'a premier tech enterprise'}. 
    Target Tier Difficulty: ${difficulty || 'Medium'}. 
    Core Sub-domain: ${topic || 'Computer Science Fundamentals'}.
    Context constraints: ${domainDirectives}
    Objective: Ask exactly ONE random, challenging technical question aligned perfectly with these exact company standards and domain areas. Wait for the user's answer.`;

    const aiResponse = await getInterviewerResponse(promptInstructions, []);
    const conversation = [{ role: 'assistant', content: aiResponse.interviewerMessage }];

    const result = await pool.query(
      `INSERT INTO interview_sessions (user_id, problem_title, conversation, status)
       VALUES ($1, $2, $3, 'active') RETURNING *`,
      [req.userId, interviewContextTitle, JSON.stringify(conversation)]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start customized core interview', details: err.message });
  }
});

// CONTINUE an interview - send candidate's answer, get next question
router.post('/:sessionId/respond', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const sessionResult = await pool.query(
      'SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, req.userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const session = sessionResult.rows[0];
    const conversation = typeof session.conversation === 'string' 
      ? JSON.parse(session.conversation) 
      : session.conversation;

    conversation.push({ role: 'user', content: message });

    const aiResponse = await getInterviewerResponse(session.problem_title, conversation);
    conversation.push({ role: 'assistant', content: aiResponse.interviewerMessage });

    const updated = await pool.query(
      `UPDATE interview_sessions SET conversation = $1 WHERE id = $2 RETURNING *`,
      [JSON.stringify(conversation), sessionId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to continue interview', details: err.message });
  }
});

// END interview and get scorecard
router.post('/:sessionId/end', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionResult = await pool.query(
      'SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, req.userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const session = sessionResult.rows[0];
    const conversation = typeof session.conversation === 'string' 
      ? JSON.parse(session.conversation) 
      : session.conversation;

    const scorecard = await generateScorecard(session.problem_title, conversation);

    const updated = await pool.query(
      `UPDATE interview_sessions SET status = 'completed', scorecard = $1 WHERE id = $2 RETURNING *`,
      [JSON.stringify(scorecard), sessionId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to end interview', details: err.message });
  }
});

module.exports = router;