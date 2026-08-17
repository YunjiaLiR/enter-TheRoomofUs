import { useMemo } from "react";
import { motion } from "framer-motion";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "../GameContext";
import { playChime } from "../audio";

export function IntroScreen() {
  const { enterRoom } = useGame();

  const motes = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 40,
      })),
    [],
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-night-gradient px-6 text-center">
      {/* ambient lamp glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{ background: "var(--gradient-lamp-radial)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[50vh] w-[80vh] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "hsl(var(--blush) / 0.25)" }}
        aria-hidden
      />

      {/* floating motes */}
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full bg-lamp/40"
          style={{ left: `${m.left}%`, width: m.size, height: m.size }}
          initial={{ y: "10vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.8, 0], x: m.drift }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h1 className="font-display text-[3.4rem] font-semibold leading-[0.95] text-cream sm:text-[5rem]">
          Happy <span className="text-gradient-warm">Birthday.</span>
        </h1>
        <p className="mt-6 max-w-md text-pretty text-[0.95rem] leading-relaxed text-cream/70 sm:text-base">
          Your gift is already here—hidden somewhere in this room.
        </p>
        <p className="mt-4 max-w-md text-pretty text-[0.95rem] leading-relaxed text-cream/70 sm:text-base">
          I’m not going to tell you where it is.
        </p>
        <p className="mt-4 max-w-md text-pretty text-[0.95rem] leading-relaxed text-cream/70 sm:text-base">
          Explore the room, follow the memories, solve the puzzles, and find it
          yourself.
        </p>
        <p className="mt-4 max-w-md text-pretty font-display text-lg italic text-lamp/90 sm:text-xl">
          Good luck!
        </p>

        <Button
          type="button"
          size="lg"
          className="mt-10 gap-2 border-0 bg-lamp px-8 text-night hover:bg-lamp-glow"
          onClick={() => {
            playChime();
            enterRoom();
          }}
        >
          <DoorOpen className="h-4 w-4" />
          Enter the Room
        </Button>
      </motion.div>

    </div>
  );
}
