import React from "react";

// Reusable blocky Minecraft-style button
export default function BlockButton({
  children,
  variant = "oak", // grass | dirt | stone | oak | diamond | gold
  size = "md",
  onClick,
  disabled = false,
  className = "",
  textId,
  ...rest
}) {
  const sizes = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl",
    xl: "px-10 py-5 text-3xl",
  };
  const texMap = {
    grass: "tex-grass",
    dirt: "tex-dirt",
    stone: "tex-stone",
    oak: "tex-oak",
    diamond: "tex-diamond",
    gold: "tex-gold",
  };
  const txtColor = variant === "stone" || variant === "dirt" || variant === "enderman" ? "text-white" : "text-[#212121]";
  return (
    <button
      data-testid={textId}
      onClick={onClick}
      disabled={disabled}
      className={`font-pixel uppercase ${sizes[size]} ${texMap[variant] || "tex-oak"} ${txtColor} block-pop lift-hover no-rounded relative select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      {...rest}
    >
      <span className="relative z-10 drop-shadow-[2px_2px_0_rgba(255,255,255,0.4)]">{children}</span>
    </button>
  );
}
