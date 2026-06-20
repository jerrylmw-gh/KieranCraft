import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { SFX } from "@/lib/sounds";
import { checkBadges, SKINS, WEAPONS, PETS } from "@/lib/gameState";
import { applyMult, roundBonus, getMaxHints, getMaxSkips } from "@/lib/abilities";
import { genMathProblem } from "@/lib/problems";
import { BOSSES } from "../PetIcons";
import { CharacterAvatar } from "../PixelIcons";
import { Header } from "./MathMine";
import BlockButton from "../BlockButton";
import Confetti from "../Confetti";
import GamePerks from "../GamePerks";
import { Heart, Swords } from "lucide-react";

// Mythic drops per Nightmare boss
const NIGHTMARE_DROPS = {
  creeper_king: { skin: "magma_beast", skinName: "Magma Beast", weapon: "inferno_blade", weaponName: "Inferno Blade" },
  skeleton_lord: { skin: "frost_king", skinName: "Frost King", weapon: "frost_bow", weaponName: "Frost Bow" },
  ender_dragon: { skin: "shadow_ender", skinName: "Shadow Ender", weapon: "void_scythe", weaponName: "Void Scythe" },
};

// Generates harder problems suitable for boss battle
function genBossProblem(difficulty, nightmare) {
  if (nightmare) return genMathProblem("hard");
  // difficulty: 1, 2, or 3
  const ops = difficulty === 1 ? ["+", "-", "×"] : difficulty === 2 ? ["×", "÷", "+"] : ["×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, ans;
  if (op === "+") {
    a = 20 + Math.floor(Math.random() * 60);
    b = 10 + Math.floor(Math.random() * 50);
    ans = a + b;
  } else if (op === "-") {
    a = 30 + Math.floor(Math.random() * 60);
    b = 5 + Math.floor(Math.random() * (a - 10));
    ans = a - b;
  } else if (op === "×") {
    a = 2 + Math.floor(Math.random() * 11);
    b = 2 + Math.floor(Math.random() * 11);
    ans = a * b;
  } else {
    b = 2 + Math.floor(Math.random() * 10);
    const q = 2 + Math.floor(Math.random() * 11);
    a = b * q;
    ans = q;
  }
  const distractors = new Set([ans]);
  let guard = 0;
  while (distractors.size < 4 && guard++ < 30) {
    const d = ans + Math.floor(Math.random() * 19) - 9;
    if (d >= 0 && d !== ans) distractors.add(d);
  }
  return { a, b, op, ans, display: `${a} ${op} ${b}`, choices: Array.from(distractors).sort(() => Math.random() - 0.5) };
}

const PLAYER_MAX_HP = 5;

export default function BossBattle({ state, setState }) {
  const [searchParams] = useSearchParams();
  const bossId = searchParams.get("boss") || "creeper_king";
  const nightmare = searchParams.get("nightmare") === "1";
  const baseBoss = BOSSES[bossId] || BOSSES.creeper_king;
  const boss = nightmare
    ? { ...baseBoss, name: `Nightmare ${baseBoss.name}`, hp: baseBoss.hp * 3, baseReward: baseBoss.baseReward * 3 }
    : baseBoss;
  const difficulty = bossId === "creeper_king" ? 1 : bossId === "skeleton_lord" ? 2 : 3;
  const navigate = useNavigate();

  const [bossHp, setBossHp] = useState(boss.hp);
  const playerMaxHp = nightmare ? 7 : 5;
  const [playerHp, setPlayerHp] = useState(playerMaxHp);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState(() => genBossProblem(difficulty, nightmare));
  const [feedback, setFeedback] = useState(null);
  const [shakingBoss, setShakingBoss] = useState(false);
  const [shakingPlayer, setShakingPlayer] = useState(false);
  const [floatNum, setFloatNum] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(() => getMaxHints(state));
  const [skipsLeft, setSkipsLeft] = useState(() => getMaxSkips(state));
  const [disabledChoices, setDisabledChoices] = useState(new Set());

  const skin = SKINS.find((s) => s.id === state.currentSkin) || SKINS[0];

  // Damage scaling
  const baseDmg = 10;

  useEffect(() => {
    if (outcome) return;
    if (bossHp <= 0) {
      SFX.win();
      setShowConfetti(true);
      setOutcome("win");
      setState((s) => {
        const reward = applyMult(boss.baseReward, s) + roundBonus(s);
        const prevBossWins = s.bossWins || {};
        const prevNm = s.nightmareWins || {};
        const next = {
          ...s,
          diamonds: s.diamonds + reward,
          gamesPlayed: s.gamesPlayed + 1,
          stats: { ...s.stats, boss: { wins: (s.stats.boss?.wins || 0) + 1 } },
        };
        if (nightmare) {
          next.nightmareWins = { ...prevNm, [bossId]: (prevNm[bossId] || 0) + 1 };
          // Mythic drops
          const drop = NIGHTMARE_DROPS[bossId];
          if (drop) {
            if (drop.skin && !(s.skins || []).includes(drop.skin)) {
              next.skins = [...s.skins, drop.skin];
            }
            if (drop.weapon && !(s.weapons || []).includes(drop.weapon)) {
              next.weapons = [...(s.weapons || []), drop.weapon];
            }
          }
          // Phoenix pet unlocks when all 3 nightmare bosses beaten
          const nmAfter = next.nightmareWins;
          const allNm = (nmAfter.creeper_king || 0) >= 1 && (nmAfter.skeleton_lord || 0) >= 1 && (nmAfter.ender_dragon || 0) >= 1;
          if (allNm && !(s.pets || []).includes("phoenix")) {
            next.pets = [...(s.pets || []), "phoenix"];
          }
        } else {
          next.bossWins = { ...prevBossWins, [bossId]: (prevBossWins[bossId] || 0) + 1 };
          if (boss.unlockSkin && !(s.skins || []).includes(boss.unlockSkin)) {
            next.skins = [...s.skins, boss.unlockSkin];
          }
          if (boss.unlockPet && !(s.pets || []).includes(boss.unlockPet)) {
            next.pets = [...(s.pets || []), boss.unlockPet];
          }
        }
        const { badges } = checkBadges(next);
        return { ...next, badges, _bossReward: reward };
      });
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
    if (playerHp <= 0) {
      SFX.wrong();
      setOutcome("lose");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bossHp, playerHp]);

  const nextProblem = () => {
    setProblem(genBossProblem(difficulty, nightmare));
    setDisabledChoices(new Set());
  };

  const choose = (val) => {
    if (feedback || outcome) return;
    if (disabledChoices.has(val)) return;
    if (val === problem.ans) {
      const newStreak = streak + 1;
      const crit = newStreak >= 3 && newStreak % 3 === 0;
      const dmg = crit ? baseDmg * 2 + 5 : baseDmg + Math.min(5, newStreak);
      SFX.diamond();
      setFeedback(crit ? "crit" : "hit");
      setShakingBoss(true);
      setFloatNum({ amount: `-${dmg}`, target: "boss", color: crit ? "#FEE12B" : "#FF6B73" });
      setStreak(newStreak);
      setTimeout(() => {
        setBossHp((h) => Math.max(0, h - dmg));
        setShakingBoss(false);
        setFloatNum(null);
        setFeedback(null);
        nextProblem();
      }, 700);
    } else {
      SFX.wrong();
      setFeedback("miss");
      setStreak(0);
      setShakingPlayer(true);
      setFloatNum({ amount: "-1", target: "player", color: "#FF6B73" });
      setTimeout(() => {
        setPlayerHp((h) => Math.max(0, h - 1));
        setShakingPlayer(false);
        setFloatNum(null);
        setFeedback(null);
      }, 700);
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
    nextProblem();
  };

  const retry = () => {
    SFX.click();
    setBossHp(boss.hp);
    setPlayerHp(playerMaxHp);
    setStreak(0);
    setProblem(genBossProblem(difficulty, nightmare));
    setHintsLeft(getMaxHints(state));
    setSkipsLeft(getMaxSkips(state));
    setDisabledChoices(new Set());
    setOutcome(null);
  };

  const BossSprite = boss.Icon;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <Confetti active={showConfetti} count={80} />
      <div className="mx-auto max-w-3xl">
        <Header title={`Boss: ${boss.name}`} subtitle="Answer to attack — wrong answer, boss hits you!" />

        {/* HP rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <HpBar
            label={boss.name}
            cur={bossHp}
            max={boss.hp}
            color="#FF6B73"
            testId="boss-hp"
          />
          <HpBar
            label="You"
            cur={playerHp}
            max={playerMaxHp}
            color="#5E9D34"
            unit="heart"
            testId="player-hp"
          />
        </div>

        {/* Sprites */}
        <div className="tex-sky block-pop no-rounded relative p-6 mb-5 flex items-center justify-between gap-4 overflow-hidden">
          <div className={`relative z-10 ${shakingPlayer ? "anim-wiggle" : "anim-bob"}`}>
            <div className="tex-dirt block-pop-sm no-rounded relative p-2">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                <CharacterAvatar skin={skin} className="h-full w-full" />
              </div>
            </div>
            {floatNum && floatNum.target === "player" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-pixel text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] anim-pop-in"
                   style={{ color: floatNum.color }}>
                {floatNum.amount}
              </div>
            )}
          </div>

          <div className="font-pixel uppercase text-3xl sm:text-5xl text-[#212121] drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
            <Swords className="inline-block h-10 w-10 sm:h-14 sm:w-14" strokeWidth={3} />
          </div>

          <div className={`relative z-10 ${shakingBoss ? "anim-wiggle" : "anim-bob"}`}>
            <div className="tex-stone block-pop-sm no-rounded relative p-2">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                <BossSprite className="h-full w-full" />
              </div>
            </div>
            {floatNum && floatNum.target === "boss" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-pixel text-3xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)] anim-pop-in"
                   style={{ color: floatNum.color }}>
                {floatNum.amount}{feedback === "crit" && "!"}
              </div>
            )}
          </div>
        </div>

        {outcome === "win" ? (
          <div className={`${nightmare ? "tex-diamond" : "tex-grass"} block-pop no-rounded relative p-7 text-center anim-pop-in`}>
            <div className="relative z-10">
              <div className={`font-pixel uppercase text-4xl sm:text-5xl ${nightmare ? "text-[#212121]" : "text-white"} drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]`}>
                {nightmare ? "✦ NIGHTMARE CLEARED ✦" : "Victory!"}
              </div>
              <p className={`font-bold ${nightmare ? "text-[#212121]" : "text-white"} text-lg mt-2`}>
                Defeated {boss.name}! +{state._bossReward || boss.baseReward} diamonds.
              </p>
              {nightmare && NIGHTMARE_DROPS[bossId] && (
                <div className="mt-3 space-y-1">
                  <p className="font-pixel uppercase text-[#FF1493] text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                    ✦ MYTHIC SKIN: {NIGHTMARE_DROPS[bossId].skinName}
                  </p>
                  <p className="font-pixel uppercase text-[#FF1493] text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                    ✦ MYTHIC WEAPON: {NIGHTMARE_DROPS[bossId].weaponName}
                  </p>
                </div>
              )}
              {!nightmare && boss.unlockSkin && (
                <p className="font-pixel uppercase text-yellow-200 text-xl mt-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  ✦ Legendary Skin Unlocked: {boss.unlockSkinName}!
                </p>
              )}
              {!nightmare && boss.unlockPet && (
                <p className="font-pixel uppercase text-yellow-200 text-xl mt-1 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  ✦ Legendary Pet Unlocked: {boss.unlockPetName}!
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <BlockButton variant={nightmare ? "grass" : "diamond"} size="md" onClick={retry} textId="boss-retry">
                  Fight Again
                </BlockButton>
                <BlockButton variant="gold" size="md" onClick={() => navigate("/")} textId="boss-home">
                  Back to Hub
                </BlockButton>
              </div>
            </div>
          </div>
        ) : outcome === "lose" ? (
          <div className="bg-[#FFA8A8] block-pop no-rounded relative p-7 text-center">
            <div className="relative z-10">
              <div className="font-pixel uppercase text-3xl sm:text-4xl text-[#212121]">Oh no!</div>
              <p className="font-bold text-[#212121] text-lg mt-2">{boss.name} won this round. Try again, Builder!</p>
              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <BlockButton variant="grass" size="md" onClick={retry} textId="boss-retry">
                  Try Again
                </BlockButton>
                <BlockButton variant="dirt" size="md" onClick={() => navigate("/")} textId="boss-home">
                  Back to Hub
                </BlockButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`tex-stone block-pop no-rounded relative p-6 sm:p-7 text-center mb-4 ${feedback === "miss" ? "anim-wiggle" : ""}`}>
              <div className="relative z-10 font-pixel text-3xl sm:text-5xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                {problem.display || `${problem.a} ${problem.op} ${problem.b}`} = ?
              </div>
              <div className="relative z-10 mt-2 text-white font-pixel uppercase text-sm">
                Streak: x{streak} {streak >= 2 && <span className="text-[#FEE12B]">— Crit next!</span>}
                {nightmare && <span className="ml-2 text-[#FF1493]">✦ NIGHTMARE</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {problem.choices.map((c, i) => {
                const variants = ["dirt", "stone", "oak", "grass"];
                const v = variants[i % 4];
                const isDis = disabledChoices.has(c);
                return (
                  <button
                    key={c + "-" + i}
                    data-testid={`boss-choice-${c}`}
                    onClick={() => choose(c)}
                    disabled={!!feedback || isDis}
                    className={`tex-${v} block-pop lift-hover no-rounded relative p-4 sm:p-6 font-pixel text-4xl sm:text-5xl ${v === "stone" || v === "dirt" ? "text-white" : "text-[#212121]"} ${isDis ? "opacity-30 line-through grayscale" : ""}`}
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

function HpBar({ label, cur, max, color, unit, testId }) {
  const pct = Math.max(0, (cur / max) * 100);
  return (
    <div className="tex-dirt block-pop-sm no-rounded relative p-2" data-testid={testId}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="font-pixel uppercase text-sm sm:text-base text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">{label}</span>
          {unit === "heart" ? (
            <span className="inline-flex gap-0.5">
              {Array.from({ length: max }).map((_, i) => (
                <Heart
                  key={i}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill={i < cur ? "#FF6B73" : "transparent"}
                  color={i < cur ? "#FF6B73" : "#9B9B9B"}
                  strokeWidth={3}
                />
              ))}
            </span>
          ) : (
            <span className="font-pixel text-sm text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              {cur} / {max}
            </span>
          )}
        </div>
        {unit !== "heart" && (
          <div className="h-4 bg-[#212121] border-2 border-[#212121] no-rounded relative">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: color, boxShadow: "inset 0 3px 0 rgba(255,255,255,0.3)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
