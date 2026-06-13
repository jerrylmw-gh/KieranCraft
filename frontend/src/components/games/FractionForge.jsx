import React, { useEffect, useMemo, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { Header, ProgressRow } from "./MathMine";
import { Win } from "./LetterQuest";
import Confetti from "../Confetti";

// ---------- Helpers ----------
function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
function reduce(n, d) {
  const g = gcd(n, d);
  return [n / g, d / g];
}

// ---------- Visual fraction pie ----------
function FractionPie({ num, den, size = 140, color = "#5E9D34", emptyColor = "#FFFFFF" }) {
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const slices = [];
  for (let i = 0; i < den; i++) {
    const startAngle = (i / den) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const path =
      den === 1
        ? `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 ${-2 * r},0 Z`
        : `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
    slices.push(
      <path
        key={i}
        d={path}
        fill={i < num ? color : emptyColor}
        stroke="#212121"
        strokeWidth="3"
      />,
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]">
      {slices}
    </svg>
  );
}

// ---------- Visual fraction bar ----------
function FractionBar({ num, den, width = 280, height = 36, color = "#FEE12B" }) {
  const cells = [];
  const cellW = width / den;
  for (let i = 0; i < den; i++) {
    cells.push(
      <rect
        key={i}
        x={i * cellW}
        y={0}
        width={cellW}
        height={height}
        fill={i < num ? color : "#FFFFFF"}
        stroke="#212121"
        strokeWidth="3"
      />,
    );
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {cells}
    </svg>
  );
}

// ---------- Fraction text (n / d) ----------
function FracText({ n, d, size = "text-5xl" }) {
  return (
    <span className={`inline-flex flex-col items-center font-pixel leading-none ${size}`}>
      <span>{n}</span>
      <span className="block w-full border-t-4 border-[#212121] my-1" />
      <span>{d}</span>
    </span>
  );
}

// ---------- Question generators ----------
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genShaded() {
  // "What fraction is shaded?"
  const dens = [2, 3, 4, 5, 6, 8];
  const d = pick(dens);
  const n = 1 + Math.floor(Math.random() * (d - 1));
  const [rn, rd] = reduce(n, d);
  const ans = `${rn}/${rd}`;
  const distractors = new Set([ans]);
  let guard = 0;
  while (distractors.size < 4 && guard++ < 30) {
    const dd = pick(dens);
    const nn = 1 + Math.floor(Math.random() * (dd - 1));
    const [a, b] = reduce(nn, dd);
    distractors.add(`${a}/${b}`);
  }
  return {
    kind: "shaded",
    visual: { num: n, den: d },
    prompt: "What fraction is shaded?",
    choices: Array.from(distractors).sort(() => Math.random() - 0.5),
    ans,
  };
}

function genOfQuantity() {
  // "1/4 of 12 = ?"
  const dens = [2, 3, 4, 5];
  const d = pick(dens);
  const mult = 1 + Math.floor(Math.random() * 6); // total = d*mult
  const total = d * mult;
  const ansVal = mult; // 1/d of total = mult
  const distractors = new Set([ansVal]);
  while (distractors.size < 4) {
    let v = ansVal + Math.floor(Math.random() * 7) - 3;
    if (v < 0) v = Math.abs(v) + 1;
    if (v !== ansVal) distractors.add(v);
  }
  return {
    kind: "of",
    prompt: <>What is <FracText n={1} d={d} size="text-3xl" /> of {total}?</>,
    visual: null,
    choices: Array.from(distractors).sort(() => Math.random() - 0.5).map(String),
    ans: String(ansVal),
  };
}

function genCompare() {
  // "Which is bigger?"
  const dens = [2, 3, 4, 5, 6, 8];
  let a, b, c, d;
  do {
    a = 1 + Math.floor(Math.random() * 5);
    b = pick(dens);
    c = 1 + Math.floor(Math.random() * 5);
    d = pick(dens);
    if (a >= b) a = b - 1;
    if (c >= d) c = d - 1;
  } while (a / b === c / d);
  const choices = [{ n: a, d: b }, { n: c, d: d }];
  const ans = a / b > c / d ? `${a}/${b}` : `${c}/${d}`;
  return {
    kind: "compare",
    prompt: "Which fraction is BIGGER?",
    visual: { compare: choices },
    choices: choices.map((x) => `${x.n}/${x.d}`),
    ans,
  };
}

function genEquivalent() {
  // 1/2 = ?/8
  const base = pick([
    { n: 1, d: 2 },
    { n: 1, d: 3 },
    { n: 1, d: 4 },
    { n: 2, d: 3 },
    { n: 3, d: 4 },
  ]);
  const k = 2 + Math.floor(Math.random() * 3); // 2-4
  const targetD = base.d * k;
  const targetN = base.n * k;
  const distractors = new Set([targetN]);
  while (distractors.size < 4) {
    let v = targetN + Math.floor(Math.random() * 7) - 3;
    if (v < 1) v = Math.abs(v) + 1;
    if (v !== targetN && v < targetD) distractors.add(v);
  }
  return {
    kind: "equiv",
    prompt: (
      <>
        <FracText n={base.n} d={base.d} size="text-3xl" /> = <FracText n={"?"} d={targetD} size="text-3xl" />
      </>
    ),
    visual: null,
    choices: Array.from(distractors).sort(() => Math.random() - 0.5).map(String),
    ans: String(targetN),
  };
}

function genQuestion() {
  const gen = pick([genShaded, genShaded, genOfQuantity, genCompare, genEquivalent]);
  return gen();
}

// ---------- Component ----------
export default function FractionForge({ state, setState }) {
  const [q, setQ] = useState(genQuestion);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const TARGET = 5;

  useEffect(() => {
    if (solved >= TARGET) {
      SFX.win();
      setShowConfetti(true);
      setState((s) => {
        const next = { ...s, gamesPlayed: s.gamesPlayed + 1 };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      const t = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(t);
    }
  }, [solved, setState]);

  const choose = (val) => {
    if (feedback || solved >= TARGET) return;
    if (val === q.ans) {
      SFX.diamond();
      setFeedback("correct");
      setStreak((x) => x + 1);
      setSolved((x) => x + 1);
      setState((s) => {
        const fr = s.stats.fraction || { correct: 0, attempts: 0 };
        const next = {
          ...s,
          diamonds: s.diamonds + 2, // fractions reward more
          stats: { ...s.stats, fraction: { correct: fr.correct + 1, attempts: fr.attempts + 1 } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
      setTimeout(() => {
        setFeedback(null);
        setQ(genQuestion());
      }, 800);
    } else {
      SFX.wrong();
      setFeedback("wrong");
      setStreak(0);
      setState((s) => {
        const fr = s.stats.fraction || { correct: 0, attempts: 0 };
        return {
          ...s,
          stats: { ...s.stats, fraction: { correct: fr.correct, attempts: fr.attempts + 1 } },
        };
      });
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const restart = () => {
    SFX.click();
    setSolved(0);
    setStreak(0);
    setQ(genQuestion());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-3xl">
        <Header title="Fraction Forge" subtitle="Master fractions — earn 2 diamonds each!" />
        <ProgressRow solved={solved} target={TARGET} streak={streak} />

        {solved >= TARGET ? (
          <Win onRestart={restart} testId="fraction-restart" message="Fraction Master!" />
        ) : (
          <>
            <div className={`tex-stone block-pop no-rounded relative mt-6 p-6 sm:p-8 ${feedback === "wrong" ? "anim-wiggle" : ""}`}>
              <div className="relative z-10 text-center">
                <div className="font-pixel uppercase text-2xl sm:text-3xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)] inline-flex items-center justify-center gap-2 flex-wrap">
                  {q.prompt}
                </div>

                {q.kind === "shaded" && q.visual && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <FractionPie num={q.visual.num} den={q.visual.den} size={170} color="#51EBE1" />
                    <FractionBar num={q.visual.num} den={q.visual.den} />
                  </div>
                )}

                {q.kind === "compare" && q.visual && (
                  <div className="mt-4 grid grid-cols-2 gap-6 justify-items-center">
                    {q.visual.compare.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <FractionPie num={c.n} den={c.d} size={120} color={i === 0 ? "#FEE12B" : "#51EBE1"} />
                        <div className="font-pixel text-2xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
                          <FracText n={c.n} d={c.d} size="text-3xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              {q.choices.map((c, i) => {
                const variants = ["dirt", "stone", "oak", "grass"];
                const v = variants[i % 4];
                const isFraction = String(c).includes("/");
                const [cn, cd] = isFraction ? String(c).split("/") : [c, null];
                return (
                  <button
                    key={String(c) + i}
                    data-testid={`fraction-choice-${String(c).replace("/", "-")}`}
                    onClick={() => choose(c)}
                    disabled={!!feedback}
                    className={`tex-${v} block-pop lift-hover no-rounded relative p-4 sm:p-6 ${v === "stone" || v === "dirt" ? "text-white" : "text-[#212121]"} min-h-[100px] flex items-center justify-center`}
                  >
                    <div className="relative z-10">
                      {isFraction ? (
                        <FracText n={cn} d={cd} size="text-4xl sm:text-5xl" />
                      ) : (
                        <span className="font-pixel text-4xl sm:text-5xl">{c}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {feedback === "wrong" && (
              <div className="mt-4 text-center">
                <span className="font-pixel uppercase text-xl text-[#212121] bg-[#FFA8A8] block-pop-sm no-rounded relative inline-block px-4 py-2">
                  <span className="relative z-10">Try Again, Builder!</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
