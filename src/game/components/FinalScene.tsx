import { useEffect } from "react";
import { motion } from "framer-motion";
import { Footprints } from "lucide-react";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";
import { playReveal } from "../audio";

/** Dim the room, walk footprints to the bed, pour a beam of light underneath. */
export function FinalScene() {
  const { reachFinalScreen } = useGame();
  const bed = gameConfig.finalBedHotspot;
  const cx = bed.x + bed.w / 2;
  const cy = bed.y + bed.h / 2;

  useEffect(() => {
    playReveal();
    const t = window.setTimeout(() => reachFinalScreen(), 4400);
    return () => window.clearTimeout(t);
  }, [reachFinalScreen]);

  const start = { x: 50, y: 95 };
  const steps = 6;
  const pts = Array.from({ length: steps }).map((_, i) => {
    const t = i / (steps - 1);
    return {
      x: start.x + (cx - start.x) * t,
      y: start.y + (cy - start.y) * t - 7 * Math.sin(Math.PI * t),
    };
  });

  return (
    <div className="absolute inset-0 z-40 overflow-hidden">
      {/* dim the room */}
      <motion.div
        className="absolute inset-0 bg-night/80 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* footprints leading to the bed */}
      {pts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-lamp/70"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.85, 0.85], scale: 1 }}
          transition={{ delay: 0.4 + i * 0.32, duration: 0.4 }}
        >
          <Footprints
            className="h-5 w-5"
            style={{ transform: i % 2 ? "scaleX(-1)" : undefined }}
          />
        </motion.span>
      ))}

      {/* beam of light under the bed */}
      <motion.div
        className="absolute"
        style={{
          left: `${cx}%`,
          top: `${cy}%`,
          width: "26%",
          height: "40%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, hsl(var(--lamp) / 0.55), hsl(var(--lamp) / 0.15) 45%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.4, duration: 1, ease: "easeOut" }}
      />

      <motion.p
        className="absolute inset-x-0 bottom-6 text-center font-display text-lg italic text-cream/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8 }}
      >
        Following the footprints…
      </motion.p>
    </div>
  );
}
