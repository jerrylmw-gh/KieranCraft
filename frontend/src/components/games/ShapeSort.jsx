import React, { useEffect, useMemo, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { applyMult, roundBonus } from "@/lib/abilities";
import { Header, ProgressRow } from "./MathMine";
import { Win } from "./LetterQuest";
import Confetti from "../Confetti";

// Bins: by texture/category. Items spawn one-at-a-time, child picks the matching bin.
const BINS = [
  { id: "grass", label: "Grass", tex: "tex-grass" },
  { id: "dirt", label: "Dirt", tex: "tex-dirt" },
  { id: "stone", label: "Stone", tex: "tex-stone" },
  { id: "diamond", label: "Diamond", tex: "tex-diamond" },
];

function randomItem() {
  return BINS[Math.floor(Math.random() * BINS.length)];
}

export default function ShapeSort({ state, setState }) {
  const [item, setItem] = useState(randomItem);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 6;

  useEffect(() => {
    if (solved >= TARGET) {
      SFX.win();
      setShowConfetti(true);
      setState((s) => {
        const next = { ...s, gamesPlayed: s.gamesPlayed + 1, diamonds: s.diamonds + roundBonus(s) };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      const t = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(t);
    }
  }, [solved, setState]);

  const choose = (binId) => {
    if (feedback || solved >= TARGET) return;
    if (binId === item.id) {
      SFX.diamond();
      setFeedback("correct");
      setStreak((x) => x + 1);
      setSolved((x) => x + 1);
      setState((s) => {
        const next = {
          ...s,
          diamonds: s.diamonds + applyMult(1, s),
          stats: { ...s.stats, shape: { correct: s.stats.shape.correct + 1, attempts: s.stats.shape.attempts + 1 } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      setTimeout(() => {
        setFeedback(null);
        setItem(randomItem());
      }, 700);
    } else {
      SFX.wrong();
      setFeedback("wrong");
      setStreak(0);
      setState((s) => ({
        ...s,
        stats: { ...s.stats, shape: { correct: s.stats.shape.correct, attempts: s.stats.shape.attempts + 1 } },
      }));
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const restart = () => {
    SFX.click();
    setSolved(0);
    setStreak(0);
    setItem(randomItem());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-4xl">
        <Header title="Shape Sort" subtitle="Tap the matching block bin" />
        <ProgressRow solved={solved} target={TARGET} streak={streak} />

        {solved >= TARGET ? (
          <Win onRestart={restart} testId="shape-restart" />
        ) : (
          <>
            <div className="tex-sky block-pop no-rounded relative mt-6 p-6 sm:p-8 flex justify-center">
              <div className={`relative z-10 ${feedback === "wrong" ? "anim-wiggle" : ""}`}>
                <div className={`${item.tex} block-pop no-rounded relative h-28 w-28 sm:h-40 sm:w-40 anim-bob`} data-testid={`shape-item-${item.id}`}>
                </div>
                <div className="text-center mt-3 font-pixel uppercase text-2xl text-[#212121] drop-shadow-[1px_1px_0_rgba(255,255,255,0.5)]">
                  Which bin?
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mt-6">
              {BINS.map((b) => (
                <button
                  key={b.id}
                  data-testid={`shape-bin-${b.id}`}
                  disabled={!!feedback}
                  onClick={() => choose(b.id)}
                  className={`${b.tex} block-pop lift-hover no-rounded relative p-6 text-center min-h-[130px] flex flex-col items-center justify-center gap-2`}
                >
                  <div className="relative z-10 font-pixel uppercase text-xl text-[#212121] drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)]">
                    {b.label}
                  </div>
                  <div className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#212121] bg-black/10" />
                </button>
              ))}
            </div>

            {feedback === "wrong" && (
              <div className="mt-4 text-center">
                <span className="font-pixel uppercase text-xl text-[#212121] bg-[#FFA8A8] block-pop-sm no-rounded relative inline-block px-4 py-2">
                  <span className="relative z-10">Not that one — Try Again!</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
