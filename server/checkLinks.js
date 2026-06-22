require('dotenv').config();
const pool = require('./db');

pool.query("SELECT title, platform_link FROM problems LIMIT 5")
  .then(r => { r.rows.forEach(x => console.log(x.title, '->', x.platform_link)); process.exit(); })
  .catch(e => { console.error(e.message); process.exit(1); });