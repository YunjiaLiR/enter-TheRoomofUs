import { gameConfig } from "../gameConfig";
import { cn } from "@/lib/utils";

export function ClueInventory({
  collectedIds,
}: {
  collectedIds: string[];
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label="Collected memory fragments"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const id = collectedIds[i];
        const frag = id
          ? gameConfig.clueFragments.find((f) => f.id === id)
          : null;
        return (
          <div
            key={i}
            className={cn(
              "flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border px-2 font-display text-sm transition-all duration-500",
              frag
                ? "border-lamp/50 bg-lamp/10 text-cream shadow-[0_0_14px_-4px_hsl(var(--lamp)/0.6)]"
                : "border-border/70 bg-muted/30 text-muted-foreground/50",
            )}
          >
            {frag ? frag.text : "·"}
          </div>
        );
      })}
    </div>
  );
}
