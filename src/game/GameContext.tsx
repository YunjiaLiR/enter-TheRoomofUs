import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { gameConfig } from "./gameConfig";
import { setAudioMuted } from "./audio";
import type { GameAction, GameState, PuzzleId } from "./types";
import { useSessionStorage } from "./useSessionStorage";

const STORAGE_KEY = "room-of-us:v1";

const initialState: GameState = {
  phase: "intro",
  completedPuzzles: {
    citySkyline: false,
    tableTennis: false,
    piano: false,
    chess: false,
    hiking: false,
  },
  collectedFragmentIds: [],
  muted: false,
};

/** Pure transition function — the reducer, kept outside the component for testability. */
export const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "ENTER_ROOM":
      return { ...state, phase: "room" };
    case "SOLVE_PUZZLE": {
      if (state.completedPuzzles[action.puzzle]) return state;
      return {
        ...state,
        completedPuzzles: {
          ...state.completedPuzzles,
          [action.puzzle]: true,
        },
        collectedFragmentIds: [...state.collectedFragmentIds, action.fragmentId],
      };
    }
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "START_FINAL_SCENE":
      return { ...state, phase: "finalScene" };
    case "REACH_FINAL_SCREEN":
      return { ...state, phase: "finalScreen" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

interface GameContextValue {
  state: GameState;
  progress: number;
  allSolved: boolean;
  isPuzzleDone: (puzzle: PuzzleId) => boolean;
  enterRoom: () => void;
  solvePuzzle: (puzzle: PuzzleId) => void;
  toggleMute: () => void;
  startFinalScene: () => void;
  reachFinalScreen: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState, remove] = useSessionStorage<GameState>(
    STORAGE_KEY,
    initialState,
  );

  const dispatch = useCallback(
    (action: GameAction) => {
      setState((prev) => reducer(prev, action));
    },
    [setState],
  );

  // Keep the audio module in sync with the mute flag.
  useEffect(() => {
    setAudioMuted(state.muted);
  }, [state.muted]);

  const value = useMemo<GameContextValue>(() => {
    const completedCount = Object.values(state.completedPuzzles).filter(
      Boolean,
    ).length;
    return {
      state,
      progress: completedCount,
      allSolved: completedCount === 5,
      isPuzzleDone: (puzzle: PuzzleId) => state.completedPuzzles[puzzle],
      enterRoom: () => dispatch({ type: "ENTER_ROOM" }),
      solvePuzzle: (puzzle: PuzzleId) => {
        const hotspot = gameConfig.hotspots.find((h) => h.id === puzzle);
        if (!hotspot) return;
        dispatch({
          type: "SOLVE_PUZZLE",
          puzzle,
          fragmentId: hotspot.fragmentId,
        });
      },
      toggleMute: () => dispatch({ type: "TOGGLE_MUTE" }),
      startFinalScene: () => dispatch({ type: "START_FINAL_SCENE" }),
      reachFinalScreen: () => dispatch({ type: "REACH_FINAL_SCREEN" }),
      reset: () => {
        remove();
        setState(initialState);
      },
    };
  }, [state, dispatch, remove, setState]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
