import React from "react";

// Pixel-art SVG icons (Minecraft-style) — no external image files
export function CreeperIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" fill="#5E9D34" />
      <rect x="2" y="2" width="12" height="3" fill="#6FB83F" />
      <rect x="2" y="11" width="12" height="3" fill="#3F6B22" />
      {/* eyes */}
      <rect x="4" y="6" width="2" height="2" fill="#212121" />
      <rect x="10" y="6" width="2" height="2" fill="#212121" />
      {/* mouth */}
      <rect x="6" y="9" width="1" height="3" fill="#212121" />
      <rect x="9" y="9" width="1" height="3" fill="#212121" />
      <rect x="7" y="10" width="2" height="2" fill="#212121" />
      {/* outline */}
      <rect x="2" y="2" width="12" height="1" fill="#212121" />
      <rect x="2" y="13" width="12" height="1" fill="#212121" />
      <rect x="2" y="2" width="1" height="12" fill="#212121" />
      <rect x="13" y="2" width="1" height="12" fill="#212121" />
    </svg>
  );
}

export function PigIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" fill="#F4A8B8" />
      <rect x="2" y="3" width="12" height="2" fill="#FFC4D2" />
      <rect x="5" y="6" width="2" height="2" fill="#212121" />
      <rect x="9" y="6" width="2" height="2" fill="#212121" />
      <rect x="6" y="9" width="4" height="2" fill="#D88498" />
      <rect x="7" y="10" width="1" height="1" fill="#212121" />
      <rect x="8" y="10" width="1" height="1" fill="#212121" />
      <rect x="2" y="3" width="12" height="1" fill="#212121" />
      <rect x="2" y="12" width="12" height="1" fill="#212121" />
      <rect x="2" y="3" width="1" height="10" fill="#212121" />
      <rect x="13" y="3" width="1" height="10" fill="#212121" />
    </svg>
  );
}

export function GoldIngot({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="5" width="12" height="6" fill="#FEE12B" />
      <rect x="2" y="5" width="12" height="2" fill="#FFF59A" />
      <rect x="2" y="9" width="12" height="2" fill="#D9A800" />
      <rect x="2" y="5" width="12" height="1" fill="#212121" />
      <rect x="2" y="10" width="12" height="1" fill="#212121" />
      <rect x="2" y="5" width="1" height="6" fill="#212121" />
      <rect x="13" y="5" width="1" height="6" fill="#212121" />
    </svg>
  );
}

export function ApplePixel({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="3" width="2" height="2" fill="#3F6B22" />
      <rect x="6" y="2" width="1" height="1" fill="#3F6B22" />
      <rect x="4" y="5" width="8" height="8" fill="#E63946" />
      <rect x="4" y="5" width="3" height="2" fill="#FF6B73" />
      <rect x="4" y="5" width="8" height="1" fill="#212121" />
      <rect x="4" y="12" width="8" height="1" fill="#212121" />
      <rect x="4" y="5" width="1" height="8" fill="#212121" />
      <rect x="11" y="5" width="1" height="8" fill="#212121" />
    </svg>
  );
}

export function TntIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" fill="#E63946" />
      <rect x="2" y="6" width="12" height="4" fill="#FFFFFF" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="6" y="7" width="1" height="1" fill="#212121" />
      <rect x="8" y="7" width="1" height="1" fill="#212121" />
      <rect x="10" y="7" width="1" height="1" fill="#212121" />
      <text x="5" y="9.5" fontFamily="monospace" fontSize="3" fill="#212121" fontWeight="bold">TNT</text>
      <rect x="2" y="2" width="12" height="1" fill="#212121" />
      <rect x="2" y="13" width="12" height="1" fill="#212121" />
      <rect x="2" y="2" width="1" height="12" fill="#212121" />
      <rect x="13" y="2" width="1" height="12" fill="#212121" />
    </svg>
  );
}

