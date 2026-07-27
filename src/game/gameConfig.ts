import type { GameConfig } from "./types";

/* =========================================================================
 *  THE ROOM OF US — single source of personalisation.
 *  Every REPLACE marker below is a spot to swap in real details.
 *  Nothing else in the app needs editing to customise the game.
 * ========================================================================= */

export const gameConfig: GameConfig = {
  // REPLACE: the person this room is built for.
  boyfriendName: "Joshua",
  // REPLACE: relationship start date as DDMMYY. "150620" = 15 June 2020.
  relationshipDateDDMMYY: "250324",

  roomBackgroundImage: "/room-background.png",

  // Hotspot positions are % of the 16:9 stage and are tuned to the generated
  // background. Adjust here if you regenerate the image.
  hotspots: [
    {
      id: "bigBen",
      x: 19,
      y: 8,
      w: 19,
      h: 47,
      label: "The window and the London skyline",
      echo: "A window. Big Ben glows in the distance.",
      fragmentId: "f1",
    },
    {
      id: "tableTennis",
      x: 1,
      y: 71,
      w: 15,
      h: 26,
      label: "The bedside table with a table-tennis paddle",
      echo: "A paddle and a lone orange ball rest here.",
      fragmentId: "f2",
    },
    {
      id: "chess",
      x: 44,
      y: 33,
      w: 18,
      h: 20,
      label: "The chessboard on the desk",
      echo: "A game is frozen mid-play.",
      fragmentId: "f4",
    },
    {
      id: "piano",
      x: 72,
      y: 31,
      w: 19,
      h: 38,
      label: "The upright piano",
      echo: "The keys wait in the lamplight.",
      fragmentId: "f3",
    },
    {
      id: "hiking",
      x: 47,
      y: 79,
      w: 18,
      h: 16,
      label: "The hiking boots and trail map",
      echo: "Boots and a folded map by the desk.",
      fragmentId: "f5",
    },
  ],

  // Region over the bed used for the final "under the bed" reveal.
  finalBedHotspot: { x: 1, y: 58, w: 22, h: 40 },

  tableTennis: {
    targets: [
      { id: "t1", label: "Far left" },
      { id: "t2", label: "Left" },
      { id: "t3", label: "Center" },
      { id: "t4", label: "Right" },
      { id: "t5", label: "Far right" },
    ],
    // REPLACE: which target scores the point.
    correctTargetId: "t1",
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

  hints: {
    bigBen: "Six digits, day then month then year — the day we became 'us'.",
    tableTennis: "Aim dead centre, where the paddle's shadow falls at noon.",
    piano: "The melody is one note shy. Reach up to the seventh key.",
    chess:
      "The black king is walled in by its own pawns. Slide a rook along the back rank to finish it.",
    hiking: "The true route is the UK Three Peaks — three mountains, one challenge.",
  },

  // REPLACE: the birthday message revealed under the bed.
  personalMessage: `Happy Birthday!!!
This room is made of us—every object holds a memory, and every puzzle leads back to a moment we shared.

The London nights beneath Big Ben.
The table-tennis matches we played until our arms ached.
The slightly off-key piano evenings.
The burning brain chess games 
The mountains we climbed, and all the ones still waiting for us.

Five memories. One truth, hidden safely under the bed all along:

I love you—today, tomorrow, and every day that follows.

Love you 

Yunjia`,
};
