"use client";

import {
  Home,
  User,
  BookOpen,
  Cpu,
  Calendar,
  GraduationCap,
  Briefcase,
  Bot,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: Home },
  { name: "Profile", icon: User },
  { name: "DSA Tracker", icon: BookOpen },
  { name: "Core ECE", icon: Cpu },
  { name: "Planner", icon: Calendar },
  { name: "CGPA", icon: GraduationCap },
  { name: "Placements", icon: Briefcase },
  { name: "AI Mentor", icon: Bot },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#0B1120] border-r border-gray-800 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">🎓 Vinil OS</h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 transition"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}