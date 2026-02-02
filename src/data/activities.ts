import { Activity, UserActivity, UserStats } from "@/types/activity";

export const activitiesData: Activity[] = [
  {
    id: "1",
    title: "Python Data Analysis Fundamentals",
    description: "Learn the basics of data analysis using Python, pandas, and numpy. This activity covers data manipulation, cleaning, and visualization techniques.",
    category: "Coding",
    difficulty: "Intermediate",
    durationMinutes: 45,
    xp: 50,
    skills: ["Python", "Pandas", "Data Analysis"],
    featured: true,
    steps: [
      { id: "1-1", title: "Introduction to Pandas", description: "Learn the basics of pandas library", completed: false },
      { id: "1-2", title: "Data Loading & Inspection", description: "Load and explore datasets", completed: false },
      { id: "1-3", title: "Data Cleaning", description: "Handle missing values and outliers", completed: false },
      { id: "1-4", title: "Data Visualization", description: "Create charts and graphs", completed: false },
    ],
  },
  {
    id: "2",
    title: "Aptitude Practice - Quantitative",
    description: "Sharpen your quantitative aptitude skills with practice problems covering percentages, ratios, and time-work problems.",
    category: "Skills",
    difficulty: "Easy",
    durationMinutes: 30,
    xp: 30,
    skills: ["Mathematics", "Problem Solving", "Aptitude"],
    steps: [
      { id: "2-1", title: "Percentages", description: "Solve percentage problems", completed: false },
      { id: "2-2", title: "Ratios & Proportions", description: "Master ratio concepts", completed: false },
      { id: "2-3", title: "Time & Work", description: "Solve time-work problems", completed: false },
    ],
  },
  {
    id: "3",
    title: "Machine Learning Research Paper Analysis",
    description: "Read and analyze a cutting-edge machine learning research paper. Understand the methodology, results, and implications.",
    category: "Reading",
    difficulty: "Advanced",
    durationMinutes: 60,
    xp: 75,
    skills: ["Machine Learning", "Research", "Critical Thinking"],
    featured: true,
    steps: [
      { id: "3-1", title: "Abstract & Introduction", description: "Understand the paper's goals", completed: false },
      { id: "3-2", title: "Methodology Review", description: "Analyze the approach used", completed: false },
      { id: "3-3", title: "Results Analysis", description: "Interpret the findings", completed: false },
      { id: "3-4", title: "Critical Summary", description: "Write your analysis", completed: false },
    ],
  },
  {
    id: "4",
    title: "Build a REST API with Node.js",
    description: "Create a fully functional REST API using Node.js and Express. Learn routing, middleware, and database integration.",
    category: "Projects",
    difficulty: "Intermediate",
    durationMinutes: 90,
    xp: 100,
    skills: ["Node.js", "Express", "API Design", "MongoDB"],
    steps: [
      { id: "4-1", title: "Project Setup", description: "Initialize Node.js project", completed: false },
      { id: "4-2", title: "Create Routes", description: "Define API endpoints", completed: false },
      { id: "4-3", title: "Add Middleware", description: "Implement authentication", completed: false },
      { id: "4-4", title: "Database Integration", description: "Connect to MongoDB", completed: false },
      { id: "4-5", title: "Testing", description: "Test API endpoints", completed: false },
    ],
  },
  {
    id: "5",
    title: "JavaScript ES6+ Features",
    description: "Master modern JavaScript features including arrow functions, destructuring, spread operators, and async/await.",
    category: "Coding",
    difficulty: "Easy",
    durationMinutes: 40,
    xp: 40,
    skills: ["JavaScript", "ES6", "Web Development"],
    steps: [
      { id: "5-1", title: "Arrow Functions", description: "Learn arrow function syntax", completed: false },
      { id: "5-2", title: "Destructuring", description: "Object and array destructuring", completed: false },
      { id: "5-3", title: "Spread & Rest", description: "Master spread operators", completed: false },
      { id: "5-4", title: "Async/Await", description: "Handle async operations", completed: false },
    ],
  },
  {
    id: "6",
    title: "System Design Fundamentals",
    description: "Learn the basics of system design including scalability, load balancing, caching, and database sharding.",
    category: "Research",
    difficulty: "Advanced",
    durationMinutes: 75,
    xp: 85,
    skills: ["System Design", "Architecture", "Scalability"],
    featured: true,
    steps: [
      { id: "6-1", title: "Scalability Concepts", description: "Horizontal vs vertical scaling", completed: false },
      { id: "6-2", title: "Load Balancing", description: "Distribution strategies", completed: false },
      { id: "6-3", title: "Caching Strategies", description: "Redis and memcached", completed: false },
      { id: "6-4", title: "Database Design", description: "Sharding and replication", completed: false },
    ],
  },
  {
    id: "7",
    title: "Git & GitHub Workflow",
    description: "Master version control with Git and collaborative workflows using GitHub. Learn branching, merging, and pull requests.",
    category: "Practice",
    difficulty: "Easy",
    durationMinutes: 35,
    xp: 35,
    skills: ["Git", "GitHub", "Version Control"],
    steps: [
      { id: "7-1", title: "Git Basics", description: "Init, add, commit, push", completed: false },
      { id: "7-2", title: "Branching", description: "Create and manage branches", completed: false },
      { id: "7-3", title: "Pull Requests", description: "Collaborate on GitHub", completed: false },
    ],
  },
  {
    id: "8",
    title: "React Hooks Deep Dive",
    description: "Master React hooks including useState, useEffect, useContext, useMemo, and custom hooks.",
    category: "Coding",
    difficulty: "Intermediate",
    durationMinutes: 55,
    xp: 60,
    skills: ["React", "Hooks", "Frontend"],
    steps: [
      { id: "8-1", title: "useState & useEffect", description: "Basic hooks", completed: false },
      { id: "8-2", title: "useContext", description: "Context API", completed: false },
      { id: "8-3", title: "useMemo & useCallback", description: "Performance optimization", completed: false },
      { id: "8-4", title: "Custom Hooks", description: "Build reusable hooks", completed: false },
    ],
  },
  {
    id: "9",
    title: "SQL Query Optimization",
    description: "Learn to write efficient SQL queries and understand query execution plans, indexes, and optimization techniques.",
    category: "Practice",
    difficulty: "Intermediate",
    durationMinutes: 50,
    xp: 55,
    skills: ["SQL", "Database", "Optimization"],
    steps: [
      { id: "9-1", title: "Query Basics Review", description: "SELECT, JOIN, GROUP BY", completed: false },
      { id: "9-2", title: "Indexing", description: "Create and use indexes", completed: false },
      { id: "9-3", title: "Execution Plans", description: "Analyze query plans", completed: false },
      { id: "9-4", title: "Optimization Techniques", description: "Best practices", completed: false },
    ],
  },
  {
    id: "10",
    title: "Technical Interview Prep",
    description: "Practice common technical interview questions including algorithms, data structures, and problem-solving patterns.",
    category: "Skills",
    difficulty: "Advanced",
    durationMinutes: 60,
    xp: 70,
    skills: ["Algorithms", "Data Structures", "Problem Solving"],
    steps: [
      { id: "10-1", title: "Arrays & Strings", description: "Common patterns", completed: false },
      { id: "10-2", title: "Linked Lists", description: "Pointer manipulation", completed: false },
      { id: "10-3", title: "Trees & Graphs", description: "Traversal algorithms", completed: false },
      { id: "10-4", title: "Dynamic Programming", description: "DP patterns", completed: false },
    ],
  },
];

