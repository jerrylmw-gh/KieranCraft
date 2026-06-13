import React from "react";

// Burst of pixel-blocks falling from top after a win
export default function Confetti({ active, count = 40 }) {
  if (!active) return null;
  const colors = ["#5E9D34", "#51EBE1", "#FEE12B", "#79553A", "#B8945F", "#A04AFF", "#FFA8A8"];
  const pieces = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const dur = 1.8 + Math.random() * 1.4;
    const size = 10 + Math.random() * 14;
    const color = colors[i % colors.length];
    return (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${left}%`,
          top: `-30px`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          border: "2px solid #212121",
          animation: `confetti-fall ${dur}s ${delay}s linear forwards`,
          boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.2)",
        }}
      />
    );
  });
  return (
    <div data-testid="confetti" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces}
    </div>
  );
}
