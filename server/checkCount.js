require('dotenv').config();
const pool = require('./db');

pool.query("SELECT COUNT(*) FROM problems WHERE topic = 'Data Structures & Algorithms'")
  .then(r => { console.log('Count:', r.rows[0].count); process.exit(); })
  .catch(e => { console.error(e.message); process.exit(1); });