import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";
import { Confetti } from "./Confetti";

function GiftSunglasses() {
  return (
    <motion.div
      className="mt-5 flex flex-col items-center"
      initial={{ opacity: 0, y: -8, rotate: -7 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 220 92"
        role="img"
        aria-label="A pair of stylish sunglasses with black lenses"
        className="h-auto w-32 drop-shadow-[0_10px_18px_hsl(var(--night)/0.35)] sm:w-40"
      >
        <defs>
          <linearGradient id="frame-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--cream))" />
            <stop offset="0.35" stopColor="hsl(var(--gold))" />
            <stop offset="1" stopColor="hsl(var(--lamp))" />
          </linearGradient>
        </defs>

        <path
          d="M11 31C31 22 50 20 78 24M142 24c28-4 47-2 67 7"
          fill="none"
          stroke="url(#frame-gold)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M84 33c8-8 44-8 52 0"
          fill="none"
          stroke="url(#frame-gold)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M20 29c2-4 8-6 14-6h48c7 0 11 6 10 13l-3 19C87 70 75 79 58 79S28 70 25 55l-5-26Z"
          fill="hsl(var(--night-deep))"
          stroke="url(#frame-gold)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M200 29c-2-4-8-6-14-6h-48c-7 0-11 6-10 13l3 19c2 15 14 24 31 24s30-9 33-24l5-26Z"
          fill="hsl(var(--night-deep))"
          stroke="url(#frame-gold)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M39 36c10-7 24-8 35-4M146 36c10-7 24-8 35-4"
          fill="none"
          stroke="hsl(var(--cream))"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="m66 39 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7ZM167 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"
          fill="hsl(var(--cream))"
          opacity="0.85"
        />
      </svg>
    </motion.div>
  );
}

export function FinalScreen() {
  const { reset } = useGame();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-paper-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <Confetti count={34} />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{ background: "var(--gradient-lamp-radial)" }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center px-5 py-10 text-center sm:px-6 sm:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
      >
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.45em] text-blush-deep">
          Mission Complete
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-night sm:text-5xl">
          You found it.
        </h1>

        <GiftSunglasses />

        <motion.div
          className="mt-6 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          <div className="rounded-xl border border-gold/40 bg-paper-soft/70 p-5 shadow-[0_12px_36px_-16px_hsl(var(--lamp-deep)/0.25)] sm:p-6">
            <p
              className="whitespace-pre-line text-pretty font-serif text-[0.98rem] leading-relaxed"
              style={{ color: "hsl(var(--ink))" }}
            >
              {gameConfig.personalMessage}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-8 gap-2 border-lamp-deep/50 bg-transparent text-lamp-deep hover:bg-lamp-deep/10 hover:text-lamp-deep"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
            Play again
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
