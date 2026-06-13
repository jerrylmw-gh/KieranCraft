import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadState, saveState, resetState, checkBadges } from "@/lib/gameState";
import HUD from "@/components/HUD";
import Hub from "@/components/Hub";
import Rewards from "@/components/Rewards";
import MathMine from "@/components/games/MathMine";
import LetterQuest from "@/components/games/LetterQuest";
import ShapeSort from "@/components/games/ShapeSort";
import MemoryMatch from "@/components/games/MemoryMatch";
import CodeSteve from "@/components/games/CodeSteve";
import FractionForge from "@/components/games/FractionForge";
import { Toaster, toast } from "sonner";

function App() {
  const [state, setState] = useState(loadState);

  // Persist
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Detect newly-earned badges and toast them
  const prevBadgesRef = React.useRef(state.badges);
  useEffect(() => {
    const prev = new Set(prevBadgesRef.current);
    const newOnes = state.badges.filter((b) => !prev.has(b));
    if (newOnes.length) {
      newOnes.forEach((b) =>
        toast.success(`Badge unlocked: ${b.replace(/_/g, " ")}`, {
          duration: 3200,
          style: {
            background: "#FEE12B",
            border: "4px solid #212121",
            boxShadow: "4px 4px 0 #212121",
            borderRadius: 0,
            color: "#212121",
            fontFamily: "'Pixelify Sans', monospace",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
        }),
      );
    }
    prevBadgesRef.current = state.badges;
  }, [state.badges]);

  // After any setState updates that change diamonds/stats but didn't include checkBadges,
  // ensure badges keep in sync (idempotent safety net).
  useEffect(() => {
    const { badges, newlyEarned } = checkBadges(state);
    if (newlyEarned.length) {
      setState((s) => ({ ...s, badges }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.diamonds, state.gamesPlayed]);

  const onReset = () => {
    resetState();
    setState(loadState());
  };

  return (
    <div className="App tex-sky min-h-screen">
      <BrowserRouter>
        <HUD state={state} setState={setState} onReset={onReset} />
        <Routes>
          <Route path="/" element={<Hub state={state} />} />
          <Route path="/rewards" element={<Rewards state={state} setState={setState} />} />
          <Route path="/play/math" element={<MathMine state={state} setState={setState} />} />
          <Route path="/play/letter" element={<LetterQuest state={state} setState={setState} />} />
          <Route path="/play/shape" element={<ShapeSort state={state} setState={setState} />} />
          <Route path="/play/memory" element={<MemoryMatch state={state} setState={setState} />} />
          <Route path="/play/code" element={<CodeSteve state={state} setState={setState} />} />
          <Route path="/play/fraction" element={<FractionForge state={state} setState={setState} />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
