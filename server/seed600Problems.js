const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hireloop'
});

const TOPIC = 'Data Structures & Algorithms';
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const DSA_TEMPLATES = [
  'Two Sum Variant with Sliding Window',
  'Longest Substring Without Repeating Characters',
  'Container With Most Water Optimization',
  '3Sum Target Triplets Verification',
  'Remove Nth Node From End of Linked List',
  'Merge K Sorted Lists efficiently',
  'Reverse Nodes in K-Group',
  'Trapping Rain Water Spatial Maxima',
  'Valid Parentheses Multi-bracket Stack',
  'Longest Valid Parentheses Depth Calculation',
  'Evaluate Reverse Polish Notation Stack Engine',
  'Sliding Window Maximum Deque Optimization',
  'Top K Frequent Elements Bucket Sort',
  'Find Minimum in Rotated Sorted Array',
  'Search in Rotated Sorted Array II',
  'Median of Two Sorted Arrays Binary Search',
  'Binary Tree Maximum Path Sum Subtree',
  'Serialize and Deserialize Binary Tree Framework',
  'Construct Binary Tree from Preorder and Inorder Traversal',
  'Lowest Common Ancestor of a Binary Tree',
  'Word Ladder Shortest Transformation Sequence',
  'Number of Islands Grid DFS Grid Parsing',
  'Clone Graph Deep Copy Traversal',
  'Course Schedule II Topological Sort',
  'Longest Increasing Subsequence Memoization',
  'Edit Distance Dynamic Programming Matrix',
  'Coin Change Minimum Coin Combinations',
  'Partition Equal Subset Sum Knapsack Variant',
  'Merge Intervals Boundary Processing',
  'Non-overlapping Intervals Greedy Elimination',
  'Subsets Power Set Backtracking Array',
  'Permutations Recursive State Generation',
  'Word Search II Trie-based Backtracking Matrix',
  'Implement Trie (Prefix Tree) Data Structure',
  'Maximum Subarray Sum Kadane Vector',
  'Kth Largest Element in an Array Min-Heap',
  'Find Median from Data Stream Two-Heap Pattern',
  'Counting Bits Popcount Bitwise Shift Matrix',
  'Reverse Bits Unsigned Integer Mutation',
  'Single Number Xor Operator Masking'
];

async function seedProblems() {
  console.log('🧹 Purging all non-DSA topics and compiling fresh records...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Wipes out old records so only the incoming DSA questions will exist
    await client.query('TRUNCATE TABLE problems RESTART IDENTITY CASCADE;');

    let problemCounter = 0;
    const batchSize = 100;
    let queryValues = [];
    
    for (let i = 1; i <= 620; i++) {
      const difficulty = DIFFICULTIES[i % DIFFICULTIES.length];
      const template = DSA_TEMPLATES[i % DSA_TEMPLATES.length];

      const title = `${template} (Set ${Math.ceil(i / DSA_TEMPLATES.length)}) #${i}`;
      const platformLink = `https://leetcode.com/problems/custom-mock-id-${i}`;

      queryValues.push(title, TOPIC, difficulty, platformLink);
      problemCounter++;

      if (problemCounter % batchSize === 0 || i === 620) {
        const placeholders = [];
        for (let b = 0; b < queryValues.length / 4; b++) {
          placeholders.push(`($${b * 4 + 1}, $${b * 4 + 2}, $${b * 4 + 3}, $${b * 4 + 4})`);
        }

        const insertQuery = `
          INSERT INTO problems (title, topic, difficulty, platform_link)
          VALUES ${placeholders.join(', ')}
          ON CONFLICT DO NOTHING;
        `;

        await client.query(insertQuery, queryValues);
        queryValues = [];
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Success! Table cleared and populated with ${problemCounter} pure DSA problems.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database seeding aborted due to error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedProblems();