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
- Hub with welcome banner, stat cards, 6 tiles (5 games + Treasure Chest).
- HUD: home/rewards/diamond counter/sound toggle/reset (reset on home only).
- Math Mine: addition/subtraction (numbers 1-18), 5 problems per round, 4 choice blocks.
- Letter Quest: spell-the-word puzzles, 24-word bank, 5 puzzles per round, 4 letter choices.
- Shape Sort: match a textured block (grass/dirt/stone/diamond) to its bin, 6 per round.
- Memory Match: 6-pair card flip game with 7 pixel-art Minecraft items. Reward scales 3-10 diamonds by efficiency.
- Code Steve: 4-level path puzzle, place U/D/L/R arrows, RUN executes program with step animation. +5 diamonds per win.
- Treasure Chest: 6 skins (Steve, Alex, Creeper, Zombie, Enderman, Diamond Hero) — unlock with diamonds and equip. 10 badges auto-earned by stats.
- Custom pixel-art SVG icons (Creeper, Pig, Gold, Apple, TNT, Emerald, Diamond, character avatars).
- Pixel-block textures generated purely via CSS gradients.
- Confetti win animation, gentle wiggle for wrong answers.
- localStorage persistence + Reset button (with confirm prompt).

## Testing
- iteration_1: 100% frontend success rate. All 14 features verified by testing agent.

## Backlog
- P1: parent-mode/PIN to view weekly progress, more word lists per grade level.
- P1: add reading-comprehension mini-game (sentence → emoji selection).
- P2: drag-and-drop for older kids; multi-player same-device.
- P2: optional backend to sync progress across devices.
- P2: localization (Traditional Chinese mirror UI for bilingual learning).

## Next Action Items
- Gather user feedback from the child on difficulty curve and pacing.
- Possibly add a "Daily Quest" with bonus diamonds to encourage daily practice.
