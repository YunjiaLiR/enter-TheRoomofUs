# The Room of Us — Birthday Escape Room Game

## Context
Replace the default template landing page with a private, no-login, no-backend browser escape-room game. Five hotspot puzzles set in an illustrated cosy bedroom each reveal a word/letter fragment; combining all five fragments in the right order spells "UNDER THE BED", triggering a final reveal scene under the bed with a personal birthday message. Everything (dates, names, answers, mountain names, chess move, messages) must live in one `gameConfig.ts` file for easy editing. No backend/Enter Cloud is needed — pure frontend, state persisted only in `sessionStorage` for the current browser session.

## Approach Overview
- **Visuals**: One AI-generated (nano-banana-pro) full-bleed illustrated bedroom-at-night background image (bed, window with London night skyline + Big Ben silhouette, table-tennis racket/ball, upright piano, chessboard, hiking shoes, mountain map, decorative travel trinkets). Interactive hotspots are invisible, percent-positioned buttons layered on top, glowing/scaling on hover via framer-motion (already a dependency). No object is visually labelled as a "puzzle".
- **State**: A single `GameContext` (React context + `useReducer`) holds progress, collected clues, mute flag, and per-puzzle completion — persisted to `sessionStorage` so a refresh mid-session doesn't lose progress; a Reset button clears it.
- **Sound**: A tiny Web Audio API helper (`audio.ts`) generates oscillator-based chime/tone/success/error sounds procedurally — no audio files required now, and it's built so real files can later replace the oscillator calls.
- **Chess puzzle**: Lightweight custom board (no chess.js). Config supplies a fixed placement + one `correctMove {from, to}`; only the piece(s) listed as movable in config can be picked up; any other from/to combo shows the "not quite" message.
- **Table tennis mini-game**: Forgiving "aim & serve" interaction — player selects a target lane via drag/click/tap or ←/→ + Enter keyboard, then serves; ball animates in an arc via framer-motion to the chosen target. No real physics engine needed.
- **Final fragment reordering**: Use `@dnd-kit/core` + `@dnd-kit/sortable` (new dependency) for accessible (mouse, touch, keyboard) drag-and-drop reordering of the 5 collected fragments.
- **Confetti**: Small custom framer-motion particle burst (warm palette), no new dependency.

## New Dependencies
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — accessible drag-and-drop for the final fragment-ordering puzzle.

## File Structure (new)
```
src/game/
  gameConfig.ts                # SINGLE editable config: dates, names, answers, mountains, chess, messages, hints
  types.ts                     # shared TS types for config + state
  GameContext.tsx              # progress/clue/mute state, sessionStorage persistence, reducer actions
  audio.ts                     # Web Audio helpers: playTone, playChime, playSuccess, playError, playNote
  useSessionStorage.ts         # small persistence hook used by GameContext
  RoomOfUsGame.tsx             # top-level: intro -> room -> final screen switch
  components/
    IntroScreen.tsx            # title, tagline, "Enter the Room" button
    RoomScene.tsx               # background image + hotspots + progress/inventory/controls overlay
    Hotspot.tsx                 # reusable glow/hover invisible hotspot button (framer-motion)
    ProgressIndicator.tsx       # "Memories recovered: X/5"
    ClueInventory.tsx           # 5 slots, empty/filled fragment display
    GameControls.tsx            # reset button, mute/unmute, hint toggle
    PuzzleModal.tsx              # shared Dialog wrapper (title, close, hint button, feedback area)
    FinalFrameHotspot.tsx        # appears/glows once 5/5, opens FinalPuzzle
    puzzles/
      BigBenPuzzle.tsx          # 6-digit DDMMYY input, 2-attempt hint escalation
      TableTennisPuzzle.tsx     # aim+serve mini-game
      PianoPuzzle.tsx           # placeholder melody playback + note-picker keys
      ChessPuzzle.tsx           # custom board, movable piece(s), correct-move check
      HikingPuzzle.tsx          # footprint intro + mountain multi-select + Check Route
    FinalPuzzle.tsx              # dnd-kit fragment reordering modal
    FinalScene.tsx                # dim room, footprints to bed, light beam, then FinalScreen
    FinalScreen.tsx               # Mission Complete, message reveal, confetti, Play again
    Confetti.tsx                  # small elegant particle burst
src/pages/Index.tsx              # replaced: renders <RoomOfUsGame /> (drop unused i18n hero copy)
index.html                       # update <title> to "The Room of Us"
```

