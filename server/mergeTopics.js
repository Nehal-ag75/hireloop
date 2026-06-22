require('dotenv').config();
const pool = require('./db');

// Canonical name <- variants to merge into it
const merges = {
  'Dynamic Programming': ['DP'],
  'Two Pointers': ['Two Pointer'],
  'Graphs': ['BFS', 'BFS/DFS'],
};

async function mergeTopics() {
  console.log('Merging duplicate topic names...\n');
  try {
    for (const [canonical, variants] of Object.entries(merges)) {
      for (const variant of variants) {
        const result = await pool.query(
          'UPDATE problems SET topic = $1 WHERE topic = $2',
          [canonical, variant]
        );
        console.log(`"${variant}" -> "${canonical}": ${result.rowCount} rows updated`);
      }
    }

    // Also normalize prerequisite_topic references to use canonical names
    for (const [canonical, variants] of Object.entries(merges)) {
      for (const variant of variants) {
        const result = await pool.query(
          'UPDATE problems SET prerequisite_topic = $1 WHERE prerequisite_topic = $2',
          [canonical, variant]
        );
        if (result.rowCount > 0) {
          console.log(`prerequisite_topic "${variant}" -> "${canonical}": ${result.rowCount} rows updated`);
        }
      }
    }

    console.log('\n=== Topics after merge ===');
    const after = await pool.query(
      'SELECT DISTINCT topic, prerequisite_topic FROM problems ORDER BY topic'
    );
    console.log(after.rows);

    const countResult = await pool.query('SELECT COUNT(DISTINCT topic) FROM problems');
    console.log(`\nDistinct topics now: ${countResult.rows[0].count}`);

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

mergeTopics();