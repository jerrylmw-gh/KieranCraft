import React from "react";
import { Lightbulb, SkipForward } from "lucide-react";
import { SFX } from "@/lib/sounds";

// Renders Hint + Skip buttons. Each game wires them up via callbacks.
export default function GamePerks({
  hintsLeft = 0,
  skipsLeft = 0,
  onHint,
  onSkip,
  disabled = false,
}) {
  if (hintsLeft === 0 && skipsLeft === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
      {hintsLeft > 0 && (
        <button
          onClick={() => {
            SFX.click();
            onHint && onHint();
          }}
          disabled={disabled}
          data-testid="perk-hint"
          className="tex-gold block-pop-sm lift-hover no-rounded relative px-4 py-2 font-pixel text-[#212121] inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Lightbulb className="h-5 w-5 relative z-10" strokeWidth={3} />
          <span className="relative z-10">Hint ({hintsLeft})</span>
        </button>
      )}
      {skipsLeft > 0 && (
        <button
          onClick={() => {
            SFX.click();
            onSkip && onSkip();
          }}
          disabled={disabled}
          data-testid="perk-skip"
          className="tex-diamond block-pop-sm lift-hover no-rounded relative px-4 py-2 font-pixel text-[#212121] inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SkipForward className="h-5 w-5 relative z-10" strokeWidth={3} />
          <span className="relative z-10">Skip ({skipsLeft})</span>
        </button>
      )}
    </div>
  );
}
