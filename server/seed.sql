INSERT INTO problems (title, topic, difficulty, platform_link, companies, prerequisite_topic) VALUES
-- Arrays (no prerequisite — foundational topic)
('Two Sum', 'Arrays', 'Easy', 'https://leetcode.com/problems/two-sum', ARRAY['Google', 'Amazon', 'Microsoft'], NULL),
('Best Time to Buy and Sell Stock', 'Arrays', 'Easy', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock', ARRAY['Amazon', 'Facebook'], NULL),
('Maximum Subarray', 'Arrays', 'Medium', 'https://leetcode.com/problems/maximum-subarray', ARRAY['Google', 'Microsoft'], NULL),

-- Two Pointers (prerequisite: Arrays)
('Container With Most Water', 'Two Pointers', 'Medium', 'https://leetcode.com/problems/container-with-most-water', ARRAY['Google', 'Amazon'], 'Arrays'),
('3Sum', 'Two Pointers', 'Medium', 'https://leetcode.com/problems/3sum', ARRAY['Amazon', 'Microsoft'], 'Arrays'),

-- Sliding Window (prerequisite: Two Pointers)
('Longest Substring Without Repeating Characters', 'Sliding Window', 'Medium', 'https://leetcode.com/problems/longest-substring-without-repeating-characters', ARRAY['Google', 'Amazon'], 'Two Pointers'),
('Minimum Window Substring', 'Sliding Window', 'Hard', 'https://leetcode.com/problems/minimum-window-substring', ARRAY['Google', 'Facebook'], 'Two Pointers'),

-- Recursion (no prerequisite — foundational)
('Climbing Stairs', 'Recursion', 'Easy', 'https://leetcode.com/problems/climbing-stairs', ARRAY['Amazon', 'Adobe'], NULL),
('Generate Parentheses', 'Recursion', 'Medium', 'https://leetcode.com/problems/generate-parentheses', ARRAY['Google', 'Microsoft'], NULL),

-- Dynamic Programming (prerequisite: Recursion)
('House Robber', 'Dynamic Programming', 'Medium', 'https://leetcode.com/problems/house-robber', ARRAY['Google', 'Amazon'], 'Recursion'),
('Longest Increasing Subsequence', 'Dynamic Programming', 'Medium', 'https://leetcode.com/problems/longest-increasing-subsequence', ARRAY['Microsoft', 'Google'], 'Recursion'),
('Coin Change', 'Dynamic Programming', 'Medium', 'https://leetcode.com/problems/coin-change', ARRAY['Amazon', 'Uber'], 'Recursion'),

-- Trees (no prerequisite — foundational)
('Maximum Depth of Binary Tree', 'Trees', 'Easy', 'https://leetcode.com/problems/maximum-depth-of-binary-tree', ARRAY['Amazon', 'Microsoft'], NULL),
('Validate Binary Search Tree', 'Trees', 'Medium', 'https://leetcode.com/problems/validate-binary-search-tree', ARRAY['Google', 'Facebook'], NULL),

-- Graphs (prerequisite: Trees)
('Number of Islands', 'Graphs', 'Medium', 'https://leetcode.com/problems/number-of-islands', ARRAY['Google', 'Amazon', 'Microsoft'], 'Trees'),
('Course Schedule', 'Graphs', 'Medium', 'https://leetcode.com/problems/course-schedule', ARRAY['Google', 'Facebook'], 'Trees'),
('Clone Graph', 'Graphs', 'Medium', 'https://leetcode.com/problems/clone-graph', ARRAY['Amazon', 'Microsoft'], 'Trees'),

-- Binary Search (no prerequisite — foundational)
('Binary Search', 'Binary Search', 'Easy', 'https://leetcode.com/problems/binary-search', ARRAY['Google', 'Amazon'], NULL),
('Search in Rotated Sorted Array', 'Binary Search', 'Medium', 'https://leetcode.com/problems/search-in-rotated-sorted-array', ARRAY['Google', 'Microsoft', 'Amazon'], NULL);