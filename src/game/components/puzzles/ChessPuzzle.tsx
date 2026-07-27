import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PuzzleModal } from "../PuzzleModal";
import { useGame } from "../../GameContext";
import { gameConfig } from "../../gameConfig";
import type { ChessPiece } from "../../types";
import { playClick, playError, playSuccess } from "../../audio";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SYMBOLS: Record<string, string> = {
  whiteKing: "♔",
  whiteQueen: "♕",
  whiteRook: "♖",
  whiteBishop: "♗",
  whiteKnight: "♘",
  whitePawn: "♙",
  blackKing: "♚",
  blackQueen: "♛",
  blackRook: "♜",
  blackBishop: "♝",
  blackKnight: "♞",
  blackPawn: "♟",
};

function fileIndex(sq: string) {
  return sq.charCodeAt(0) - 97;
}
function rankNum(sq: string) {
  return parseInt(sq[1], 10);
}
function squarePos(sq: string) {
  return {
    left: (fileIndex(sq) / 8) * 100,
    top: ((8 - rankNum(sq)) / 8) * 100,
  };
}
function isDark(sq: string) {
  return (fileIndex(sq) + rankNum(sq)) % 2 === 1;
}
function symbolKey(p: ChessPiece) {
  return p.color + p.type[0].toUpperCase() + p.type.slice(1);
}

export function ChessPuzzle({ open, onOpenChange }: Props) {
  const { isPuzzleDone, solvePuzzle } = useGame();
  const solved = isPuzzleDone("chess");
  const [pieces, setPieces] = useState<ChessPiece[]>(gameConfig.chess.pieces);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPieces(gameConfig.chess.pieces);
      setSelected(null);
      setFeedback(null);
    }
  }, [open]);

  const hint = gameConfig.hints.chess;

  function onSquareClick(sq: string) {
    if (solved) return;
    const pieceHere = pieces.find((p) => p.square === sq);
    if (pieceHere?.movable) {
      setSelected(sq);
      playClick();
      setFeedback(null);
      return;
    }
    if (selected) {
      if (sq === selected) {
        setSelected(null);
        return;
      }
      const { from, to } = gameConfig.chess.correctMove;
      if (selected === from && sq === to) {
        setFeedback(null);
        playSuccess();
        setPieces((prev) =>
          prev.map((p) => (p.square === from ? { ...p, square: to } : p)),
        );
        setSelected(null);
        solvePuzzle("chess");
      } else {
        setFeedback("That's not the move that wins. Try again.");
        playError();
        setSelected(null);
      }
    }
  }

  const squares: string[] = [];
  for (let r = 8; r >= 1; r--) {
    for (let f = 0; f < 8; f++) {
      squares.push(String.fromCharCode(97 + f) + r);
    }
  }

  return (
    <PuzzleModal
      open={open}
      onOpenChange={onOpenChange}
      title="The Chessboard"
      description="A game frozen mid-play. Find the one move that ends it — checkmate in one."
      hint={hint}
      solved={solved}
      fragmentText="E"
    >
      <div className="space-y-3">
        <div className="relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-lg border border-border/70 shadow-[0_12px_40px_-12px_hsl(var(--night)/0.9)]">
          <div className="grid h-full w-full grid-cols-8 grid-rows-8">
            {squares.map((sq) => {
              const piece = pieces.find((p) => p.square === sq);
              const movable = piece?.movable && !solved;
              return (
                <button
                  key={sq}
                  type="button"
                  aria-label={`Square ${sq}${piece ? `, ${piece.color} ${piece.type}` : ""}`}
                  onClick={() => onSquareClick(sq)}
                  className={cn(
                    "relative flex items-center justify-center",
                    isDark(sq) ? "bg-night-deep" : "bg-muted",
                    selected === sq && "ring-2 ring-inset ring-lamp",
                    movable &&
                      !solved &&
                      "shadow-[inset_0_0_0_2px_hsl(var(--lamp)/0.45)]",
                  )}
                >
                  {movable && !solved ? (
                    <span className="absolute inset-0 animate-glow-pulse rounded-sm bg-lamp/10" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {pieces.map((p, i) => {
            const pos = squarePos(p.square);
            return (
              <motion.div
                key={symbolKey(p) + i}
                className="pointer-events-none absolute flex items-center justify-center"
                style={{ width: "12.5%", height: "12.5%" }}
                animate={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <span
                  className={cn(
                    "text-2xl leading-none drop-shadow sm:text-3xl",
                    p.color === "white" ? "text-cream" : "text-blush-deep",
                  )}
                >
                  {SYMBOLS[symbolKey(p)]}
                </span>
              </motion.div>
            );
          })}
        </div>

        {feedback ? (
          <p className="text-center text-sm text-blush">{feedback}</p>
        ) : null}
        {solved ? (
          <p className="text-center text-sm text-sage">
            Checkmate — the board goes still.
          </p>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Tap the glowing piece, then the square it should reach.
          </p>
        )}
      </div>
    </PuzzleModal>
  );
}
