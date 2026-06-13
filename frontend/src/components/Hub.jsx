import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Type, Shapes, Brain, Move, PieChart } from "lucide-react";
import { SFX } from "@/lib/sounds";
import { SKINS, WEAPONS } from "@/lib/gameState";
import { CharacterAvatar, EmeraldIcon } from "./PixelIcons";
import { WeaponIcon } from "./WeaponIcons";
import { DiamondIcon } from "./HUD";
import DailyChest from "./DailyChest";

const GAMES = [
  { id: "math", path: "/play/math", title: "Math Mine", subtitle: "Add, Subtract, ×, ÷", Icon: Calculator, variant: "tex-stone", testId: "tile-math" },
  { id: "fraction", path: "/play/fraction", title: "Fraction Forge", subtitle: "Pies, Bars & Equivalents", Icon: PieChart, variant: "tex-diamond", testId: "tile-fraction" },
  { id: "letter", path: "/play/letter", title: "Letter Quest", subtitle: "Dig Out the Right Letter", Icon: Type, variant: "tex-oak", testId: "tile-letter" },
  { id: "shape", path: "/play/shape", title: "Shape Sort", subtitle: "Match Color & Shape", Icon: Shapes, variant: "tex-diamond", testId: "tile-shape" },
  { id: "memory", path: "/play/memory", title: "Memory Match", subtitle: "Find Matching Blocks", Icon: Brain, variant: "tex-gold", testId: "tile-memory" },
  { id: "code", path: "/play/code", title: "Code Steve", subtitle: "Guide Steve to Diamond", Icon: Move, variant: "tex-grass", testId: "tile-code" },
];

export default function Hub({ state, setState }) {
  const currentSkin = SKINS.find((s) => s.id === state.currentSkin) || SKINS[0];
  const currentWeapon = WEAPONS.find((w) => w.id === state.currentWeapon);
  return (
    <div className="px-4 sm:px-6 lg:px-10 pb-16 pt-6">
      {/* Welcome banner */}
      <div className="mx-auto max-w-6xl">
        <div className="tex-grass block-pop no-rounded relative p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="relative z-10 flex items-center gap-4 sm:gap-6">
            <div className="tex-dirt block-pop-sm no-rounded relative shrink-0 p-2">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 anim-bob">
                <CharacterAvatar skin={currentSkin} className="h-full w-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 data-testid="hub-title" className="font-pixel text-3xl sm:text-5xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)] uppercase leading-tight">
                Hi, Builder!
              </h1>
              <p className="font-bold text-white/95 text-base sm:text-xl mt-1 drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
                Pick a quest to start mining for diamonds.
              </p>
              {currentWeapon && (
                <div data-testid="equipped-weapon" className="mt-2 inline-flex items-center gap-2 bg-black/30 border-2 border-black no-rounded px-2 py-1">
                  <div className="h-6 w-6">
                    <WeaponIcon id={currentWeapon.id} className="h-full w-full" />
                  </div>
                  <span className="font-pixel uppercase text-white text-sm drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
                    {currentWeapon.name}
                  </span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-center">
              <div className="anim-spin-block h-16 w-16">
                <DiamondIcon className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard label="Diamonds" value={state.diamonds} variant="tex-diamond" testId="stat-diamonds" />
          <StatCard label="Badges" value={state.badges.length} variant="tex-gold" testId="stat-badges" />
          <StatCard label="Skins" value={state.skins.length} variant="tex-oak" testId="stat-skins" />
          <StatCard label="Wins" value={state.gamesPlayed} variant="tex-grass" testId="stat-wins" />
        </div>

        {/* Daily Chest */}
        <div className="mb-8">
          <DailyChest state={state} setState={setState} />
        </div>

        {/* Game tiles */}
        <h2 className="font-pixel text-2xl sm:text-3xl uppercase text-[#212121] mb-4 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
          Quests
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GAMES.map((g) => (
            <Link
              key={g.id}
              to={g.path}
              data-testid={g.testId}
              onClick={() => SFX.click()}
              className={`${g.variant} block-pop lift-hover no-rounded relative p-6 min-h-[180px] flex flex-col justify-between text-[#212121]`}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="tex-dirt block-pop-sm no-rounded relative h-14 w-14 flex items-center justify-center">
                  <g.Icon className="h-7 w-7 text-white relative z-10" strokeWidth={3} />
                </div>
                <div className="bg-[#212121] text-white font-pixel uppercase px-2 py-1 text-xs">
                  Play
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <h3 className="font-pixel text-2xl sm:text-3xl uppercase leading-tight drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
                  {g.title}
                </h3>
                <p className="font-bold text-base mt-1 opacity-90">{g.subtitle}</p>
              </div>
            </Link>
          ))}

          {/* Rewards tile */}
          <Link
            to="/rewards"
            data-testid="tile-rewards"
            onClick={() => SFX.click()}
            className="tex-dirt block-pop lift-hover no-rounded relative p-6 min-h-[180px] flex flex-col justify-between text-white"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="tex-gold block-pop-sm no-rounded relative h-14 w-14 flex items-center justify-center">
                <EmeraldIcon className="h-9 w-9 relative z-10" />
              </div>
              <div className="bg-[#FEE12B] text-[#212121] font-pixel uppercase px-2 py-1 text-xs">
                Open
              </div>
            </div>
            <div className="relative z-10 mt-4">
              <h3 className="font-pixel text-2xl sm:text-3xl uppercase leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                Treasure Chest
              </h3>
              <p className="font-bold text-base mt-1 opacity-95">Badges & Skins</p>
            </div>
          </Link>
        </div>

        <div className="mt-10 mx-auto max-w-3xl tex-sky block-pop no-rounded relative p-5">
          <p className="relative z-10 font-bold text-[#212121] text-center">
            <span className="font-pixel uppercase text-xl mr-2">Tip:</span>
            Earn diamonds in any quest. Spend them in the Treasure Chest to unlock new skins!
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, variant, testId }) {
  return (
    <div data-testid={testId} className={`${variant} block-pop-sm no-rounded relative p-4 text-center`}>
      <div className="relative z-10">
        <div className="font-pixel text-3xl sm:text-4xl text-[#212121]">{value}</div>
        <div className="font-pixel uppercase text-xs sm:text-sm text-[#212121] tracking-widest mt-1">{label}</div>
      </div>
    </div>
  );
}
