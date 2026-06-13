import React, { useEffect, useMemo, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { applyMult, roundBonus, perfectBonus } from "@/lib/abilities";
import BlockButton from "../BlockButton";
import Confetti from "../Confetti";
import { Header, ProgressRow } from "./MathMine";

const WORDS = [
  // Minecraft words
  "CREEPER", "DIAMOND", "ZOMBIE", "PICKAXE", "EMERALD", "TORCH",
  "ENDERMAN", "VILLAGER", "SKELETON", "REDSTONE", "OBSIDIAN", "NETHER",
  // Year-4 vocabulary
  "ADVENTURE", "TREASURE", "KNOWLEDGE", "CHARACTER", "MOUNTAIN", "JOURNEY",
  "DISCOVER", "DRAGON", "CASTLE", "BRIDGE", "FOREST", "ISLAND",
  "DESERT", "OCEAN", "WIZARD", "POTION", "MAGIC", "ARROW",
  "SHIELD", "ARMOR", "EXPLORE", "BRAVE", "QUEST", "SECRET",
  "HARVEST", "GARDEN", "BUTTER", "RABBIT", "DOLPHIN", "EAGLE",
  "PLANET", "ROCKET", "GALAXY", "FUTURE", "STRONG", "FRIEND",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildPuzzle() {
  const word = pick(WORDS);
  // hide 1 letter (not the first letter to keep it gentle)
  const hideIdx = 1 + Math.floor(Math.random() * Math.max(1, word.length - 1));
  const missing = word[hideIdx];
  const masked = word.split("").map((ch, i) => (i === hideIdx ? "_" : ch));
  // generate 4 letter choices including the answer
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((c) => c !== missing);
  const distractors = [];
  while (distractors.length < 3) {
    const c = pool[Math.floor(Math.random() * pool.length)];
    if (!distractors.includes(c)) distractors.push(c);
  }
  const choices = [missing, ...distractors].sort(() => Math.random() - 0.5);
  return { word, masked, missing, choices, hideIdx };
}

export default function LetterQuest({ state, setState }) {
  const [puzzle, setPuzzle] = useState(buildPuzzle);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 5;

  useEffect(() => {
    if (solved >= TARGET) {
      SFX.win();
      setShowConfetti(true);
      const bonus = roundBonus(state);
      setState((s) => {
        const next = { ...s, gamesPlayed: s.gamesPlayed + 1, diamonds: s.diamonds + bonus };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      const t = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(t);
    }
  }, [solved, setState]);

  const choose = (letter) => {
    if (feedback || solved >= TARGET) return;
    if (letter === puzzle.missing) {
      SFX.diamond();
      setFeedback("correct");
      setStreak((x) => x + 1);
      setSolved((x) => x + 1);
      setState((s) => {
        const next = {
          ...s,
          diamonds: s.diamonds + applyMult(1, s),
          stats: { ...s.stats, letter: { correct: s.stats.letter.correct + 1, attempts: s.stats.letter.attempts + 1 } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      setTimeout(() => {
        setFeedback(null);
        setPuzzle(buildPuzzle());
      }, 850);
    } else {
      SFX.wrong();
      setFeedback("wrong");
      setStreak(0);
      setState((s) => ({
        ...s,
        stats: { ...s.stats, letter: { correct: s.stats.letter.correct, attempts: s.stats.letter.attempts + 1 } },
      }));
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const restart = () => {
    SFX.click();
    setSolved(0);
    setStreak(0);
    setPuzzle(buildPuzzle());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-3xl">
        <Header title="Letter Quest" subtitle="Dig out the missing letter to spell the word" />
        <ProgressRow solved={solved} target={TARGET} streak={streak} />

        {solved >= TARGET ? (
          <Win onRestart={restart} testId="letter-restart" />
        ) : (
          <>
            <div className={`tex-oak block-pop no-rounded relative mt-6 p-5 ${feedback === "wrong" ? "anim-wiggle" : ""}`}>
              <div className="relative z-10 flex flex-wrap justify-center gap-2 sm:gap-3">
                {puzzle.masked.map((ch, i) => (
                  <div
                    key={i}
                    className={`${ch === "_" ? "tex-stone" : "tex-grass"} block-pop-sm no-rounded relative h-14 w-12 sm:h-20 sm:w-16 flex items-center justify-center font-pixel text-3xl sm:text-5xl ${ch === "_" ? "text-white" : "text-white"}`}
                  >
                    <span className="relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                      {ch === "_" ? (feedback === "correct" ? puzzle.missing : "?") : ch}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6">
              {puzzle.choices.map((c, i) => (
                <button
                  key={c + i}
                  data-testid={`letter-choice-${c}`}
                  disabled={!!feedback}
                  onClick={() => choose(c)}
                  className={`tex-${["dirt", "stone", "gold", "diamond"][i % 4]} block-pop lift-hover no-rounded relative p-4 sm:p-6 font-pixel text-4xl sm:text-5xl ${i % 4 === 0 || i % 4 === 1 ? "text-white" : "text-[#212121]"}`}
                >
                  <span className="relative z-10">{c}</span>
                </button>
              ))}
            </div>

            {feedback === "wrong" && (
              <div className="mt-4 text-center">
                <span className="font-pixel uppercase text-xl text-[#212121] bg-[#FFA8A8] block-pop-sm no-rounded relative inline-block px-4 py-2">
                  <span className="relative z-10">Try Again!</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Win({ onRestart, testId, message = "Level Cleared!" }) {
  return (
    <div className="tex-grass block-pop no-rounded relative p-8 text-center mt-6 anim-pop-in">
      <div className="relative z-10">
        <div className="font-pixel uppercase text-4xl sm:text-5xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
          {message}
        </div>
        <p className="font-bold text-white text-lg mt-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
          Great work, Builder!
        </p>
        <div className="mt-5">
          <BlockButton variant="diamond" size="lg" onClick={onRestart} textId={testId}>
            Play Again
          </BlockButton>
        </div>
      </div>
    </div>
  );
}
