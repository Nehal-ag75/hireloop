require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const cols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'problems' ORDER BY ordinal_position`);
  console.log('=== COLUMNS ===');
  cols.rows.forEach(r => console.log(r.column_name, '-', r.data_type));

  const row = await pool.query('SELECT * FROM problems LIMIT 1');
  console.log('\n=== SAMPLE ROW ===');
  console.log(JSON.stringify(row.rows[0], null, 2));

  await pool.end();
}
run().catch(e => { console.error(e.message); process.exit(1); });