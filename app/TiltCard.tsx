"use client";

import { useRef, useState } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // How far the cursor is from center, as a ratio (-1 to 1)
    const rotateY = ((x - centerX) / centerX) * 8; // max 8deg
    const rotateX = -((y - centerY) / centerY) * 8;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });
  }

  function handleMouseLeave() {
    setHovering(false);
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
    });
  }

  function handleMouseEnter() {
    setHovering(true);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: "preserve-3d" }}
      className={`relative rounded-xl border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70 ${className}`}
    >
      {/* Glow layer beneath, intensifies on hover */}
      <div
        className={`pointer-events-none absolute -inset-2 -z-10 rounded-xl bg-amber-400/20 blur-xl transition-opacity duration-300 dark:bg-amber-500/25 ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      />
      {children}
    </div>
  );
}