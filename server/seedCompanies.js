require('dotenv').config();
const pool = require('./db');

const newProblems = [
  // Apple
  { title: "Merge Intervals", topic: "Arrays", difficulty: "Medium", companies: ["Apple", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "LRU Cache", topic: "Design", difficulty: "Medium", companies: ["Apple", "Amazon", "Netflix"], platform_link: "https://leetcode.com/problems/lru-cache/" },
  { title: "Word Ladder", topic: "BFS", difficulty: "Hard", companies: ["Apple", "Amazon"], platform_link: "https://leetcode.com/problems/word-ladder/" },
  // Netflix
  { title: "Top K Frequent Elements", topic: "Heap", difficulty: "Medium", companies: ["Netflix", "Amazon", "Uber"], platform_link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { title: "Sliding Window Maximum", topic: "Sliding Window", difficulty: "Hard", companies: ["Netflix", "Google"], platform_link: "https://leetcode.com/problems/sliding-window-maximum/" },
  // Goldman Sachs
  { title: "Trapping Rain Water", topic: "Arrays", difficulty: "Hard", companies: ["Goldman Sachs", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Stock Buy and Sell II", topic: "Greedy", difficulty: "Medium", companies: ["Goldman Sachs", "Amazon"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" },
  // Flipkart
  { title: "Kth Largest Element", topic: "Heap", difficulty: "Medium", companies: ["Flipkart", "Google", "Amazon"], platform_link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", companies: ["Flipkart", "Microsoft"], platform_link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  // Paytm
  { title: "Coin Change", topic: "DP", difficulty: "Medium", companies: ["Paytm", "Amazon"], platform_link: "https://leetcode.com/problems/coin-change/" },
  { title: "Longest Common Subsequence", topic: "DP", difficulty: "Medium", companies: ["Paytm", "Google"], platform_link: "https://leetcode.com/problems/longest-common-subsequence/" },
  // Swiggy
  { title: "Find Median from Data Stream", topic: "Heap", difficulty: "Hard", companies: ["Swiggy", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { title: "Subarray Sum Equals K", topic: "Arrays", difficulty: "Medium", companies: ["Swiggy", "Facebook"], platform_link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  // Zomato
  { title: "Number of Islands", topic: "Graphs", difficulty: "Medium", companies: ["Zomato", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Rotting Oranges", topic: "BFS", difficulty: "Medium", companies: ["Zomato", "Amazon"], platform_link: "https://leetcode.com/problems/rotting-oranges/" },
  // Razorpay
  { title: "Design HashMap", topic: "Design", difficulty: "Easy", companies: ["Razorpay", "Amazon"], platform_link: "https://leetcode.com/problems/design-hashmap/" },
  { title: "Implement Queue using Stacks", topic: "Stacks", difficulty: "Easy", companies: ["Razorpay", "Microsoft"], platform_link: "https://leetcode.com/problems/implement-queue-using-stacks/" },
  // CRED
  { title: "Minimum Window Substring", topic: "Sliding Window", difficulty: "Hard", companies: ["CRED", "Google", "Amazon"], platform_link: "https://leetcode.com/problems/minimum-window-substring/" },
  { title: "Serialize and Deserialize Binary Tree", topic: "Trees", difficulty: "Hard", companies: ["CRED", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  // Infosys
  { title: "Palindrome Number", topic: "Math", difficulty: "Easy", companies: ["Infosys", "Google"], platform_link: "https://leetcode.com/problems/palindrome-number/" },
  { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", companies: ["Infosys", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/reverse-linked-list/" },
  // Salesforce
  { title: "Clone Graph", topic: "Graphs", difficulty: "Medium", companies: ["Salesforce", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/clone-graph/" },
  { title: "Course Schedule", topic: "Graphs", difficulty: "Medium", companies: ["Salesforce", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/course-schedule/" },
  // Oracle
  { title: "Find Duplicate Number", topic: "Arrays", difficulty: "Medium", companies: ["Oracle", "Amazon"], platform_link: "https://leetcode.com/problems/find-the-duplicate-number/" },
  { title: "Spiral Matrix", topic: "Arrays", difficulty: "Medium", companies: ["Oracle", "Microsoft", "Amazon"], platform_link: "https://leetcode.com/problems/spiral-matrix/" },
  // Walmart
  { title: "Product of Array Except Self", topic: "Arrays", difficulty: "Medium", companies: ["Walmart", "Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { title: "Jump Game", topic: "Greedy", difficulty: "Medium", companies: ["Walmart", "Amazon"], platform_link: "https://leetcode.com/problems/jump-game/" },
  // Atlassian
  { title: "Text Justification", topic: "Strings", difficulty: "Hard", companies: ["Atlassian", "Google"], platform_link: "https://leetcode.com/problems/text-justification/" },
  { title: "Design Twitter", topic: "Design", difficulty: "Medium", companies: ["Atlassian", "Amazon"], platform_link: "https://leetcode.com/problems/design-twitter/" },
  // Meesho
  { title: "3Sum", topic: "Arrays", difficulty: "Medium", companies: ["Meesho", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/3sum/" },
  { title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", companies: ["Meesho", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  // PhonePe
  { title: "Search in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", companies: ["PhonePe", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { title: "Find Minimum in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", companies: ["PhonePe", "Google"], platform_link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  // Ola
  { title: "Dijkstra Shortest Path", topic: "Graphs", difficulty: "Medium", companies: ["Ola", "Google", "Uber"], platform_link: "https://leetcode.com/problems/network-delay-time/" },
  { title: "Path Sum II", topic: "Trees", difficulty: "Medium", companies: ["Ola", "Amazon"], platform_link: "https://leetcode.com/problems/path-sum-ii/" },
  // Groww
  { title: "Best Time to Buy and Sell Stock", topic: "Arrays", difficulty: "Easy", companies: ["Groww", "Amazon", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "House Robber", topic: "DP", difficulty: "Medium", companies: ["Groww", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/house-robber/" },
  // Byju's
  { title: "Lowest Common Ancestor", topic: "Trees", difficulty: "Medium", companies: ["Byju's", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { title: "Diameter of Binary Tree", topic: "Trees", difficulty: "Easy", companies: ["Byju's", "Google"], platform_link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  // Dream11
  { title: "Combination Sum", topic: "Backtracking", difficulty: "Medium", companies: ["Dream11", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/combination-sum/" },
  { title: "Permutations", topic: "Backtracking", difficulty: "Medium", companies: ["Dream11", "Microsoft"], platform_link: "https://leetcode.com/problems/permutations/" },
  // Nutanix
  { title: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", companies: ["Nutanix", "Google", "Amazon"], platform_link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { title: "Regular Expression Matching", topic: "DP", difficulty: "Hard", companies: ["Nutanix", "Google"], platform_link: "https://leetcode.com/problems/regular-expression-matching/" },
  // Qualcomm
  { title: "Single Number", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Qualcomm", "Amazon"], platform_link: "https://leetcode.com/problems/single-number/" },
  { title: "Power of Two", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Qualcomm", "Google"], platform_link: "https://leetcode.com/problems/power-of-two/" },
  // TCS / Wipro / Capgemini / Infosys
  { title: "Fibonacci Number", topic: "DP", difficulty: "Easy", companies: ["TCS", "Infosys", "Wipro", "Capgemini"], platform_link: "https://leetcode.com/problems/fibonacci-number/" },
  { title: "Two Sum", topic: "Arrays", difficulty: "Easy", companies: ["TCS", "Wipro", "Capgemini", "Amazon"], platform_link: "https://leetcode.com/problems/two-sum/" },
  { title: "Linked List Cycle", topic: "Linked List", difficulty: "Easy", companies: ["TCS", "Infosys", "Wipro"], platform_link: "https://leetcode.com/problems/linked-list-cycle/" },
  // Morgan Stanley / JP Morgan
  { title: "Maximum Product Subarray", topic: "DP", difficulty: "Medium", companies: ["Morgan Stanley", "JP Morgan", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { title: "Valid Sudoku", topic: "Arrays", difficulty: "Medium", companies: ["Morgan Stanley", "JP Morgan"], platform_link: "https://leetcode.com/problems/valid-sudoku/" },
   // DE Shaw
  { title: "Largest Rectangle in Histogram", topic: "Stacks", difficulty: "Hard", companies: ["DE Shaw", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { title: "Maximum Flow Network", topic: "Graphs", difficulty: "Hard", companies: ["DE Shaw"], platform_link: "https://leetcode.com/problems/max-flow/" },
  { title: "Count of Smaller Numbers After Self", topic: "Arrays", difficulty: "Hard", companies: ["DE Shaw", "Google"], platform_link: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
  { title: "Burst Balloons", topic: "DP", difficulty: "Hard", companies: ["DE Shaw", "Google"], platform_link: "https://leetcode.com/problems/burst-balloons/" },
  { title: "Minimum Cost to Hire K Workers", topic: "Heap", difficulty: "Hard", companies: ["DE Shaw"], platform_link: "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/" },

  // Sprinklr
  { title: "Design Search Autocomplete System", topic: "Design", difficulty: "Hard", companies: ["Sprinklr", "Google"], platform_link: "https://leetcode.com/problems/design-search-autocomplete-system/" },
  { title: "Word Break II", topic: "DP", difficulty: "Hard", companies: ["Sprinklr", "Amazon", "Google"], platform_link: "https://leetcode.com/problems/word-break-ii/" },
  { title: "Alien Dictionary", topic: "Graphs", difficulty: "Hard", companies: ["Sprinklr", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/alien-dictionary/" },

  // Tower Research
  { title: "Sliding Window Median", topic: "Sliding Window", difficulty: "Hard", companies: ["Tower Research", "DE Shaw"], platform_link: "https://leetcode.com/problems/sliding-window-median/" },
  { title: "Integer to English Words", topic: "Math", difficulty: "Hard", companies: ["Tower Research", "Microsoft", "Amazon"], platform_link: "https://leetcode.com/problems/integer-to-english-words/" },
  { title: "Maximal Rectangle", topic: "Stacks", difficulty: "Hard", companies: ["Tower Research", "Amazon"], platform_link: "https://leetcode.com/problems/maximal-rectangle/" },

  // Optiver
  { title: "Minimum Number of Arrows to Burst Balloons", topic: "Greedy", difficulty: "Medium", companies: ["Optiver", "Amazon"], platform_link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
  { title: "Candy", topic: "Greedy", difficulty: "Hard", companies: ["Optiver", "Amazon"], platform_link: "https://leetcode.com/problems/candy/" },
  { title: "IPO", topic: "Heap", difficulty: "Hard", companies: ["Optiver", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/ipo/" },

  // Jane Street
  { title: "Nim Game", topic: "Math", difficulty: "Easy", companies: ["Jane Street"], platform_link: "https://leetcode.com/problems/nim-game/" },
  { title: "Stone Game", topic: "DP", difficulty: "Medium", companies: ["Jane Street", "DE Shaw"], platform_link: "https://leetcode.com/problems/stone-game/" },
  { title: "Cat and Mouse", topic: "Graphs", difficulty: "Hard", companies: ["Jane Street"], platform_link: "https://leetcode.com/problems/cat-and-mouse/" },
  { title: "Profitable Schemes", topic: "DP", difficulty: "Hard", companies: ["Jane Street", "DE Shaw"], platform_link: "https://leetcode.com/problems/profitable-schemes/" },

  // Navi
  { title: "Partition Equal Subset Sum", topic: "DP", difficulty: "Medium", companies: ["Navi", "Amazon"], platform_link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { title: "Pacific Atlantic Water Flow", topic: "Graphs", difficulty: "Medium", companies: ["Navi", "Google"], platform_link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },

  // Slice
  { title: "Maximum Points You Can Obtain from Cards", topic: "Sliding Window", difficulty: "Medium", companies: ["Slice", "Amazon"], platform_link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/" },
  { title: "Longest Palindromic Substring", topic: "DP", difficulty: "Medium", companies: ["Slice", "Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/longest-palindromic-substring/" },

  // Jupiter
  { title: "Find All Anagrams in a String", topic: "Sliding Window", difficulty: "Medium", companies: ["Jupiter", "Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
  { title: "Decode Ways", topic: "DP", difficulty: "Medium", companies: ["Jupiter", "Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/decode-ways/" },h
  
];

async function seedCompanies() {
  console.log('Seeding new company-tagged problems...');
  let added = 0;
  let updated = 0;

  for (const p of newProblems) {
    try {
      const existing = await pool.query(
        'SELECT id FROM problems WHERE title = $1',
        [p.title]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE problems 
           SET companies = (
             SELECT array_agg(DISTINCT elem) 
             FROM unnest(companies || $1::text[]) AS elem
           )
           WHERE title = $2`,
          [p.companies, p.title]
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
      console.error(`Error on "${p.title}":`, err.message);
    }
  }

  console.log(`Done. Added: ${added} new problems, Updated: ${updated} existing problems.`);
  await pool.end();
}

seedCompanies();