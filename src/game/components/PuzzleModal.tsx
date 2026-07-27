import { useState, type ReactNode } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PuzzleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  hint?: string;
  solved?: boolean;
  fragmentText?: string;
  children: ReactNode;
}

export function PuzzleModal({
  open,
  onOpenChange,
  title,
  description,
  hint,
  solved = false,
  fragmentText,
  children,
}: PuzzleModalProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto border-border/70 bg-card/95 p-6 backdrop-blur-xl sm:max-w-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-lg bg-[linear-gradient(90deg,hsl(var(--lamp)),hsl(var(--blush)),hsl(var(--gold)))]" />
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-display text-2xl leading-tight text-cream sm:text-3xl">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-[0.95rem] leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {solved ? (
          <div className="flex items-center gap-2 rounded-lg border border-lamp/40 bg-lamp/10 px-3 py-2 text-sm text-lamp">
            <Sparkles className="h-4 w-4" />
            <span>
              Memory recovered
              {fragmentText ? (
                <span className="ml-1 font-display text-base text-cream">
                  — {fragmentText}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}

        {children}

        {hint ? (
          <div className="space-y-2 border-t border-border/60 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-blush"
              onClick={() => setShowHint((s) => !s)}
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? "Hide hint" : "Need a hint?"}
            </Button>
            {showHint ? (
              <p
                className={cn(
                  "rounded-lg bg-blush/10 px-3 py-2 text-sm italic leading-relaxed text-blush",
                )}
              >
                {hint}
              </p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
