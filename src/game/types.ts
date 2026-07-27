// Shared types for The Room of Us game (config + state).

export type PuzzleId =
  | "bigBen"
  | "tableTennis"
  | "piano"
  | "chess"
  | "hiking";

export type GamePhase = "intro" | "room" | "finalScene" | "finalScreen";

/** A clickable region layered over the room background. Positions are % of the stage. */
export interface HotspotConfig {
  id: PuzzleId;
  /** left edge as % of stage width */
  x: number;
  /** top edge as % of stage height */
  y: number;
  /** width as % of stage width */
  w: number;
  /** height as % of stage height */
  h: number;
  /** accessible label announced to screen readers */
  label: string;
  /** short flavour shown when hovering/focused */
  echo: string;
  /** id of the clue fragment revealed when this puzzle is solved */
  fragmentId: string;
}

export interface ClueFragment {
  id: string;
  text: string;
  /** render a space after this fragment when joining the solution phrase */
  spaceAfter?: boolean;
}

export interface TableTennisTarget {
  id: string;
  label: string;
}

export interface PianoNote {
  note: string;
  freq: number;
  /** seconds */
  duration: number;
}

export type ChessPieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";

export type ChessColor = "white" | "black";

export interface ChessPiece {
  /** algebraic square, e.g. "d1" */
  square: string;
  type: ChessPieceType;
  color: ChessColor;
  /** only pieces marked movable can be picked up by the player */
  movable?: boolean;
}

export interface MountainOption {
  id: string;
  name: string;
}

export interface GameConfig {
  /** REPLACE: the person this room is built for. */
  boyfriendName: string;
  /** REPLACE: relationship start date as DDMMYY, e.g. "150620" = 15 June 2020. */
  relationshipDateDDMMYY: string;

  roomBackgroundImage: string;

  hotspots: HotspotConfig[];
  /** region over the bed used for the final reveal (% of stage). */
  finalBedHotspot: { x: number; y: number; w: number; h: number };

  tableTennis: {
    targets: TableTennisTarget[];
    correctTargetId: string;
  };

  piano: {
    /** Placeholder melody. The last note must equal `correctNote`.
     *  SWAP LATER: replace oscillator playback in audio.ts with a real audio file. */
    melody: PianoNote[];
    correctNote: string;
    availableKeys: string[];
  };

  chess: {
    pieces: ChessPiece[];
    correctMove: { from: string; to: string };
  };

  mountains: {
    options: MountainOption[];
    correctIds: string[];
  };

  /** Fragments in SOLUTION order. Joining (honouring spaceAfter) yields "UNDER THE BED". */
  clueFragments: ClueFragment[];

  /** Four-digit code that unlocks the final birthday letter. */
  finalPin: string;

  hints: {
    bigBen: string;
    tableTennis: string;
    piano: string;
    chess: string;
    hiking: string;
  };

  /** REPLACE: the final birthday message revealed under the bed. */
  personalMessage: string;

  /*
   * PHOTOS (later): drop real photographs into /public/photos and reference them
   * here (e.g. a `photos: { src; caption }[]` array) to show a small gallery on
   * the FinalScreen alongside the message.
   */
}

export interface GameState {
  phase: GamePhase;
  completedPuzzles: Record<PuzzleId, boolean>;
  /** fragment ids in the order they were collected */
  collectedFragmentIds: string[];
  muted: boolean;
}

export type GameAction =
  | { type: "ENTER_ROOM" }
  | { type: "SOLVE_PUZZLE"; puzzle: PuzzleId; fragmentId: string }
  | { type: "TOGGLE_MUTE" }
  | { type: "START_FINAL_SCENE" }
  | { type: "REACH_FINAL_SCREEN" }
  | { type: "RESET" };
