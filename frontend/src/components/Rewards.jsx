import React, { useState } from "react";
import { SKINS, BADGES, WEAPONS, PETS, RARITY, checkBadges } from "@/lib/gameState";
import { CharacterAvatar } from "./PixelIcons";
import { DiamondIcon } from "./HUD";
import { WeaponIcon } from "./WeaponIcons";
import { PetIcon } from "./PetIcons";
import BlockButton from "./BlockButton";
import { SFX } from "@/lib/sounds";
import { Lock, Check } from "lucide-react";

export default function Rewards({ state, setState }) {
  const [tab, setTab] = useState("skins");
  const [msg, setMsg] = useState("");

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 1800);
  };

  const buySkin = (skin) => {
    if (state.skins.includes(skin.id)) {
      SFX.click();
      setState((s) => ({ ...s, currentSkin: skin.id }));
      flash(`${skin.name} equipped!`);
      return;
    }
    if (state.diamonds < skin.cost) {
      SFX.wrong();
      flash(`Need ${skin.cost - state.diamonds} more diamonds`);
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
    flash(`Unlocked ${skin.name}!`);
  };

  const buyWeapon = (weapon) => {
    const owned = (state.weapons || []).includes(weapon.id);
    if (owned) {
      SFX.click();
      const equipping = state.currentWeapon === weapon.id;
      setState((s) => ({ ...s, currentWeapon: equipping ? null : weapon.id }));
      flash(equipping ? `${weapon.name} unequipped` : `${weapon.name} equipped!`);
      return;
    }
    if (state.diamonds < weapon.cost) {
      SFX.wrong();
      flash(`Need ${weapon.cost - state.diamonds} more diamonds`);
      return;
    }
    SFX.badge();
    setState((s) => {
      const next = {
        ...s,
        diamonds: s.diamonds - weapon.cost,
        weapons: [...(s.weapons || []), weapon.id],
        currentWeapon: weapon.id,
      };
      const { badges } = checkBadges(next);
      return { ...next, badges };
    });
    flash(`Forged ${weapon.name}!`);
  };

  const buyPet = (pet) => {
    const owned = (state.pets || []).includes(pet.id);
    if (owned) {
      SFX.click();
      const equipping = state.currentPet === pet.id;
      setState((s) => ({ ...s, currentPet: equipping ? null : pet.id }));
      flash(equipping ? `${pet.name} sent home` : `${pet.name} is your buddy now!`);
      return;
    }
    if (pet.unlockReq) {
      SFX.wrong();
      flash(pet.unlockReq);
      return;
    }
    if (state.diamonds < pet.cost) {
      SFX.wrong();
      flash(`Need ${pet.cost - state.diamonds} more diamonds`);
      return;
    }
    SFX.badge();
    setState((s) => {
      const next = {
        ...s,
        diamonds: s.diamonds - pet.cost,
        pets: [...(s.pets || []), pet.id],
        currentPet: pet.id,
      };
      const { badges } = checkBadges(next);
      return { ...next, badges };
    });
    flash(`Adopted ${pet.name}!`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      <div className="mx-auto max-w-6xl">
        <div className="tex-oak block-pop no-rounded relative p-6 mb-6">
          <h1
            data-testid="rewards-title"
            className="relative z-10 font-pixel text-3xl sm:text-5xl uppercase text-[#212121] drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]"
          >
            Treasure Chest
          </h1>
          <p className="relative z-10 font-bold text-[#212121] mt-1 text-base sm:text-lg opacity-90">
            Forge weapons. Equip heroes. Collect badges.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-5 flex-wrap">
          <TabBtn id="skins" cur={tab} onClick={setTab}>Heroes</TabBtn>
          <TabBtn id="weapons" cur={tab} onClick={setTab}>Weapons</TabBtn>
          <TabBtn id="pets" cur={tab} onClick={setTab}>Pets</TabBtn>
          <TabBtn id="badges" cur={tab} onClick={setTab}>Badges</TabBtn>
        </div>

        {msg && (
          <div
            data-testid="rewards-msg"
            className="tex-gold block-pop-sm no-rounded relative p-3 mb-5 text-center font-pixel uppercase text-[#212121] text-xl anim-pop-in"
          >
            <span className="relative z-10">{msg}</span>
          </div>
        )}

        {tab === "skins" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
            {SKINS.map((skin) => {
              const owned = state.skins.includes(skin.id);
              const equipped = state.currentSkin === skin.id;
              const rarity = RARITY[skin.rarity || "common"];
              return (
                <div
                  key={skin.id}
                  data-testid={`skin-${skin.id}`}
                  className={`tex-stone block-pop no-rounded relative p-4 flex flex-col items-center ${equipped ? "outline outline-4 outline-offset-2 outline-[#FEE12B]" : ""}`}
                  style={{ borderColor: rarity.color }}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 font-pixel uppercase text-xs border-2 border-[#212121] no-rounded z-20`}
                       style={{ background: rarity.color, color: skin.rarity === "legendary" ? "#212121" : "#FFFFFF" }}>
                    {rarity.label}
                  </div>
                  <div className="relative z-10 w-full text-center">
                    <div className="tex-dirt block-pop-sm no-rounded relative p-3 mx-auto w-fit mb-3">
                      <div className="relative h-20 w-20 anim-bob">
                        <CharacterAvatar skin={skin} className="h-full w-full" />
                      </div>
                    </div>
                    <div className="font-pixel uppercase text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                      {skin.name}
                    </div>
                    <div className="font-bold text-white/95 text-xs mt-1 min-h-[2rem] px-1">
                      {skin.abilityDesc}
                    </div>
                    <div className="flex items-center justify-center gap-1 my-2 font-pixel text-lg text-white">
                      {owned ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-4 w-4" strokeWidth={3} /> Owned
                        </span>
                      ) : skin.unlockReq ? (
                        <span className="text-yellow-200 text-xs">{skin.unlockReq}</span>
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
                      onClick={() => buySkin(skin)}
                      textId={`skin-action-${skin.id}`}
                      disabled={equipped || (!owned && skin.unlockReq)}
                      className="w-full"
                    >
                      {equipped
                        ? "Equipped"
                        : owned
                          ? "Equip"
                          : skin.unlockReq
                            ? <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4" strokeWidth={3} /> Locked</span>
                            : state.diamonds >= skin.cost ? "Unlock" : (
                              <span className="inline-flex items-center gap-1">
                                <Lock className="h-4 w-4" strokeWidth={3} /> Locked
                              </span>
                            )}
                    </BlockButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "weapons" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
            {WEAPONS.map((w) => {
              const owned = (state.weapons || []).includes(w.id);
              const equipped = state.currentWeapon === w.id;
              return (
                <div
                  key={w.id}
                  data-testid={`weapon-${w.id}`}
                  className={`tex-dirt block-pop no-rounded relative p-4 flex flex-col items-center ${equipped ? "outline outline-4 outline-offset-2 outline-[#51EBE1]" : ""}`}
                >
                  <div className="relative z-10 w-full text-center">
                    <div
                      className="block-pop-sm no-rounded relative p-3 mx-auto w-fit mb-3"
                      style={{ background: w.color }}
                    >
                      <div className="relative h-20 w-20 anim-bob">
                        <WeaponIcon id={w.id} className="h-full w-full" />
                      </div>
                    </div>
                    <div className="font-pixel uppercase text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                      {w.name}
                    </div>
                    <div className="font-bold text-white/95 text-xs mt-1 min-h-[2.5rem] px-1">
                      {w.perkDesc}
                    </div>
                    <div className="flex items-center justify-center gap-1 my-2 font-pixel text-lg text-white">
                      {owned ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-4 w-4" strokeWidth={3} /> Owned
                        </span>
                      ) : (
                        <>
                          <DiamondIcon className="h-5 w-5" />
                          <span>{w.cost}</span>
                        </>
                      )}
                    </div>
                    <BlockButton
                      variant={owned ? (equipped ? "diamond" : "grass") : "gold"}
                      size="sm"
                      onClick={() => buyWeapon(w)}
                      textId={`weapon-action-${w.id}`}
                      className="w-full"
                    >
                      {equipped
                        ? "Unequip"
                        : owned
                          ? "Equip"
                          : state.diamonds >= w.cost ? "Forge" : (
                            <span className="inline-flex items-center gap-1">
                              <Lock className="h-4 w-4" strokeWidth={3} /> Locked
                            </span>
                          )}
                    </BlockButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "pets" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
            {PETS.map((pet) => {
              const owned = (state.pets || []).includes(pet.id);
              const equipped = state.currentPet === pet.id;
              const rarity = RARITY[pet.rarity || "common"];
              return (
                <div
                  key={pet.id}
                  data-testid={`pet-${pet.id}`}
                  className={`tex-stone block-pop no-rounded relative p-4 flex flex-col items-center ${equipped ? "outline outline-4 outline-offset-2 outline-[#A8FFB2]" : ""}`}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 font-pixel uppercase text-xs border-2 border-[#212121] no-rounded z-20`}
                       style={{ background: rarity.color, color: pet.rarity === "legendary" ? "#212121" : "#FFFFFF" }}>
                    {rarity.label}
                  </div>
                  <div className="relative z-10 w-full text-center">
                    <div className="block-pop-sm no-rounded relative p-3 mx-auto w-fit mb-3"
                         style={{ background: pet.color }}>
                      <div className="relative h-20 w-20 anim-bob">
                        <PetIcon id={pet.id} className="h-full w-full" />
                      </div>
                    </div>
                    <div className="font-pixel uppercase text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                      {pet.name}
                    </div>
                    <div className="font-bold text-white/95 text-xs mt-1 min-h-[2.5rem] px-1">
                      {pet.abilityDesc}
                    </div>
                    <div className="flex items-center justify-center gap-1 my-2 font-pixel text-lg text-white">
                      {owned ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-4 w-4" strokeWidth={3} /> Owned
                        </span>
                      ) : pet.unlockReq ? (
                        <span className="text-yellow-200 text-xs">{pet.unlockReq}</span>
                      ) : (
                        <>
                          <DiamondIcon className="h-5 w-5" />
                          <span>{pet.cost}</span>
                        </>
                      )}
                    </div>
                    <BlockButton
                      variant={owned ? (equipped ? "diamond" : "grass") : "gold"}
                      size="sm"
                      onClick={() => buyPet(pet)}
                      textId={`pet-action-${pet.id}`}
                      disabled={!owned && pet.unlockReq}
                      className="w-full"
                    >
                      {equipped
                        ? "Unequip"
                        : owned
                          ? "Adopt"
                          : pet.unlockReq
                            ? <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4" strokeWidth={3} /> Locked</span>
                            : state.diamonds >= pet.cost ? "Adopt" : (
                              <span className="inline-flex items-center gap-1">
                                <Lock className="h-4 w-4" strokeWidth={3} /> Locked
                              </span>
                            )}
                    </BlockButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "badges" && (
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
                    <div className={`text-4xl mb-1 ${earned ? "" : "grayscale opacity-50"}`}>
                      {b.icon}
                    </div>
                    <div className={`font-pixel uppercase text-sm ${earned ? "text-[#212121]" : "text-white"}`}>
                      {b.name}
                    </div>
                    <div className={`text-xs font-bold mt-1 ${earned ? "text-[#212121]/80" : "text-white/80"}`}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({ id, cur, onClick, children }) {
  const active = id === cur;
  return (
    <button
      data-testid={`rewards-tab-${id}`}
      onClick={() => {
        SFX.click();
        onClick(id);
      }}
      className={`${active ? "tex-grass text-white" : "tex-stone text-white opacity-80"} block-pop-sm lift-hover no-rounded relative px-5 py-2 font-pixel uppercase text-lg`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
