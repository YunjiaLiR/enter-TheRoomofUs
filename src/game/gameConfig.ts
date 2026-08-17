import type { GameConfig } from "./types";

/* =========================================================================
 *  THE ROOM OF US — single source of personalisation.
 *  Every REPLACE marker below is a spot to swap in real details.
 *  Nothing else in the app needs editing to customise the game.
 * ========================================================================= */

export const gameConfig: GameConfig = {
  // REPLACE: the person this room is built for.
  boyfriendName: "Joshua",

  roomBackgroundImage: "/room-background-warm.png",
  // REPLACE: swap in your own illustration to change the city skyline puzzle artwork.
  citySkylineImage: "/city-skyline-v2.png",

  // Hotspot positions are % of the 43:24 stage and are tuned to the generated
  // background. Adjust here if you regenerate the image.
  hotspots: [
    {
      id: "citySkyline",
      x: 4,
      y: 1,
      w: 41,
      h: 46,
      label: "The window and the city skyline",
      echo: "A window. The city glitters in the distance.",
      fragmentId: "f1",
    },
    {
      id: "tableTennis",
      x: 0,
      y: 78,
      w: 14,
      h: 22,
      label: "The bedside table with a table-tennis paddle",
      echo: "A paddle and a lone orange ball rest here.",
      fragmentId: "f2",
    },
    {
      id: "chess",
      x: 55,
      y: 42,
      w: 29,
      h: 16,
      label: "The chessboard on the desk",
      echo: "A game is frozen mid-play.",
      fragmentId: "f4",
    },
    {
      id: "piano",
      x: 78,
      y: 34,
      w: 22,
      h: 52,
      label: "The upright piano",
      echo: "The keys wait in the lamplight.",
      fragmentId: "f3",
    },
    {
      id: "hiking",
      x: 52,
      y: 70,
      w: 27,
      h: 30,
      label: "The hiking boots and trail map",
      echo: "Boots and a folded map by the desk.",
      fragmentId: "f5",
    },
  ],

  // Region over the bed used for the final "under the bed" reveal.
  finalBedHotspot: { x: 27, y: 77, w: 22, h: 18 },

  mayorTransport: {
    options: [
      { id: "helicopter", label: "Helicopter" },
      { id: "car", label: "Car" },
      { id: "train", label: "Train" },
      { id: "ferry", label: "Ferry" },
      { id: "walking", label: "Walking" },
      { id: "lightning", label: "Lightning" },
    ],
    // REPLACE: which option id is correct.
    correctOptionId: "helicopter",
  },

  tableTennis: {
    // REPLACE: swap in your own four photos to change the answer choices.
    players: [
      { id: "p1", image: "/person-1.png" },
      { id: "p2", image: "/person-2.png" },
      { id: "p3", image: "/person-3.png" },
      { id: "p4", image: "/person-4.png" },
    ],
    // REPLACE: which player id is the correct answer.
    correctPlayerId: "p2",
  },

  piano: {
    // Placeholder melody. The LAST note must equal `correctNote`.
    // SWAP LATER: replace oscillator playback in audio.ts with a real recording.
    melody: [
      { note: "G", freq: 392.0, duration: 0.4 },
      { note: "E", freq: 329.63, duration: 0.4 },
      { note: "D", freq: 293.66, duration: 0.4 },
      { note: "E", freq: 329.63, duration: 0.4 },
      { note: "G", freq: 392.0, duration: 0.4 },
      { note: "A", freq: 440.0, duration: 0.5 },
      { note: "B", freq: 493.88, duration: 0.6 },
    ],
    correctNote: "B",
    availableKeys: ["C", "D", "E", "F", "G", "A", "B"],
  },

  chess: {
    // A back-rank mate in one. White rook slides d1-d8# while the black king is
    // walled in by its own f7/g7/h7 pawns.
    pieces: [
      { square: "g1", type: "king", color: "white" },
      { square: "d1", type: "rook", color: "white", movable: true },
      { square: "g8", type: "king", color: "black" },
      { square: "f7", type: "pawn", color: "black" },
      { square: "g7", type: "pawn", color: "black" },
      { square: "h7", type: "pawn", color: "black" },
    ],
    correctMove: { from: "d1", to: "d8" },
  },

  mountains: {
    // The true route is the UK Three Peaks challenge.
    options: [
      { id: "ben-nevis", name: "Ben Nevis" },
      { id: "snowdon", name: "Snowdonia" },
      { id: "scafell-pike", name: "泰山" },
      { id: "fuji", name: "Mount Fuji" },
      { id: "k2", name: "衡山" },
      { id: "table", name: "恒山" },
      { id: "kilimanjaro", name: "华山" },
      { id: "mont-blanc", name: "嵩山" },
    ],
    // REPLACE: the mountains that form the real hiking route.
    correctIds: ["snowdon", "scafell-pike", "mont-blanc"],
  },

  // Fragments in SOLUTION order. Joined (honouring spaceAfter) -> "UNDER THE BED".
  clueFragments: [
    { id: "f1", text: "UNDER", spaceAfter: true },
    { id: "f2", text: "THE", spaceAfter: true },
    { id: "f3", text: "B", spaceAfter: false },
    { id: "f4", text: "E", spaceAfter: false },
    { id: "f5", text: "D", spaceAfter: false },
  ],

  // REPLACE: the four-digit code on the physical birthday gift.
  finalPin: "0818",

  hints: {
    citySkyline: "Think about how a mayor might travel quickly across the city.",
    tableTennis: "Look for the confident stance and the steady eyes on the ball.",
    piano: "The melody is one note shy. Reach up to the seventh key.",
    chess:
      "The black king is walled in by its own pawns. Slide a rook along the back rank to finish it.",
    hiking: "The true route is the UK Three Peaks — three mountains, one challenge.",
  },

  // REPLACE: the birthday message revealed under the bed.
  personalMessage: `Happy Birthday!!!
  
I hope the year ahead brings you lots of happiness, success, and wonderful moments. May everything go smoothly for you, and may all your wishes come true.
Also, I love you—today, tomorrow, and every day that follows.

Yunjia`,
};
