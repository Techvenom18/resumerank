"use client";

import { useEffect, useState } from "react";

type Candidate = {
  name: string;
  score: number;
};

const FINAL_ORDER: Candidate[] = [
  { name: "Priya Sharma", score: 90 },
  { name: "Ananya Reddy", score: 68 },
  { name: "Arjun Kapoor", score: 55 },
];

const SHUFFLED_START: Candidate[] = [
  { name: "Arjun Kapoor", score: 55 },
  { name: "Priya Sharma", score: 90 },
  { name: "Ananya Reddy", score: 68 },
];

export default function LandingLeaderboard() {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const list = settled ? FINAL_ORDER : SHUFFLED_START;

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Ranked candidates
        </span>
        <span className="text-xs text-gray-400">Full Stack Developer</span>
      </div>
      <div className="space-y-2">
        {list.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 transition-all duration-700 ease-out"
            style={{
              transitionProperty: "transform, background-color",
            }}
          >
            <span className="text-sm font-medium text-gray-800">{c.name}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-700 ${
                settled && c.score >= 80
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {c.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}