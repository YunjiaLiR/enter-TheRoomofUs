import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playSequence } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PianoPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("piano");
  const { melody } = gameConfig.piano;
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setPlaying(true);
      playSequence(melody);
      const totalMs =
        melody.reduce((sum, n) => sum + n.duration, 0) * 1000 + 200;
      timeoutRef.current = window.setTimeout(() => {
        setPlaying(false);
        solvePuzzle("piano");
      }, totalMs);
    } else {
      setPlaying(false);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Upright Piano"
      description={
        playing
          ? "A familiar melody begins to play…"
          : "The keys settle back into the lamplight."
      }
      solved={solved}
      fragmentText="B"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-500",
            playing
              ? "animate-glow-pulse border-lamp/60 bg-lamp/15 text-lamp shadow-[0_0_28px_-4px_hsl(var(--lamp)/0.6)]"
              : "border-lamp/25 bg-lamp/5 text-lamp/70",
          )}
        >
          <Music className="h-6 w-6" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {playing
            ? "A familiar melody begins to play…"
            : "The room hums softly, the melody still lingering."}
        </p>
      </div>
    </PuzzleModal>
  );
}
