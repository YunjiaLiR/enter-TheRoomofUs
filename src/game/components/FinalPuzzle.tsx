import { useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuzzleModal } from "./PuzzleModal";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";
import { playError, playUnlock } from "../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PIN_LENGTH = 4;
const EMPTY_PIN = Array.from({ length: PIN_LENGTH }, () => "");
const INCORRECT_PIN_MESSAGE = "That code does not unlock this memory. Try again.";

export function FinalPuzzle({ open, onOpenChange }: Props) {
  const { reachFinalScreen } = useGame();
  const [digits, setDigits] = useState<string[]>(EMPTY_PIN);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const locationClue = useMemo(
    () =>
      gameConfig.clueFragments.reduce((phrase, fragment, index, fragments) => {
        if (index === 0) return fragment.text;
        return `${phrase}${fragments[index - 1].spaceAfter ? " " : ""}${fragment.text}`;
      }, ""),
    [],
  );

  function focusInput(index: number) {
    window.requestAnimationFrame(() => inputRefs.current[index]?.focus());
  }

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    setFeedback(null);
    if (digit && index < PIN_LENGTH - 1) focusInput(index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitPin();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      setFeedback(null);
      setDigits((current) => {
        const next = [...current];
        if (next[index]) {
          next[index] = "";
        } else if (index > 0) {
          next[index - 1] = "";
          focusInput(index - 1);
        }
        return next;
      });
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    } else if (event.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedDigits) return;

    event.preventDefault();
    setDigits((current) => {
      const next = [...current];
      pastedDigits
        .slice(0, PIN_LENGTH - index)
        .split("")
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
      return next;
    });
    setFeedback(null);
    focusInput(Math.min(index + pastedDigits.length, PIN_LENGTH - 1));
  }

  function submitPin() {
    if (unlocking) return;

    if (digits.join("") !== gameConfig.finalPin) {
      setFeedback(INCORRECT_PIN_MESSAGE);
      playError();
      return;
    }

    setFeedback(null);
    setUnlocking(true);
    playUnlock();
    window.setTimeout(() => {
      onOpenChange(false);
      reachFinalScreen();
    }, 1100);
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Last Lock"
      description="The five memories have settled into one final location. Find the birthday gift there, then enter its four-digit code."
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          submitPin();
        }}
      >
        <div className="rounded-xl border border-lamp/30 bg-night/45 px-4 py-4 text-center shadow-[inset_0_0_24px_hsl(var(--lamp)/0.05)]">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
            Your location clue
          </p>
          <p className="mt-1 font-display text-3xl text-gradient-warm">
            {locationClue}
          </p>
        </div>

        <motion.div
          className="flex justify-center"
          animate={unlocking ? { y: [0, -2, 0] } : undefined}
          transition={{ duration: 0.8 }}
          aria-live="polite"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-lamp/35 bg-lamp/10 text-lamp shadow-[0_0_24px_-6px_hsl(var(--lamp)/0.6)]">
            <AnimatePresence mode="wait" initial={false}>
              {unlocking ? (
                <motion.span
                  key="unlocked"
                  initial={{ opacity: 0, rotate: -28, scale: 0.75 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 190, damping: 14 }}
                >
                  <Unlock className="h-6 w-6" aria-label="Lock opened" />
                </motion.span>
              ) : (
                <motion.span key="locked" exit={{ opacity: 0, rotate: 18, scale: 0.8 }}>
                  <Lock className="h-6 w-6" aria-label="Locked" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.div>

        <fieldset disabled={unlocking}>
          <legend className="sr-only">Four-digit PIN</legend>
          <div className="flex justify-center gap-2.5 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                aria-label={`PIN digit ${index + 1}`}
                aria-invalid={Boolean(feedback)}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                onFocus={(event) => event.currentTarget.select()}
                className={cn(
                  "h-14 w-12 rounded-lg border bg-night/55 text-center font-display text-2xl text-cream caret-lamp outline-none transition-all sm:h-16 sm:w-14 sm:text-3xl",
                  feedback
                    ? "border-blush/80 shadow-[0_0_16px_-6px_hsl(var(--blush)/0.7)]"
                    : "border-lamp/35 focus:border-lamp focus:ring-2 focus:ring-lamp/20",
                )}
              />
            ))}
          </div>
        </fieldset>

        <Button
          type="submit"
          disabled={unlocking}
          className="w-full gap-2 border-0 bg-lamp text-night hover:bg-lamp-glow disabled:opacity-80"
        >
          {unlocking ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {unlocking ? "Opening…" : "Unlock"}
        </Button>

        <div className="min-h-5" aria-live="polite">
          {feedback ? (
            <p className="text-center text-sm text-blush">{feedback}</p>
          ) : null}
        </div>
      </form>
    </PuzzleModal>
  );
}
