const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { getModel } = require('../config/gemini');
const Submission = require('../models/Submission');
const User = require('../models/User');

const router = express.Router();

const PROBLEMS = [
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3' }, { input: 's = "bbbbb"', output: '1' }],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    starterCode: { python: 'def lengthOfLongestSubstring(s: str) -> int:\n    pass', javascript: 'function lengthOfLongestSubstring(s) {\n  \n}', java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}' },
    testCases: [{ input: 'abcabcbb', expected: '3' }, { input: 'bbbbb', expected: '1' }],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Adobe', 'Bloomberg'],
  },
  {
    id: 'merge-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list.',
    examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100'],
    starterCode: { python: 'def mergeTwoLists(list1, list2):\n    pass', javascript: 'function mergeTwoLists(list1, list2) {\n  \n}', java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}' },
    testCases: [{ input: '[1,2,4]\n[1,3,4]', expected: '[1,1,2,3,4,4]' }],
    tags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Apple', 'Microsoft'],
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Hash Table',
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    starterCode: { python: 'def groupAnagrams(strs):\n    pass', javascript: 'function groupAnagrams(strs) {\n  \n}', java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}' },
    testCases: [{ input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Goldman Sachs', 'Uber'],
  },
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set).',
    examples: [{ input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    starterCode: { python: 'def subsets(nums):\n    pass', javascript: 'function subsets(nums) {\n  \n}', java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        \n    }\n}' },
    testCases: [{ input: '[1,2,3]', expected: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
    companies: ['Facebook', 'Google', 'Cisco'],
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [{ input: 'n = 2', output: '2' }, { input: 'n = 3', output: '3' }],
    constraints: ['1 <= n <= 45'],
    starterCode: { python: 'def climbStairs(n: int) -> int:\n    pass', javascript: 'function climbStairs(n) {\n  \n}', java: 'class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}' },
    testCases: [{ input: '2', expected: '2' }, { input: '3', expected: '3' }],
    tags: ['Math', 'DP', 'Memoization'],
    companies: ['Google', 'Adobe', 'Apple'],
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.',
    examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6'],
    starterCode: { python: 'def exist(board, word):\n    pass', javascript: 'function exist(board, word) {\n  \n}', java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        \n    }\n}' },
    testCases: [{ input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nABCCED', expected: 'true' }],
    tags: ['Array', 'Backtracking', 'Matrix'],
    companies: ['Microsoft', 'Twitter', 'Snapchat'],
  },
];

// GET /api/coding/problems
router.get('/problems', protect, async (req, res) => {
  const problems = PROBLEMS.map(p => ({ ...p, starterCode: undefined, testCases: undefined }));
  res.json({ success: true, problems });
});

// GET /api/coding/problems/:id
router.get('/problems/:id', protect, async (req, res) => {
  const problem = PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  res.json({ success: true, problem });
});

// POST /api/coding/run
router.post('/run', protect, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    const langMap = { python: 71, javascript: 63, java: 62, cpp: 54 };
    const langId = langMap[language] || 71;

    // Use Gemini to evaluate the solution if Judge0 key not set
    if (!process.env.JUDGE0_API_KEY || process.env.JUDGE0_API_KEY === 'your_judge0_api_key_here') {
      const model = getModel();
      const problem = PROBLEMS.find(p => p.id === problemId);
      const prompt = `Evaluate this ${language} solution for the problem "${problem?.title}":

Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON: { "status": "accepted|wrong_answer|error", "output": "<output>", "feedback": "<brief feedback>", "timeComplexity": "<O(n)>", "spaceComplexity": "<O(n)>" }
Return ONLY JSON.`;

      const result = await model.generateContent(prompt);
      const evaluation = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());
      return res.json({ success: true, ...evaluation });
    }

    const response = await axios.post(`${process.env.JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
      source_code: code,
      language_id: langId,
    }, {
      headers: {
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    });

    const { status, stdout, stderr, time, memory } = response.data;
    res.json({ success: true, status: status.description.toLowerCase().replace(' ', '_'), output: stdout || stderr, runtime: time, memoryUsed: memory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/coding/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    const model = getModel();
    const problem = PROBLEMS.find(p => p.id === problemId);

    const prompt = `Evaluate this ${language} solution for "${problem?.title}". Test against: ${JSON.stringify(problem?.testCases)}.

Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON: { "status": "accepted|wrong_answer|error", "passedTests": <number>, "totalTests": <number>, "score": <0-100>, "feedback": "<detailed feedback>", "timeComplexity": "<O(n)>", "spaceComplexity": "<O(n)>" }
Return ONLY JSON.`;

    const result = await model.generateContent(prompt);
    const evaluation = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem?.title || problemId,
      problemId,
      language,
      code,
      status: evaluation.status,
      score: evaluation.score,
    });

    if (evaluation.status === 'accepted') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { points: evaluation.score } });
    }

    res.json({ success: true, ...evaluation, submissionId: submission._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/coding/submissions
router.get('/submissions', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
