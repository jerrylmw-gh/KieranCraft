// Helpers to read active perks from skin + weapon
import { SKINS, WEAPONS } from "./gameState";

export function activeSkin(state) {
  return SKINS.find((s) => s.id === state.currentSkin) || SKINS[0];
}

export function activeWeapon(state) {
  if (!state.currentWeapon) return null;
  return WEAPONS.find((w) => w.id === state.currentWeapon) || null;
}

// Multiplier on all diamond rewards
export function diamondMultiplier(state) {
  const skin = activeSkin(state);
  const weapon = activeWeapon(state);
  let mult = 1;
  // Netherite axe overrides others to 2x
  if (weapon?.id === "netherite_axe") return 2;
  if (weapon?.id === "diamond_sword") mult *= 1.5;
  if (skin?.ability === "diamond_x15") mult *= 1.5;
  return mult;
}

export function applyMult(base, state) {
  const v = base * diamondMultiplier(state);
  return Math.max(1, Math.round(v));
}

// Per-round "win bonus" diamonds (added when level cleared)
export function roundBonus(state) {
  const weapon = activeWeapon(state);
  let bonus = 0;
  if (weapon?.id === "iron_sword") bonus += 3;
  if (weapon?.id === "enchanted_book") bonus += 5;
  return bonus;
}

// Memory match win bonus
export function memoryBonus(state) {
  const skin = activeSkin(state);
  return skin?.ability === "memory_bonus" ? 3 : 0;
}

// Math correct extra (per correct answer)
export function mathExtra(state) {
  const skin = activeSkin(state);
  return skin?.ability === "math_bonus" ? 1 : 0;
}

// Perfect-round bonus (called when level cleared & no wrongs)
export function perfectBonus(state) {
  const skin = activeSkin(state);
  return skin?.ability === "perfect_bonus" ? 2 : 0;
}

// Streak bonus (every 5 in a row adds +1)
export function streakBonus(state, streak) {
  const weapon = activeWeapon(state);
  if (weapon?.id === "wooden_sword" && streak > 0 && streak % 5 === 0) return 1;
  return 0;
}

// Charges available for hints (eliminate a wrong answer)
export function getMaxHints(state) {
  const weapon = activeWeapon(state);
  let h = 0;
  if (weapon?.id === "stone_pickaxe") h += 1;
  if (weapon?.id === "enchanted_book") h += 1;
  if (weapon?.id === "trident") h += 3;
  if (weapon?.id === "bow_arrow") h += 1; // bow gives 1 "reveal" — treated as hint
  return h;
}

// Charges available for skips (skip current question without penalty)
export function getMaxSkips(state) {
  const skin = activeSkin(state);
  const weapon = activeWeapon(state);
  let s = 0;
  if (skin?.ability === "free_skip") s += 1;
  if (weapon?.id === "golden_pickaxe") s += 1;
  if (weapon?.id === "trident") s += 3;
  return s;
}

// Daily chest cooldown (20h)
const DAILY_COOLDOWN_MS = 20 * 60 * 60 * 1000;
export function isDailyReady(state) {
  return (Date.now() - (state.lastDailyClaim || 0)) >= DAILY_COOLDOWN_MS;
}
export function nextDailyMs(state) {
  return Math.max(0, DAILY_COOLDOWN_MS - (Date.now() - (state.lastDailyClaim || 0)));
}

// Roll a daily reward — returns { type: "diamonds"|"weapon", amount?, weaponId? }
export function rollDaily(state) {
  const unowned = WEAPONS.filter((w) => !(state.weapons || []).includes(w.id));
  const r = Math.random();
  if (unowned.length && r < 0.08) {
    // 8% chance: a random unowned weapon (free!)
    const w = unowned[Math.floor(Math.random() * unowned.length)];
    return { type: "weapon", weaponId: w.id, weaponName: w.name };
  }
  if (r < 0.4) {
    // 32% chance: 5-12 diamonds
    return { type: "diamonds", amount: 5 + Math.floor(Math.random() * 8) };
  }
  if (r < 0.85) {
    // 45% chance: 13-25 diamonds
    return { type: "diamonds", amount: 13 + Math.floor(Math.random() * 13) };
  }
  // 15% chance: 26-40 diamonds
  return { type: "diamonds", amount: 26 + Math.floor(Math.random() * 15) };
}
