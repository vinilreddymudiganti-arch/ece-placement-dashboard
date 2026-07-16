"use client";


import ProfileCard from "../components/profile/ProfileCard";

import React, { useState, useEffect } from "react";

import {
  Flame,
  Calendar,
  ListTodo,
  Code2,
  Cpu,
  BookOpen,
  GraduationCap,
  Award,
  PenSquare,
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  BrainCircuit,
  Compass,
  FileText,
  UserCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, Badge, ProgressBar, Dialog } from "../components/ui-components";

// Types for Task Dashboard
interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'DSA' | 'ECE' | 'Aptitude' | 'Other';
}

// Types for DSA Tracker
interface DsaProblem {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  link?: string;
}

interface DsaTopic {
  id: string;
  name: string;
  problems: DsaProblem[];
}

// Types for Core ECE Roadmap
interface EceSubTopic {
  id: string;
  name: string;
  completed: boolean;
  importance: 'High' | 'Medium' | 'Low';
}

interface EceTopic {
  id: string;
  name: string;
  subTopics: EceSubTopic[];
}

// Types for Daily Study Planner
interface TimeSlot {
  time: string;
  task: string;
  category: 'dsa' | 'ece' | 'aptitude' | 'break' | 'empty';
}

// Types for CGPA Tracker
interface SemesterCGPA {
  semester: number;
  cgpa: number;
  active: boolean;
}

