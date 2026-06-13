import React, { useEffect, useMemo, useRef, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges, SKINS } from "@/lib/gameState";
import { Header } from "./MathMine";
import { Win } from "./LetterQuest";
import { CharacterAvatar } from "../PixelIcons";
import { DiamondIcon } from "../HUD";
import BlockButton from "../BlockButton";
import Confetti from "../Confetti";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Eraser, RotateCw } from "lucide-react";

const COLS = 6;
const ROWS = 5;

// Levels: each has start, goal, walls (cells that are not walkable)
const LEVELS = [
  {
    id: 1,
    start: { x: 0, y: 4 },
    goal: { x: 5, y: 0 },
    walls: [],
  },
  {
    id: 2,
    start: { x: 0, y: 4 },
    goal: { x: 5, y: 0 },
    walls: [{ x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }],
  },
  {
    id: 3,
    start: { x: 0, y: 4 },
    goal: { x: 5, y: 4 },
    walls: [{ x: 1, y: 4 }, { x: 1, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 3 }],
  },
  {
    id: 4,
    start: { x: 0, y: 0 },
    goal: { x: 5, y: 4 },
    walls: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }],
  },
  {
    id: 5,
    start: { x: 0, y: 0 },
    goal: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 },
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
    ],
  },
  {
    id: 6,
    start: { x: 0, y: 2 },
    goal: { x: 5, y: 2 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 4 },
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 3, y: 4 },
      { x: 2, y: 2 }, { x: 4, y: 2 },
    ],
  },
  {
    id: 7,
    start: { x: 0, y: 0 },
    goal: { x: 0, y: 4 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
  },
  {
    id: 8,
    start: { x: 0, y: 4 },
    goal: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 4 }, { x: 1, y: 2 }, { x: 1, y: 0 },
      { x: 3, y: 4 }, { x: 3, y: 2 }, { x: 3, y: 0 },
      { x: 5, y: 4 }, { x: 5, y: 2 },
    ],
  },
];

const DIRS = {
  U: { dx: 0, dy: -1, Icon: ArrowUp, label: "Up" },
  D: { dx: 0, dy: 1, Icon: ArrowDown, label: "Down" },
  L: { dx: -1, dy: 0, Icon: ArrowLeft, label: "Left" },
  R: { dx: 1, dy: 0, Icon: ArrowRight, label: "Right" },
};