## gameConfig.ts — editable fields (with inline comments marking what to replace)
- `boyfriendName: string` — replace with real name
- `relationshipDateDDMMYY: string` — 6-digit string, e.g. `"150620"`
- `tableTennis: { targets: string[]; correctTargetId: string }`
- `piano: { melody: { note: string; freq: number; duration: number }[]; correctNote: string; availableKeys: string[] }` — placeholder melody array; comment on swapping in a real audio file later
- `chess: { pieces: {square, type, color, movable}[]; correctMove: { from: string; to: string } }`
- `mountains: { options: {id, name}[]; correctIds: string[] }`
- `clueFragments: { id, text, spaceAfter }[]` in solution order (`UNDER`, `THE`, `B`, `E`, `D`) — join logic renders "UNDER THE BED"
- `hints: { bigBen, tableTennis, piano, chess, hiking }` — optional hint strings per puzzle
- `personalMessage: string` — final birthday message, replace with real text
- `photos` placeholder comment block noting where to later add real photographs if desired

## Interaction Flow
1. `IntroScreen` → "Enter the Room" → `RoomScene` (background image + 5 hotspots + bed, all part of image except hotspots as invisible overlays).
2. Each hotspot opens its `PuzzleModal`-wrapped puzzle; correct answer → play sound, reveal fragment into `ClueInventory`, mark hotspot complete (subtle static glow/checkmark), close/allow reopen (completed puzzles show a "already solved" state, non-blocking).
3. Wrong answers show inline feedback text from spec; Big Ben adds hint after 2 wrong tries; hiking shows "There are N correct mountains" after 2 wrong tries.
4. When `progress === 5`, `FinalFrameHotspot` appears glowing in the room → opens `FinalPuzzle` (drag-and-drop reorder of 5 fragments).
5. Correct order → `FinalScene` plays (dim overlay, footprints path SVG to bed, glow beam under bed, success chime) → `FinalScreen` (Mission Complete, buttons: "Read your birthday message" reveals `personalMessage`, "Play again" resets context + sessionStorage and returns to `IntroScreen`).

## Accessibility & Mobile
- All hotspots and puzzle controls are real `<button>`/interactive elements with visible focus rings, reachable via Tab, operable via Enter/Space.
- Piano keys and mountain cards support keyboard number/arrow selection in addition to click/tap.
- Table tennis serve supports drag (mouse/touch) and ←/→ + Enter keyboard.
- Modals use existing `Dialog` (Radix) component for built-in focus trap/ESC handling.
- Layout uses responsive Tailwind classes; hotspots positioned in % so they scale with the background image at any viewport; touch target sizes ≥ 44px.

## Design Tokens
- Extend `index.css`/`tailwind.config.ts` with a warm romantic palette (deep navy-night background, warm amber/gold lamp-light accent, soft cream text, blush highlight) as CSS variables, plus a `font-serif`-leaning elegant display font pairing already available via system/Google-safe stack — used consistently instead of hardcoded colors in components.

