// Game state management using localStorage
const KEY = "mc_learn_v1";

const DEFAULT_STATE = {
  diamonds: 0,
  correctAnswers: 0,
  gamesPlayed: 0,
  soundOn: true,
  difficulty: "normal", // "normal" | "hard"
  badges: [], // ids
  skins: ["steve"], // unlocked
  currentSkin: "steve",
  weapons: [], // unlocked weapon ids
  currentWeapon: null,
  pets: [], // unlocked pet ids
  currentPet: null,
  bossWins: { creeper_king: 0, skeleton_lord: 0, ender_dragon: 0 },
  nightmareWins: { creeper_king: 0, skeleton_lord: 0, ender_dragon: 0 },
  endlessHighScore: 0,
  lastDailyClaim: 0, // ms timestamp
  stats: {
    math: { correct: 0, attempts: 0 },
    fraction: { correct: 0, attempts: 0 },
    letter: { correct: 0, attempts: 0 },
    shape: { correct: 0, attempts: 0 },
    memory: { wins: 0 },
    code: { wins: 0 },
    boss: { wins: 0 },
    endless: { best: 0 },
  },
};

export const RARITY = {
  common: { label: "Common", color: "#9B9B9B", glow: "#FFFFFF" },
  rare: { label: "Rare", color: "#3D6BFF", glow: "#7AA8FF" },
  epic: { label: "Epic", color: "#A04AFF", glow: "#D094FF" },
  legendary: { label: "Legendary", color: "#FEE12B", glow: "#FFF59A" },
  mythic: { label: "Mythic", color: "#FF1493", glow: "#FF87C8" },
};

export const SKINS = [
  { id: "steve", name: "Steve", cost: 0, rarity: "common", color: "#5BBAFF", face: "#E6B89C", ability: "balanced", abilityDesc: "Balanced hero — ready for anything." },
  { id: "alex", name: "Alex", cost: 10, rarity: "common", color: "#9ED36A", face: "#F5C5A0", ability: "perfect_bonus", abilityDesc: "+2 💎 on a perfect round (no wrongs)." },
  { id: "creeper", name: "Creeper", cost: 25, rarity: "rare", color: "#5E9D34", face: "#3F6B22", ability: "memory_bonus", abilityDesc: "+3 💎 per Memory Match win." },
  { id: "knight", name: "Knight", cost: 40, rarity: "rare", color: "#D0D0E0", face: "#FFD7A0", ability: "math_bonus", abilityDesc: "+1 💎 per Math correct answer." },
  { id: "wizard", name: "Wizard", cost: 60, rarity: "rare", color: "#A04AFF", face: "#FFD7A0", ability: "hint_master", abilityDesc: "+2 Hints per game." },
  { id: "zombie", name: "Zombie", cost: 50, rarity: "rare", color: "#79553A", face: "#5E9D34", ability: "math_bonus", abilityDesc: "+1 💎 per Math correct answer." },
  { id: "enderman", name: "Enderman", cost: 100, rarity: "epic", color: "#212121", face: "#A04AFF", ability: "free_skip", abilityDesc: "1 free Skip in every game." },
  { id: "ninja", name: "Ninja", cost: 120, rarity: "epic", color: "#212121", face: "#8B5CF6", ability: "streak_x2", abilityDesc: "Double streak bonus (+2 every 5 in a row)." },
  { id: "pig_man", name: "Pig Man", cost: 150, rarity: "epic", color: "#F4A8B8", face: "#D88498", ability: "memory_bonus", abilityDesc: "+3 💎 per Memory Match win." },
  { id: "diamond_hero", name: "Diamond Hero", cost: 200, rarity: "epic", color: "#51EBE1", face: "#FFFFFF", ability: "diamond_x15", abilityDesc: "1.5× all diamond rewards." },
  { id: "nether_king", name: "Nether King", cost: 0, rarity: "legendary", color: "#A03030", face: "#FFD700", ability: "all_bonus", abilityDesc: "+1 💎 in any game + 1 Hint.", unlockReq: "Beat Skeleton Lord" },
  { id: "dragon_slayer", name: "Dragon Slayer", cost: 0, rarity: "legendary", color: "#FEE12B", face: "#FFFFFF", ability: "ultimate", abilityDesc: "2× diamonds + 2 Hints + 2 Skips.", unlockReq: "Beat Ender Dragon" },
  // Mythic — from Nightmare wins
  { id: "magma_beast", name: "Magma Beast", cost: 0, rarity: "mythic", color: "#FF3D00", face: "#FFE0B0", ability: "mythic_fire", abilityDesc: "+2 💎 per correct + 2 Hints + Streak ×2.", unlockReq: "Beat Nightmare Creeper King" },
  { id: "frost_king", name: "Frost King", cost: 0, rarity: "mythic", color: "#7AC8FF", face: "#FFFFFF", ability: "mythic_ice", abilityDesc: "2× diamonds + 2 Skips + +1 hp in Boss.", unlockReq: "Beat Nightmare Skeleton Lord" },
  { id: "shadow_ender", name: "Shadow Ender", cost: 0, rarity: "mythic", color: "#0D0D0D", face: "#FF1493", ability: "mythic_void", abilityDesc: "2× diamonds + 3 Hints + 3 Skips.", unlockReq: "Beat Nightmare Ender Dragon" },
];

