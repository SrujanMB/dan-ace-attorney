import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { Team, GameState, ObjectionPayload, NamePayload } from "../../common/gameData";
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

  const handleApplyName = () => {
    const payload: NamePayload = { teamId: team, userName };
    socket.emit(Events.name.send, payload);
  };

  if (!gameState) return <div className="w-screen h-screen bg-black text-zinc-400 flex items-center justify-center text-xl">Connecting to Courtroom...</div>;

  const isLocked = gameState.isLocked || !userName;

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold text-white m-0 tracking-wider">
        TEAM {team}
      </h1>

      <div className="flex flex-col items-center gap-3">
        <input
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="px-5 py-3 rounded bg-zinc-900 text-white border-2 border-zinc-700 w-80 text-center text-lg outline-none focus:border-amber-600 transition-colors placeholder-zinc-500"
        />
        <button
          onClick={handleApplyName}
          disabled={!userName}
          className="px-8 py-2 rounded bg-zinc-800 text-zinc-300 text-sm font-semibold tracking-widest hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-zinc-700"
        >
          APPLY NAME
        </button>
      </div>

      <button
        onClick={handleObjection}
        disabled={isLocked}
        className="w-96 h-28 rounded-2xl font-bold border-2 cursor-pointer transition-all duration-200 select-none"
        style={{
          background: isLocked ? "#18181b" : "#991b1b",
          borderColor: isLocked ? "#3f3f46" : "#ef4444",
          color: isLocked ? "#52525b" : "#fef2f2",
          cursor: isLocked ? "not-allowed" : "pointer",
          textShadow: isLocked ? "none" : "0 2px 8px rgba(0,0,0,0.5)",
          boxShadow: isLocked
            ? "inset 0 2px 4px rgba(0,0,0,0.4)"
            : "0 0 20px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <span
          className="text-5xl tracking-[0.15em] block leading-tight"
          style={{
            filter: isLocked ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        >
          {isLocked ? "WAIT" : "OBJECTION!"}
        </span>
      </button>

      <SlamDetector callback={handleObjection} />
    </div>
  );
}
