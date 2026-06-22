require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
const attemptsRoutes = require('./routes/attempts');
const aiRoutes = require('./routes/ai');
const interviewRoutes = require('./routes/interview');
const resumeRoutes = require('./routes/resume');
const companiesRoutes = require('./routes/companies');
const statsRoutes = require('./routes/stats');




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hireloop backend is running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ dbConnected: true, currentTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ dbConnected: false, error: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/attempts', attemptsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});