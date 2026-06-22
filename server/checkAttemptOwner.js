require('dotenv').config();
const pool = require('./db');

async function check() {
  try {
    const attempts = await pool.query(
      `SELECT a.id, a.user_id, a.problem_id, a.verdict, a.submitted_at, u.email
       FROM attempts a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.submitted_at DESC`
    );
    console.log('=== ALL ATTEMPTS ===');
    console.log(attempts.rows);

    const users = await pool.query('SELECT id, name, email FROM users ORDER BY id');
    console.log('\n=== ALL USERS ===');
    console.log(users.rows);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

check();