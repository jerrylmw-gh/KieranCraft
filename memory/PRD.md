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
- Hub with welcome banner, stat cards, **Daily Chest**, 6 game tiles + Treasure Chest + **Boss Battles section**.
- HUD: home/rewards/diamond counter/sound toggle/reset.
- Math Mine (Year-4 +, -, ×, ÷), Fraction Forge, Letter Quest, Shape Sort, Memory Match, Code Steve (8 levels).
- **Boss Battles** — 3 progressive bosses:
  - Creeper King (80 HP, +40 💎, unlocks Pig Man skin)
  - Skeleton Lord (130 HP, +80 💎, unlocks Nether King skin)
  - Ender Dragon (220 HP, +200 💎, unlocks Dragon Slayer skin + Baby Dragon pet)
  - Turn-based math combat: correct = damage, wrong = lose 1 heart, 3-streak = critical hit.
- **Treasure Chest with 4 tabs**: Heroes / Weapons / Pets / Badges.
- **12 Heroes** with rarity tiers (Common/Rare/Epic/Legendary):
  - Common: Steve, Alex
  - Rare: Creeper, Knight, Wizard, Zombie
  - Epic: Enderman, Ninja, Pig Man, Diamond Hero
  - Legendary (boss drops only): Nether King, Dragon Slayer
- **9 Weapons** with concrete game perks (multipliers, hint/skip charges, round bonuses).
- **7 Pets** with passive abilities + wandering animation on Hub:
  - Common: Pig, Wolf
  - Rare: Cat, Fox
  - Epic: Parrot, Axolotl
  - Legendary (Ender Dragon drop): Baby Dragon
- **Daily Chest** — 20h cooldown, 5-40 diamonds or 8% chance for a weapon.
- 17 progress badges total.
- localStorage persistence.

## Testing
- iteration_1: 100% (14/14)
- iteration_2: 100% (18/18) — reward system expansion
- iteration_3: ~95% (12/13) — pets, bosses, rarity tiers; boss-win flow code-reviewed

## Backlog
- P1: parent-mode/PIN to view weekly progress, more word lists per grade level.
- P1: add reading-comprehension mini-game (sentence → emoji selection).
- P2: drag-and-drop for older kids; multi-player same-device.
- P2: optional backend to sync progress across devices.
- P2: localization (Traditional Chinese mirror UI for bilingual learning).

## Next Action Items
- Gather user feedback from the child on difficulty curve and pacing.
- Possibly add a "Daily Quest" with bonus diamonds to encourage daily practice.