// Mock user activity data
export const userActivitiesData: UserActivity[] = [
  {
    id: "ua-1",
    activityId: "1",
    status: "in_progress",
    progress: 50,
    completedSteps: ["1-1", "1-2"],
    startedAt: new Date(Date.now() - 86400000),
    xpEarned: 0,
  },
  {
    id: "ua-2",
    activityId: "5",
    status: "completed",
    progress: 100,
    completedSteps: ["5-1", "5-2", "5-3", "5-4"],
    startedAt: new Date(Date.now() - 172800000),
    completedAt: new Date(Date.now() - 86400000),
    xpEarned: 40,
  },
  {
    id: "ua-3",
    activityId: "7",
    status: "completed",
    progress: 100,
    completedSteps: ["7-1", "7-2", "7-3"],
    startedAt: new Date(Date.now() - 259200000),
    completedAt: new Date(Date.now() - 172800000),
    xpEarned: 35,
  },
];

export const userStatsData: UserStats = {
  totalXP: 1250,
  level: 8,
  activitiesCompleted: 24,
  currentStreak: 12,
  totalTimeSpent: 1840,
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 150) + 1;
};

export const getXPForNextLevel = (level: number): number => {
  return level * 150;
};

export const getCurrentLevelXP = (xp: number, level: number): number => {
  return xp - (level - 1) * 150;
};
