# Whisperwood — Potion Brewer visual asset package

This folder is prepared for Claude Code to implement the **latest, intentionally coarse/raw pixel-art forest foraging environment**. The full interface reference retains the original intended screen context.

## Source of truth

1. `references/forest_scene_exact_reference.png` — **visual target**, cropped from the latest generated game screenshot. The *look*, relative placement, and visual hierarchy should follow this.
2. `references/full_ui_reference.png` — overall screen context (contains mobile browser chrome; do not render browser chrome in the game).
3. `references/concept_sprite_atlas.png` — generated conceptual sprite artwork and palette, decomposed into runtime PNGs.
4. `preview/transparent_sprite_contact_sheet.png` — inspect all extracted PNGs and transparency quality at a glance.
5. `preview/reconstructed_from_sprites_preview.png` — a **sample recomposition**, not pixel-identical to the scene; shows how the individual sprites may be layered.

## Contents

- `sprites/trees`, `sprites/bushes`, `sprites/rocks`, `sprites/props` — RGBA PNG world sprites (background removed). Trees, boulders, logs and stumps.
- `sprites/gatherables` — herbs, red berries, mushrooms, bellflowers, twigs, exposed roots, and **Raven Ironroot** example. The `herb_idle/hover/harvesting/depleted` sequence is available; `wild_herb` contains its own selected/outlined style and should **not** be the normal idle state.
- `sprites/details` — grass tufts and flowers.
- `terrain` — **32 × 32 repeatable RGB ground tiles** plus separately named `illustrative_terrain_patch_*` samples (not guaranteed seamless).
- `backgrounds` — parallax *reference bands* from the atlas (not guaranteed to tile seamlessly).
- `effects` — transparent glint frames and a sunbeam overlay.
- `ui` — demonstration texture-only wood/purple/parchment panels and a progress bar. Text, game state and pricing remain dynamic; see notes below.
- `asset_manifest.json` — inventory, relative paths and intended roles.
- `scene_layout.json` — sample bottom-center anchors, order and interaction recommendations.
- `CLAUDE_IMPLEMENTATION_PROMPT.md` — developer handoff to paste into Claude Code.

## Important practical limitations

These are *usable individual sprite files*, but the isolated sprites are derived from a **generated concept atlas**, not from original hand-authored, editable layered pixel files. Alpha edges were inferred programmatically; spot-clean them if noticeable at large zoom. The concept art is an interpretation of the screenshot and not an exact reconstruction; no exact source PSD/Aseprite layers exist.

Some asset colors and details may require further alignment with the application's live art. Reconstructed gameplay should render independent sprites **rather than a static screenshot**. Avoid image smoothing and scaling artifacts: use nearest-neighbor scaling, aligned pixels, and consistent base scale.

**Gameplay**: Do not invent resource drops, harvestable materials, tool purposes, or gameplay systems merely because a sprite appears in this pack. Bind resources only where the current repository supports them, and use others as decorations until a deliberate design choice is made. The highlighted plant sprites are examples of feedback states, not new economy mechanics.

## Asset usage recipe

- Set a fixed logical viewport proportional to ~900 × 440 for the environment region; scale responsively into the phone interface.
- Layer sky / distant treeline / trees / shrubs / terrain / gatherables / props / particles, with suitable depth sorting.
- Keep branches and decorative foreground foliage from intercepting taps intended for collectables.
- Reuse existing harvesting, costs, cooldown, quantity and inventory logic. The reference screen shows Raven Ironroot `200/200 ml` with `Dig up +20 ml` and the card's other text; **these must be read from the actual game state and not baked into an image**.
- Use existing selected tab and dynamic UI; only replace or texture UI visuals. Do not crop game screenshots and overlay them as clickable art.
- Test pixel consistency, transparency, touch hitboxes, card legibility, frame rate, and day/night variants.

## Delivery

Give Claude the complete ZIP or extracted folder and paste the accompanying implementation prompt. Avoid uploading only the reference screenshot: the PNG sprites and manifest are the implementation-ready pieces.