export const WEAPONS = [
  { id: "wooden_sword", name: "Wooden Sword", cost: 5, type: "sword", color: "#B8945F", perkDesc: "Streak bonus: +1 💎 every 5 in a row." },
  { id: "stone_pickaxe", name: "Stone Pickaxe", cost: 15, type: "pickaxe", color: "#9B9B9B", perkDesc: "1 Hint per game (reveals 1 wrong)." },
  { id: "iron_sword", name: "Iron Sword", cost: 30, type: "sword", color: "#D0D0E0", perkDesc: "+3 💎 per round cleared." },
  { id: "golden_pickaxe", name: "Golden Pickaxe", cost: 50, type: "pickaxe", color: "#FEE12B", perkDesc: "1 Skip per game (no penalty)." },
  { id: "bow_arrow", name: "Bow & Arrow", cost: 75, type: "bow", color: "#79553A", perkDesc: "1 Reveal per game (shows answer)." },
  { id: "diamond_sword", name: "Diamond Sword", cost: 100, type: "sword", color: "#51EBE1", perkDesc: "1.5× all diamonds." },
  { id: "trident", name: "Trident", cost: 150, type: "trident", color: "#2BB8B0", perkDesc: "3 Skips + 3 Hints per game." },
  { id: "enchanted_book", name: "Enchanted Book", cost: 200, type: "book", color: "#A04AFF", perkDesc: "+5 💎 per round + 1 Hint." },
  { id: "netherite_axe", name: "Netherite Axe", cost: 300, type: "axe", color: "#3B2E2A", perkDesc: "2× ALL diamonds (replaces other multipliers)." },
  // Mythic weapons — from Nightmare wins
  { id: "inferno_blade", name: "Inferno Blade", cost: 0, rarity: "mythic", type: "sword", color: "#FF3D00", perkDesc: "2× diamonds + Crit dmg ×2 in Boss.", unlockReq: "Beat Nightmare Creeper King" },
  { id: "frost_bow", name: "Frost Bow", cost: 0, rarity: "mythic", type: "bow", color: "#7AC8FF", perkDesc: "2× diamonds + 5 Hints per game.", unlockReq: "Beat Nightmare Skeleton Lord" },
  { id: "void_scythe", name: "Void Scythe", cost: 0, rarity: "mythic", type: "scythe", color: "#FF1493", perkDesc: "2.5× ALL diamonds (mythic multiplier).", unlockReq: "Beat Nightmare Ender Dragon" },
];

export const PETS = [
  { id: "pig", name: "Pig", cost: 10, rarity: "common", color: "#F4A8B8", abilityDesc: "+2 💎 per round cleared." },
  { id: "wolf", name: "Wolf", cost: 30, rarity: "common", color: "#D0D0D0", abilityDesc: "+1 Hint per game." },
  { id: "cat", name: "Cat", cost: 40, rarity: "rare", color: "#3B2E2A", abilityDesc: "+1 Skip per game." },
  { id: "fox", name: "Fox", cost: 75, rarity: "rare", color: "#E07A4A", abilityDesc: "+1 💎 per correct in any game." },
  { id: "parrot", name: "Parrot", cost: 120, rarity: "epic", color: "#5BBAFF", abilityDesc: "Reveals 1 extra wrong in Math." },
  { id: "axolotl", name: "Axolotl", cost: 180, rarity: "epic", color: "#FFB6E1", abilityDesc: "+5 💎 on a perfect round." },
  { id: "baby_dragon", name: "Baby Dragon", cost: 0, rarity: "legendary", color: "#A04AFF", abilityDesc: "1.5× ALL diamonds.", unlockReq: "Beat Ender Dragon" },
  // Mythic pet — beat all 3 Nightmare bosses
  { id: "phoenix", name: "Phoenix", cost: 0, rarity: "mythic", color: "#FF6B00", abilityDesc: "2× diamonds + 1 Free Skip + 1 Free Hint.", unlockReq: "Beat all 3 Nightmare bosses" },
];

