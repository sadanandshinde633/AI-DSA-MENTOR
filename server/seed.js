import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "./models/Problem.js";

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Find two indices whose values add up to the target.",

    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],

    examples: [
      {
        input:
          "nums = [2,7,11,15], target = 9",

        output:
          "[0,1]"
      }
    ],

    starterCode:
`def solve(nums, target):
    pass`
  },

  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",

    description:
      "Determine whether brackets are balanced.",

    constraints: [
      "1 <= s.length <= 10^4"
    ],

    examples: [
      {
        input: "()[]{}",

        output: "true"
      }
    ],

    starterCode:
`def solve(s):
    pass`
  },

  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",

    description:
      "Search for a target element in a sorted array.",

    constraints: [
      "Array is sorted"
    ],

    examples: [
      {
        input:
          "nums=[1,2,3,4,5], target=4",

        output: "3"
      }
    ],

    starterCode:
`def solve(nums, target):
    pass`
  },

  {
    title: "Merge Intervals",
    difficulty: "Medium",
    topic: "Arrays",

    description:
      "Merge overlapping intervals.",

    constraints: [
      "1 <= intervals.length <= 10^4"
    ],

    examples: [
      {
        input:
          "[[1,3],[2,6],[8,10]]",

        output:
          "[[1,6],[8,10]]"
      }
    ],

    starterCode:
`def solve(intervals):
    pass`
  },

  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings",

    description:
      "Find the length of the longest substring without repeating characters.",

    constraints: [
      "0 <= s.length <= 5 * 10^4"
    ],

    examples: [
      {
        input:
          's = "abcabcbb"',

        output:
          "3"
      }
    ],

    starterCode:
`def solve(s):
    pass`
  },

  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",

    description:
      "Count connected islands in a grid.",

    constraints: [
      "1 <= m,n <= 300"
    ],

    examples: [
      {
        input:
          "grid = [['1','1'],['1','0']]",

        output:
          "1"
      }
    ],

    starterCode:
`def solve(grid):
    pass`
  },

  {
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graphs",

    description:
      "Determine whether all courses can be completed.",

    constraints: [
      "1 <= numCourses <= 2000"
    ],

    examples: [
      {
        input:
          "numCourses = 2, prerequisites = [[1,0]]",

        output:
          "true"
      }
    ],

    starterCode:
`def solve(numCourses, prerequisites):
    pass`
  },

  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees",

    description:
      "Find the maximum depth of a binary tree.",

    constraints: [
      "Number of nodes <= 10^4"
    ],

    examples: [
      {
        input:
          "[3,9,20,null,null,15,7]",

        output:
          "3"
      }
    ],

    starterCode:
`def solve(root):
    pass`
  },

  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",

    description:
      "Count distinct ways to reach the top.",

    constraints: [
      "1 <= n <= 45"
    ],

    examples: [
      {
        input:
          "n = 3",

        output:
          "3"
      }
    ],

    starterCode:
`def solve(n):
    pass`
  },

  {
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "Design",

    description:
      "Design and implement an LRU cache.",

    constraints: [
      "1 <= capacity <= 3000"
    ],

    examples: [
      {
        input:
          "LRUCache(2)",

        output:
          "Implementation Required"
      }
    ],

    starterCode:
`class LRUCache:
    pass`
  },
  {
  title: "Contains Duplicate",
  difficulty: "Easy",
  topic: "Arrays",
  description: "Determine if an array contains duplicate values.",
  constraints: ["1 <= nums.length <= 10^5"],
  examples: [{ input: "[1,2,3,1]", output: "true" }],
  starterCode: `def solve(nums):
    pass`
},

{
  title: "Maximum Subarray",
  difficulty: "Medium",
  topic: "Arrays",
  description: "Find the contiguous subarray with the largest sum.",
  constraints: ["1 <= nums.length <= 10^5"],
  examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
  starterCode: `def solve(nums):
    pass`
},

{
  title: "Product of Array Except Self",
  difficulty: "Medium",
  topic: "Arrays",
  description: "Return an array where each element is the product of all other elements.",
  constraints: ["n > 1"],
  examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
  starterCode: `def solve(nums):
    pass`
},

{
  title: "Merge Sorted Array",
  difficulty: "Easy",
  topic: "Arrays",
  description: "Merge two sorted arrays into one sorted array.",
  constraints: ["Arrays are sorted"],
  examples: [{ input: "[1,2,3],[2,5,6]", output: "[1,2,2,3,5,6]" }],
  starterCode: `def solve(nums1, nums2):
    pass`
},

{
  title: "Move Zeroes",
  difficulty: "Easy",
  topic: "Arrays",
  description: "Move all zeros to the end while maintaining order.",
  constraints: ["In-place preferred"],
  examples: [{ input: "[0,1,0,3,12]", output: "[1,3,12,0,0]" }],
  starterCode: `def solve(nums):
    pass`
},

{
  title: "Valid Anagram",
  difficulty: "Easy",
  topic: "Strings",
  description: "Check whether two strings are anagrams.",
  constraints: ["Only lowercase letters"],
  examples: [{ input: '"anagram","nagaram"', output: "true" }],
  starterCode: `def solve(s,t):
    pass`
},

{
  title: "Longest Common Prefix",
  difficulty: "Easy",
  topic: "Strings",
  description: "Find the longest common prefix among strings.",
  constraints: ["1 <= strs.length <= 200"],
  examples: [{ input: '["flower","flow","flight"]', output: '"fl"' }],
  starterCode: `def solve(strs):
    pass`
},

