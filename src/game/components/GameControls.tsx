import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGame } from "../GameContext";
import { playClick } from "../audio";

export function GameControls() {
  const { state, toggleMute, reset } = useGame();

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-lamp"
        aria-label={state.muted ? "Unmute sounds" : "Mute sounds"}
        aria-pressed={state.muted}
        onClick={() => {
          playClick();
          toggleMute();
        }}
      >
        {state.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-blush"
            aria-label="Reset the game"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-border/70 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl text-cream">
              Reset the room?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This clears every memory recovered in this session and walks you
              back to the door.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/70 bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-cream">
              Stay
            </AlertDialogCancel>
            <AlertDialogAction
              className="border-0 bg-blush-deep text-cream hover:bg-blush-deep/80"
              onClick={reset}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
