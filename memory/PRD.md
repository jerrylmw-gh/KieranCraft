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
- Hub with welcome banner, stat cards, **Daily Chest**, 6 game tiles + Treasure Chest.
- HUD: home/rewards/diamond counter/sound toggle/reset (reset on home only).
- Math Mine: Year-4 level — addition (10-99), subtraction (up to 99), multiplication (2-12×2-12), division.
- Fraction Forge: 4 question types — shaded fractions (pie & bar), fractions of quantity, comparing fractions, equivalent fractions.
- Letter Quest: 36-word bank including Year-4 vocabulary (adventure, treasure, knowledge…).
- Shape Sort, Memory Match (6 pairs), Code Steve (8 levels).
- **Treasure Chest with 3 tabs**: Heroes / Weapons / Badges.
- **6 Heroes** with passive abilities (perfect_bonus, memory_bonus, math_bonus, free_skip, diamond_x15).
- **9 Weapons** (Wooden Sword → Netherite Axe) with concrete perks:
  - Multipliers (Diamond Sword 1.5×, Netherite Axe 2×)
  - Hint button (Stone Pickaxe, Trident, Enchanted Book, Bow)
  - Skip button (Golden Pickaxe, Trident)
  - Round bonus (+3 Iron, +5 Enchanted Book)
  - Streak bonus (+1 per 5 streak Wooden Sword)
- **Daily Chest** — 20h cooldown, random reward (5-40 diamonds, 8% chance for a free weapon).
- 15 progress badges total.
- localStorage persistence with reset.

## Testing
- iteration_1: 100% frontend success rate (14/14).
- iteration_2: 100% frontend success rate (18/18) — reward system expansion fully validated.

## Backlog
- P1: parent-mode/PIN to view weekly progress, more word lists per grade level.
- P1: add reading-comprehension mini-game (sentence → emoji selection).
- P2: drag-and-drop for older kids; multi-player same-device.
- P2: optional backend to sync progress across devices.
- P2: localization (Traditional Chinese mirror UI for bilingual learning).

## Next Action Items
- Gather user feedback from the child on difficulty curve and pacing.
- Possibly add a "Daily Quest" with bonus diamonds to encourage daily practice.
