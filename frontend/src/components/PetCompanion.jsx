import React, { useEffect, useState } from "react";
import { PetIcon } from "./PetIcons";

// Wandering pet companion — moves around within its container randomly
export default function PetCompanion({ petId }) {
  const [pos, setPos] = useState({ x: 0, y: 0, flip: false });
  const [bobbing, setBobbing] = useState(false);

  useEffect(() => {
    if (!petId) return;
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const nextX = Math.floor(Math.random() * 70) - 35; // -35..35 px
      const nextY = Math.floor(Math.random() * 10) - 5;
      setPos((p) => ({ x: nextX, y: nextY, flip: nextX < p.x }));
      setBobbing(true);
      setTimeout(() => setBobbing(false), 600);
    };
    tick();
    const id = setInterval(tick, 2500 + Math.random() * 1500);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [petId]);

  if (!petId) return null;
  return (
    <div
      data-testid="pet-companion"
      className="absolute -bottom-2 -right-2 pointer-events-none"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) ${pos.flip ? "scaleX(-1)" : ""}`,
        transition: "transform 800ms cubic-bezier(0.3, 0.8, 0.4, 1)",
      }}
    >
      <div className={`h-12 w-12 sm:h-14 sm:w-14 ${bobbing ? "anim-walk" : "anim-bob"}`}>
        <PetIcon id={petId} className="h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}
