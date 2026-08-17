import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameConfig } from "../gameConfig";
import { useGame } from "../GameContext";
import type { PuzzleId } from "../types";
import { playClick } from "../audio";
import { Hotspot } from "./Hotspot";
import { ProgressIndicator } from "./ProgressIndicator";
import { ClueInventory } from "./ClueInventory";
import { GameControls } from "./GameControls";
import { FinalFrameHotspot } from "./FinalFrameHotspot";
import { FinalScene } from "./FinalScene";
import { FinalScreen } from "./FinalScreen";
import { CitySkylinePuzzle } from "./puzzles/CitySkylinePuzzle";
import { TableTennisPuzzle } from "./puzzles/TableTennisPuzzle";
import { PianoPuzzle } from "./puzzles/PianoPuzzle";
import { ChessPuzzle } from "./puzzles/ChessPuzzle";
import { HikingPuzzle } from "./puzzles/HikingPuzzle";

export function RoomScene() {
  const { state, progress, allSolved, isPuzzleDone } = useGame();
  const [active, setActive] = useState<PuzzleId | null>(null);

  function openPuzzle(id: PuzzleId) {
    playClick();
    setActive(id);
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-night-gradient">
      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/40 bg-night/70 px-4 py-2.5 backdrop-blur-md">
        <ProgressIndicator progress={progress} />
        <ClueInventory collectedIds={state.collectedFragmentIds} />
        <GameControls />
      </div>

      {/* Stage */}
      <div className="absolute inset-0 flex items-center justify-center p-2 pt-[4.75rem]">
        <div className="relative aspect-[43/24] max-h-full w-full max-w-[1500px] overflow-hidden rounded-xl border border-border/40 shadow-[0_24px_70px_-24px_hsl(var(--night)/0.95)]">
          <img
            src={gameConfig.roomBackgroundImage}
            alt="A cosy bedroom at night"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                "inset 0 0 130px 40px hsl(var(--night) / 0.65)",
            }}
            aria-hidden
          />

          {gameConfig.hotspots.map((h) => (
            <Hotspot
              key={h.id}
              x={h.x}
              y={h.y}
              w={h.w}
              h={h.h}
              label={h.label}
              completed={isPuzzleDone(h.id)}
              onClick={() => openPuzzle(h.id)}
            />
          ))}

          <FinalFrameHotspot />

          {state.phase === "finalScene" ? <FinalScene /> : null}
        </div>
      </div>

      {/* "all solved" nudge */}
      <AnimatePresence>
        {allSolved && state.phase === "room" ? (
          <motion.div
            className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <p className="rounded-full border border-blush/40 bg-night/70 px-4 py-1.5 text-center text-sm text-blush backdrop-blur-md">
              All five memories recovered. Something glows by the bed…
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Puzzle modals */}
      <CitySkylinePuzzle open={active === "citySkyline"} onOpenChange={(o) => !o && setActive(null)} />
      <TableTennisPuzzle open={active === "tableTennis"} onOpenChange={(o) => !o && setActive(null)} />
      <PianoPuzzle open={active === "piano"} onOpenChange={(o) => !o && setActive(null)} />
      <ChessPuzzle open={active === "chess"} onOpenChange={(o) => !o && setActive(null)} />
      <HikingPuzzle open={active === "hiking"} onOpenChange={(o) => !o && setActive(null)} />

      {state.phase === "finalScreen" ? <FinalScreen /> : null}
    </div>
  );
}
