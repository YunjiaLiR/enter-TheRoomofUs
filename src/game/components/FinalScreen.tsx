import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";
import { playSuccess } from "../audio";
import { Confetti } from "./Confetti";

export function FinalScreen() {
  const { reset } = useGame();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-night-gradient">
      {revealed ? <Confetti /> : null}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{ background: "var(--gradient-lamp-radial)" }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.45em] text-blush/80">
          Mission Complete
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
          You found it.
        </h1>

        {!revealed ? (
          <>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-cream/75">
              Something was hidden under the bed all along, {gameConfig.boyfriendName}.
              Five memories led you here.
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-8 gap-2 border-0 bg-lamp px-8 text-night hover:bg-lamp-glow"
              onClick={() => {
                setRevealed(true);
                playSuccess();
              }}
            >
              <Gift className="h-4 w-4" />
              Read your birthday message
            </Button>
          </>
        ) : (
          <motion.div
            className="mt-6 w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl border border-lamp/30 bg-card/80 p-6 backdrop-blur-sm">
              <p className="whitespace-pre-line text-pretty font-serif text-[0.98rem] leading-relaxed text-cream/90">
                {gameConfig.personalMessage}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="mt-8 gap-2 border-lamp/40 bg-transparent text-lamp hover:bg-lamp/10 hover:text-lamp"
              onClick={reset}
            >
              <RotateCcw className="h-4 w-4" />
              Play again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
