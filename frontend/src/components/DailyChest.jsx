import React, { useEffect, useState } from "react";
import { SFX } from "@/lib/sounds";
import { isDailyReady, nextDailyMs, rollDaily } from "@/lib/abilities";
import { checkBadges, WEAPONS } from "@/lib/gameState";
import { WeaponIcon } from "./WeaponIcons";
import { DiamondIcon } from "./HUD";
import BlockButton from "./BlockButton";
import Confetti from "./Confetti";
import { Gift, Clock } from "lucide-react";

function fmtTime(ms) {
  if (ms <= 0) return "Ready!";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function DailyChest({ state, setState }) {
  const ready = isDailyReady(state);
  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [ready, state.lastDailyClaim]);

  const open = () => {
    if (!ready || opening) return;
    SFX.click();
    setOpening(true);
    const r = rollDaily(state);
    // shake animation then reveal
    setTimeout(() => {
      setReward(r);
      if (r.type === "weapon") SFX.badge();
      else SFX.diamond();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2400);
      setState((s) => {
        let next = { ...s, lastDailyClaim: Date.now() };
        if (r.type === "diamonds") next.diamonds = s.diamonds + r.amount;
        if (r.type === "weapon") {
          next.weapons = [...(s.weapons || []), r.weaponId];
          if (!s.currentWeapon) next.currentWeapon = r.weaponId;
        }
        const { badges } = checkBadges(next);
        return { ...next, badges };
      });
    }, 900);
  };

  const close = () => {
    SFX.click();
    setOpening(false);
    setReward(null);
  };

  return (
    <div className="relative">
      <Confetti active={showConfetti} count={60} />
      {!opening ? (
        <button
          onClick={open}
          disabled={!ready}
          data-testid="daily-chest-btn"
          className={`${ready ? "tex-gold" : "tex-stone"} block-pop lift-hover no-rounded relative p-5 w-full flex items-center justify-between gap-3 ${!ready ? "cursor-not-allowed" : ""}`}
        >
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <div className={`${ready ? "tex-diamond" : "tex-dirt"} block-pop-sm no-rounded relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center ${ready ? "anim-bob" : ""}`}>
              <Gift className={`h-7 w-7 sm:h-8 sm:w-8 relative z-10 ${ready ? "text-[#212121]" : "text-white"}`} strokeWidth={3} />
            </div>
            <div className="text-left">
              <div className={`font-pixel uppercase text-xl sm:text-2xl ${ready ? "text-[#212121]" : "text-white"} drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)]`}>
                Daily Chest
              </div>
              <div className={`font-bold text-sm ${ready ? "text-[#212121]/85" : "text-white/85"}`}>
                {ready ? "Tap to open — free reward!" : "Come back tomorrow"}
              </div>
            </div>
          </div>
          <div className={`relative z-10 ${ready ? "tex-grass" : "tex-stone"} block-pop-sm no-rounded px-3 py-1.5 font-pixel uppercase text-white`}>
            {ready ? (
              <span className="relative z-10 inline-flex items-center gap-1">Open</span>
            ) : (
              <span className="relative z-10 inline-flex items-center gap-1">
                <Clock className="h-4 w-4" strokeWidth={3} /> {fmtTime(nextDailyMs(state))}
              </span>
            )}
          </div>
        </button>
      ) : (
        <div data-testid="daily-chest-modal" className="tex-gold block-pop no-rounded relative p-6 text-center">
          <div className="relative z-10">
            {!reward ? (
              <div className="anim-wiggle anim-bob">
                <Gift className="h-20 w-20 mx-auto text-[#212121]" strokeWidth={2.5} />
                <div className="font-pixel uppercase text-2xl mt-3 text-[#212121]">Opening…</div>
              </div>
            ) : reward.type === "diamonds" ? (
              <div className="anim-pop-in">
                <DiamondIcon className="h-24 w-24 mx-auto anim-sparkle" />
                <div className="font-pixel uppercase text-4xl mt-3 text-[#212121] drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
                  +{reward.amount} Diamonds!
                </div>
                <div className="mt-4">
                  <BlockButton variant="diamond" size="md" onClick={close} textId="daily-close">
                    Awesome!
                  </BlockButton>
                </div>
              </div>
            ) : (
              <div className="anim-pop-in">
                <div className="tex-stone block-pop-sm no-rounded relative h-28 w-28 mx-auto p-3 anim-bob">
                  <div className="relative z-10 h-full w-full">
                    <WeaponIcon id={reward.weaponId} className="h-full w-full" />
                  </div>
                </div>
                <div className="font-pixel uppercase text-3xl sm:text-4xl mt-3 text-[#212121] drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
                  RARE WEAPON!
                </div>
                <div className="font-pixel uppercase text-xl mt-1 text-[#212121]">
                  {reward.weaponName}
                </div>
                <div className="mt-4">
                  <BlockButton variant="diamond" size="md" onClick={close} textId="daily-close">
                    Equip & Go!
                  </BlockButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
