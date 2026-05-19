import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { Team, GameState, ObjectionPayload } from "../../common/gameData";
import SlamDetector from "./utils/SlamDetector";

interface BuzzerProps {
  team: Team;
}

export default function Buzzer({ team }: BuzzerProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userName, setUserName] = useState(`I am ${team}`);

  useEffect(() => {
    socket.on(Events.game.stateUpdate, (state: GameState) => {
      setGameState(state);
    });

    return () => {
      socket.off(Events.game.stateUpdate);
    };
  }, []);

  const handleObjection = () => {
    if (gameState?.isLocked) return;

    const payload: ObjectionPayload = { teamId: team, userName };
    socket.emit(Events.objection.send, payload);
  };

  if (!gameState) return <div className="w-screen h-screen bg-black text-zinc-400 flex items-center justify-center text-xl">Connecting to Courtroom...</div>;

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-white m-0">
        Team {team}
      </h1>

      <input
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-3 rounded bg-zinc-800 text-white border border-zinc-700 w-80 text-center text-lg outline-none focus:border-zinc-500"
      />

      <button
        onClick={handleObjection}
        disabled={gameState.isLocked || !userName}
        className="w-[200px] h-[200px] rounded-full text-white text-2xl font-bold border-none cursor-pointer transition-colors"
        style={{
          background: gameState.isLocked ? "#3f3f46" : "#dc2626",
          cursor: gameState.isLocked ? "not-allowed" : "pointer",
        }}
      >
        {gameState.isLocked ? "WAIT" : "OBJECTION!"}
      </button>
      <SlamDetector callback={handleObjection} />
    </div>
  );
}
