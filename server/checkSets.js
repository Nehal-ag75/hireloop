require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const r = await pool.query("SELECT title FROM problems WHERE title LIKE '%(Set 1)%' LIMIT 3");
  console.log('Set 1 count:', r.rows.length);
  r.rows.forEach(x => console.log(x.title));

  const r2 = await pool.query("SELECT title FROM problems WHERE title LIKE '%(Set 2)%' LIMIT 3");
  console.log('Set 2 count:', r2.rows.length);
  r2.rows.forEach(x => console.log(x.title));

  await pool.end();
}
run().catch(e => { console.error(e.message); process.exit(1); });