export function EmeraldIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="2" width="6" height="1" fill="#A8FFB2" />
      <rect x="4" y="3" width="8" height="1" fill="#5E9D34" />
      <rect x="3" y="4" width="10" height="3" fill="#3F6B22" />
      <rect x="4" y="5" width="3" height="1" fill="#A8FFB2" />
      <rect x="5" y="7" width="6" height="1" fill="#3F6B22" />
      <rect x="6" y="8" width="4" height="1" fill="#3F6B22" />
      <rect x="7" y="9" width="2" height="1" fill="#3F6B22" />
      <rect x="3" y="4" width="1" height="3" fill="#212121" />
      <rect x="12" y="4" width="1" height="3" fill="#212121" />
      <rect x="4" y="3" width="1" height="1" fill="#212121" />
      <rect x="11" y="3" width="1" height="1" fill="#212121" />
      <rect x="5" y="2" width="1" height="1" fill="#212121" />
      <rect x="10" y="2" width="1" height="1" fill="#212121" />
      <rect x="4" y="7" width="1" height="1" fill="#212121" />
      <rect x="11" y="7" width="1" height="1" fill="#212121" />
      <rect x="5" y="8" width="1" height="1" fill="#212121" />
      <rect x="10" y="8" width="1" height="1" fill="#212121" />
      <rect x="6" y="9" width="1" height="1" fill="#212121" />
      <rect x="9" y="9" width="1" height="1" fill="#212121" />
      <rect x="7" y="10" width="2" height="1" fill="#212121" />
    </svg>
  );
}

// Character avatar — uses skin face/color
export function CharacterAvatar({ skin, className = "h-24 w-24" }) {
  const faceColor = skin?.face || "#E6B89C";
  const bodyColor = skin?.color || "#5BBAFF";
  const id = skin?.id || "steve";
  // Special "creeper" face
  if (id === "creeper") {
    return (
      <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges">
        <rect x="3" y="2" width="10" height="10" fill={faceColor} />
        <rect x="3" y="2" width="10" height="2" fill="#6FB83F" />
        <rect x="5" y="5" width="2" height="2" fill="#212121" />
        <rect x="9" y="5" width="2" height="2" fill="#212121" />
        <rect x="6" y="8" width="1" height="3" fill="#212121" />
        <rect x="9" y="8" width="1" height="3" fill="#212121" />
        <rect x="7" y="9" width="2" height="2" fill="#212121" />
        <rect x="3" y="12" width="10" height="2" fill={bodyColor} />
        <rect x="3" y="2" width="10" height="1" fill="#212121" />
        <rect x="3" y="13" width="10" height="1" fill="#212121" />
        <rect x="3" y="2" width="1" height="12" fill="#212121" />
        <rect x="12" y="2" width="1" height="12" fill="#212121" />
      </svg>
    );
  }
  // Default Steve/Alex-like face + body
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges">
      {/* head */}
      <rect x="4" y="1" width="8" height="6" fill={faceColor} />
      {/* hair */}
      <rect x="4" y="1" width="8" height="2" fill="#3B2A18" />
      {/* eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#FFFFFF" />
      <rect x="7" y="4" width="1" height="1" fill="#3D6BFF" />
      <rect x="9" y="4" width="1" height="1" fill="#FFFFFF" />
      <rect x="10" y="4" width="1" height="1" fill="#3D6BFF" />
      {/* mouth */}
      <rect x="7" y="6" width="2" height="1" fill="#7A4A2A" />
      {/* body */}
      <rect x="4" y="7" width="8" height="5" fill={bodyColor} />
      {/* arms */}
      <rect x="3" y="7" width="1" height="5" fill={bodyColor} />
      <rect x="12" y="7" width="1" height="5" fill={bodyColor} />
      {/* legs */}
      <rect x="5" y="12" width="3" height="3" fill="#2D4D9A" />
      <rect x="8" y="12" width="3" height="3" fill="#2D4D9A" />
      {/* outline */}
      <rect x="4" y="1" width="8" height="1" fill="#212121" />
      <rect x="3" y="7" width="10" height="1" fill="#212121" opacity="0.3" />
      <rect x="4" y="1" width="1" height="6" fill="#212121" />
      <rect x="11" y="1" width="1" height="6" fill="#212121" />
      <rect x="5" y="14" width="3" height="1" fill="#212121" />
      <rect x="8" y="14" width="3" height="1" fill="#212121" />
    </svg>
  );
}
