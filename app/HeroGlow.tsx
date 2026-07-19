import {
  Monitor,
  Code2,
  GraduationCap,
  MessageCircle,
  FileText,
  Star,
} from "lucide-react";

// Ring radii MUST match the <circle r="..."> values in the SVG below exactly.
const RING_INNER = 150;
const RING_MIDDLE = 230;
const RING_OUTER = 310;

const ORBIT_ICONS = [
  // Inner ring — 1 icon
  { Icon: Star, angle: 45, radius: RING_INNER, duration: "55s" },

  // Middle ring — 2 icons, evenly spaced (180deg apart)
  { Icon: Monitor, angle: 20, radius: RING_MIDDLE, duration: "70s" },
  { Icon: FileText, angle: 200, radius: RING_MIDDLE, duration: "70s" },

  // Outer ring — 3 icons, evenly spaced (120deg apart)
  { Icon: Code2, angle: 0, radius: RING_OUTER, duration: "85s" },
  { Icon: GraduationCap, angle: 120, radius: RING_OUTER, duration: "85s" },
  { Icon: MessageCircle, angle: 240, radius: RING_OUTER, duration: "85s" },
];

const DOTS = [
  { top: "30%", left: "35%" },
  { top: "45%", left: "60%" },
  { top: "55%", left: "42%" },
  { top: "38%", left: "70%" },
  { top: "60%", left: "30%" },
  { top: "25%", left: "50%" },
];

export default function HeroGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Central glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/30 blur-[90px] dark:bg-amber-500/25"
        style={{ animation: "glow-pulse 5s ease-in-out infinite" }}
      />

      {/* Concentric rings — radii match RING_INNER / RING_MIDDLE / RING_OUTER above */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 dark:opacity-25"
        width="700"
        height="700"
        viewBox="0 0 700 700"
      >
        <circle cx="350" cy="350" r={RING_INNER} fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-600" />
        <circle cx="350" cy="350" r={RING_MIDDLE} fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-600" />
        <circle cx="350" cy="350" r={RING_OUTER} fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-600" />
      </svg>

      {/* Twinkling dots */}
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-amber-500 dark:bg-amber-400"
          style={{
            top: dot.top,
            left: dot.left,
            animation: `twinkle ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Orbiting icon badges — locked to ring radii, counter-rotated to stay upright */}
      {ORBIT_ICONS.map(({ Icon, angle, radius, duration }, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            animation: `orbit-spin ${duration} linear infinite`,
          }}
        >
          <div
            className="absolute"
            style={{
              transform: `rotate(${angle}deg) translateX(${radius}px)`,
            }}
          >
            <div
              style={{
                animation: `orbit-spin-reverse ${duration} linear infinite`,
              }}
            >
              <div className="flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white/70 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/70">
                <Icon size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}