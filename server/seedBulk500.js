require('dotenv').config();
const pool = require('./db');

const newProblems = [
  // ===== Math =====
  { title: "Palindrome Number", topic: "Math", difficulty: "Easy", companies: ["Amazon", "Infosys"], platform_link: "https://leetcode.com/problems/palindrome-number/" },
  { title: "Reverse Integer", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Apple"], platform_link: "https://leetcode.com/problems/reverse-integer/" },
  { title: "FizzBuzz", topic: "Math", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/fizz-buzz/" },
  { title: "Roman to Integer", topic: "Math", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/roman-to-integer/" },
  { title: "Integer to Roman", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/integer-to-roman/" },
  { title: "Pow(x, n)", topic: "Math", difficulty: "Medium", companies: ["Google", "Amazon"], platform_link: "https://leetcode.com/problems/powx-n/" },
  { title: "Sqrt(x)", topic: "Math", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/sqrtx/" },
  { title: "Excel Sheet Column Number", topic: "Math", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/excel-sheet-column-number/" },
  { title: "Happy Number", topic: "Math", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/happy-number/" },
  { title: "Count Primes", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/count-primes/" },
  { title: "Plus One", topic: "Math", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/plus-one/" },
  { title: "Multiply Strings", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/multiply-strings/" },
  { title: "Greatest Common Divisor of Strings", topic: "Math", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/greatest-common-divisor-of-strings/" },
  { title: "Power of Three", topic: "Math", difficulty: "Easy", companies: ["Google"], platform_link: "https://leetcode.com/problems/power-of-three/" },
  { title: "Factorial Trailing Zeroes", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/factorial-trailing-zeroes/" },
  { title: "Add Digits", topic: "Math", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/add-digits/" },
  { title: "Basic Calculator", topic: "Math", difficulty: "Hard", companies: ["Google", "Amazon"], platform_link: "https://leetcode.com/problems/basic-calculator/" },
  { title: "Basic Calculator II", topic: "Math", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/basic-calculator-ii/" },

  // ===== Recursion =====
  { title: "Fibonacci Number", topic: "Recursion", difficulty: "Easy", companies: ["TCS", "Infosys", "Wipro"], platform_link: "https://leetcode.com/problems/fibonacci-number/" },
  { title: "Climbing Stairs", topic: "Recursion", difficulty: "Easy", companies: ["Amazon", "Adobe"], platform_link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "Power of Two", topic: "Recursion", difficulty: "Easy", companies: ["Google"], platform_link: "https://leetcode.com/problems/power-of-two/" },
  { title: "Generate Parentheses", topic: "Recursion", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/generate-parentheses/" },
  { title: "Letter Combinations of a Phone Number", topic: "Recursion", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { title: "Subsets II", topic: "Recursion", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/subsets-ii/" },
  { title: "Combinations", topic: "Recursion", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/combinations/" },
  { title: "Sudoku Solver", topic: "Recursion", difficulty: "Hard", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/sudoku-solver/" },
  { title: "Remove Invalid Parentheses", topic: "Recursion", difficulty: "Hard", companies: ["Google", "Facebook"], platform_link: "https://leetcode.com/problems/remove-invalid-parentheses/" },

  // ===== Sorting =====
  { title: "Merge Sorted Array", topic: "Sorting", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/merge-sorted-array/" },
  { title: "Sort an Array", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/sort-an-array/" },
  { title: "Largest Number", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/largest-number/" },
  { title: "Sort Colors", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Facebook"], platform_link: "https://leetcode.com/problems/sort-colors/" },
  { title: "Meeting Rooms II", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/meeting-rooms-ii/" },
  { title: "Merge Intervals", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Apple", "Google"], platform_link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "H-Index", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/h-index/" },
  { title: "Kth Largest Element in an Array", topic: "Sorting", difficulty: "Medium", companies: ["Amazon", "Flipkart"], platform_link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Wiggle Sort II", topic: "Sorting", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/wiggle-sort-ii/" },

  // ===== Simulation =====
  { title: "Spiral Matrix", topic: "Simulation", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Oracle"], platform_link: "https://leetcode.com/problems/spiral-matrix/" },
  { title: "Spiral Matrix II", topic: "Simulation", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/spiral-matrix-ii/" },
  { title: "Game of Life", topic: "Simulation", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/game-of-life/" },
  { title: "Robot Bounded In Circle", topic: "Simulation", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/robot-bounded-in-circle/" },
  { title: "Zigzag Conversion", topic: "Simulation", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/zigzag-conversion/" },
  { title: "Rotate Image", topic: "Simulation", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/rotate-image/" },
  { title: "Pascal's Triangle", topic: "Simulation", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/pascals-triangle/" },
  { title: "Candy Crush", topic: "Simulation", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/candy-crush/" },

  // ===== Matrix =====
  { title: "Set Matrix Zeroes", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { title: "Search a 2D Matrix", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { title: "Search a 2D Matrix II", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
  { title: "Word Search", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/word-search/" },
  { title: "Rotting Oranges", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Zomato"], platform_link: "https://leetcode.com/problems/rotting-oranges/" },
  { title: "Number of Islands", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Zomato"], platform_link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Max Area of Island", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/max-area-of-island/" },
  { title: "Surrounded Regions", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/surrounded-regions/" },
  { title: "Valid Sudoku", topic: "Matrix", difficulty: "Medium", companies: ["Amazon", "Morgan Stanley"], platform_link: "https://leetcode.com/problems/valid-sudoku/" },

  // ===== Hashing =====
  { title: "Two Sum", topic: "Hashing", difficulty: "Easy", companies: ["Amazon", "TCS", "Wipro"], platform_link: "https://leetcode.com/problems/two-sum/" },
  { title: "Group Anagrams", topic: "Hashing", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Valid Anagram", topic: "Hashing", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/valid-anagram/" },
  { title: "Longest Consecutive Sequence", topic: "Hashing", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
  { title: "Subarray Sum Equals K", topic: "Hashing", difficulty: "Medium", companies: ["Amazon", "Swiggy", "Facebook"], platform_link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { title: "Isomorphic Strings", topic: "Hashing", difficulty: "Easy", companies: ["Amazon", "Adobe"], platform_link: "https://leetcode.com/problems/isomorphic-strings/" },
  { title: "Word Pattern", topic: "Hashing", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/word-pattern/" },
  { title: "Ransom Note", topic: "Hashing", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/ransom-note/" },
  { title: "First Unique Character in a String", topic: "Hashing", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
  { title: "Four Sum II", topic: "Hashing", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/4sum-ii/" },
  { title: "Insert Delete GetRandom O(1)", topic: "Hashing", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },

  // ===== Strings =====
  { title: "Longest Palindromic Substring", topic: "Strings", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Slice"], platform_link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { title: "Implement strStr()", topic: "Strings", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/implement-strstr/" },
  { title: "String to Integer (atoi)", topic: "Strings", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/string-to-integer-atoi/" },
  { title: "Longest Common Prefix", topic: "Strings", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/longest-common-prefix/" },
  { title: "Group Shifted Strings", topic: "Strings", difficulty: "Medium", companies: ["Google", "Facebook"], platform_link: "https://leetcode.com/problems/group-shifted-strings/" },
  { title: "Decode Ways", topic: "Strings", difficulty: "Medium", companies: ["Amazon", "Jupiter", "Facebook"], platform_link: "https://leetcode.com/problems/decode-ways/" },
  { title: "Text Justification", topic: "Strings", difficulty: "Hard", companies: ["Google", "Atlassian"], platform_link: "https://leetcode.com/problems/text-justification/" },
  { title: "Integer to English Words", topic: "Strings", difficulty: "Hard", companies: ["Amazon", "Microsoft", "Tower Research"], platform_link: "https://leetcode.com/problems/integer-to-english-words/" },
  { title: "Reverse Words in a String", topic: "Strings", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/reverse-words-in-a-string/" },
  { title: "Compare Version Numbers", topic: "Strings", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/compare-version-numbers/" },
  { title: "Encode and Decode Strings", topic: "Strings", difficulty: "Medium", companies: ["Google", "Facebook"], platform_link: "https://leetcode.com/problems/encode-and-decode-strings/" },
  { title: "Minimum Remove to Make Valid Parentheses", topic: "Strings", difficulty: "Medium", companies: ["Facebook", "Amazon"], platform_link: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/" },

  // ===== Design =====
  { title: "Design HashMap", topic: "Design", difficulty: "Easy", companies: ["Amazon", "Razorpay"], platform_link: "https://leetcode.com/problems/design-hashmap/" },
  { title: "Design HashSet", topic: "Design", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/design-hashset/" },
  { title: "Implement Queue using Stacks", topic: "Design", difficulty: "Easy", companies: ["Amazon", "Razorpay"], platform_link: "https://leetcode.com/problems/implement-queue-using-stacks/" },
  { title: "Implement Stack using Queues", topic: "Design", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/implement-stack-using-queues/" },
  { title: "Min Stack", topic: "Design", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/min-stack/" },
  { title: "LRU Cache", topic: "Design", difficulty: "Medium", companies: ["Amazon", "Apple", "Netflix"], platform_link: "https://leetcode.com/problems/lru-cache/" },
  { title: "LFU Cache", topic: "Design", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/lfu-cache/" },
  { title: "Design Twitter", topic: "Design", difficulty: "Medium", companies: ["Amazon", "Atlassian"], platform_link: "https://leetcode.com/problems/design-twitter/" },
  { title: "Design Underground System", topic: "Design", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/design-underground-system/" },
  { title: "Design Browser History", topic: "Design", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/design-browser-history/" },
  { title: "Time Based Key-Value Store", topic: "Design", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/time-based-key-value-store/" },
  { title: "Design Circular Queue", topic: "Design", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/design-circular-queue/" },
  { title: "All O`one Data Structure", topic: "Design", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/all-oone-data-structure/" },

  // ===== Arrays (deeper) =====
  { title: "Two Sum II - Input Array Is Sorted", topic: "Arrays", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { title: "Remove Duplicates from Sorted Array", topic: "Arrays", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  { title: "Majority Element", topic: "Arrays", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/majority-element/" },
  { title: "Rotate Array", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/rotate-array/" },
  { title: "Best Time to Buy and Sell Stock II", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" },
  { title: "Jump Game", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Walmart"], platform_link: "https://leetcode.com/problems/jump-game/" },
  { title: "Insert Interval", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/insert-interval/" },
  { title: "3Sum", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Google", "Meesho"], platform_link: "https://leetcode.com/problems/3sum/" },
  { title: "4Sum", topic: "Arrays", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/4sum/" },
  { title: "Next Permutation", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/next-permutation/" },
  { title: "Find First and Last Position of Element in Sorted Array", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
  { title: "Subarray Sums Divisible by K", topic: "Arrays", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/subarray-sums-divisible-by-k/" },
  { title: "Maximum Product Subarray", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Morgan Stanley", "JP Morgan"], platform_link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { title: "Find Peak Element", topic: "Arrays", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/find-peak-element/" },
  { title: "Summary Ranges", topic: "Arrays", difficulty: "Easy", companies: ["Google"], platform_link: "https://leetcode.com/problems/summary-ranges/" },
  { title: "Pivot Index", topic: "Arrays", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/find-pivot-index/" },

  // ===== Trees (deeper) =====
  { title: "Symmetric Tree", topic: "Trees", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/symmetric-tree/" },
  { title: "Same Tree", topic: "Trees", difficulty: "Easy", companies: ["Amazon", "Bloomberg"], platform_link: "https://leetcode.com/problems/same-tree/" },
  { title: "Path Sum", topic: "Trees", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/path-sum/" },
  { title: "Path Sum II", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Ola"], platform_link: "https://leetcode.com/problems/path-sum-ii/" },
  { title: "Binary Tree Right Side View", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { title: "Binary Tree Zigzag Level Order Traversal", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
  { title: "Flatten Binary Tree to Linked List", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
  { title: "Populating Next Right Pointers in Each Node", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
  { title: "Kth Smallest Element in a BST", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { title: "Convert Sorted Array to Binary Search Tree", topic: "Trees", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
  { title: "Delete Node in a BST", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/delete-node-in-a-bst/" },
  { title: "Count Complete Tree Nodes", topic: "Trees", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/count-complete-tree-nodes/" },
  { title: "Vertical Order Traversal of a Binary Tree", topic: "Trees", difficulty: "Hard", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" },
  { title: "House Robber III", topic: "Trees", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/house-robber-iii/" },
  { title: "Unique Binary Search Trees", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/unique-binary-search-trees/" },
  { title: "Recover Binary Search Tree", topic: "Trees", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/recover-binary-search-tree/" },

  // ===== Graphs (deeper) =====
  { title: "Flood Fill", topic: "Graphs", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/flood-fill/" },
  { title: "Walls and Gates", topic: "Graphs", difficulty: "Medium", companies: ["Google", "Facebook"], platform_link: "https://leetcode.com/problems/walls-and-gates/" },
  { title: "Is Graph Bipartite?", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/is-graph-bipartite/" },
  { title: "Redundant Connection", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/redundant-connection/" },
  { title: "Number of Connected Components in an Undirected Graph", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { title: "Cheapest Flights Within K Stops", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
  { title: "Reconstruct Itinerary", topic: "Graphs", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/reconstruct-itinerary/" },
  { title: "Evaluate Division", topic: "Graphs", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/evaluate-division/" },
  { title: "Minimum Height Trees", topic: "Graphs", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/minimum-height-trees/" },
  { title: "Critical Connections in a Network", topic: "Graphs", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/critical-connections-in-a-network/" },
  { title: "Swim in Rising Water", topic: "Graphs", difficulty: "Hard", companies: ["Google", "DE Shaw"], platform_link: "https://leetcode.com/problems/swim-in-rising-water/" },
  { title: "Path with Maximum Probability", topic: "Graphs", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/path-with-maximum-probability/" },
  { title: "Bus Routes", topic: "Graphs", difficulty: "Hard", companies: ["Google", "Ola"], platform_link: "https://leetcode.com/problems/bus-routes/" },

  // ===== DP (deeper) =====
  { title: "Min Cost Climbing Stairs", topic: "DP", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { title: "Maximal Square", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/maximal-square/" },
  { title: "Maximal Rectangle", topic: "DP", difficulty: "Hard", companies: ["Amazon", "Tower Research"], platform_link: "https://leetcode.com/problems/maximal-rectangle/" },
  { title: "Triangle", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/triangle/" },
  { title: "Minimum Path Sum", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/minimum-path-sum/" },
  { title: "Unique Paths II", topic: "DP", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/unique-paths-ii/" },
  { title: "Interleaving String", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/interleaving-string/" },
  { title: "Distinct Subsequences", topic: "DP", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/distinct-subsequences/" },
  { title: "Best Time to Buy and Sell Stock III", topic: "DP", difficulty: "Hard", companies: ["Amazon", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/" },
  { title: "Best Time to Buy and Sell Stock IV", topic: "DP", difficulty: "Hard", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/" },
  { title: "Best Time to Buy and Sell Stock with Cooldown", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { title: "Coin Change II", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/coin-change-ii/" },
  { title: "Target Sum", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/target-sum/" },
  { title: "Decode Ways II", topic: "DP", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/decode-ways-ii/" },
  { title: "Palindromic Substrings", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/palindromic-substrings/" },
  { title: "Longest Palindromic Subsequence", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/longest-palindromic-subsequence/" },
  { title: "Russian Doll Envelopes", topic: "DP", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/russian-doll-envelopes/" },
  { title: "Wildcard Matching", topic: "DP", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/wildcard-matching/" },
  { title: "Profitable Schemes", topic: "DP", difficulty: "Hard", companies: ["Jane Street", "DE Shaw"], platform_link: "https://leetcode.com/problems/profitable-schemes/" },
  { title: "Stone Game", topic: "DP", difficulty: "Medium", companies: ["Jane Street", "DE Shaw"], platform_link: "https://leetcode.com/problems/stone-game/" },
  { title: "Perfect Squares", topic: "DP", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/perfect-squares/" },
  { title: "Combination Sum IV", topic: "DP", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/combination-sum-iv/" },
  { title: "Integer Break", topic: "DP", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/integer-break/" },

  // ===== Linked List (deeper) =====
  { title: "Add Two Numbers", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/add-two-numbers/" },
  { title: "Copy List with Random Pointer", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft", "Facebook"], platform_link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { title: "Rotate List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/rotate-list/" },
  { title: "Swap Nodes in Pairs", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
  { title: "Reverse Nodes in k-Group", topic: "Linked List", difficulty: "Hard", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { title: "Partition List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/partition-list/" },
  { title: "Odd Even Linked List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/odd-even-linked-list/" },
  { title: "Intersection of Two Linked Lists", topic: "Linked List", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
  { title: "Palindrome Linked List", topic: "Linked List", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/palindrome-linked-list/" },
  { title: "Remove Duplicates from Sorted List II", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/" },
  { title: "Linked List Cycle II", topic: "Linked List", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/linked-list-cycle-ii/" },
  { title: "Flatten a Multilevel Doubly Linked List", topic: "Linked List", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/" },

  // ===== Binary Search (deeper) =====
  { title: "First Bad Version", topic: "Binary Search", difficulty: "Easy", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/first-bad-version/" },
  { title: "Search Insert Position", topic: "Binary Search", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/search-insert-position/" },
  { title: "Capacity To Ship Packages Within D Days", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
  { title: "Split Array Largest Sum", topic: "Binary Search", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/split-array-largest-sum/" },
  { title: "Find K Closest Elements", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/find-k-closest-elements/" },
  { title: "Search in Rotated Sorted Array II", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" },
  { title: "Single Element in a Sorted Array", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/single-element-in-a-sorted-array/" },
  { title: "Magnetic Force Between Two Balls", topic: "Binary Search", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/magnetic-force-between-two-balls/" },

  // ===== Stacks (deeper) =====
  { title: "Implement Stack using Arrays", topic: "Stacks", difficulty: "Easy", companies: ["TCS", "Infosys"], platform_link: "https://leetcode.com/problems/implement-stack-using-queues/" },
  { title: "Remove K Digits", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/remove-k-digits/" },
  { title: "Asteroid Collision", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/asteroid-collision/" },
  { title: "Decode String", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/decode-string/" },
  { title: "Next Greater Element I", topic: "Stacks", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/next-greater-element-i/" },
  { title: "Next Greater Element II", topic: "Stacks", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/next-greater-element-ii/" },
  { title: "Online Stock Span", topic: "Stacks", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/online-stock-span/" },
  { title: "Basic Calculator", topic: "Stacks", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/basic-calculator/" },
  { title: "Trapping Rain Water", topic: "Stacks", difficulty: "Hard", companies: ["Amazon", "Google", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/trapping-rain-water/" },

  // ===== Backtracking (deeper) =====
  { title: "Permutations II", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/permutations-ii/" },
  { title: "Combination Sum II", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/combination-sum-ii/" },
  { title: "Combination Sum III", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/combination-sum-iii/" },
  { title: "Restore IP Addresses", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/restore-ip-addresses/" },
  { title: "N-Queens II", topic: "Backtracking", difficulty: "Hard", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/n-queens-ii/" },
  { title: "Matchsticks to Square", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/matchsticks-to-square/" },
  { title: "Partition to K Equal Sum Subsets", topic: "Backtracking", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" },

  // ===== Greedy (deeper) =====
  { title: "Best Time to Buy and Sell Stock", topic: "Greedy", difficulty: "Easy", companies: ["Amazon", "Groww"], platform_link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Maximum Subarray", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Goldman Sachs"], platform_link: "https://leetcode.com/problems/maximum-subarray/" },
  { title: "Two City Scheduling", topic: "Greedy", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/two-city-scheduling/" },
  { title: "Queue Reconstruction by Height", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/queue-reconstruction-by-height/" },
  { title: "Valid Triangle Number", topic: "Greedy", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/valid-triangle-number/" },
  { title: "Reorganize String", topic: "Greedy", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/reorganize-string/" },

  // ===== Two Pointer (deeper) =====
  { title: "Move Zeroes", topic: "Two Pointer", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/move-zeroes/" },
  { title: "Backspace String Compare", topic: "Two Pointer", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/backspace-string-compare/" },
  { title: "Squares of a Sorted Array", topic: "Two Pointer", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/squares-of-a-sorted-array/" },
  { title: "Boats to Save People", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/boats-to-save-people/" },
  { title: "Partition Labels", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/partition-labels/" },
  { title: "Sort Array By Parity", topic: "Two Pointer", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/sort-array-by-parity/" },
  { title: "Dutch National Flag Problem", topic: "Two Pointer", difficulty: "Medium", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/sort-colors/" },

  // ===== Sliding Window (deeper) =====
  { title: "Max Consecutive Ones III", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
  { title: "Subarrays with K Different Integers", topic: "Sliding Window", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/subarrays-with-k-different-integers/" },
  { title: "Frequency of the Most Frequent Element", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/" },
  { title: "Longest Subarray of 1's After Deleting One Element", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/" },
  { title: "Maximum Points You Can Obtain from Cards", topic: "Sliding Window", difficulty: "Medium", companies: ["Amazon", "Slice"], platform_link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/" },

  // ===== Bit Manipulation (deeper) =====
  { title: "XOR Operation in an Array", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/xor-operation-in-an-array/" },
  { title: "Hamming Distance", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/hamming-distance/" },
  { title: "Binary Number with Alternating Bits", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/binary-number-with-alternating-bits/" },
  { title: "Subsets", topic: "Bit Manipulation", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/subsets/" },
  { title: "Gray Code", topic: "Bit Manipulation", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/gray-code/" },
  { title: "Find the Difference", topic: "Bit Manipulation", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/find-the-difference/" },

  // ===== Heap (deeper) =====
  { title: "Sort Characters By Frequency", topic: "Heap", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/sort-characters-by-frequency/" },
  { title: "Reorganize String", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/reorganize-string/" },
  { title: "Smallest Range Covering Elements from K Lists", topic: "Heap", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/" },
  { title: "Kth Smallest Element in a Sorted Matrix", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
  { title: "Meeting Rooms II", topic: "Heap", difficulty: "Medium", companies: ["Amazon", "Google", "Facebook"], platform_link: "https://leetcode.com/problems/meeting-rooms-ii/" },

  // ===== Tries (deeper) =====
  { title: "Longest Word in Dictionary", topic: "Tries", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/longest-word-in-dictionary/" },
  { title: "Stream of Characters", topic: "Tries", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/stream-of-characters/" },
  { title: "Maximum XOR of Two Numbers in an Array", topic: "Tries", difficulty: "Hard", companies: ["Google", "DE Shaw"], platform_link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },

  // ===== BFS/DFS (new topic) =====
  { title: "Binary Tree Level Order Traversal II", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
  { title: "Symmetric Tree", topic: "BFS/DFS", difficulty: "Easy", companies: ["Amazon", "Microsoft"], platform_link: "https://leetcode.com/problems/symmetric-tree/" },
  { title: "Minimum Depth of Binary Tree", topic: "BFS/DFS", difficulty: "Easy", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/minimum-depth-of-binary-tree/" },
  { title: "Rotting Oranges", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon", "Zomato"], platform_link: "https://leetcode.com/problems/rotting-oranges/" },
  { title: "01 Matrix", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/01-matrix/" },
  { title: "Open the Lock", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/open-the-lock/" },
  { title: "Shortest Bridge", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/shortest-bridge/" },
  { title: "All Paths From Source to Target", topic: "BFS/DFS", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/all-paths-from-source-to-target/" },

  // ===== Union Find (new topic) =====
  { title: "Number of Provinces", topic: "Union Find", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/number-of-provinces/" },
  { title: "Redundant Connection", topic: "Union Find", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/redundant-connection/" },
  { title: "Accounts Merge", topic: "Union Find", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/accounts-merge/" },
  { title: "Most Stones Removed with Same Row or Column", topic: "Union Find", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/" },
  { title: "Satisfiability of Equality Equations", topic: "Union Find", difficulty: "Medium", companies: ["Google"], platform_link: "https://leetcode.com/problems/satisfiability-of-equality-equations/" },
  { title: "Number of Islands II", topic: "Union Find", difficulty: "Hard", companies: ["Google"], platform_link: "https://leetcode.com/problems/number-of-islands-ii/" },

  // ===== Intervals (new topic) =====
  { title: "Merge Intervals", topic: "Intervals", difficulty: "Medium", companies: ["Amazon", "Google", "Apple"], platform_link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "Insert Interval", topic: "Intervals", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/insert-interval/" },
  { title: "Non-overlapping Intervals", topic: "Intervals", difficulty: "Medium", companies: ["Amazon", "Google", "Microsoft"], platform_link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { title: "Meeting Rooms", topic: "Intervals", difficulty: "Easy", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/meeting-rooms/" },
  { title: "Interval List Intersections", topic: "Intervals", difficulty: "Medium", companies: ["Amazon", "Facebook"], platform_link: "https://leetcode.com/problems/interval-list-intersections/" },
  { title: "Employee Free Time", topic: "Intervals", difficulty: "Hard", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/employee-free-time/" },

  // ===== Stacks & Queues (Monotonic, new topic) =====
  { title: "Daily Temperatures", topic: "Monotonic Stack", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/daily-temperatures/" },
  { title: "Largest Rectangle in Histogram", topic: "Monotonic Stack", difficulty: "Hard", companies: ["Amazon", "DE Shaw"], platform_link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { title: "Maximal Rectangle", topic: "Monotonic Stack", difficulty: "Hard", companies: ["Amazon", "Tower Research"], platform_link: "https://leetcode.com/problems/maximal-rectangle/" },
  { title: "Sum of Subarray Minimums", topic: "Monotonic Stack", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/sum-of-subarray-minimums/" },
  { title: "132 Pattern", topic: "Monotonic Stack", difficulty: "Medium", companies: ["Amazon"], platform_link: "https://leetcode.com/problems/132-pattern/" },

  // ===== Prefix Sum (new topic) =====
  { title: "Range Sum Query - Immutable", topic: "Prefix Sum", difficulty: "Easy", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/range-sum-query-immutable/" },
  { title: "Range Sum Query 2D - Immutable", topic: "Prefix Sum", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/range-sum-query-2d-immutable/" },
  { title: "Continuous Subarray Sum", topic: "Prefix Sum", difficulty: "Medium", companies: ["Amazon", "Google"], platform_link: "https://leetcode.com/problems/continuous-subarray-sum/" },
  { title: "Subarray Sum Equals K", topic: "Prefix Sum", difficulty: "Medium", companies: ["Amazon", "Swiggy"], platform_link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { title: "Product of Array Except Self", topic: "Prefix Sum", difficulty: "Medium", companies: ["Amazon", "Walmart"], platform_link: "https://leetcode.com/problems/product-of-array-except-self/" },
];

async function seedBulk() {
  console.log(`Seeding bulk batch of ${newProblems.length} problems...`);
  let added = 0;
  let updated = 0;
  let errors = 0;
  for (const p of newProblems) {
    try {
      const existing = await pool.query(
        'SELECT id FROM problems WHERE title = $1 AND topic = $2',
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
      errors++;
    }
  }
  console.log(`Done. Added: ${added} new problems, Updated: ${updated} existing problems, Errors: ${errors}.`);
  console.log(`Total in this batch: ${newProblems.length}`);

  const total = await pool.query('SELECT COUNT(*) FROM problems');
  console.log(`GRAND TOTAL problems in DB now: ${total.rows[0].count}`);

  await pool.end();
}

seedBulk();