{
  title: "Reverse String",
  difficulty: "Easy",
  topic: "Strings",
  description: "Reverse a character array in-place.",
  constraints: ["In-place operation"],
  examples: [{ input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
  starterCode: `def solve(s):
    pass`
},

{
  title: "Palindrome Check",
  difficulty: "Easy",
  topic: "Strings",
  description: "Check whether a string is a palindrome.",
  constraints: ["Ignore spaces and punctuation"],
  examples: [{ input: '"A man a plan a canal Panama"', output: "true" }],
  starterCode: `def solve(s):
    pass`
},

{
  title: "Group Anagrams",
  difficulty: "Medium",
  topic: "Strings",
  description: "Group words that are anagrams.",
  constraints: ["1 <= strs.length <= 10^4"],
  examples: [{ input: '["eat","tea","tan","ate","nat","bat"]', output: "Grouped Lists" }],
  starterCode: `def solve(strs):
    pass`
},

{
  title: "Reverse Linked List",
  difficulty: "Easy",
  topic: "Linked List",
  description: "Reverse a singly linked list.",
  constraints: ["Iterative or recursive"],
  examples: [{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }],
  starterCode: `def solve(head):
    pass`
},

{
  title: "Middle of Linked List",
  difficulty: "Easy",
  topic: "Linked List",
  description: "Return the middle node of a linked list.",
  constraints: ["One pass preferred"],
  examples: [{ input: "[1,2,3,4,5]", output: "3" }],
  starterCode: `def solve(head):
    pass`
},

{
  title: "Linked List Cycle",
  difficulty: "Easy",
  topic: "Linked List",
  description: "Detect if a linked list contains a cycle.",
  constraints: ["O(1) space preferred"],
  examples: [{ input: "cycle exists", output: "true" }],
  starterCode: `def solve(head):
    pass`
},

{
  title: "Valid Parentheses",
  difficulty: "Easy",
  topic: "Stack",
  description: "Check if brackets are balanced.",
  constraints: ["Contains only brackets"],
  examples: [{ input: "()[]{}", output: "true" }],
  starterCode: `def solve(s):
    pass`
},

{
  title: "Min Stack",
  difficulty: "Medium",
  topic: "Stack",
  description: "Design a stack supporting getMin().",
  constraints: ["O(1) operations"],
  examples: [{ input: "push/pop", output: "min value" }],
  starterCode: `class MinStack:
    pass`
},

{
  title: "Implement Queue Using Stacks",
  difficulty: "Easy",
  topic: "Queue",
  description: "Implement queue using two stacks.",
  constraints: ["FIFO behavior"],
  examples: [{ input: "push,pop", output: "queue operations" }],
  starterCode: `class MyQueue:
    pass`
},

{
  title: "Binary Search",
  difficulty: "Easy",
  topic: "Binary Search",
  description: "Find target in sorted array.",
  constraints: ["Array sorted"],
  examples: [{ input: "[1,2,3,4,5],4", output: "3" }],
  starterCode: `def solve(nums,target):
    pass`
},

{
  title: "Search Insert Position",
  difficulty: "Easy",
  topic: "Binary Search",
  description: "Find insert position of target.",
  constraints: ["Sorted array"],
  examples: [{ input: "[1,3,5,6],5", output: "2" }],
  starterCode: `def solve(nums,target):
    pass`
},

{
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  topic: "Trees",
  description: "Find maximum depth of tree.",
  constraints: ["Nodes <= 10^4"],
  examples: [{ input: "[3,9,20,null,null,15,7]", output: "3" }],
  starterCode: `def solve(root):
    pass`
},

{
  title: "Same Tree",
  difficulty: "Easy",
  topic: "Trees",
  description: "Check whether two trees are identical.",
  constraints: ["Recursive solution allowed"],
  examples: [{ input: "[1,2,3],[1,2,3]", output: "true" }],
  starterCode: `def solve(p,q):
    pass`
},

{
  title: "Invert Binary Tree",
  difficulty: "Easy",
  topic: "Trees",
  description: "Invert a binary tree.",
  constraints: ["Recursive solution allowed"],
  examples: [{ input: "[4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
  starterCode: `def solve(root):
    pass`
},

{
  title: "Number of Islands",
  difficulty: "Medium",
  topic: "Graphs",
  description: "Count islands in a grid.",
  constraints: ["DFS/BFS"],
  examples: [{ input: "grid", output: "1" }],
  starterCode: `def solve(grid):
    pass`
},

{
  title: "Clone Graph",
  difficulty: "Medium",
  topic: "Graphs",
  description: "Create a deep copy of a graph.",
  constraints: ["Connected graph"],
  examples: [{ input: "graph", output: "cloned graph" }],
  starterCode: `def solve(node):
    pass`
},

{
  title: "Climbing Stairs",
  difficulty: "Easy",
  topic: "Dynamic Programming",
  description: "Count ways to reach the top.",
  constraints: ["1 <= n <= 45"],
  examples: [{ input: "3", output: "3" }],
  starterCode: `def solve(n):
    pass`
},

{
  title: "House Robber",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  description: "Find maximum amount that can be robbed.",
  constraints: ["No adjacent houses"],
  examples: [{ input: "[1,2,3,1]", output: "4" }],
  starterCode: `def solve(nums):
    pass`
},
];


const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    await Problem.deleteMany(
      {}
    );

    console.log(
      "Old problems removed"
    );

    await Problem.insertMany(
      problems
    );

    console.log(
      `${problems.length} problems inserted`
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedDatabase();