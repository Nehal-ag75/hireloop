require('dotenv').config();
const pool = require('./db');

async function inspect() {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('=== TABLES ===');
    console.log(tables.rows.map(r => r.table_name));

    for (const t of tables.rows) {
      const cols = await pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
        [t.table_name]
      );
      console.log(`\n=== ${t.table_name} ===`);
      console.log(cols.rows);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

inspect();