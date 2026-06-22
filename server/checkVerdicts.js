require('dotenv').config();
const pool = require('./db');

async function checkVerdicts() {
  try {
    const result = await pool.query(
      'SELECT DISTINCT verdict, COUNT(*) as count FROM attempts GROUP BY verdict ORDER BY count DESC'
    );
    console.log('=== DISTINCT VERDICT VALUES ===');
    console.log(result.rows);

    const total = await pool.query('SELECT COUNT(*) FROM attempts');
    console.log(`\nTotal rows in attempts table: ${total.rows[0].count}`);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

checkVerdicts();