import React, { useEffect, useMemo, useState } from "react";
import { SFX } from "@/lib/sounds";
import { checkBadges } from "@/lib/gameState";
import { applyMult, memoryBonus, roundBonus } from "@/lib/abilities";
import { Header } from "./MathMine";
import { Win } from "./LetterQuest";
import Confetti from "../Confetti";
import { CreeperIcon, PigIcon, GoldIngot, ApplePixel, TntIcon, EmeraldIcon } from "../PixelIcons";
import { DiamondIcon } from "../HUD";

const ITEMS = [
  { id: "creeper", Icon: CreeperIcon },
  { id: "pig", Icon: PigIcon },
  { id: "gold", Icon: GoldIngot },
  { id: "apple", Icon: ApplePixel },
  { id: "tnt", Icon: TntIcon },
  { id: "emerald", Icon: EmeraldIcon },
  { id: "diamond", Icon: DiamondIcon },
];

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard() {
  // 6 pairs = 12 cards
  const picks = shuffle(ITEMS).slice(0, 6);
  const cards = shuffle([...picks, ...picks]).map((it, idx) => ({
    uid: idx,
    id: it.id,
    Icon: it.Icon,
    flipped: false,
    matched: false,
  }));
  return cards;
}

export default function MemoryMatch({ state, setState }) {
  const [cards, setCards] = useState(buildBoard);
  const [first, setFirst] = useState(null);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const matchedCount = cards.filter((c) => c.matched).length;
  const allMatched = matchedCount === cards.length;

  useEffect(() => {
    if (allMatched) {
      SFX.win();
      setShowConfetti(true);
      setState((s) => {
        const baseReward = Math.max(3, 10 - Math.floor(moves / 4));
        const reward = applyMult(baseReward, s) + memoryBonus(s) + roundBonus(s);
        const next = {
          ...s,
          diamonds: s.diamonds + reward,
          gamesPlayed: s.gamesPlayed + 1,
          stats: { ...s.stats, memory: { wins: s.stats.memory.wins + 1 } },
        };
        const { badges } = checkBadges(next);
        return { ...next, badges, _memReward: reward };
      });
      const t = setTimeout(() => setShowConfetti(false), 2400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMatched]);

  const flip = (uid) => {
    if (busy || allMatched) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    SFX.click();
    const newCards = cards.map((c) => (c.uid === uid ? { ...c, flipped: true } : c));
    setCards(newCards);

    if (!first) {
      setFirst(card);
    } else {
      setMoves((m) => m + 1);
      if (first.id === card.id) {
        // match
        SFX.diamond();
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, matched: true } : c)));
          setFirst(null);
        }, 350);
      } else {
        setBusy(true);
        setTimeout(() => {
          setCards((cs) => cs.map((c) => (c.uid === first.uid || c.uid === uid ? { ...c, flipped: false } : c)));
          setFirst(null);
          setBusy(false);
        }, 700);
      }
    }
  };

  const restart = () => {
    SFX.click();
    setCards(buildBoard());
    setFirst(null);
    setBusy(false);
    setMoves(0);
  };

  const reward = Math.max(3, 10 - Math.floor(moves / 4));

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} />
      <div className="mx-auto max-w-3xl">
        <Header title="Memory Match" subtitle="Flip blocks to find pairs" />

        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="tex-stone block-pop-sm no-rounded relative px-3 py-1.5 font-pixel text-lg text-white">
            <span className="relative z-10">Moves: {moves}</span>
          </div>
          <div className="tex-grass block-pop-sm no-rounded relative px-3 py-1.5 font-pixel text-lg text-white">
            <span className="relative z-10">Matched: {matchedCount / 2} / 6</span>
          </div>
          <div className="tex-diamond block-pop-sm no-rounded relative flex items-center gap-1 px-3 py-1.5 font-pixel text-lg text-[#212121]">
            <DiamondIcon className="h-5 w-5 relative z-10" />
            <span className="relative z-10">+{reward}</span>
          </div>
        </div>

        {allMatched ? (
          <Win onRestart={restart} testId="memory-restart" message={`+${state._memReward || reward} diamonds!`} />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {cards.map((c) => {
              const show = c.flipped || c.matched;
              return (
                <button
                  key={c.uid}
                  data-testid={`memory-card-${c.uid}`}
                  onClick={() => flip(c.uid)}
                  className={`relative h-24 sm:h-28 ${show ? "tex-oak" : "tex-stone"} block-pop lift-hover no-rounded p-2 flex items-center justify-center ${c.matched ? "opacity-90" : ""}`}
                  disabled={busy || c.matched}
                >
                  <div className="relative z-10">
                    {show ? (
                      <c.Icon className="h-14 w-14 sm:h-16 sm:w-16 anim-pop-in" />
                    ) : (
                      <span className="font-pixel text-3xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">?</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
