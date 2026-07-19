const DOTS = [
  { top: "12%", left: "20%" }, { top: "22%", left: "78%" },
  { top: "35%", left: "12%" }, { top: "18%", left: "50%" },
  { top: "60%", left: "85%" }, { top: "70%", left: "15%" },
  { top: "80%", left: "55%" }, { top: "48%", left: "25%" },
  { top: "55%", left: "68%" }, { top: "28%", left: "35%" },
  { top: "65%", left: "40%" }, { top: "40%", left: "90%" },
  { top: "15%", left: "65%" }, { top: "75%", left: "30%" },
];

export default function AuthGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* Central radial glow behind the card */}
      <div
        className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/35 blur-[120px]"
        style={{ animation: "glow-pulse 6s ease-in-out infinite" }}
      />

      {/* Drifting + twinkling star dust */}
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-amber-100"
          style={{
            top: dot.top,
            left: dot.left,
            animation: `twinkle ${2.5 + (i % 4) * 0.6}s ease-in-out infinite, float ${8 + (i % 5) * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s, ${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}