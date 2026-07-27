import { GameProvider, useGame } from "./GameContext";
import { IntroScreen } from "./components/IntroScreen";
import { RoomScene } from "./components/RoomScene";

function GameSwitch() {
  const { state } = useGame();
  if (state.phase === "intro") return <IntroScreen />;
  // room / finalScene / finalScreen all render from within RoomScene so the
  // bedroom stays visible as the finale layers over it.
  return <RoomScene />;
}

export function RoomOfUsGame() {
  return (
    <GameProvider>
      <GameSwitch />
    </GameProvider>
  );
}
