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

export function TableTennisPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("tableTennis");
  const { players, correctPlayerId } = gameConfig.tableTennis;
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.tableTennis;

  function choose(id: string) {
    if (solved) return;
    setSelected(id);
    if (id === correctPlayerId) {
      setFeedback("Correct! Clearly the strongest player.");
      playSuccess();
      solvePuzzle("tableTennis");
    } else {
      setFeedback("Not this one. Try again!");
      playError();
    }
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Paddle & the Ball"
      description="Which of these four people is the best at table tennis?"
      hint={hint}
      solved={solved}
      fragmentText="THE"
    >
      <div className="space-y-4">
        <div
          role="radiogroup"
          aria-label="Choose who is the best at table tennis"
          className="grid grid-cols-2 gap-2 sm:gap-3"
        >
          {players.map((p) => {
            const isSelected = selected === p.id;
            const showCorrect = solved && p.id === correctPlayerId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label="Select this person"
                disabled={solved}
                onClick={() => choose(p.id)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lamp",
                  showCorrect
                    ? "border-sage shadow-[0_0_0_3px_hsl(var(--sage)/0.35)]"
                    : isSelected
                      ? "border-blush shadow-[0_0_0_3px_hsl(var(--blush)/0.3)]"
                      : "border-border/70 hover:border-lamp/60 hover:shadow-[0_0_20px_-4px_hsl(var(--lamp)/0.5)]",
                )}
              >
                <img
                  src={p.image}
                  alt=""
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-300",
                    !solved && "group-hover:scale-[1.04]",
                  )}
                />
                {showCorrect ? (
                  <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-sage text-night shadow-[0_0_12px_hsl(var(--sage)/0.7)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                ) : null}
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
