// Game state management using localStorage
const KEY = "mc_learn_v1";

const DEFAULT_STATE = {
  diamonds: 0,
  correctAnswers: 0,
  gamesPlayed: 0,
  soundOn: true,
  badges: [], // ids
  skins: ["steve"], // unlocked
  currentSkin: "steve",
  weapons: [], // unlocked weapon ids
  currentWeapon: null,
  lastDailyClaim: 0, // ms timestamp
  stats: {
    math: { correct: 0, attempts: 0 },
    fraction: { correct: 0, attempts: 0 },
    letter: { correct: 0, attempts: 0 },
    shape: { correct: 0, attempts: 0 },
    memory: { wins: 0 },
    code: { wins: 0 },
  },
};

export const SKINS = [
  { id: "steve", name: "Steve", cost: 0, color: "#5BBAFF", face: "#E6B89C", ability: "balanced", abilityDesc: "Balanced hero — ready for anything." },
  { id: "alex", name: "Alex", cost: 10, color: "#9ED36A", face: "#F5C5A0", ability: "perfect_bonus", abilityDesc: "+2 💎 on a perfect round (no wrongs)." },
  { id: "creeper", name: "Creeper", cost: 25, color: "#5E9D34", face: "#3F6B22", ability: "memory_bonus", abilityDesc: "+3 💎 per Memory Match win." },
  { id: "zombie", name: "Zombie", cost: 50, color: "#79553A", face: "#5E9D34", ability: "math_bonus", abilityDesc: "+1 💎 per Math correct answer." },
  { id: "enderman", name: "Enderman", cost: 100, color: "#212121", face: "#A04AFF", ability: "free_skip", abilityDesc: "1 free Skip in every game." },
  { id: "diamond_hero", name: "Diamond Hero", cost: 200, color: "#51EBE1", face: "#FFFFFF", ability: "diamond_x15", abilityDesc: "1.5× all diamond rewards." },
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