## Implementation Checklist
- [passed] Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` dependencies
- [passed] Generate illustrated bedroom-at-night background image (nano-banana-pro) with bed, window+London skyline+Big Ben, table-tennis gear, piano, chessboard, hiking shoes, mountain map, travel trinkets
- [passed] Add warm romantic design tokens to `index.css` + `tailwind.config.ts` (no hardcoded colors in components)
- [passed] Create `src/game/gameConfig.ts` with all editable fields and inline "replace here" comments
- [passed] Create `src/game/types.ts` shared types
- [passed] Create `src/game/audio.ts` Web Audio helpers (tone/chime/success/error/note) with mute support
- [passed] Create `src/game/useSessionStorage.ts` + `GameContext.tsx` (progress, clues, completedPuzzles, muted, reducer, sessionStorage persistence, reset action)
- [passed] Build `IntroScreen`, `RoomScene`, `Hotspot`, `ProgressIndicator`, `ClueInventory`, `GameControls`, `PuzzleModal`
- [passed] Build `BigBenPuzzle`: DDMMYY input, validates against `relationshipDateDDMMYY`, 2-attempt hint, success reveals "UNDER"
- [passed] Build `TableTennisPuzzle`: aim+serve interaction (mouse/touch/keyboard), correct target reveals "THE"
- [passed] Build `PianoPuzzle`: plays placeholder melody stopping before last note, labelled keys, correct note reveals "B"
- [passed] Build `ChessPuzzle`: custom board rendering config position, only configured piece movable, correct move reveals "E"
- [passed] Build `HikingPuzzle`: footprints intro animation, mountain multi-select grid, "Check Route", 2-attempt count hint, correct selection draws animated dotted trail + reveals "D"
- [passed] Build `FinalFrameHotspot` (visible only at 5/5) + `FinalPuzzle` drag-and-drop reorder with dnd-kit, validates against fragment order
- [passed] Build `FinalScene` (dim room, footprints-to-bed animation, light beam under bed, success sound) → `FinalScreen` (Mission Complete, message reveal, `Confetti`, Play again)
- [passed] Wire `Reset Game` button (clears sessionStorage + context state, returns to intro) and mute/unmute control into `GameControls`, present throughout main game
- [passed] Replace `src/pages/Index.tsx` to render `RoomOfUsGame`; update `index.html` `<title>`

## Verification Checklist
- [passed] Entering `/` shows Intro screen with exact title/subtitle copy and "Enter the Room" button; clicking transitions to room
- [passed] Progress indicator reads "Memories recovered: 0/5" initially and increments correctly per solved puzzle; inventory shows 5 empty slots filling with fragments in solve order
- [passed] Big Ben: wrong code shows generic wrong feedback twice, then hint text; correct `relationshipDateDDMMYY` plays chime, animates, adds "UNDER", locks as complete
- [manual-required] Table tennis: wrong target shows miss message and allows retry; correct target plays impact animation and adds "THE"; reachable via keyboard only
- [manual-required] Piano: incorrect key shows "creative interpretation" message; correct note completes melody, animates, adds "B"; keys operable by click and keyboard
- [manual-required] Chess: only configured movable piece(s) can be picked up; wrong destination shows warning message; correct move animates and adds "E"
- [manual-required] Hiking: selecting wrong set twice shows count hint with correct number of mountains; correct set places flags, draws animated trail, adds "D"
- [manual-required] Final fragment panel only appears at 5/5; drag-and-drop works via mouse, touch, and keyboard (dnd-kit sortable keyboard sensor); only "UNDER THE BED" order is accepted
- [manual-required] Final scene dims room, animates footprints to bed and a light beam, plays success sound, then shows Mission Complete screen with boyfriend name, personal message reveal button, and Play again button that fully resets state
- [manual-required] Mute control silences all sounds app-wide; Reset Game button at any point returns to Intro with cleared sessionStorage
- [manual-required] Responsive check at mobile width: hotspots remain tappable, modals fit viewport, no horizontal overflow
- [passed] `pnpm lint` and project build pass with no errors

## Files to Edit for Personalization (documented in gameConfig.ts comments)
- Relationship date, boyfriend's name, personal birthday message
- Table-tennis target labels/correct target
- Piano melody notes + correct note
- Chess starting position + correct move
- Mountain names + correct mountains
- Where to later swap in real audio files and real photographs
