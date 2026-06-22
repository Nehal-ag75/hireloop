require('dotenv').config();
const pool = require('./db');

async function testRoadmap() {
  try {
    // Simulate what the route does, step by step, to find where it breaks
    console.log('Step 1: Fetching all problems...');
    const problemsResult = await pool.query('SELECT * FROM problems');
    const allProblems = problemsResult.rows;
    console.log(`  -> Found ${allProblems.length} problems`);

    console.log('\nStep 2: Building topic list...');
    const topics = [...new Set(allProblems.map((p) => p.topic))];
    console.log(`  -> Found ${topics.length} distinct topics:`, topics);

    console.log('\nStep 3: Building prerequisite map...');
    const prerequisiteMap = {};
    allProblems.forEach((p) => {
      prerequisiteMap[p.topic] = p.prerequisite_topic;
    });
    console.log('  -> prerequisiteMap:', prerequisiteMap);

    console.log('\nStep 4: Loading topologicalSort helper...');
    const topologicalSort = require('./helpers/topologicalSort');
    console.log('  -> typeof topologicalSort:', typeof topologicalSort);

    console.log('\nStep 5: Running topologicalSort on all topics (known_topics = [])...');
    const sortedTopics = topologicalSort(topics, prerequisiteMap);
    console.log('  -> sortedTopics:', sortedTopics);
    console.log('  -> sortedTopics.length:', sortedTopics ? sortedTopics.length : 'undefined/null!');

  } catch (err) {
    console.error('\n!!! ERROR AT SOME STEP !!!');
    console.error(err);
  } finally {
    await pool.end();
  }
}

testRoadmap();