import React, { useState } from "react";
import { SKINS, BADGES, checkBadges } from "@/lib/gameState";
import { CharacterAvatar } from "./PixelIcons";
import { DiamondIcon } from "./HUD";
import BlockButton from "./BlockButton";
import { SFX } from "@/lib/sounds";
import { Lock, Check } from "lucide-react";

export default function Rewards({ state, setState }) {
  const [msg, setMsg] = useState("");

  const buy = (skin) => {
    if (state.skins.includes(skin.id)) {
      // equip
      SFX.click();
      setState((s) => ({ ...s, currentSkin: skin.id }));
      setMsg(`${skin.name} equipped!`);
      setTimeout(() => setMsg(""), 1800);
      return;
    }
    if (state.diamonds < skin.cost) {
      SFX.wrong();
      setMsg(`Need ${skin.cost - state.diamonds} more diamonds`);
      setTimeout(() => setMsg(""), 1800);
      return;
    }
    SFX.badge();
    setState((s) => {
      const next = {
        ...s,
        diamonds: s.diamonds - skin.cost,
        skins: [...s.skins, skin.id],
        currentSkin: skin.id,
      };
      const { badges } = checkBadges(next);
      return { ...next, badges };
    });
    setMsg(`Unlocked ${skin.name}!`);
    setTimeout(() => setMsg(""), 2200);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <div className="mx-auto max-w-6xl">
        <div className="tex-oak block-pop no-rounded relative p-6 mb-8">
          <h1 data-testid="rewards-title" className="relative z-10 font-pixel text-3xl sm:text-5xl uppercase text-[#212121] drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
            Treasure Chest
          </h1>
          <p className="relative z-10 font-bold text-[#212121] mt-1 text-base sm:text-lg opacity-90">
            Spend diamonds. Earn badges. Show off your skin.
          </p>
        </div>

        {msg && (
          <div data-testid="rewards-msg" className="tex-gold block-pop-sm no-rounded relative p-3 mb-6 text-center font-pixel uppercase text-[#212121] text-xl anim-pop-in">
            <span className="relative z-10">{msg}</span>
          </div>
        )}

        {/* Skins */}
        <h2 className="font-pixel uppercase text-2xl sm:text-3xl text-[#212121] mb-4 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
          Skins
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 mb-10">
          {SKINS.map((skin) => {
            const owned = state.skins.includes(skin.id);
            const equipped = state.currentSkin === skin.id;
            return (
              <div
                key={skin.id}
                data-testid={`skin-${skin.id}`}
                className={`tex-stone block-pop no-rounded relative p-4 text-center flex flex-col items-center ${equipped ? "outline outline-4 outline-offset-2 outline-[#FEE12B]" : ""}`}
              >
                <div className="relative z-10 w-full">
                  <div className="tex-dirt block-pop-sm no-rounded relative p-3 mx-auto w-fit mb-3">
                    <div className="relative h-20 w-20 anim-bob">
                      <CharacterAvatar skin={skin} className="h-full w-full" />
                    </div>
                  </div>
                  <div className="font-pixel uppercase text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    {skin.name}
                  </div>
                  <div className="flex items-center justify-center gap-1 my-2 font-pixel text-lg text-white">
                    {owned ? (
                      <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" strokeWidth={3}/> Owned</span>
                    ) : (
                      <>
                        <DiamondIcon className="h-5 w-5" />
                        <span>{skin.cost}</span>
                      </>
                    )}
                  </div>
                  <BlockButton
                    variant={owned ? (equipped ? "diamond" : "grass") : "gold"}
                    size="sm"
                    onClick={() => buy(skin)}
                    textId={`skin-action-${skin.id}`}
                    disabled={equipped}
                    className="w-full"
                  >
                    {equipped ? "Equipped" : owned ? "Equip" : state.diamonds >= skin.cost ? "Unlock" : <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4" strokeWidth={3}/> Locked</span>}
                  </BlockButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <h2 className="font-pixel uppercase text-2xl sm:text-3xl text-[#212121] mb-4 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
          Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGES.map((b) => {
            const earned = state.badges.includes(b.id);
            return (
              <div
                key={b.id}
                data-testid={`badge-${b.id}`}
                className={`${earned ? "tex-gold" : "tex-stone"} block-pop-sm no-rounded relative p-4 text-center`}
              >
                <div className="relative z-10">
                  <div className={`text-4xl mb-1 ${earned ? "" : "grayscale opacity-50"}`}>{b.icon}</div>
                  <div className={`font-pixel uppercase text-sm ${earned ? "text-[#212121]" : "text-white"}`}>{b.name}</div>
                  <div className={`text-xs font-bold mt-1 ${earned ? "text-[#212121]/80" : "text-white/80"}`}>{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
