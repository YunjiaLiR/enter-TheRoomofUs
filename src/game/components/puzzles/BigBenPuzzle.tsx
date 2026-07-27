import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playError, playSuccess } from "../../audio";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BigBenPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("bigBen");
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setAttempts(0);
      setFeedback(null);
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const hint = gameConfig.hints.bigBen;
  const showHint = attempts >= 2;

  function submit() {
    if (solved) return;
    const v = value.trim();
    if (v.length < 6) {
      setFeedback("Six digits — day, month, year.");
      return;
    }
    if (v === gameConfig.relationshipDateDDMMYY) {
      setFeedback(null);
      playSuccess();
      solvePuzzle("bigBen");
    } else {
      setAttempts((a) => a + 1);
      setFeedback("The clock doesn't chime for that date.");
      playError();
    }
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Window & Big Ben"
      description="Through the glass, Big Ben holds a number only the two of you would chime. Enter the day we began — six digits, DDMMYY."
      hint={hint}
      solved={solved}
      fragmentText="UNDER"
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-lamp/30 bg-lamp/10 text-lamp">
            <Clock className="h-6 w-6" />
          </div>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) =>
              setValue(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            inputMode="numeric"
            placeholder="DDMMYY"
            maxLength={6}
            disabled={solved}
            aria-label="Date as day month year"
            className="h-14 w-44 border-border/70 bg-night/40 text-center font-display text-3xl tracking-[0.35em] text-cream placeholder:tracking-[0.35em] placeholder:text-muted-foreground/40 focus-visible:ring-lamp"
          />
          <Button
            type="button"
            onClick={submit}
            disabled={solved}
            className="border-0 bg-lamp px-8 text-night hover:bg-lamp-glow"
          >
            Chime
          </Button>
        </div>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}

        {showHint && !solved ? (
          <p className="rounded-lg bg-blush/10 px-3 py-2 text-center text-sm italic leading-relaxed text-blush">
            {hint}
          </p>
        ) : null}

        {solved ? (
          <p className="text-center text-sm text-sage">
            A warm chime — the first memory is yours.
          </p>
        ) : null}
      </div>
    </PuzzleModal>
  );
}
