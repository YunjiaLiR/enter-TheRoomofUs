import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playClick, playError, playSuccess } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TableTennisPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("tableTennis");
  const targets = gameConfig.tableTennis.targets;
  const [selected, setSelected] = useState(
    Math.max(
      0,
      targets.findIndex((t) => t.id === gameConfig.tableTennis.correctTargetId),
    ),
  );
  const [serving, setServing] = useState(false);
  const [servedLane, setServedLane] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const courtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setServing(false);
      setServedLane(null);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.tableTennis;

  function serve(idx: number) {
    if (serving || solved) return;
    setServing(true);
    setServedLane(idx);
    setFeedback(null);
    playClick();
    window.setTimeout(() => {
      const target = targets[idx];
      if (target.id === gameConfig.tableTennis.correctTargetId) {
        playSuccess();
        solvePuzzle("tableTennis");
      } else {
        playError();
        setFeedback("Off the edge. Try a different lane.");
      }
      setServing(false);
    }, 850);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (solved || serving) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelected((s) => Math.min(targets.length - 1, s + 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      serve(selected);
    }
  }

  const ballLane = servedLane ?? selected;
  const ballLeft = ((ballLane + 0.5) / targets.length) * 100;

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Paddle & the Ball"
      description="One serve. Pick a lane, then send the ball home. Use ← → to aim and Enter to serve."
      hint={hint}
      solved={solved}
      fragmentText="THE"
    >
      <div className="space-y-4">
        <div
          ref={courtRef}
          tabIndex={0}
          role="application"
          aria-label="Table tennis court. Use arrow keys to aim and enter to serve."
          onKeyDown={onKeyDown}
          className="relative h-56 w-full overflow-hidden rounded-xl border border-border/70 bg-[linear-gradient(180deg,hsl(var(--night-soft)),hsl(var(--night-deep)))] outline-none focus-visible:ring-2 focus-visible:ring-lamp"
        >
          {/* target lanes */}
          <div className="absolute inset-x-0 top-0 flex h-20">
            {targets.map((t, i) => (
              <button
                key={t.id}
                type="button"
                disabled={serving || solved}
                onClick={() => {
                  setSelected(i);
                  serve(i);
                }}
                aria-label={`Aim at ${t.label}`}
                className="flex flex-1 flex-col items-center justify-center gap-1 border-r border-border/40 last:border-r-0 transition-colors hover:bg-lamp/5"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-[0.6rem] font-medium transition-all",
                    selected === i
                      ? "border-lamp bg-lamp/20 text-lamp shadow-[0_0_16px_hsl(var(--lamp)/0.5)]"
                      : "border-border/60 bg-night/40 text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          {/* net line */}
          <div className="absolute inset-x-0 top-20 h-px bg-lamp/20" />

          {/* ball */}
          <motion.span
            className="absolute h-4 w-4 rounded-full bg-blush-deep shadow-[0_0_14px_hsl(var(--blush)/0.7)]"
            style={{ left: "50%", marginLeft: "-0.5rem" }}
            animate={
              serving
                ? { left: ["50%", `${ballLeft}%`], top: ["82%", "26%", "14%"] }
                : { left: "50%", top: "82%" }
            }
            transition={{ duration: 0.85, ease: "easeIn" }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Aiming: <span className="text-cream">{targets[selected].label}</span>
          </p>
          <Button
            type="button"
            onClick={() => serve(selected)}
            disabled={serving || solved}
            className="gap-2 border-0 bg-lamp text-night hover:bg-lamp-glow"
          >
            <Zap className="h-4 w-4" />
            Serve
          </Button>
        </div>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}
        {solved ? (
          <p className="text-center text-sm text-sage">
            A clean winner — the ball knew exactly where to land.
          </p>
        ) : null}
      </div>
    </PuzzleModal>
  );
}
