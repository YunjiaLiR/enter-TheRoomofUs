import { cn } from "@/lib/utils";

export function ProgressIndicator({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
        Memories recovered
      </span>
      <span className="font-display text-lg leading-none text-lamp">
        {progress}
        <span className="text-muted-foreground">/5</span>
      </span>
      <div className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i < progress
                ? "w-4 bg-lamp shadow-[0_0_8px_hsl(var(--lamp)/0.6)]"
                : "w-3 bg-muted/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
