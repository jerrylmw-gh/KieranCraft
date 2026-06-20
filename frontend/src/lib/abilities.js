// Helpers to read active perks from skin + weapon + pet
import { SKINS, WEAPONS, PETS } from "./gameState";

export function activeSkin(state) {
  return SKINS.find((s) => s.id === state.currentSkin) || SKINS[0];
}
export function activeWeapon(state) {
  if (!state.currentWeapon) return null;
  return WEAPONS.find((w) => w.id === state.currentWeapon) || null;
}
export function activePet(state) {
  if (!state.currentPet) return null;
  return PETS.find((p) => p.id === state.currentPet) || null;
}

// Multiplier on diamond rewards
export function diamondMultiplier(state) {
  const skin = activeSkin(state);
  const weapon = activeWeapon(state);
  const pet = activePet(state);
  // Mythic overrides
  if (weapon?.id === "void_scythe") return 2.5;
  if (weapon?.id === "netherite_axe") return 2;
  if (skin?.id === "dragon_slayer") return 2;
  if (skin?.id === "shadow_ender") return 2;
  if (skin?.id === "frost_king") return 2;
  if (skin?.id === "magma_beast") return 1.5;
  if (weapon?.id === "inferno_blade") return 2;
  if (weapon?.id === "frost_bow") return 2;
  if (pet?.id === "phoenix") return 2;
  let mult = 1;
  if (weapon?.id === "diamond_sword") mult *= 1.5;
  if (skin?.ability === "diamond_x15") mult *= 1.5;
  if (pet?.id === "baby_dragon") mult *= 1.5;
  return mult;
}

export function applyMult(base, state) {
  const v = base * diamondMultiplier(state);
  // Add flat per-correct bonus from fox/nether_king/magma_beast/phoenix
  let extra = 0;
  const pet = activePet(state);
  const skin = activeSkin(state);
  if (pet?.id === "fox") extra += 1;
  if (skin?.id === "nether_king") extra += 1;
  if (skin?.id === "magma_beast") extra += 2;
  return Math.max(1, Math.round(v) + extra);
}

// Per-round "win bonus" added when level cleared
export function roundBonus(state) {
  const weapon = activeWeapon(state);
  const pet = activePet(state);
  let bonus = 0;
  if (weapon?.id === "iron_sword") bonus += 3;
  if (weapon?.id === "enchanted_book") bonus += 5;
  if (pet?.id === "pig") bonus += 2;
  return bonus;
}

// Memory match win bonus (per pair, applied once at win)
export function memoryBonus(state) {
  const skin = activeSkin(state);
  if (skin?.ability === "memory_bonus") return 3;
  return 0;
}

// Math correct extra (per correct answer)
export function mathExtra(state) {
  const skin = activeSkin(state);
  return skin?.ability === "math_bonus" ? 1 : 0;
}

// Perfect-round bonus
export function perfectBonus(state) {
  const skin = activeSkin(state);
  const pet = activePet(state);
  let b = 0;
  if (skin?.ability === "perfect_bonus") b += 2;
  if (pet?.id === "axolotl") b += 5;
  return b;
}

// Streak bonus (every 5 in a row)
export function getMaxHints(state) {
  const weapon = activeWeapon(state);
  const skin = activeSkin(state);
  const pet = activePet(state);
  let h = 0;
  if (weapon?.id === "stone_pickaxe") h += 1;
  if (weapon?.id === "enchanted_book") h += 1;
  if (weapon?.id === "trident") h += 3;
  if (weapon?.id === "bow_arrow") h += 1;
  if (weapon?.id === "frost_bow") h += 5;
  if (skin?.ability === "hint_master") h += 2;
  if (skin?.id === "nether_king") h += 1;
  if (skin?.id === "dragon_slayer") h += 2;
  if (skin?.id === "magma_beast") h += 2;
  if (skin?.id === "shadow_ender") h += 3;
  if (pet?.id === "wolf") h += 1;
  if (pet?.id === "parrot") h += 1;
  if (pet?.id === "phoenix") h += 1;
  return h;
}

export function getMaxSkips(state) {
  const skin = activeSkin(state);
  const weapon = activeWeapon(state);
  const pet = activePet(state);
  let s = 0;
  if (skin?.ability === "free_skip") s += 1;
  if (skin?.id === "dragon_slayer") s += 2;
  if (skin?.id === "frost_king") s += 2;
  if (skin?.id === "shadow_ender") s += 3;
  if (weapon?.id === "golden_pickaxe") s += 1;
  if (weapon?.id === "trident") s += 3;
  if (pet?.id === "cat") s += 1;
  if (pet?.id === "phoenix") s += 1;
  return s;
}

// Streak bonus
export function streakBonus(state, streak) {
  const weapon = activeWeapon(state);
  const skin = activeSkin(state);
  if (weapon?.id === "wooden_sword" && streak > 0 && streak % 5 === 0) {
    if (skin?.ability === "streak_x2" || skin?.id === "magma_beast") return 2;
    return 1;
  }
  return 0;
}

// Daily chest cooldown (20h)
const DAILY_COOLDOWN_MS = 20 * 60 * 60 * 1000;
export function isDailyReady(state) {
  return (Date.now() - (state.lastDailyClaim || 0)) >= DAILY_COOLDOWN_MS;
}
export function nextDailyMs(state) {
  return Math.max(0, DAILY_COOLDOWN_MS - (Date.now() - (state.lastDailyClaim || 0)));
}

export function rollDaily(state) {
  const unowned = WEAPONS.filter((w) => !(state.weapons || []).includes(w.id));
  const r = Math.random();
  if (unowned.length && r < 0.08) {
    const w = unowned[Math.floor(Math.random() * unowned.length)];
    return { type: "weapon", weaponId: w.id, weaponName: w.name };
  }
  if (r < 0.4) return { type: "diamonds", amount: 5 + Math.floor(Math.random() * 8) };
  if (r < 0.85) return { type: "diamonds", amount: 13 + Math.floor(Math.random() * 13) };
  return { type: "diamonds", amount: 26 + Math.floor(Math.random() * 15) };
}