// Types for AI Chat Messages
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function PlacementDashboard() {
  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(5);
  const [countdownDate, setCountdownDate] = useState('2026-09-01');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Today's Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('DSA');

  // DSA Tracker State
  const [dsaTopics, setDsaTopics] = useState<DsaTopic[]>([]);
  const [selectedDsaTopic, setSelectedDsaTopic] = useState<DsaTopic | null>(null);

  // ECE Roadmap State
  const [eceRoadmap, setEceRoadmap] = useState<EceTopic[]>([]);
  const [selectedEceTopic, setSelectedEceTopic] = useState<EceTopic | null>(null);

  // Daily Study Planner State
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [editingSlotText, setEditingSlotText] = useState('');
  const [editingSlotCategory, setEditingSlotCategory] = useState<TimeSlot['category']>('empty');

  // CGPA Tracker State
  const [semesters, setSemesters] = useState<SemesterCGPA[]>([]);
  const [targetCgpa, setTargetCgpa] = useState<number>(8.5);

  // Notes State
  const [notes, setNotes] = useState({
    interview: '• Focus on Setup & Hold time equations in sequential logic.\n• Review OSI model vs TCP/IP layer protocols.\n• Solve at least 2 Leetcode medium problems daily.',
    formulas: '• MOSFET ID (Sat) = 1/2 * μn * Cox * (W/L) * (VGS - Vth)^2\n• Setup Time: Tc - Tcq - Tcomb >= Ts\n• Nyquist Rate: fs >= 2 * fmax',
    general: 'Prepare resume emphasizing the Embedded VLSI micro-project.'
  });
  const [activeNoteTab, setActiveNoteTab] = useState<'interview' | 'formulas' | 'general'>('interview');

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  // --- INITIALIZATION & LOCAL STORAGE ---
  useEffect(() => {
    setMounted(true);

    // Initial Load from LocalStorage or default fallback data
    const storedTasks = localStorage.getItem('ece_tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      const defaultTasks: Task[] = [
        { id: '1', text: 'Solve 3 problems on Sliding Window', completed: false, category: 'DSA' },
        { id: '2', text: 'Revise Setup and Hold time configurations', completed: true, category: 'ECE' },
        { id: '3', text: 'Take a 30-min Aptitude Quantitative Test', completed: false, category: 'Aptitude' },
        { id: '4', text: 'Refine CV Embedded Projects description', completed: false, category: 'Other' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('ece_tasks', JSON.stringify(defaultTasks));
    }

    const storedStreak = localStorage.getItem('ece_streak');
    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }

    const storedDsa = localStorage.getItem('ece_dsa');
    if (storedDsa) {
      setDsaTopics(JSON.parse(storedDsa));
    } else {
      const defaultDsa: DsaTopic[] = [
        {
          id: 'dsa-1',
          name: 'Arrays & Hashing',
          problems: [
            { id: 'p1', name: 'Two Sum', difficulty: 'Easy', solved: true },
            { id: 'p2', name: 'Valid Anagram', difficulty: 'Easy', solved: true },
            { id: 'p3', name: 'Group Anagrams', difficulty: 'Medium', solved: false },
            { id: 'p4', name: 'Top K Frequent Elements', difficulty: 'Medium', solved: false },
          ]
        },
        {
          id: 'dsa-2',
          name: 'Two Pointers & Sliding Window',
          problems: [
            { id: 'p5', name: 'Valid Palindrome', difficulty: 'Easy', solved: true },
            { id: 'p6', name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', solved: false },
            { id: 'p7', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', solved: false },
            { id: 'p8', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', solved: false },
          ]
        },
        {
          id: 'dsa-3',
          name: 'Trees & Graphs',
          problems: [
            { id: 'p9', name: 'Invert Binary Tree', difficulty: 'Easy', solved: false },
            { id: 'p10', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', solved: false },
            { id: 'p11', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', solved: false },
            { id: 'p12', name: 'Number of Islands (BFS/DFS)', difficulty: 'Medium', solved: false },
          ]
        },
        {
          id: 'dsa-4',
          name: 'Dynamic Programming',
          problems: [
            { id: 'p13', name: 'Climbing Stairs', difficulty: 'Easy', solved: false },
            { id: 'p14', name: 'Min Cost Climbing Stairs', difficulty: 'Easy', solved: false },
            { id: 'p15', name: 'Coin Change', difficulty: 'Medium', solved: false },
            { id: 'p16', name: 'Longest Common Subsequence', difficulty: 'Medium', solved: false },
          ]
        }
      ];
      setDsaTopics(defaultDsa);
      localStorage.setItem('ece_dsa', JSON.stringify(defaultDsa));
    }

    const storedEce = localStorage.getItem('ece_roadmap');
    if (storedEce) {
      setEceRoadmap(JSON.parse(storedEce));
    } else {
      const defaultEce: EceTopic[] = [
        {
          id: 'ece-1',
          name: 'Digital Design & Verilog',
          subTopics: [
            { id: 'es1', name: 'K-Maps & Combinational Circuits', completed: true, importance: 'High' },
            { id: 'es2', name: 'Setup & Hold Time, Clock Skew/Jitter', completed: false, importance: 'High' },
            { id: 'es3', name: 'Verilog Blocking vs Non-Blocking', completed: false, importance: 'Medium' },
            { id: 'es4', name: 'Finite State Machine (FSM) Design', completed: false, importance: 'High' },
          ]
        },
        {
          id: 'ece-2',
          name: 'VLSI & Analog Circuits',
          subTopics: [
            { id: 'es5', name: 'MOSFET Operation & IV Curves', completed: true, importance: 'High' },
            { id: 'es6', name: 'CMOS Inverter Characteristics (VTC)', completed: false, importance: 'High' },
            { id: 'es7', name: 'Op-Amp Circuits & Negative Feedback', completed: false, importance: 'Medium' },
            { id: 'es8', name: 'Static Timing Analysis (STA)', completed: false, importance: 'High' },
          ]
        },
        {
          id: 'ece-3',
          name: 'Embedded Systems & Microprocessors',
          subTopics: [
            { id: 'es9', name: '8085/8086 Architecture & Interrupts', completed: false, importance: 'Medium' },
            { id: 'es10', name: 'UART, I2C, SPI Communication Protocols', completed: false, importance: 'High' },
            { id: 'es11', name: 'Timers, PWM, and ADC Integration', completed: false, importance: 'Medium' },
            { id: 'es12', name: 'Real-Time Operating Systems (RTOS) basics', completed: false, importance: 'High' },
          ]
        },
        {
          id: 'ece-4',
          name: 'Computer Science Core',
          subTopics: [
            { id: 'es13', name: 'Process Synchronization & Semaphores', completed: false, importance: 'High' },
            { id: 'es14', name: 'Paging, Segmentation, and Virtual Memory', completed: false, importance: 'High' },
            { id: 'es15', name: 'TCP/IP Handshake, IP Addressing & Subnets', completed: false, importance: 'Medium' },
            { id: 'es16', name: 'DBMS Indexing & SQL Queries', completed: false, importance: 'Medium' },
          ]
        }
      ];
      setEceRoadmap(defaultEce);
      localStorage.setItem('ece_roadmap', JSON.stringify(defaultEce));
    }

    const storedPlanner = localStorage.getItem('ece_planner');
    if (storedPlanner) {
      setTimeSlots(JSON.parse(storedPlanner));
    } else {
      const defaultPlanner: TimeSlot[] = [
        { time: '08:00 AM - 10:00 AM', task: 'DSA Sliding Window Practice', category: 'dsa' },
        { time: '10:00 AM - 11:00 AM', task: 'Breakfast & Rest', category: 'break' },
        { time: '11:00 AM - 01:00 PM', task: 'Revise Digital Flip-Flops & Setup Time', category: 'ece' },
        { time: '01:00 PM - 02:00 PM', task: 'Lunch', category: 'break' },
        { time: '02:00 PM - 04:00 PM', task: 'VLSI MOSFET & CMOS VTC Curves', category: 'ece' },
        { time: '04:00 PM - 05:00 PM', task: 'Evening break & walk', category: 'break' },
        { time: '05:00 PM - 06:30 PM', task: 'Aptitude test & logic revision', category: 'aptitude' },
        { time: '06:30 PM - 08:30 PM', task: 'C++ OOPs and OS Threading revision', category: 'dsa' },
        { time: '08:30 PM - 09:30 PM', task: 'Dinner', category: 'break' },
        { time: '09:30 PM - 10:30 PM', task: 'Formula compilation & Notes logging', category: 'ece' },
      ];
      setTimeSlots(defaultPlanner);
      localStorage.setItem('ece_planner', JSON.stringify(defaultPlanner));
    }

    const storedCgpa = localStorage.getItem('ece_cgpa_semesters');
    if (storedCgpa) {
      setSemesters(JSON.parse(storedCgpa));
    } else {
      const defaultCgpa: SemesterCGPA[] = [
        { semester: 1, cgpa: 8.2, active: true },
        { semester: 2, cgpa: 8.4, active: true },
        { semester: 3, cgpa: 8.6, active: true },
        { semester: 4, cgpa: 8.3, active: true },
        { semester: 5, cgpa: 8.7, active: true },
        { semester: 6, cgpa: 8.9, active: true },
        { semester: 7, cgpa: 0, active: false },
        { semester: 8, cgpa: 0, active: false },
      ];
      setSemesters(defaultCgpa);
      localStorage.setItem('ece_cgpa_semesters', JSON.stringify(defaultCgpa));
    }

    const storedTargetCgpa = localStorage.getItem('ece_target_cgpa');
    if (storedTargetCgpa) {
      setTargetCgpa(parseFloat(storedTargetCgpa));
    }

    const storedNotes = localStorage.getItem('ece_notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }

    // Default chat introduction
    setChatMessages([
      {
        id: '1',
        sender: 'ai',
        text: 'Hello! I am your personal **ECE Placement AI Coach**. 🎓🔌\n\nI can help you review core concepts in **VLSI, Digital Systems, Microcontrollers, OS/Networks**, or debug **DSA logic**. What are we practicing today?\n\n*Try asking about: "Setup/Hold time equations", "CMOS inverter VTC", "DP coin change strategy", or "Mock interview question".*',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const target = new Date(`${countdownDate}T00:00:00`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 100); // Tenth of second display or just seconds
        setCountdown({
          days: d,
          hours: h,
          minutes: m,
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownDate, mounted]);

  // Save changes wrapper
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- ACTIONS ---

  // Streak Booster trigger
  const triggerStreakJoy = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('ece_streak', newStreak.toString());
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#a855f7', '#ec4899', '#10b981', '#f97316']
    });
  };

  // Task Handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      category: newTaskCategory,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    setNewTaskText('');
    saveToLocal('ece_tasks', updated);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed && tasks.filter(x => !x.completed).length === 1) {
          // Trigger confetti on all tasks completed
          confetti({
            particleCount: 50,
            spread: 60,
            colors: ['#10b981', '#3b82f6']
          });
        }
        return { ...t, completed };
      }
      return t;
    });
    setTasks(updated);
    saveToLocal('ece_tasks', updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToLocal('ece_tasks', updated);
  };

  // DSA Tracker Handlers
  const handleToggleDsaProblem = (topicId: string, problemId: string) => {
    const updated = dsaTopics.map(topic => {
      if (topic.id === topicId) {
        const updatedProblems = topic.problems.map(prob => {
          if (prob.id === problemId) {
            const solved = !prob.solved;
            // Confetti check for topic completion
            const otherUnsolved = topic.problems.filter(p => p.id !== problemId && !p.solved).length;
            if (solved && otherUnsolved === 0) {
              confetti({
                particleCount: 80,
                spread: 80,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#a855f7', '#3b82f6']
              });
            }
            return { ...prob, solved };
          }
          return prob;
        });
        return { ...topic, problems: updatedProblems };
      }
      return topic;
    });
    setDsaTopics(updated);
    saveToLocal('ece_dsa', updated);

    // Sync selected topic if it's currently open
    if (selectedDsaTopic && selectedDsaTopic.id === topicId) {
      const refreshedTopic = updated.find(t => t.id === topicId);
      if (refreshedTopic) setSelectedDsaTopic(refreshedTopic);
    }
  };

  // ECE Roadmap Handlers
  const handleToggleEceSubTopic = (topicId: string, subTopicId: string) => {
    const updated = eceRoadmap.map(topic => {
      if (topic.id === topicId) {
        const updatedSubs = topic.subTopics.map(sub => {
          if (sub.id === subTopicId) {
            const completed = !sub.completed;
            const otherUncompleted = topic.subTopics.filter(s => s.id !== subTopicId && !s.completed).length;
            if (completed && otherUncompleted === 0) {
              confetti({
                particleCount: 80,
                spread: 80,
                colors: ['#10b981', '#f97316']
              });
            }
            return { ...sub, completed };
          }
          return sub;
        });
        return { ...topic, subTopics: updatedSubs };
      }
      return topic;
    });
    setEceRoadmap(updated);
    saveToLocal('ece_roadmap', updated);

    // Sync selected topic
    if (selectedEceTopic && selectedEceTopic.id === topicId) {
      const refreshedTopic = updated.find(t => t.id === topicId);
      if (refreshedTopic) setSelectedEceTopic(refreshedTopic);
    }
  };

  // Study Planner Handlers
  const handleOpenEditSlot = (index: number) => {
    setEditingSlotIndex(index);
    setEditingSlotText(timeSlots[index].task);
    setEditingSlotCategory(timeSlots[index].category);
  };

  const handleSaveSlot = () => {
    if (editingSlotIndex === null) return;
    const updated = [...timeSlots];
    updated[editingSlotIndex] = {
      ...updated[editingSlotIndex],
      task: editingSlotText,
      category: editingSlotCategory
    };
    setTimeSlots(updated);
    saveToLocal('ece_planner', updated);
    setEditingSlotIndex(null);
  };

  // CGPA Tracker Handlers
  const handleSemesterCgpaChange = (semester: number, val: string) => {
    const numeric = parseFloat(val) || 0;
    const updated = semesters.map(s => {
      if (s.semester === semester) {
        return { ...s, cgpa: numeric, active: numeric > 0 };
      }
      return s;
    });
    setSemesters(updated);
    saveToLocal('ece_cgpa_semesters', updated);
  };

  const handleTargetCgpaChange = (val: string) => {
    const numeric = parseFloat(val) || 0;
    setTargetCgpa(numeric);
    localStorage.setItem('ece_target_cgpa', numeric.toString());
  };

  // Notes tab save handler
  const handleNotesChange = (text: string) => {
    const updated = { ...notes, [activeNoteTab]: text };
    setNotes(updated);
    saveToLocal('ece_notes', updated);
  };

  // AI Mock Chat Coach Handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setAiTyping(true);

    // Simulate thinking delay and route response
    setTimeout(() => {
      const text = userMsg.text.toLowerCase();
      let aiText = '';

      if (text.includes('setup') || text.includes('hold') || text.includes('sta') || text.includes('timing')) {
        aiText = `### Setup & Hold Time Revision ⏱️\n\nFor digital circuit placements, **Static Timing Analysis (STA)** is one of the most frequently asked concepts. Here is a review:\n\n1. **Setup Time (\\(T_s\\))**: The minimum time before the clock edge that data must be stable at the flip-flop input.\n   - **Equation**: \\(T_c \\ge T_{cq} + T_{comb} + T_s - T_{skew}\\)\n   - **Setup Violation**: Occurs if the clock path is too fast or combinational delay \\(T_{comb}\\) is too slow.\n\n2. **Hold Time (\\(T_h\\))**: The minimum time after the clock edge that data must remain stable.\n   - **Equation**: \\(T_{cq} + T_{comb} \\ge T_h + T_{skew}\\)\n   - **Hold Violation**: Occurs if the combinational path is too fast (e.g. wire/buffer only) so data overwrite happens before hold requirements are met. Note that hold time is independent of clock frequency.\n\n*Question for you:* How do we fix a setup violation versus a hold violation in a physical layout design? (Let me know if you want the answer!)`;
      } else if (text.includes('mosfet') || text.includes('cmos') || text.includes('inverter') || text.includes('vtc')) {
        aiText = `### MOSFET & CMOS Inverter Cheat Sheet 🔌\n\nLet's break down CMOS logic and MOSFET operation:\n\n*   **MOSFET Modes of Operation**:\n    *   **Cut-off**: \\(V_{GS} < V_{th}\\). Current \\(I_D \\approx 0\\).\n    *   **Linear/Triode**: \\(V_{GS} \\ge V_{th}\\) and \\(V_{DS} < V_{GS} - V_{th}\\).\n        - Equation: \\(I_D = \\mu_n C_{ox} \\frac{W}{L} \\left[ (V_{GS}-V_{th})V_{DS} - \\frac{1}{2}V_{DS}^2 \\right]\\)\n    *   **Saturation (Pinch-off)**: \\(V_{GS} \\ge V_{th}\\) and \\(V_{DS} \\ge V_{GS} - V_{th}\\).\n        - Equation: \\(I_D = \\frac{1}{2} \\mu_n C_{ox} \\frac{W}{L} (V_{GS}-V_{th})^2\\)\n\n*   **CMOS Inverter VTC (Voltage Transfer Curve)**:\n    - **Region 1 (Cutoff NMOS, Linear PMOS)**: Input is logic Low. Output is \\(V_{DD}\\).\n    - **Region 2 (Sat NMOS, Linear PMOS)**: Input rises slightly.\n    - **Region 3 (Sat NMOS, Sat PMOS)**: High gain region. Output drops rapidly. Switching threshold \\(V_{sp}\\) is where \\(V_{in} = V_{out}\\).\n    - **Region 4 (Linear NMOS, Sat PMOS)**: Input close to \\(V_{DD}\\).\n    - **Region 5 (Linear NMOS, Cutoff PMOS)**: Input is logic High. Output is 0V.\n\nWould you like to practice calculating the Switching Threshold \\(V_{sp}\\)?`;
      } else if (text.includes('coin') || text.includes('change') || text.includes('dp') || text.includes('dynamic')) {
        aiText = `### Dynamic Programming Strategy: Coin Change 🪙\n\nThe Coin Change problem ("Given coins of different denominations and a total amount, find the minimum number of coins to make up that amount") is a classic placement question.\n\n*   **State Definition**: Let \\(dp[i]\\) be the minimum coins required to make up amount \\(i\\).\n*   **Base Case**: \\(dp[0] = 0\\) (0 coins needed for amount 0).\n*   **Transition Relation**:\n    \\[dp[i] = \\min_{c \\in \\text{coins}} (dp[i - c] + 1) \\quad \\text{if } i - c \\ge 0\\]\n*   **C++ / Java Implementation snippet**:\n    \`\`\`cpp\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (i - coin >= 0) {\n                dp[i] = min(dp[i], dp[i - coin] + 1);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n    \`\`\`\n*   **Complexity**: Time complexity is \\(O(\\text{amount} \\times n)\\), where \\(n\\) is the number of coin types. Space is \\(O(\\text{amount})\\).`;
      } else if (text.includes('interview') || text.includes('question') || text.includes('mock')) {
        const interviewQuestions = [
          `**ECE Mock Question**: Explain the difference between Latches and Flip-Flops. What are their respective triggering methods, and why are flip-flops preferred in synchronous designs?`,
          `**DSA Mock Question**: Given a binary tree, check if it is a binary search tree (BST). Note that checking left < root and right > root recursively is *insufficient*. What is the correct O(N) approach?`,
          `**Embedded Mock Question**: Explain UART packet structure. Why does UART not require a shared clock line, and how do receiver and transmitter agree on timing (Baud rate)?`,
          `**OS Mock Question**: What is the difference between a Process and a Thread? Describe how Context Switching overhead differs between the two.`
        ];
        const randomQuestion = interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
        aiText = `### 🎯 Practice Interview Question\n\nHere is a high-yield question for your upcoming placements:\n\n${randomQuestion}\n\n*Draft your answer in the Notes panel or reply to me with your points, and I will critique it!*`;
      } else if (text.includes('streak') || text.includes('motivate') || text.includes('motivation')) {
        aiText = `### Keep Burning Bright! 🔥\n\nYou are on a **${streak}-day study streak**. Here is your motivation for today:\n\n> "Consistency is not about perfection. It is about showing up daily and making 1% progress."\n\nLooking at your stats, you have completed some core topics, but some heavy topics like **Dynamic Programming** and **STA (Static Timing Analysis)** are still pending. Set a 1-hour block today to tackle one sub-topic. You've got this!`;
      } else {
        aiText = `### ECE Placement Coach 🎓\n\nI received your message: "${userMsg.text}".\n\nLet's keep our placement prep focused. I can guide you on:\n- **Core ECE Theory**: VLSI design, Digital Electronics, Embedded Protocols (I2C/SPI), RTOS concepts.\n- **CS / DSA Topics**: Stacks, Graphs, Trees, Dynamic Programming, Operating Systems, Computer Networks.\n- **Resume / HR advice**: How to structure your capstone projects.\n\nWhat topic would you like to review or get a mock question for?`;
      }

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date()
      }]);
      setAiTyping(false);
    }, 1200);
  };

  // --- STATS / CALCULATIONS ---

  // Tasks completion
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const tasksPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // DSA completion
  const dsaTotalProblems = dsaTopics.reduce((acc, t) => acc + t.problems.length, 0);
  const dsaSolvedProblems = dsaTopics.reduce((acc, t) => acc + t.problems.filter(p => p.solved).length, 0);
  const dsaPercent = dsaTotalProblems > 0 ? Math.round((dsaSolvedProblems / dsaTotalProblems) * 100) : 0;

  // ECE completion
  const eceTotalSubtopics = eceRoadmap.reduce((acc, t) => acc + t.subTopics.length, 0);
  const eceCompletedSubtopics = eceRoadmap.reduce((acc, t) => acc + t.subTopics.filter(s => s.completed).length, 0);
  const ecePercent = eceTotalSubtopics > 0 ? Math.round((eceCompletedSubtopics / eceTotalSubtopics) * 100) : 0;

  // CGPA calculations
  const activeSems = semesters.filter(s => s.active);
  const currentCgpa = activeSems.length > 0
    ? (activeSems.reduce((acc, s) => acc + s.cgpa, 0) / activeSems.length)
    : 0;
  const remainingSems = semesters.filter(s => !s.active);

  const calculateRequiredCgpa = () => {
    if (remainingSems.length === 0) return 0;
    const totalSems = semesters.length;
    const totalCurrentPoints = activeSems.reduce((acc, s) => acc + s.cgpa, 0);
    const targetPoints = targetCgpa * totalSems;
    const neededPoints = targetPoints - totalCurrentPoints;
    const requiredAvg = neededPoints / remainingSems.length;
    return requiredAvg > 10 ? -1 : Math.max(requiredAvg, 0);
  };

  const requiredCgpa = calculateRequiredCgpa();

  if (!mounted) return <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">Loading Dashboard...</div>;

  return (
    <main className="min-h-screen bg-[#030712] text-gray-100 relative overflow-hidden pb-12">
      <ProfileCard />

      {/* Background Radial Glows */}
      <div className="radial-glow-blue top-[-100px] left-[-100px]" />
      <div className="radial-glow-purple bottom-[100px] right-[-100px]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] height-[300px] bg-gradient-to-tr from-pink-500/5 to-transparent filter blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="blue">2026 Placement Drive</Badge>
              <span className="text-xs text-gray-500">v1.2.0 (Single User)</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              ECE Prep & Placement Suite
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Apple-inspired workspace to accelerate DSA and Core ECE concept mastery.
            </p>
          </div>

          {/* Streak and Countdown widget */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <button
              onClick={triggerStreakJoy}
              className="glass-panel flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/5 active:scale-95 transition-all text-left"
              title="Click to level up study streak!"
            >
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20 animate-pulse" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Daily Streak</div>
                <div className="text-base font-bold text-orange-400">{streak} Days</div>
              </div>
            </button>

            {/* Placement Countdown */}
            <div className="glass-panel flex items-center gap-3 px-4 py-2.5 rounded-2xl">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Countdown</div>
                <div className="text-sm font-bold text-blue-400">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CORE STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today's Tasks</span>
                <h3 className="text-2xl font-bold mt-1 text-white">{completedTasksCount}/{totalTasksCount}</h3>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <ListTodo className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{tasksPercent}%</span>
              </div>
              <ProgressBar value={tasksPercent} color="bg-gradient-to-r from-purple-500 to-indigo-500" />
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">DSA Progress</span>
                <h3 className="text-2xl font-bold mt-1 text-white">{dsaSolvedProblems}/{dsaTotalProblems} Problems</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Completed</span>
                <span>{dsaPercent}%</span>
              </div>
              <ProgressBar value={dsaPercent} color="bg-gradient-to-r from-blue-500 to-cyan-500" />
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Core ECE Prep</span>
                <h3 className="text-2xl font-bold mt-1 text-white">{eceCompletedSubtopics}/{eceTotalSubtopics} Topics</h3>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Roadmap</span>
                <span>{ecePercent}%</span>
              </div>
              <ProgressBar value={ecePercent} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current CGPA</span>
                <h3 className="text-2xl font-bold mt-1 text-white">{currentCgpa.toFixed(2)} / 10</h3>
              </div>
              <div className="p-2 bg-pink-500/10 rounded-xl">
                <GraduationCap className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Target: {targetCgpa.toFixed(1)}</span>
                <span className={requiredCgpa === -1 ? 'text-rose-400 font-bold' : 'text-gray-400'}>
                  {requiredCgpa === -1 ? 'Target impossible' : `Need Sem avg: ${requiredCgpa.toFixed(2)}`}
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* MAIN INTERACTIVE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION (Tasks, DSA, ECE Core) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TODAY'S TASKS CARD */}
            <Card>
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-purple-400" />
                  Today's Study Checklist
                </h2>
                <Badge variant="purple">{tasks.filter(t => !t.completed).length} Remaining</Badge>
              </div>

              {/* Task Add Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a prep task (e.g. Study UART framing, Solve two sum...)"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="glass-input flex-grow text-sm"
                />
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as Task['category'])}
                  className="glass-input text-sm text-gray-300 font-medium"
                  style={{ width: '110px' }}
                >
                  <option value="DSA" className="bg-[#030712]">DSA</option>
                  <option value="ECE" className="bg-[#030712]">ECE</option>
                  <option value="Aptitude" className="bg-[#030712]">Apt</option>
                  <option value="Other" className="bg-[#030712]">Other</option>
                </select>
                <button
                  type="submit"
                  className="glass-button-primary px-4 py-2 text-sm"
                  aria-label="Add task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Task List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No tasks listed for today. Add some above!</p>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={() => handleToggleTask(task.id)}>
                        <button className="text-gray-400 hover:text-white" aria-label={task.completed ? "Mark incomplete" : "Mark complete"}>
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                          )}
                        </button>
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {task.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            task.category === 'DSA'
                              ? 'blue'
                              : task.category === 'ECE'
                              ? 'green'
                              : task.category === 'Aptitude'
                              ? 'orange'
                              : 'gray'
                          }
                        >
                          {task.category}
                        </Badge>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-500 hover:text-rose-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* DSA TRACKER & TOPICS */}
            <Card>
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  LeetCode & DSA Topic Tracker
                </h2>
                <Badge variant="blue">{dsaPercent}% Done</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dsaTopics.map(topic => {
                  const solvedCount = topic.problems.filter(p => p.solved).length;
                  const totalCount = topic.problems.length;
                  const percent = Math.round((solvedCount / totalCount) * 100);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedDsaTopic(topic)}
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {topic.name}
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {solvedCount}/{totalCount} solved
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Progress</span>
                          <span>{percent}%</span>
                        </div>
                        <ProgressBar value={percent} color="bg-blue-500" height="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* CORE ECE ROADMAP CARD */}
            <Card>
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  Core ECE Technical Roadmap
                </h2>
                <Badge variant="green">{ecePercent}% Completed</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eceRoadmap.map(topic => {
                  const compCount = topic.subTopics.filter(s => s.completed).length;
                  const totalCount = topic.subTopics.length;
                  const percent = Math.round((compCount / totalCount) * 100);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedEceTopic(topic)}
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {topic.name}
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {compCount}/{totalCount} ready
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Preparation</span>
                          <span>{percent}%</span>
                        </div>
                        <ProgressBar value={percent} color="bg-emerald-500" height="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* RIGHT SECTION (Study Planner, CGPA, Notes, Chat) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* DAILY STUDY PLANNER */}
            <Card>
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-orange-400" />
                  Daily Time Blocks
                </h2>
                <Badge variant="orange">Planner</Badge>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => handleOpenEditSlot(index)}
                    className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-all flex items-start gap-3"
                  >
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5 whitespace-nowrap min-w-[70px]">
                      {slot.time.split(' ')[0]} {slot.time.split(' ')[1]}
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-semibold text-gray-200 line-clamp-1">{slot.task || 'Empty Slot'}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          slot.category === 'dsa' ? 'bg-blue-500' :
                          slot.category === 'ece' ? 'bg-emerald-500' :
                          slot.category === 'aptitude' ? 'bg-orange-500' :
                          slot.category === 'break' ? 'bg-gray-500' : 'bg-transparent'
                        }`} />
                        <span className="text-[9px] uppercase font-bold text-gray-500">{slot.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CGPA TRACKER DETAIL */}
            <Card>
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-pink-400" />
                  Semester CGPA Calculator
                </h2>
                <Badge variant="pink">CGPA Target</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-xs text-gray-400">Target CGPA</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={targetCgpa}
                    onChange={(e) => handleTargetCgpaChange(e.target.value)}
                    className="glass-input py-1 px-2 w-20 text-center text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {semesters.map(sem => (
                    <div key={sem.semester} className="flex flex-col items-center p-2 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                      <span className="text-[10px] text-gray-500">S{sem.semester}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="-"
                        value={sem.cgpa || ''}
                        onChange={(e) => handleSemesterCgpaChange(sem.semester, e.target.value)}
                        className="bg-transparent border-b border-white/10 outline-none text-center text-xs font-medium w-full text-white mt-1 focus:border-pink-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* NOTES & CHEAT SHEETS */}
            <Card>
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <PenSquare className="w-4.5 h-4.5 text-yellow-400" />
                  Placement Revision Notebook
                </h2>
                <div className="flex gap-1">
                  {(['interview', 'formulas', 'general'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveNoteTab(tab)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border capitalize transition-all ${
                        activeNoteTab === tab
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                          : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  value={notes[activeNoteTab]}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder={`Write down your ${activeNoteTab} cheat sheets, formulas, or checklist...`}
                  className="w-full h-32 bg-white/[0.01] border border-white/[0.05] rounded-xl p-3 text-xs text-gray-300 font-mono outline-none focus:border-yellow-500/50 transition-colors resize-none"
                />
                <div className="text-[10px] text-gray-500 text-right mt-1">Autosaved to localStorage</div>
              </div>
            </Card>
          </div>
        </div>

        {/* AI PLACEMENT COACH SECTION */}
        <section className="mt-8">
          <Card className="relative overflow-hidden">
            {/* Absolute radial highlights for AI chat */}
            <div className="absolute top-[-100px] right-[-50px] w-64 h-64 bg-blue-500/5 filter blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl relative">
                  <BrainCircuit className="w-6 h-6 text-white" />
                  <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-emerald-500 border border-[#030712] rounded-full animate-ping" />
                  <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-emerald-500 border border-[#030712] rounded-full" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                    ECE Placement AI Coach
                    <Badge variant="blue" className="py-0 px-1.5 text-[9px] uppercase font-black">Ready</Badge>
                  </h2>
                  <p className="text-xs text-gray-400">Contextual simulator for VLSI timing, CMOS characteristics, and DSA problem-solving</p>
                </div>
              </div>
              <button
                onClick={() => setChatMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'ai',
                    text: 'Chat history cleared. How can I help you prepare today?',
                    timestamp: new Date()
                  }
                ])}
                className="text-xs text-gray-500 hover:text-gray-300 font-medium"
              >
                Clear Chat
              </button>
            </div>

            {/* Chat Box */}
            <div className="flex flex-col h-[350px]">
              {/* Message History */}
              <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-1">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm font-sans leading-relaxed border ${
                        msg.sender === 'user'
                          ? 'bg-blue-600/10 border-blue-500/20 text-blue-100 rounded-br-none'
                          : 'bg-white/[0.02] border-white/[0.05] text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {/* Very simple markdown parser for bold, headers, code, bullet points */}
                      <div className="space-y-2 whitespace-pre-wrap">
                        {msg.text.split('\n\n').map((para, pIdx) => {
                          // Check for code blocks
                          if (para.startsWith('```')) {
                            const code = para.replace(/```[a-z]*\n/, '').replace(/```$/, '');
                            return (
                              <pre key={pIdx} className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono text-blue-300 overflow-x-auto my-2">
                                <code>{code}</code>
                              </pre>
                            );
                          }
                          // Check for headers
                          if (para.startsWith('###')) {
                            return <h4 key={pIdx} className="font-bold text-base text-white mt-2">{para.replace('###', '').trim()}</h4>;
                          }
                          // Regular paragraph with bold parsing
                          const boldParts = para.split('**');
                          return (
                            <p key={pIdx}>
                              {boldParts.map((part, bIdx) => (
                                bIdx % 2 === 1 ? <strong key={bIdx} className="text-white font-semibold">{part}</strong> : part
                              ))}
                            </p>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 block text-right font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl rounded-bl-none p-4 max-w-[200px]">
                      <div className="flex gap-1.5 items-center justify-center py-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Quick Prompts */}
              <div className="flex flex-wrap gap-2 mb-4 border-t border-white/5 pt-3">
                <button
                  onClick={() => { setChatInput('Tell me about Setup and Hold time equations'); }}
                  className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Setup/Hold Equations
                </button>
                <button
                  onClick={() => { setChatInput('Explain CMOS Inverter Switching Threshold'); }}
                  className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  CMOS Inverter VTC
                </button>
                <button
                  onClick={() => { setChatInput('Give me Coin Change DP strategy'); }}
                  className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  Coin Change DP
                </button>
                <button
                  onClick={() => { setChatInput('Give me a mock interview question'); }}
                  className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Mock Placement Question
                </button>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about setup/hold delays, CMOS sizing, microcontrollers, UART timing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="glass-input flex-grow text-sm"
                  disabled={aiTyping}
                />
                <button
                  type="submit"
                  className="glass-button-primary px-5 py-2.5 text-sm"
                  disabled={aiTyping || !chatInput.trim()}
                  aria-label="Send message"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          </Card>
        </section>
      </div>

      {/* --- POPUP DIALOGS --- */}

      {/* DSA problems dialog */}
      {selectedDsaTopic && (
        <Dialog
          isOpen={selectedDsaTopic !== null}
          onClose={() => setSelectedDsaTopic(null)}
          title={`${selectedDsaTopic.name} Problems`}
        >
          <div className="space-y-3 mt-2">
            <p className="text-xs text-gray-400 mb-3">Check off problems as you solve them. These represent high-yield placement questions.</p>
            {selectedDsaTopic.problems.map(prob => (
              <div
                key={prob.id}
                onClick={() => handleToggleDsaProblem(selectedDsaTopic.id, prob.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  {prob.solved ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-400 fill-blue-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                  )}
                  <span className={`text-sm ${prob.solved ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}`}>
                    {prob.name}
                  </span>
                </div>
                <Badge
                  variant={
                    prob.difficulty === 'Easy' ? 'green' :
                    prob.difficulty === 'Medium' ? 'orange' : 'pink'
                  }
                >
                  {prob.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </Dialog>
      )}

      {/* ECE topics dialog */}
      {selectedEceTopic && (
        <Dialog
          isOpen={selectedEceTopic !== null}
          onClose={() => setSelectedEceTopic(null)}
          title={selectedEceTopic.name}
        >
          <div className="space-y-3 mt-2">
            <p className="text-xs text-gray-400 mb-3">Ensure complete conceptual understanding of these sub-topics. Focus heavily on 'High' priority items.</p>
            {selectedEceTopic.subTopics.map(sub => (
              <div
                key={sub.id}
                onClick={() => handleToggleEceSubTopic(selectedEceTopic.id, sub.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  {sub.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                  )}
                  <span className={`text-sm ${sub.completed ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}`}>
                    {sub.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sub.importance === 'High' ? 'pink' : sub.importance === 'Medium' ? 'orange' : 'gray'}>
                    {sub.importance} Priority
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Dialog>
      )}

      {/* Time Slot Edit Dialog */}
      {editingSlotIndex !== null && (
        <Dialog
          isOpen={editingSlotIndex !== null}
          onClose={() => setEditingSlotIndex(null)}
          title={`Edit Slot: ${timeSlots[editingSlotIndex].time}`}
        >
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Study Target / Task</label>
              <input
                type="text"
                value={editingSlotText}
                onChange={(e) => setEditingSlotText(e.target.value)}
                className="glass-input w-full text-sm"
                placeholder="What will you study during this block?"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Category</label>
              <select
                value={editingSlotCategory}
                onChange={(e) => setEditingSlotCategory(e.target.value as TimeSlot['category'])}
                className="glass-input w-full text-sm text-gray-300 font-medium"
              >
                <option value="dsa" className="bg-[#030712]">DSA Preparation</option>
                <option value="ece" className="bg-[#030712]">ECE Core Concept</option>
                <option value="aptitude" className="bg-[#030712]">Aptitude Test</option>
                <option value="break" className="bg-[#030712]">Rest / Break</option>
                <option value="empty" className="bg-[#030712]">Free Block</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSlotIndex(null)}
                className="glass-button text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSlot}
                className="glass-button-primary text-xs py-1.5 px-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  );
}
