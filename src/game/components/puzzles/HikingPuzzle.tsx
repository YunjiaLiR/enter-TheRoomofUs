import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flag, Footprints, Map as MapIcon, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import { playError, playSuccess } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HikingPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("hiking");
  const { options, correctIds } = gameConfig.mountains;
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setAttempts(0);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.hiking;
  const showCountHint = attempts >= 2;

  const footprints = useMemo(
    () => Array.from({ length: 5 }).map((_, i) => ({ id: i, left: 8 + i * 21 })),
    [],
  );

  function toggle(id: string) {
    if (solved) return;
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
    setFeedback(null);
  }

  function checkRoute() {
    if (solved) return;
    const setEq =
      selected.length === correctIds.length &&
      correctIds.every((id) => selected.includes(id));
    if (setEq) {
      setFeedback(null);
      playSuccess();
      solvePuzzle("hiking");
    } else {
      setAttempts((a) => a + 1);
      setFeedback("That's not the route. The boots know a different path.");
      playError();
    }
  }

  // trail path through correct mountains in correctIds order (2-col grid)
  const trailPath = useMemo(() => {
    if (!solved) return "";
    const pts = correctIds
      .map((id) => options.findIndex((o) => o.id === id))
      .filter((i) => i >= 0)
      .map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return { x: col * 50 + 25, y: row * 25 + 12.5 };
      });
    if (pts.length === 0) return "";
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  }, [solved, correctIds, options]);

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Boots & the Map"
      description="A route is marked on the map — but only the right peaks belong. Select every mountain on the true trail, then check your route."
      hint={hint}
      solved={solved}
      fragmentText="D"
    >
      <div className="space-y-4">
        {/* footprints intro */}
        <div className="relative h-6 w-full">
          {footprints.map((f, i) => (
            <motion.span
              key={f.id}
              className="absolute top-0 text-lamp/50"
              style={{ left: `${f.left}%` }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.7, 0.7], scale: 1 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.4 }}
            >
              <Footprints className="h-4 w-4" style={{ transform: i % 2 ? "scaleX(-1)" : undefined }} />
            </motion.span>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-2">
            {options.map((m) => {
              const isSel = selected.includes(m.id);
              const isCorrect = correctIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-pressed={isSel}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                    solved && isCorrect
                      ? "border-sage/60 bg-sage/10 text-cream"
                      : isSel
                        ? "border-lamp/60 bg-lamp/10 text-cream"
                        : "border-border/70 bg-night/30 text-muted-foreground hover:border-lamp/30 hover:text-cream",
                  )}
                >
                  <MapIcon className="h-4 w-4 shrink-0 opacity-60" />
                  <span className="flex-1">{m.name}</span>
                  {solved && isCorrect ? (
                    <Flag className="h-4 w-4 text-sage" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* animated trail overlay */}
          {solved && trailPath ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d={trailPath}
                fill="none"
                stroke="hsl(var(--lamp))"
                strokeWidth={0.8}
                strokeLinecap="round"
                strokeDasharray="3 4"
                initial={{ strokeDashoffset: 300 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="text-cream">{selected.length}</span> selected
          </p>
          <Button
            type="button"
            onClick={checkRoute}
            disabled={solved || selected.length === 0}
            className="gap-2 border-0 bg-lamp text-night hover:bg-lamp-glow"
          >
            <Route className="h-4 w-4" />
            Check Route
          </Button>
        </div>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}
        {showCountHint && !solved ? (
          <p className="rounded-lg bg-blush/10 px-3 py-2 text-center text-sm italic text-blush">
            There are {correctIds.length} mountains on the true route.
          </p>
        ) : null}
        {solved ? (
          <p className="text-center text-sm text-sage">
            The trail is set — flags planted, boots ready.
          </p>
        ) : null}
      </div>
    </PuzzleModal>
  );
}