export default function CodeSteve({ state, setState }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];
  const [program, setProgram] = useState([]);
  const [pos, setPos] = useState(level.start);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(null); // "win" | "fail" | null
  const [showConfetti, setShowConfetti] = useState(false);
  const stopRef = useRef(false);

  const currentSkin = SKINS.find((s) => s.id === state.currentSkin) || SKINS[0];

  useEffect(() => {
    setPos(level.start);
    setProgram([]);
    setStatus(null);
  }, [levelIdx, level.start.x, level.start.y]);

  const isWall = (x, y) =>
    level.walls.some((w) => w.x === x && w.y === y) ||
    x < 0 || x >= COLS || y < 0 || y >= ROWS;

  const addStep = (dir) => {
    if (running || status === "win") return;
    if (program.length >= 18) return;
    SFX.place();
    setProgram((p) => [...p, dir]);
  };

  const clearProg = () => {
    if (running) return;
    SFX.click();
    setProgram([]);
    setPos(level.start);
    setStatus(null);
  };

  const reset = () => {
    if (running) return;
    SFX.click();
    setPos(level.start);
    setStatus(null);
  };

  const run = async () => {
    if (running || program.length === 0) return;
    setRunning(true);
    setStatus(null);
    stopRef.current = false;
    let cur = { ...level.start };
    setPos(cur);
    for (let i = 0; i < program.length; i++) {
      if (stopRef.current) break;
      const d = DIRS[program[i]];
      const nx = cur.x + d.dx;
      const ny = cur.y + d.dy;
      if (isWall(nx, ny)) {
        SFX.wrong();
        setStatus("fail");
        setRunning(false);
        return;
      }
      cur = { x: nx, y: ny };
      SFX.step();
      setPos(cur);
      await new Promise((r) => setTimeout(r, 320));
      if (cur.x === level.goal.x && cur.y === level.goal.y) {
        SFX.diamond();
        setTimeout(() => {
          SFX.win();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2400);
        }, 200);
        setStatus("win");
        setState((s) => {
          const next = {
            ...s,
            diamonds: s.diamonds + 5,
            gamesPlayed: s.gamesPlayed + 1,
            stats: { ...s.stats, code: { wins: s.stats.code.wins + 1 } },
          };
          const { badges } = checkBadges(next);
          return { ...next, badges };
        });
        setRunning(false);
        return;
      }
    }
    if (!stopRef.current) {
      SFX.wrong();
      setStatus("fail");
    }
    setRunning(false);
  };

  const next = () => {
    if (levelIdx < LEVELS.length - 1) {
      SFX.click();
      setLevelIdx(levelIdx + 1);
    } else {
      SFX.click();
      setLevelIdx(0);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-5xl">
        <Header title={`Code Steve — Level ${level.id}`} subtitle="Tap arrows to plan Steve's path, then press RUN" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 mt-4">
          {/* Grid */}
          <div className="tex-sky block-pop no-rounded relative p-3 sm:p-4">
            <div
              className="relative z-10 grid gap-1 sm:gap-2 mx-auto"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, maxWidth: 560 }}
            >
              {Array.from({ length: ROWS * COLS }).map((_, i) => {
                const x = i % COLS;
                const y = Math.floor(i / COLS);
                const wall = level.walls.some((w) => w.x === x && w.y === y);
                const isGoal = level.goal.x === x && level.goal.y === y;
                const isPos = pos.x === x && pos.y === y;
                return (
                  <div
                    key={i}
                    data-testid={`code-cell-${x}-${y}`}
                    className={`relative aspect-square ${wall ? "tex-stone" : "tex-grass"} border-2 border-[#212121] no-rounded flex items-center justify-center`}
                  >
                    {isGoal && !isPos && (
                      <div className="relative z-10 anim-spin-block w-3/4 h-3/4">
                        <DiamondIcon className="h-full w-full" />
                      </div>
                    )}
                    {isPos && (
                      <div className={`relative z-10 w-4/5 h-4/5 ${running ? "anim-walk" : ""}`}>
                        <CharacterAvatar skin={currentSkin} className="h-full w-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="tex-oak block-pop no-rounded relative p-4">
              <div className="relative z-10">
                <div className="font-pixel uppercase text-lg text-[#212121] mb-2">Add Arrow</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DIRS).map(([k, d]) => (
                    <button
                      key={k}
                      data-testid={`code-add-${k}`}
                      onClick={() => addStep(k)}
                      disabled={running || status === "win"}
                      className="tex-grass block-pop-sm lift-hover no-rounded relative py-3 font-pixel text-base text-white flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <d.Icon className="h-5 w-5 relative z-10" strokeWidth={3} />
                      <span className="relative z-10">{d.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    data-testid="code-clear"
                    onClick={clearProg}
                    disabled={running}
                    className="flex-1 tex-stone block-pop-sm lift-hover no-rounded relative py-2 font-pixel text-base text-white inline-flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Eraser className="h-4 w-4 relative z-10" strokeWidth={3} />
                    <span className="relative z-10">Clear</span>
                  </button>
                  <button
                    data-testid="code-reset"
                    onClick={reset}
                    disabled={running}
                    className="flex-1 tex-dirt block-pop-sm lift-hover no-rounded relative py-2 font-pixel text-base text-white inline-flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <RotateCw className="h-4 w-4 relative z-10" strokeWidth={3} />
                    <span className="relative z-10">Reset</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="tex-stone block-pop no-rounded relative p-3 min-h-[120px]">
              <div className="relative z-10">
                <div className="font-pixel uppercase text-sm text-white mb-2">Program ({program.length})</div>
                <div className="flex flex-wrap gap-1">
                  {program.length === 0 && (
                    <div className="font-bold text-white/85 text-sm">Tap arrows to build a path…</div>
                  )}
                  {program.map((k, i) => {
                    const D = DIRS[k];
                    return (
                      <div
                        key={i}
                        className="tex-gold block-pop-sm no-rounded relative h-8 w-8 flex items-center justify-center"
                      >
                        <D.Icon className="h-4 w-4 text-[#212121] relative z-10" strokeWidth={3} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <BlockButton
              variant="diamond"
              size="lg"
              onClick={run}
              disabled={running || program.length === 0 || status === "win"}
              textId="code-run"
              className="w-full"
            >
              <Play className="inline-block h-6 w-6 mr-2" strokeWidth={3} />
              Run!
            </BlockButton>

            {status === "win" && (
              <div className="tex-grass block-pop-sm no-rounded relative p-3 text-center">
                <div className="relative z-10">
                  <div className="font-pixel uppercase text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    You Got It!
                  </div>
                  <div className="font-bold text-white text-sm mt-1">+5 diamonds</div>
                  <div className="mt-2">
                    <BlockButton variant="gold" size="sm" onClick={next} textId="code-next">
                      Next Level
                    </BlockButton>
                  </div>
                </div>
              </div>
            )}
            {status === "fail" && (
              <div className="bg-[#FFA8A8] block-pop-sm no-rounded relative p-3 text-center">
                <span className="relative z-10 font-pixel uppercase text-lg text-[#212121]">
                  Oops — Try Again!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
