import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(var(--lamp))",
  "hsl(var(--blush))",
  "hsl(var(--cream))",
  "hsl(var(--gold))",
  "hsl(var(--blush-deep))",
];

/** Small elegant confetti burst — no external dependency. */
export function Confetti({ count = 70 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 2.2,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 50,
        shape: Math.random() > 0.5 ? "0.5rem" : "9999px",
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-6%]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.62,
            background: p.color,
            borderRadius: p.shape,
            boxShadow: `0 0 8px ${p.color}`,
          }}
          initial={{ y: 0, opacity: 0, rotate: p.rotate }}
          animate={{
            y: "118vh",
            opacity: [0, 1, 1, 0],
            rotate: p.rotate + 360,
            x: p.drift,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: Math.random() * 1.8,
          }}
        />
      ))}
    </div>
  );
}
