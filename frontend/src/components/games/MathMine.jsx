import React, { useEffect, useMemo, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { applyMult, mathExtra, perfectBonus, roundBonus, streakBonus, getMaxHints, getMaxSkips } from "@/lib/abilities";
import { DiamondIcon } from "../HUD";
import BlockButton from "../BlockButton";
import Confetti from "../Confetti";
import GamePerks from "../GamePerks";

// Year-4 level: mix of +, -, ×, ÷ with larger numbers.
function genProblem() {
  const ops = ["+", "-", "+", "-", "×", "×", "÷"]; // bias toward + - × for variety
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, ans;
  if (op === "+") {
    a = Math.floor(Math.random() * 80) + 10; // 10-89
    b = Math.floor(Math.random() * 60) + 5;  // 5-64
    ans = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 80) + 20; // 20-99
    b = Math.floor(Math.random() * (a - 5)) + 1;
    ans = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 11) + 2; // 2-12
    b = Math.floor(Math.random() * 11) + 2; // 2-12
    ans = a * b;
  } else {
    // division — guarantee divisible
    b = Math.floor(Math.random() * 11) + 2; // 2-12
    const q = Math.floor(Math.random() * 11) + 2; // 2-12
    a = b * q;
    ans = q;
  }
  // build 4 plausible choices
  const distractors = new Set([ans]);
  let guard = 0;
  while (distractors.size < 4 && guard++ < 50) {
    let delta;
    if (op === "×") delta = Math.floor(Math.random() * 11) - 5;
    else if (op === "÷") delta = Math.floor(Math.random() * 7) - 3;
    else delta = Math.floor(Math.random() * 21) - 10;
    if (delta === 0) delta = 1;
    const d = ans + delta;
    if (d >= 0 && d !== ans) distractors.add(d);
  }
  const choices = Array.from(distractors).sort(() => Math.random() - 0.5);
  return { a, b, op, ans, choices };
}

