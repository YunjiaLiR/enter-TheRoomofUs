import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playError, playSuccess } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CitySkylinePuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("citySkyline");
  const { options, correctOptionId } = gameConfig.mayorTransport;
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.citySkyline;

  function choose(id: string) {
    if (solved) return;
    setSelected(id);
    if (id === correctOptionId) {
      setFeedback("Correct — the mayor travels by helicopter.");
      playSuccess();
      solvePuzzle("citySkyline");
    } else {
      setFeedback("Not quite. Try again.");
      playError();
    }
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="City Skyline"
      description="What is the mayor's mode of transport?"
      hint={hint}
      solved={solved}
      fragmentText="UNDER"
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border/70">
          <img
            src={gameConfig.citySkylineImage}
            alt="An aerial view of a modern city skyline at night"
            className="h-40 w-full object-cover sm:h-48"
          />
        </div>

        <div
          role="radiogroup"
          aria-label="Choose the mayor's mode of transport"
          className="grid grid-cols-2 gap-2"
        >
          {options.map((o) => {
            const isSelected = selected === o.id;
            const showCorrect = solved && o.id === correctOptionId;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={solved}
                onClick={() => choose(o.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                  showCorrect
                    ? "border-sage/60 bg-sage/10 text-cream"
                    : isSelected
                      ? "border-lamp/60 bg-lamp/10 text-cream"
                      : "border-border/70 bg-night/30 text-muted-foreground hover:border-lamp/30 hover:text-cream",
                )}
              >
                <span>{o.label}</span>
                {showCorrect ? <Check className="h-4 w-4 text-sage" /> : null}
              </button>
            );
          })}
        </div>

        {feedback ? (
          <p
            className={cn(
              "text-center text-sm",
              solved ? "text-sage" : "text-blush",
            )}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </PuzzleModal>
  );
}