export const BADGES = [
  { id: "first_win", name: "First Win", icon: "🏆", desc: "Win your first game" },
  { id: "math_5", name: "Block Counter", icon: "➕", desc: "Solve 5 math problems" },
  { id: "math_25", name: "Math Master", icon: "✖️", desc: "Solve 25 math problems" },
  { id: "fraction_5", name: "Fraction Friend", icon: "🥧", desc: "Solve 5 fractions" },
  { id: "fraction_25", name: "Fraction Forger", icon: "📐", desc: "Solve 25 fractions" },
  { id: "letter_5", name: "Letter Digger", icon: "🔤", desc: "Spell 5 words" },
  { id: "letter_25", name: "Word Wizard", icon: "📖", desc: "Spell 25 words" },
  { id: "shape_10", name: "Shape Shaper", icon: "🔷", desc: "Sort 10 shapes" },
  { id: "memory_5", name: "Memory Miner", icon: "🧠", desc: "Win 5 memory games" },
  { id: "code_5", name: "Code Crafter", icon: "🧭", desc: "Solve 5 code puzzles" },
  { id: "diamond_50", name: "Diamond Collector", icon: "💎", desc: "Collect 50 diamonds" },
  { id: "diamond_100", name: "Diamond Hoarder", icon: "💠", desc: "Collect 100 diamonds" },
  { id: "weapon_3", name: "Armorer", icon: "⚔️", desc: "Own 3 weapons" },
  { id: "weapon_6", name: "Weapon Master", icon: "🛡️", desc: "Own 6 weapons" },
  { id: "skin_3", name: "Style Switcher", icon: "🎭", desc: "Own 3 skins" },
  { id: "pet_3", name: "Pet Friend", icon: "🐾", desc: "Adopt 3 pets" },
  { id: "boss_1", name: "Boss Slayer", icon: "⚔️", desc: "Beat 1 boss" },
  { id: "boss_3", name: "Champion", icon: "👑", desc: "Beat all 3 bosses" },
  { id: "nightmare_1", name: "Nightmare Survivor", icon: "🌑", desc: "Beat 1 Nightmare boss" },
  { id: "nightmare_3", name: "Nightmare King", icon: "💀", desc: "Beat all 3 Nightmare bosses" },
  { id: "mythic_1", name: "Mythic Touch", icon: "✨", desc: "Own a Mythic item" },
  { id: "hard_streak", name: "Hard Hitter", icon: "🔥", desc: "Solve 25 Hard problems" },
  { id: "endless_50", name: "Endless 50", icon: "♾️", desc: "Score 50+ in Endless Marathon" },
];

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) } };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetState() {
  localStorage.removeItem(KEY);
}

export function checkBadges(state) {
  const earned = new Set(state.badges);
  const rules = [
    ["first_win", () => state.gamesPlayed >= 1],
    ["math_5", () => state.stats.math.correct >= 5],
    ["math_25", () => state.stats.math.correct >= 25],
    ["fraction_5", () => (state.stats.fraction?.correct || 0) >= 5],
    ["fraction_25", () => (state.stats.fraction?.correct || 0) >= 25],
    ["letter_5", () => state.stats.letter.correct >= 5],
    ["letter_25", () => state.stats.letter.correct >= 25],
    ["shape_10", () => state.stats.shape.correct >= 10],
    ["memory_5", () => state.stats.memory.wins >= 5],
    ["code_5", () => state.stats.code.wins >= 5],
    ["diamond_50", () => state.diamonds >= 50],
    ["diamond_100", () => state.diamonds >= 100],
    ["weapon_3", () => (state.weapons?.length || 0) >= 3],
    ["weapon_6", () => (state.weapons?.length || 0) >= 6],
    ["skin_3", () => (state.skins?.length || 0) >= 3],
    ["pet_3", () => (state.pets?.length || 0) >= 3],
    ["boss_1", () => (state.stats.boss?.wins || 0) >= 1],
    ["boss_3", () => {
      const bw = state.bossWins || {};
      return (bw.creeper_king || 0) >= 1 && (bw.skeleton_lord || 0) >= 1 && (bw.ender_dragon || 0) >= 1;
    }],
    ["nightmare_1", () => {
      const nw = state.nightmareWins || {};
      return (nw.creeper_king || 0) + (nw.skeleton_lord || 0) + (nw.ender_dragon || 0) >= 1;
    }],
    ["nightmare_3", () => {
      const nw = state.nightmareWins || {};
      return (nw.creeper_king || 0) >= 1 && (nw.skeleton_lord || 0) >= 1 && (nw.ender_dragon || 0) >= 1;
    }],
    ["mythic_1", () => {
      const mythicSkins = ["magma_beast", "frost_king", "shadow_ender"];
      const mythicWeapons = ["inferno_blade", "frost_bow", "void_scythe"];
      const mythicPets = ["phoenix"];
      return (state.skins || []).some((s) => mythicSkins.includes(s)) ||
             (state.weapons || []).some((w) => mythicWeapons.includes(w)) ||
             (state.pets || []).some((p) => mythicPets.includes(p));
    }],
    ["endless_50", () => (state.endlessHighScore || 0) >= 50],
  ];
  const newlyEarned = [];
  for (const [id, ok] of rules) {
    if (!earned.has(id) && ok()) {
      earned.add(id);
      newlyEarned.push(id);
    }
  }
  return { badges: Array.from(earned), newlyEarned };
}
