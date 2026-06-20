# PRD — Minecraft Learning Quest (kid-friendly educational game)

## Original Problem Statement
> 做一個教學遊戲俾我個有輕微自閉兒子,佢鍾意minecraft

A Minecraft-themed educational web game for a mildly autistic 7-9 year old child.

## User Choices (locked-in)
- Age band: 7-9 yrs
- Subjects: addition/subtraction, English vocabulary, simple spelling
- Game types: Math, Shape & Color, Memory Match, Simple Coding Logic
- UI Language: English
- Reward system: diamonds + unlockable skins + badges
- Audio/Visual: Minecraft pixel style sounds & blocky animations

## Architecture
- React 19 SPA (CRA + craco), Tailwind CSS, lucide-react icons, sonner toasts.
- Web Audio API for synthesized sounds (no external audio assets).
- State persisted in localStorage key `mc_learn_v1` (no backend needed for MVP).
- Routing: react-router-dom v7. Routes: `/`, `/rewards`, `/play/math`, `/play/letter`, `/play/shape`, `/play/memory`, `/play/code`.
- Backend kept at default FastAPI scaffold (not used by the app yet).

## User Persona
- Primary: a mildly autistic 7-9 year old who likes Minecraft. UX needs predictability, large tap targets, gentle failure states, optional sound, immediate positive feedback.
- Secondary: parent who wants to monitor progress (diamonds, badges, skins on the Treasure Chest page).

## Core Requirements (static)
- 5 self-contained mini-games + 1 rewards/dashboard page + persistent HUD.
- Always-on sound toggle (sensory-safe).
- No harsh red error states; gentle "Try Again" feedback.
- Confetti + chime on each level clear.
- Pixel-art Minecraft aesthetic (Pixelify Sans + Nunito).

## Implemented (2026-02)
- Hub with welcome banner, stat cards, **Daily Chest**, **Difficulty Toggle (Normal/Hard)**, 7 game tiles + Boss Battles + **Nightmare Mode** + Treasure Chest.
- HUD: home/rewards/diamond counter/sound toggle/reset.
- **Hard Mode**: 3-digit add/sub, 15×15 multiplication, multi-step problems, harder fractions, longer words.
- **Endless Math Marathon**: survival mode, 3 lives, streak-based score multipliers (×1 → ×4 at streak 30).
- **Normal Bosses**: Creeper King (80 HP), Skeleton Lord (130 HP), Ender Dragon (220 HP). Drops Legendary skin + Baby Dragon pet.
- **Nightmare Boss Tier** (unlocked after beating all 3 normal): 3× HP, hard problems, +7 hearts. Drops Mythic skin + Mythic weapon. Defeat all 3 = Phoenix pet.
- **Treasure Chest 4 tabs**: Heroes / Weapons / Pets / Badges.
- **15 Heroes** with rarity tiers + abilities:
  - Common: Steve, Alex
  - Rare: Creeper, Knight, Wizard, Zombie
  - Epic: Enderman, Ninja, Pig Man, Diamond Hero
  - Legendary: Nether King, Dragon Slayer
  - **Mythic** (Nightmare-only): Magma Beast, Frost King, Shadow Ender
- **12 Weapons** with concrete game perks (multipliers, hint/skip/round bonuses):
  - Normal: Wooden Sword, Stone Pickaxe, Iron Sword, Golden Pickaxe, Bow & Arrow, Diamond Sword, Trident, Enchanted Book, Netherite Axe (1.5×–2× multipliers)
  - **Mythic**: Inferno Blade (Crit ×2 in Boss), Frost Bow (5 Hints), Void Scythe (2.5× ALL diamonds)
- **8 Pets** with passive abilities + wandering Hub animation:
  - Common: Pig, Wolf
  - Rare: Cat, Fox
  - Epic: Parrot, Axolotl
  - Legendary: Baby Dragon
  - **Mythic**: Phoenix (2× diamonds + free hint/skip)
- **Daily Chest** — 20h cooldown, 5-40 💎 or 8% chance for a weapon.
- 22 progress badges total.
- localStorage persistence.

## Testing
- iteration_1: 100% (14/14)
- iteration_2: 100% (18/18) — reward system expansion
- iteration_3: ~95% (12/13) — pets, bosses, rarity tiers
- iteration_4: 100% — Hard mode, Nightmare bosses, Mythic tier, Endless Marathon

## Backlog
- P1: parent-mode/PIN to view weekly progress, more word lists per grade level.
- P1: add reading-comprehension mini-game (sentence → emoji selection).
- P2: drag-and-drop for older kids; multi-player same-device.
- P2: optional backend to sync progress across devices.
- P2: localization (Traditional Chinese mirror UI for bilingual learning).

## Next Action Items
- Gather user feedback from the child on difficulty curve and pacing.
- Possibly add a "Daily Quest" with bonus diamonds to encourage daily practice.