export default function MathMine({ state, setState }) {
  const [problem, setProblem] = useState(genProblem);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [wrongs, setWrongs] = useState(0);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(() => getMaxHints(state));
  const [skipsLeft, setSkipsLeft] = useState(() => getMaxSkips(state));
  const [disabledChoices, setDisabledChoices] = useState(new Set());
  const TARGET = 5;

  useEffect(() => {
    if (solved >= TARGET) {
      SFX.win();
      setShowConfetti(true);
      const bonus = roundBonus(state) + (wrongs === 0 ? perfectBonus(state) : 0);
      setState((s) => {
        const next = {
          ...s,
          gamesPlayed: s.gamesPlayed + 1,
          diamonds: s.diamonds + bonus,
        };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      const t = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  const nextProblem = () => {
    setProblem(genProblem());
    setDisabledChoices(new Set());
  };

  const choose = (val) => {
    if (feedback || solved >= TARGET) return;
    if (disabledChoices.has(val)) return;
    const correct = val === problem.ans;
    if (correct) {
      SFX.diamond();
      setFeedback("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);
      setSolved((x) => x + 1);
      const base = 1 + mathExtra(state);
      const sBonus = streakBonus(state, newStreak);
      const gain = applyMult(base, state) + sBonus;
      setState((s) => {
        const next = {
          ...s,
          diamonds: s.diamonds + gain,
          correctAnswers: s.correctAnswers + 1,
          stats: { ...s.stats, math: { correct: s.stats.math.correct + 1, attempts: s.stats.math.attempts + 1 } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      setTimeout(() => {
        setFeedback(null);
        nextProblem();
      }, 700);
    } else {
      SFX.wrong();
      setFeedback("wrong");
      setStreak(0);
      setWrongs((w) => w + 1);
      setState((s) => ({
        ...s,
        stats: { ...s.stats, math: { correct: s.stats.math.correct, attempts: s.stats.math.attempts + 1 } },
      }));
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || feedback) return;
    const wrongs = problem.choices.filter((c) => c !== problem.ans && !disabledChoices.has(c));
    if (!wrongs.length) return;
    const pick = wrongs[Math.floor(Math.random() * wrongs.length)];
    setDisabledChoices((d) => new Set([...d, pick]));
    setHintsLeft((n) => n - 1);
  };

  const useSkip = () => {
    if (skipsLeft <= 0 || feedback) return;
    setSkipsLeft((n) => n - 1);
    setStreak(0);
    nextProblem();
  };

  const restart = () => {
    SFX.click();
    setSolved(0);
    setStreak(0);
    setWrongs(0);
    setHintsLeft(getMaxHints(state));
    setSkipsLeft(getMaxSkips(state));
    setDisabledChoices(new Set());
    setProblem(genProblem());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-3xl">
        <Header title="Math Mine" subtitle="Pick the block with the right answer" />

        <ProgressRow solved={solved} target={TARGET} streak={streak} />

        {solved >= TARGET ? (
          <div className="tex-grass block-pop no-rounded relative p-8 text-center mt-6">
            <div className="relative z-10">
              <div className="font-pixel uppercase text-4xl sm:text-5xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
                Level Cleared!
              </div>
              <p className="font-bold text-white text-lg mt-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
                {wrongs === 0 ? "Perfect! No wrongs." : "Great work, Builder!"}
              </p>
              <div className="mt-5">
                <BlockButton variant="diamond" size="lg" onClick={restart} textId="math-restart">
                  Mine Again
                </BlockButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`tex-stone block-pop no-rounded relative mt-6 p-8 text-center ${feedback === "wrong" ? "anim-wiggle" : ""}`}>
              <div className="relative z-10 font-pixel text-5xl sm:text-7xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                {problem.a} {problem.op} {problem.b} = ?
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {problem.choices.map((c, i) => {
                const isAns = c === problem.ans;
                const showCorrect = feedback === "correct" && isAns;
                const isDisabled = disabledChoices.has(c);
                const variant = showCorrect ? "diamond" : ["dirt", "stone", "oak", "grass"][i % 4];
                return (
                  <button
                    key={i}
                    data-testid={`math-choice-${c}`}
                    onClick={() => choose(c)}
                    disabled={!!feedback || isDisabled}
                    className={`tex-${variant} block-pop lift-hover no-rounded relative p-6 sm:p-8 font-pixel text-5xl ${variant === "stone" || variant === "dirt" ? "text-white" : "text-[#212121]"} ${showCorrect ? "anim-pop-in" : ""} ${isDisabled ? "opacity-30 line-through grayscale" : ""}`}
                  >
                    <span className="relative z-10">{c}</span>
                  </button>
                );
              })}
            </div>

            <GamePerks
              hintsLeft={hintsLeft}
              skipsLeft={skipsLeft}
              onHint={useHint}
              onSkip={useSkip}
              disabled={!!feedback}
            />

            {feedback === "wrong" && (
              <div className="mt-4 text-center font-pixel uppercase text-xl text-[#212121] bg-[#FFA8A8] block-pop-sm no-rounded relative inline-block px-4 py-2 left-1/2 -translate-x-1/2">
                <span className="relative z-10">Try Again, Builder!</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Header({ title, subtitle }) {
  return (
    <div className="tex-dirt block-pop no-rounded relative p-5 mb-4">
      <div className="relative z-10">
        <h1 className="font-pixel uppercase text-3xl sm:text-4xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">{title}</h1>
        <p className="font-bold text-white/95 text-base mt-1 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">{subtitle}</p>
      </div>
    </div>
  );
}

export function ProgressRow({ solved, target, streak }) {
  const pct = Math.min(100, (solved / target) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-8 bg-[#212121] border-4 border-[#212121] no-rounded relative">
        <div
          className="h-full tex-grass relative transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
          {solved} / {target}
        </div>
      </div>
      <div className="tex-gold block-pop-sm no-rounded relative px-3 py-1.5 font-pixel text-lg text-[#212121]">
        <span className="relative z-10">x{streak}</span>
      </div>
      <div className="tex-diamond block-pop-sm no-rounded relative px-2 py-1.5 flex items-center gap-1 font-pixel text-lg text-[#212121]">
        <DiamondIcon className="h-5 w-5 relative z-10" />
        <span className="relative z-10">+1</span>
      </div>
    </div>
  );
}
