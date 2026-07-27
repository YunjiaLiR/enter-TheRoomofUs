import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuzzleModal } from "./PuzzleModal";
import { useGame } from "../GameContext";
import { gameConfig } from "../gameConfig";
import { playError, playSuccess } from "../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fixed scramble so the puzzle always starts unsolved but solvable.
const SCRAMBLED = ["f3", "f5", "f1", "f4", "f2"];

function SortableFragment({ id }: { id: string }) {
  const frag = gameConfig.clueFragments.find((f) => f.id === id);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-lamp/40 bg-lamp/10 px-4 py-3 font-display text-2xl text-cream transition-shadow",
        isDragging
          ? "z-10 border-lamp bg-lamp/20 shadow-[0_8px_30px_-6px_hsl(var(--lamp)/0.5)]"
          : "hover:border-lamp/70",
      )}
    >
      <GripVertical className="h-4 w-4 text-lamp/50" />
      {frag?.text ?? ""}
    </div>
  );
}

export function FinalPuzzle({ open, onOpenChange }: Props) {
  const { startFinalScene } = useGame();
  const [order, setOrder] = useState<string[]>(SCRAMBLED);
  const [feedback, setFeedback] = useState<string | null>(null);

  const solution = useMemo(
    () => gameConfig.clueFragments.map((f) => f.id),
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setOrder((items) => {
        const oldIndex = items.indexOf(String(active.id));
        const newIndex = items.indexOf(String(over.id));
        return arrayMove(items, oldIndex, newIndex);
      });
      setFeedback(null);
    }
  }

  function check() {
    if (order.join(",") === solution.join(",")) {
      setFeedback(null);
      playSuccess();
      window.setTimeout(() => {
        onOpenChange(false);
        startFinalScene();
      }, 500);
    } else {
      setFeedback("The words don't settle into place yet.");
      playError();
    }
  }

  const isCorrect = order.join(",") === solution.join(",");

  // Join fragments into a preview phrase, inserting a space when the previous
  // fragment is marked spaceAfter. Solution order renders "UNDER THE BED".
  const preview = order
    .map((id) => gameConfig.clueFragments.find((f) => f.id === id))
    .reduce<string>((acc, f, i) => {
      if (!f) return acc;
      if (i === 0) return f.text;
      const prev = gameConfig.clueFragments.find((x) => x.id === order[i - 1]);
      return acc + (prev?.spaceAfter ? " " : "") + f.text;
    }, "");

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="Arrange the Memories"
      description="Five fragments. One order. Drag them — or use arrow keys — until the words make sense."
    >
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {order.map((id) => (
                <SortableFragment key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* preview */}
        <div className="rounded-lg border border-border/70 bg-night/40 px-4 py-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            Your phrase
          </p>
          <p
            className={cn(
              "font-display text-2xl",
              isCorrect ? "text-gradient-warm" : "text-cream/80",
            )}
          >
            {preview}
          </p>
        </div>

        <Button
          type="button"
          onClick={check}
          className="w-full gap-2 border-0 bg-lamp text-night hover:bg-lamp-glow"
        >
          <Shuffle className="h-4 w-4" />
          Confirm the order
        </Button>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          Tip: focus a fragment and use the arrow keys to move it.
        </p>
      </div>
    </PuzzleModal>
  );
}
