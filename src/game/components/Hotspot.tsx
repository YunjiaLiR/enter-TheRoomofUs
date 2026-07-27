import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HotspotProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  completed?: boolean;
  /** a stronger always-on pulse — used for the final-frame hotspot */
  prominent?: boolean;
  onClick: () => void;
  children?: ReactNode;
}

/**
 * An invisible-by-default button layered over the room background. A faint
 * pulsing dot makes it discoverable; hover/focus raises a warm glow ring.
 */
export function Hotspot({
  x,
  y,
  w,
  h,
  label,
  completed = false,
  prominent = false,
  onClick,
  children,
}: HotspotProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group absolute z-20 rounded-2xl focus:outline-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      {/* hover/focus glow ring */}
      <span
        className={cn(
          "absolute inset-0 rounded-2xl ring-1 ring-inset ring-lamp/0 transition-all duration-300",
          "group-hover:ring-lamp/70 group-hover:shadow-[0_0_34px_-2px_hsl(var(--lamp)/0.55)]",
          "group-focus-visible:ring-2 group-focus-visible:ring-lamp group-focus-visible:shadow-[0_0_34px_-2px_hsl(var(--lamp)/0.7)]",
        )}
        aria-hidden
      />
      {/* discoverable marker */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {completed ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lamp/90 text-night shadow-[0_0_20px_hsl(var(--lamp)/0.7)]">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        ) : (
          <span
            className={cn(
              "block rounded-full border backdrop-blur-[1px] transition-all duration-300",
              prominent
                ? "h-7 w-7 animate-glow-pulse border-blush/70 bg-blush/30 shadow-[0_0_24px_hsl(var(--blush)/0.6)]"
                : "h-3.5 w-3.5 animate-glow-pulse border-lamp/40 bg-lamp/20 group-hover:h-5 group-hover:w-5 group-hover:border-lamp/90 group-hover:bg-lamp/40",
            )}
            aria-hidden
          />
        )}
      </span>
      {children}
    </motion.button>
  );
}
