# Procedural Art Studio — isolated first prototype

This editor is deliberately separate from the running Potion Brewer game. It imports the **existing** visual generation code directly, and leaves game engine, UI, saves, and procedural rules untouched.

## Open it locally

Clone this experimental branch into a **separate folder** (leave Claude's main working copy as-is):

```bash
git clone --branch feature/procedural-art-editor-prototype --single-branch https://github.com/Ram8o211/Potion-Brewer-Claude-.git potion-brewer-art-editor
cd potion-brewer-art-editor
npm run dev
```

Open **http://localhost:5173/tools/procedural-art-editor/**

Node.js 20+ is recommended. The editor and dev server need no added runtime dependencies; to run the repository's automated tests, run `npm ci` first.

If you already have this repository cloned, you may instead use `git fetch origin` and create a separate Git worktree, but **do not overwrite or reset Claude's uncommitted work**.

## What is implemented

- Live procedural ingredient views using `src/visual/descriptor.js`, `growth.js` and `render.js`.
- Form/family, region, seed, pigment, magical influence, intensity and glow settings.
- Real per-family **numeric** morphology parameter overrides, passed to the procedural renderer.
- Native-pixel, 96×96 editable canvas with draw, erase, colour picker, brush sizes and undo/redo.
- Independent paint overlays for each growth stage / plant variant / mount, inventory icon, and each of four cauldron fragments.
- Preview galleries for four generated variants, three growth stages, the icon and fragments.
- Component library: capture current opaque sprite bounds as a reusable pixel stamp and place it into another frame's overlay.
- Deterministic region preview based on `src/visual/env/scene.js`.
- Download current edited frame as a transparent PNG.
- Project JSON export/import (schema 1, prototype only).

## Known limitations and next steps

1. **Pixel corrections are frame-specific overlays.** They do not regenerate a family grammar or automatically synchronize icons, growth stages and fragments. Structural editing (nodes/branches/components with semantic roles) is the next major feature.
2. **Captured components are pixel stamps**, not anatomical primitives. A real component system would store anchor points, layer ordering, semantic labels, transform constraints and placement rules.
3. Morphology controls currently expose numeric generator parameters; **enum and discrete structural choices** require family-specific UIs.
4. Reference environments can be viewed, but the terrain, props, occlusion, lighting and biomes are not yet edited graphically.
5. Exported JSON **is not yet loaded by the game**. Integrating it requires a separate, versioned, data-driven override layer and save compatibility policy.
6. AI-assisted art direction / Qwen integration is **not implemented**. It should produce or revise art-direction JSON and reusable components through a constrained contract, with preview and manual approval.
7. This was created via the connected GitHub interface; there was **no local browser or mobile runtime available for end-to-end testing**. Start by smoke-testing the page locally.

## Suggested acceptance checklist

- Load the page and check the initial crystal, environment, and preview gallery render.
- Switch to flower and a hanging vine form, change the seed, and see distinct silhouettes.
- Edit a morphology number and confirm the generated output changes.
- Draw, erase, pick, undo and redo on the canvas.
- Edit sprout and mature separately and check that the edits remain independent.
- Capture a component, stamp it on another stage, export JSON, refresh and re-import.
- Export a transparent PNG and check that grid guides aren't included.
- Run `npm ci && npm run check` to detect any regressions in the original game.

## Scope protection

All prototype files live in `tools/procedural-art-editor/` on the `feature/procedural-art-editor-prototype` branch. Nothing is merged into `main`. Review changes before opening any pull request.
