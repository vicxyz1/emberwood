# Emberwood

A standalone React + Vite tower-defense game with illustrated forest terrain, three tower types, ten waves, a final boss, gold rewards, and three levels each of damage and fire-rate upgrades.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` produces `dist/`; `npm test` checks the combat engine, economy, pause, defeat, victory and a normal-budget winning strategy.

## Controls

Choose a tower, then click a marked clearing. Click a placed tower to see its range and upgrade or sell it. Keys 1–3 select towers; Space starts/pauses; Escape clears selection. The board toolbar controls 1×/2× speed and restart. Sound defaults to muted. No account, backend or external API is needed. Fonts use Google Fonts with local fallbacks.

## Design

Built-in Image Gen created `public/assets/concept.png`, `forest.png`, and `sprites.png`. Art brief: hand-painted evergreen fantasy battlefield, a sandy winding trail, warm golden heartwood gate, ranger/cannon/frost towers, goblin/orc/ogre enemies. UI uses cream Cormorant Garamond headings, DM Sans controls, forest-green surfaces and golden actions. Sprites use soft portrait masks because generated transparency was unavailable. Build clearings and range/combat overlays are intentionally code-native. The movement centerline follows the final painted trail.
