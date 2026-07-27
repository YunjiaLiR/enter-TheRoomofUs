import { useState } from "react";
import { Hotspot } from "./Hotspot";
import { FinalPuzzle } from "./FinalPuzzle";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";

/** The glowing bed hotspot that appears once all five memories are recovered. */
export function FinalFrameHotspot() {
  const { allSolved } = useGame();
  const [open, setOpen] = useState(false);
  if (!allSolved) return null;

  const bed = gameConfig.finalBedHotspot;
  return (
    <>
      <Hotspot
        x={bed.x}
        y={bed.y}
        w={bed.w}
        h={bed.h}
        label="Look under the bed"
        prominent
        onClick={() => setOpen(true)}
      />
      <FinalPuzzle open={open} onOpenChange={setOpen} />
    </>
  );
}
