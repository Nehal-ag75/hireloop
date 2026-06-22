require('dotenv').config();
const pool = require('./db');

const newProblems = [
  // ===== Greedy =====
  { title: "Assign Cookies", topic: "Greedy", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/assign-cookies/" },
  { title: "Lemonade Change", topic: "Greedy", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/lemonade-change/" },
  { title: "Gas Station", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/gas-station/" },
  { title: "Jump Game II", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/jump-game-ii/" },
  { title: "Partition Labels", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/partition-labels/" },
  { title: "Non-overlapping Intervals", topic: "Greedy", difficulty: "Medium", companies: ["Google", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { title: "Task Scheduler", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Facebook", "Google"], platform_link: "https://leetcode.com/problems/task-scheduler/" },
  { title: "Boats to Save People", topic: "Greedy", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/boats-to-save-people/" },
  { title: "Candy", topic: "Greedy", difficulty: "Hard", companies: ["Google", "Optiver"], platform_link: "https://leetcode.com/problems/candy/" },
  { title: "Minimum Number of Arrows to Burst Balloons", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Optiver"], platform_link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },

  // ===== Two Pointer =====
  { title: "Valid Palindrome", topic: "Two Pointer", difficulty: "Easy", companies: ["Microsoft", "Facebook"], platform_link: "https://leetcode.com/problems/valid-palindrome/" },
  { title: "Two Sum II - Input Array Is Sorted", topic: "Two Pointer", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { title: "Container With Most Water", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/container-with-most-water/" },
  { title: "3Sum Closest", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/3sum-closest/" },
  { title: "Sort Colors", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Facebook"], platform_link: "https://leetcode.com/problems/sort-colors/" },
  { title: "Remove Duplicates from Sorted Array II", topic: "Two Pointer", difficulty: "Medium", companies: ["Microsoft"], platform_link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/" },
  { title: "Trapping Rain Water", topic: "Two Pointer", difficulty: "Hard", companies: ["Amazon", "Google", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/trapping-rain-water/" },

  // ===== Sliding Window =====
  { title: "Maximum Average Subarray I", topic: "Sliding Window", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/maximum-average-subarray-i/" },
  { title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Google", "Meesho"], platform_link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "Longest Repeating Character Replacement", topic: "Sliding Window", difficulty: "Medium", companies: ["Google", "Amazon"], platform_link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { title: "Permutation in String", topic: "Sliding Window", difficulty: "Medium", companies: ["Microsoft", "Amazon"], platform_link: "https://leetcode.com/problems/permutation-in-string/" },
  { title: "Find All Anagrams in a String", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Jupiter", "Facebook"], platform_link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
  { title: "Fruit Into Baskets", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/fruit-into-baskets/" },
  { title: "Minimum Size Subarray Sum", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
  { title: "Sliding Window Maximum", topic: "Sliding Window", difficulty: "Hard", companies: ["Amazon", "Google", "Netflix"], platform_link: "https://leetcode.com/problems/sliding-window-maximum/" },
  { title: "Minimum Window Substring", topic: "Sliding Window", difficulty: "Hard", companies: ["Amazon", "Google", "CRED"], platform_link: "https://leetcode.com/problems/minimum-window-substring/" },

  // ===== Bit Manipulation =====
  { title: "Single Number", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon", "Qualcomm"], platform_link: "https://leetcode.com/problems/single-number/" },
  { title: "Number of 1 Bits", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Apple", "Microsoft"], platform_link: "https://leetcode.com/problems/number-of-1-bits/" },
  { title: "Counting Bits", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/counting-bits/" },
  { title: "Missing Number", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/missing-number/" },
  { title: "Reverse Bits", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Apple"], platform_link: "https://leetcode.com/problems/reverse-bits/" },
  { title: "Power of Two", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Qualcomm", "Google"], platform_link: "https://leetcode.com/problems/power-of-two/" },
  { title: "Single Number II", topic: "Bit Manipulation", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/single-number-ii/" },
  { title: "Sum of Two Integers", topic: "Bit Manipulation", difficulty: "Medium", companies: ["Facebook"], platform_link: "https://leetcode.com/problems/sum-of-two-integers/" },
  { title: "Bitwise AND of Numbers Range", topic: "Bit Manipulation", difficulty: "Medium", companies: ["Qualcomm"], platform_link: "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
  { title: "Maximum XOR of Two Numbers in an Array", topic: "Bit Manipulation", difficulty: "Hard", companies: ["Google", "DE Shaw"], platform_link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },

  // ===== Heaps =====
  { title: "Kth Largest Element in a Stream", topic: "Heap", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { title: "Last Stone Weight", topic: "Heap", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/last-stone-weight/" },
  { title: "Kth Largest Element in an Array", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Google", "Flipkart"], platform_link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Top K Frequent Elements", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Netflix", "Uber"], platform_link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { title: "K Closest Points to Origin", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { title: "Task Scheduler", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/task-scheduler/" },
  { title: "Design Twitter", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Atlassian"], platform_link: "https://leetcode.com/problems/design-twitter/" },
  { title: "Find Median from Data Stream", topic: "Heap", difficulty: "Hard", companies: ["Amazon", "Google", "Swiggy"], platform_link: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { title: "IPO", topic: "Heap", difficulty: "Hard", companies: ["Goldman Sachs", "Optiver"], platform_link: "https://leetcode.com/problems/ipo/" },
  { title: "Minimum Cost to Hire K Workers", topic: "Heap", difficulty: "Hard", companies: ["DE Shaw"], platform_link: "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/" },

  // ===== Tries =====
  { title: "Implement Trie (Prefix Tree)", topic: "Tries", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { title: "Design Add and Search Words Data Structure", topic: "Tries", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { title: "Replace Words", topic: "Tries", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/replace-words/" },
  { title: "Map Sum Pairs", topic: "Tries", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/map-sum-pairs/" },
  { title: "Word Search II", topic: "Tries", difficulty: "Hard", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/word-search-ii/" },
  { title: "Design Search Autocomplete System", topic: "Tries", difficulty: "Hard", companies: ["Google", "Sprinklr"], platform_link: "https://leetcode.com/problems/design-search-autocomplete-system/" },
  { title: "Palindrome Pairs", topic: "Tries", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/palindrome-pairs/" },

  // ===== Arrays (filling gaps) =====
  { title: "Best Time to Buy and Sell Stock", topic: "Arrays", difficulty: "Easy", companies: ["Amazon", "Groww"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Contains Duplicate", topic: "Arrays", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/contains-duplicate/" },
  { title: "Product of Array Except Self", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Walmart", "Facebook"], platform_link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { title: "Maximum Subarray", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/maximum-subarray/" },
  { title: "Merge Intervals", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Google", "Apple"], platform_link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "Spiral Matrix", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Oracle"], platform_link: "https://leetcode.com/problems/spiral-matrix/" },
  { title: "Rotate Image", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/rotate-image/" },
  { title: "Set Matrix Zeroes", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { title: "First Missing Positive", topic: "Arrays", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/first-missing-positive/" },

  // ===== Trees (filling gaps) =====
  { title: "Maximum Depth of Binary Tree", topic: "Trees", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { title: "Invert Binary Tree", topic: "Trees", difficulty: "Easy", companies: ["Google", "Amazon"], platform_link: "https://leetcode.com/problems/invert-binary-tree/" },
  { title: "Diameter of Binary Tree", topic: "Trees", difficulty: "Easy", companies: ["Byju's", "Google"], platform_link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  { title: "Validate Binary Search Tree", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Facebook"], platform_link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Flipkart"], platform_link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { title: "Lowest Common Ancestor of a Binary Tree", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Byju's"], platform_link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { title: "Construct Binary Tree from Preorder and Inorder Traversal", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { title: "Binary Tree Maximum Path Sum", topic: "Trees", difficulty: "Hard", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { title: "Serialize and Deserialize Binary Tree", topic: "Trees", difficulty: "Hard", companies: ["Amazon", "Google", "CRED"], platform_link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // ===== Graphs (filling gaps) =====
  { title: "Number of Islands", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Zomato"], platform_link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Clone Graph", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google", "Salesforce"], platform_link: "https://leetcode.com/problems/clone-graph/" },
  { title: "Course Schedule", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google", "Salesforce"], platform_link: "https://leetcode.com/problems/course-schedule/" },
  { title: "Course Schedule II", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/course-schedule-ii/" },
  { title: "Pacific Atlantic Water Flow", topic: "Graphs", difficulty: "Medium", companies: ["Navi", "Google"], platform_link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { title: "Graph Valid Tree", topic: "Graphs", difficulty: "Medium", companies: ["Google", "Zomato"], platform_link: "https://leetcode.com/problems/graph-valid-tree/" },
  { title: "Network Delay Time", topic: "Graphs", difficulty: "Medium", companies: ["Ola", "Google", "Uber"], platform_link: "https://leetcode.com/problems/network-delay-time/" },
  { title: "Word Ladder", topic: "Graphs", difficulty: "Hard", companies: ["Apple", "Amazon"], platform_link: "https://leetcode.com/problems/word-ladder/" },
  { title: "Alien Dictionary", topic: "Graphs", difficulty: "Hard", companies: ["Google", "Facebook", "Sprinklr"], platform_link: "https://leetcode.com/problems/alien-dictionary/" },

  // ===== DP (filling gaps) =====
  { title: "Climbing Stairs", topic: "DP", difficulty: "Easy", companies: ["Amazon", "Adobe"], platform_link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "House Robber", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google", "Groww"], platform_link: "https://leetcode.com/problems/house-robber/" },
  { title: "Coin Change", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Paytm"], platform_link: "https://leetcode.com/problems/coin-change/" },
  { title: "Longest Increasing Subsequence", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { title: "Longest Common Subsequence", topic: "DP", difficulty: "Medium", companies: ["Google", "Paytm"], platform_link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { title: "Word Break", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/word-break/" },
  { title: "Partition Equal Subset Sum", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Navi"], platform_link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { title: "Unique Paths", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Google"], platform_link: "https://leetcode.com/problems/unique-paths/" },
  { title: "Edit Distance", topic: "DP", difficulty: "Hard", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/edit-distance/" },
  { title: "Regular Expression Matching", topic: "DP", difficulty: "Hard", companies: ["Google", "Nutanix"], platform_link: "https://leetcode.com/problems/regular-expression-matching/" },
  { title: "Burst Balloons", topic: "DP", difficulty: "Hard", companies: ["Google", "DE Shaw"], platform_link: "https://leetcode.com/problems/burst-balloons/" },

  // ===== Backtracking =====
  { title: "Subsets", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/subsets/" },
  { title: "Combination Sum", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Google", "Dream11"], platform_link: "https://leetcode.com/problems/combination-sum/" },
  { title: "Permutations", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Dream11"], platform_link: "https://leetcode.com/problems/permutations/" },
  { title: "Word Search", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/word-search/" },
  { title: "Palindrome Partitioning", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { title: "N-Queens", topic: "Backtracking", difficulty: "Hard", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/n-queens/" },

  // ===== Linked List (filling gaps) =====
  { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", companies: ["Amazon", "Microsoft", "Infosys"], platform_link: "https://leetcode.com/problems/reverse-linked-list/" },
  { title: "Linked List Cycle", topic: "Linked List", difficulty: "Easy", companies: ["Amazon", "TCS"], platform_link: "https://leetcode.com/problems/linked-list-cycle/" },
  { title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { title: "Reorder List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/reorder-list/" },
  { title: "Remove Nth Node From End of List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { title: "LRU Cache", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Apple", "Netflix"], platform_link: "https://leetcode.com/problems/lru-cache/" },
  { title: "Merge K Sorted Lists", topic: "Linked List", difficulty: "Hard", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/merge-k-sorted-lists/" },

  // ===== Binary Search =====
  { title: "Binary Search", topic: "Binary Search", difficulty: "Easy", companies: ["Google", "Amazon", "PhonePe"], platform_link: "https://leetcode.com/problems/binary-search/" },
  { title: "Search in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "Microsoft", "PhonePe"], platform_link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { title: "Find Minimum in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "PhonePe"], platform_link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { title: "Koko Eating Bananas", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/koko-eating-bananas/" },
  { title: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", companies: ["Amazon", "Google", "Nutanix"], platform_link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // ===== Stacks =====
  { title: "Valid Parentheses", topic: "Stacks", difficulty: "Easy", companies: ["Amazon", "Google", "Paytm"], platform_link: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Min Stack", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/min-stack/" },
  { title: "Evaluate Reverse Polish Notation", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { title: "Daily Temperatures", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/daily-temperatures/" },
  { title: "Largest Rectangle in Histogram", topic: "Stacks", difficulty: "Hard", companies: ["Amazon", "Google", "DE Shaw"], platform_link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
   
];

async function seedTopics() {
  console.log('Seeding expanded topic coverage...');
  let added = 0;
  let updated = 0;
  for (const p of newProblems) {
    try {
      const existing = await pool.query(
        'SELECT id, companies FROM problems WHERE title = $1 AND topic = $2',
        [p.title, p.topic]
      );
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE problems
           SET companies = (
             SELECT array_agg(DISTINCT elem)
             FROM unnest(companies || $1::text[]) AS elem
           )
           WHERE title = $2 AND topic = $3`,
          [p.companies, p.title, p.topic]
        );
        updated++;
      } else {
        await pool.query(
          `INSERT INTO problems (title, topic, difficulty, companies, platform_link)
           VALUES ($1, $2, $3, $4, $5)`,
          [p.title, p.topic, p.difficulty, p.companies, p.platform_link]
        );
        added++;
      }
    } catch (err) {
      console.error(`Error on "${p.title}" (${p.topic}):`, err.message);
    }
  }
  console.log(`Done. Added: ${added} new problems, Updated: ${updated} existing problems.`);
  console.log(`Total in this batch: ${newProblems.length}`);
  await pool.end();
}

seedTopics();