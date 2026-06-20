import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { applyMult, getMaxHints, getMaxSkips } from "@/lib/abilities";
import { genMathProblem } from "@/lib/problems";
import { Header } from "./MathMine";
import { Win } from "./LetterQuest";
import BlockButton from "../BlockButton";
import Confetti from "../Confetti";
import GamePerks from "../GamePerks";
import { DiamondIcon } from "../HUD";
import { Heart } from "lucide-react";

const STARTING_LIVES = 3;

export default function EndlessMath({ state, setState }) {
  const diff = state.difficulty || "normal";
  const [problem, setProblem] = useState(() => genMathProblem(diff));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [feedback, setFeedback] = useState(null);
  const [hintsLeft, setHintsLeft] = useState(() => getMaxHints(state));
  const [skipsLeft, setSkipsLeft] = useState(() => getMaxSkips(state));
  const [disabledChoices, setDisabledChoices] = useState(new Set());
  const [over, setOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Multiplier increases as streak grows
  const tier = streak >= 30 ? 4 : streak >= 20 ? 3 : streak >= 10 ? 2 : 1;
  const tierColor = tier === 4 ? "tex-diamond" : tier === 3 ? "tex-gold" : tier === 2 ? "tex-grass" : "tex-oak";

  useEffect(() => {
    if (lives <= 0 && !over) {
      SFX.wrong();
      setOver(true);
      // award diamonds based on score
      setState((s) => {
        const earned = applyMult(Math.floor(score / 2), s);
        const newHigh = Math.max(s.endlessHighScore || 0, score);
        const next = {
          ...s,
          diamonds: s.diamonds + earned,
          gamesPlayed: s.gamesPlayed + 1,
          endlessHighScore: newHigh,
          stats: { ...s.stats, endless: { best: newHigh } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges, _endlessEarned: earned };
      });
      if (score > (state.endlessHighScore || 0)) {
        SFX.win();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2400);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives]);

  const next = () => {
    setProblem(genMathProblem(diff));
    setDisabledChoices(new Set());
  };

  const choose = (val) => {
    if (feedback || over) return;
    if (disabledChoices.has(val)) return;
    if (val === problem.ans) {
      SFX.diamond();
      setFeedback("correct");
      setStreak((s) => s + 1);
      setScore((s) => s + tier);
      setTimeout(() => {
        setFeedback(null);
        next();
      }, 450);
    } else {
      SFX.wrong();
      setFeedback("wrong");
      setLives((l) => l - 1);
      setStreak(0);
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
    next();
  };

  const restart = () => {
    SFX.click();
    setProblem(genMathProblem(diff));
    setScore(0);
    setStreak(0);
    setLives(STARTING_LIVES);
    setOver(false);
    setHintsLeft(getMaxHints(state));
    setSkipsLeft(getMaxSkips(state));
    setDisabledChoices(new Set());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} count={70} />
      <div className="mx-auto max-w-3xl">
        <Header title="Endless Marathon" subtitle="Answer until 3 wrongs. Higher streak = bigger reward!" />

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div data-testid="endless-score" className="tex-grass block-pop-sm no-rounded relative p-3 text-center">
            <div className="relative z-10">
              <div className="font-pixel text-3xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">{score}</div>
              <div className="font-pixel uppercase text-xs text-white">Score</div>
            </div>
          </div>
          <div data-testid="endless-streak" className={`${tierColor} block-pop-sm no-rounded relative p-3 text-center`}>
            <div className="relative z-10">
              <div className="font-pixel text-3xl text-[#212121] drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)]">{streak}</div>
              <div className="font-pixel uppercase text-xs text-[#212121]">Streak ×{tier}</div>
            </div>
          </div>
          <div data-testid="endless-lives" className="tex-dirt block-pop-sm no-rounded relative p-3 text-center">
            <div className="relative z-10">
              <div className="font-pixel text-3xl text-white inline-flex gap-0.5 items-center">
                {Array.from({ length: STARTING_LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    className="h-6 w-6"
                    fill={i < lives ? "#FF6B73" : "transparent"}
                    color={i < lives ? "#FF6B73" : "#FFFFFF"}
                    strokeWidth={3}
                  />
                ))}
              </div>
              <div className="font-pixel uppercase text-xs text-white">Lives</div>
            </div>
          </div>
        </div>

        {over ? (
          <div className="tex-stone block-pop no-rounded relative p-7 text-center anim-pop-in">
            <div className="relative z-10">
              <div className="font-pixel uppercase text-3xl sm:text-5xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                {score > (state.endlessHighScore || 0) - 1 ? "NEW BEST!" : "GAME OVER"}
              </div>
              <p className="font-bold text-white text-lg mt-2">
                Final Score: <span className="font-pixel text-2xl text-[#FEE12B]">{score}</span>
              </p>
              <p className="font-bold text-white text-sm mt-1">
                Best: {state.endlessHighScore || 0} • Earned <span className="text-[#51EBE1]">+{state._endlessEarned || 0} 💎</span>
              </p>
              <div className="mt-5 flex justify-center gap-3 flex-wrap">
                <BlockButton variant="diamond" size="md" onClick={restart} textId="endless-restart">
                  Run Again
                </BlockButton>
                <BlockButton variant="gold" size="md" onClick={() => navigate("/")} textId="endless-home">
                  Back to Hub
                </BlockButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`tex-stone block-pop no-rounded relative p-6 sm:p-8 text-center ${feedback === "wrong" ? "anim-wiggle" : ""}`}>
              <div className="relative z-10 font-pixel text-4xl sm:text-6xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                {problem.display || `${problem.a} ${problem.op} ${problem.b}`} = ?
              </div>
              {diff === "hard" && (
                <div className="relative z-10 mt-2 inline-block bg-[#FF1493] border-2 border-[#212121] no-rounded px-2 py-0.5 font-pixel uppercase text-white text-xs">
                  Hard Mode
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
              {problem.choices.map((c, i) => {
                const v = ["dirt", "stone", "oak", "grass"][i % 4];
                const isDis = disabledChoices.has(c);
                return (
                  <button
                    key={c + "-" + i}
                    data-testid={`endless-choice-${c}`}
                    onClick={() => choose(c)}
                    disabled={!!feedback || isDis}
                    className={`tex-${v} block-pop lift-hover no-rounded relative p-4 sm:p-6 font-pixel text-3xl sm:text-5xl ${v === "stone" || v === "dirt" ? "text-white" : "text-[#212121]"} ${isDis ? "opacity-30 line-through grayscale" : ""}`}
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
          </>
        )}
      </div>
    </div>
  );
}
