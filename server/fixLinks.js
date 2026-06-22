require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Strict map containing only the core problem titles and their exact LeetCode slugs
const officialSlugs = {
    'longest valid parentheses': 'longest-valid-parentheses',
    'longest substring without repeating characters': 'longest-substring-without-repeating-characters',
    'longest substring without repeating': 'longest-substring-without-repeating-characters',
    'container with most water': 'container-with-most-water',
    '3sum': '3sum',
    'three sum': '3sum',
    '4sum': '4sum',
    'four sum': '4sum',
    'two sum': 'two-sum',
    '2sum': 'two-sum',
    'remove nth node from end of linked list': 'remove-nth-node-from-end-of-linked-list',
    'remove nth node': 'remove-nth-node-from-end-of-linked-list',
    'merge k sorted lists': 'merge-k-sorted-lists',
    'reverse nodes in k-group': 'reverse-nodes-in-k-group',
    'reverse nodes in k group': 'reverse-nodes-in-k-group',
    'trapping rain water': 'trapping-rain-water',
    'valid parentheses': 'valid-parentheses',
    'merge two sorted lists': 'merge-two-sorted-lists',
    'top k frequent elements': 'top-k-frequent-elements',
    'product of array except self': 'product-of-array-except-self',
    'longest consecutive sequence': 'longest-consecutive-sequence',
    'valid palindrome': 'valid-palindrome',
    'longest palindromic substring': 'longest-palindromic-substring',
    'reverse linked list': 'reverse-linked-list',
    'linked list cycle': 'linked-list-cycle',
    'subsets': 'subsets',
    'permutations': 'permutations',
    'climbing stairs': 'climbing-stairs',
    'coin change': 'coin-change',
    'edit distance': 'edit-distance'
};

async function fixAllLinks() {
    try {
        console.log('Connecting to PostgreSQL database...');
        // 1. Fetch ALL rows from the problems table
        const res = await pool.query('SELECT id, title FROM problems');
        const rows = res.rows;
        
        console.log(`Matching and updating paths for ${rows.length} rows...`);
        
        for (let row of rows) {
            const lowerTitle = row.title.toLowerCase();
            let matchedSlug = null;
            
            // 2. Look for an exact match of the core problem name within the title string
            for (const [keyword, slug] of Object.entries(officialSlugs)) {
                if (lowerTitle.includes(keyword)) {
                    matchedSlug = slug;
                    break;
                }
            }
            
            // 3. Only run the update statement if a clean official slug is found
            if (matchedSlug) {
                const cleanUrl = `https://leetcode.com/problems/${matchedSlug}`;
                await pool.query('UPDATE problems SET platform_link = $1 WHERE id = $2', [cleanUrl, row.id]);
            }
        }
        
        console.log('SUCCESS: All database paths have been cleanly updated!');
    } catch (err) {
        console.error('Execution Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

fixAllLinks();