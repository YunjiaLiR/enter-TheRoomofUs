import { useEffect, useState, type KeyboardEvent } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playNote, playSequence, playSuccess, playError } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOTE_FREQ: Record<string, number> = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
};

export function PianoPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("piano");
  const { melody, correctNote, availableKeys } = gameConfig.piano;
  const [played, setPlayed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPlayed(false);
      setActive(null);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.piano;

  function playMelody() {
    if (solved) return;
    setPlayed(true);
    setFeedback(null);
    playSequence(melody.slice(0, -1));
  }

  function pressKey(note: string) {
    if (solved) return;
    setActive(note);
    window.setTimeout(() => setActive((a) => (a === note ? null : a)), 180);
    playNote(NOTE_FREQ[note] ?? 440);
    if (note === correctNote) {
      setFeedback(null);
      playSuccess();
      solvePuzzle("piano");
    } else {
      setFeedback(
        "A creative interpretation — but not the note that finishes this.",
      );
      playError();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (solved) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= availableKeys.length) {
      e.preventDefault();
      pressKey(availableKeys[n - 1]);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = active ? availableKeys.indexOf(active) : -1;
      const next =
        e.key === "ArrowRight"
          ? (availableKeys[Math.min(availableKeys.length - 1, idx + 1)] ??
            availableKeys[0])
          : (availableKeys[Math.max(0, idx - 1)] ?? availableKeys[0]);
      setActive(next);
    } else if ((e.key === "Enter" || e.key === " ") && active) {
      e.preventDefault();
      pressKey(active);
    }
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Upright Piano"
      description="A familiar melody plays — but the last note is missing. Listen, then reach for the key that finishes it."
      hint={hint}
      solved={solved}
      fragmentText="B"
    >
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={playMelody}
          disabled={solved}
          className="gap-2 border-lamp/40 bg-lamp/5 text-lamp hover:bg-lamp/10 hover:text-lamp"
        >
          <Play className="h-4 w-4" />
          {played ? "Play the melody again" : "Play the melody"}
        </Button>

        <div
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="group"
          aria-label="Piano keys. Press number keys 1 to 7, or use arrow keys and enter."
          className="flex w-full gap-1 rounded-lg bg-night-deep p-2 outline-none focus-visible:ring-2 focus-visible:ring-lamp"
        >
          {availableKeys.map((note, i) => (
            <button
              key={note}
              type="button"
              onClick={() => pressKey(note)}
              aria-label={`Play note ${note}`}
              className={cn(
                "relative flex h-28 flex-1 flex-col items-center justify-end rounded-b-md border border-t-0 pb-2 transition-all",
                "bg-gradient-to-b from-cream to-muted/80 text-night-soft",
                active === note
                  ? "translate-y-0.5 from-lamp to-lamp shadow-[inset_0_2px_6px_hsl(var(--night)/0.4)]"
                  : "hover:from-lamp/90",
              )}
            >
              <span className="text-[0.6rem] text-night-soft/60">{i + 1}</span>
              <span className="font-display text-lg">{note}</span>
            </button>
          ))}
        </div>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}
        {solved ? (
          <p className="text-center text-sm text-sage">
            The melody completes — the room hums along.
          </p>
        ) : null}
        {played && !solved ? (
          <p className="text-center text-xs text-muted-foreground">
            Tip: number keys 1–7 play the notes.
          </p>
        ) : null}
      </div>
    </PuzzleModal>
  );
}
