import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Volume2, VolumeX, Home, Award, RotateCcw } from "lucide-react";
import { SFX } from "@/lib/sounds";

export default function HUD({ state, setState, onReset }) {
  const loc = useLocation();
  const toggleSound = () => {
    SFX.click();
    setState((s) => ({ ...s, soundOn: !s.soundOn }));
  };
  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="tex-dirt block-pop no-rounded mx-3 mt-3 flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 relative z-10">
          <Link
            to="/"
            data-testid="hud-home-btn"
            onClick={() => SFX.click()}
            className="tex-grass block-pop-sm no-rounded relative inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-[#212121]"
            aria-label="Home"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" strokeWidth={3} />
          </Link>
          <Link
            to="/rewards"
            data-testid="hud-rewards-btn"
            onClick={() => SFX.click()}
            className="tex-gold block-pop-sm no-rounded relative inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-[#212121]"
            aria-label="Rewards"
          >
            <Award className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" strokeWidth={3} />
          </Link>
        </div>

        <div
          data-testid="diamond-counter"
          className="tex-diamond block-pop-sm no-rounded relative flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 font-pixel text-xl sm:text-2xl text-[#212121]"
        >
          <DiamondIcon className="h-6 w-6 sm:h-7 sm:w-7 relative z-10 anim-sparkle" />
          <span className="relative z-10 min-w-[1.5ch] text-center">{state.diamonds}</span>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {loc.pathname === "/" && (
            <button
              onClick={() => {
                if (window.confirm("Reset all progress?")) onReset();
              }}
              data-testid="hud-reset-btn"
              className="tex-stone block-pop-sm no-rounded relative inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-white"
              aria-label="Reset progress"
              title="Reset progress"
            >
              <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" strokeWidth={3} />
            </button>
          )}
          <button
            onClick={toggleSound}
            data-testid="sound-toggle-btn"
            className={`block-pop-sm no-rounded relative inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center ${state.soundOn ? "tex-grass text-[#212121]" : "tex-stone text-white"}`}
            aria-label={state.soundOn ? "Mute sound" : "Unmute sound"}
          >
            {state.soundOn ? (
              <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" strokeWidth={3} />
            ) : (
              <VolumeX className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiamondIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      {/* pixel-art diamond */}
      <rect x="5" y="2" width="6" height="1" fill="#A8FFF7" />
      <rect x="4" y="3" width="8" height="1" fill="#51EBE1" />
      <rect x="3" y="4" width="10" height="1" fill="#2BB8B0" />
      <rect x="3" y="5" width="10" height="1" fill="#51EBE1" />
      <rect x="4" y="6" width="8" height="1" fill="#2BB8B0" />
      <rect x="3" y="4" width="1" height="2" fill="#212121" />
      <rect x="12" y="4" width="1" height="2" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#212121" />
      <rect x="10" y="2" width="1" height="1" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="11" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="7" width="6" height="1" fill="#2BB8B0" />
      <rect x="6" y="8" width="4" height="1" fill="#2BB8B0" />
      <rect x="7" y="9" width="2" height="1" fill="#2BB8B0" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="11" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="8" width="1" height="1" fill="#212121" />
      <rect x="10" y="8" width="1" height="1" fill="#212121" />
      <rect x="6" y="9" width="1" height="1" fill="#212121" />
      <rect x="9" y="9" width="1" height="1" fill="#212121" />
      <rect x="7" y="10" width="2" height="1" fill="#212121" />
      <rect x="6" y="3" width="2" height="1" fill="#FFFFFF" />
    </svg>
  );
}
