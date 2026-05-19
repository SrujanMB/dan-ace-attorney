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

  if (!gameState) return <div className="w-screen h-screen bg-black text-purple-400 flex items-center justify-center text-xl">Connecting to Courtroom...</div>;

  const isLocked = gameState.isLocked || !userName;

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-10">
      <div className="border-2 border-purple-500 px-10 py-2">
        <h1 className="text-white text-4xl font-bold m-0 tracking-[0.3em]">
          TEAM {team}
        </h1>
      </div>

      <div className="flex flex-col items-center gap-3">
        <input
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="px-5 py-3 w-80 text-center text-lg bg-black text-white border-2 border-zinc-700 outline-none focus:border-purple-500 transition-colors placeholder-zinc-600 font-sans"
        />
        <button
          onClick={handleApplyName}
          disabled={!userName}
          className="px-8 py-2 text-sm font-semibold tracking-[0.2em] bg-transparent text-purple-400 border border-purple-500/40 hover:bg-purple-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          APPLY NAME
        </button>
      </div>

      <button
        onClick={handleObjection}
        disabled={isLocked}
        className="w-96 h-28 font-bold border-2 cursor-pointer transition-all duration-200 select-none"
        style={{
          background: isLocked ? "#09090b" : "#3b0764",
          borderColor: isLocked ? "#3f3f46" : "#a855f7",
          color: isLocked ? "#52525b" : "#faf5ff",
          cursor: isLocked ? "not-allowed" : "pointer",
          textShadow: isLocked ? "none" : "0 0 12px rgba(168,85,247,0.6)",
          boxShadow: isLocked
            ? "inset 0 2px 4px rgba(0,0,0,0.4)"
            : "0 0 30px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="text-5xl tracking-[0.2em] block leading-tight"
          style={{
            filter: isLocked ? "none" : "drop-shadow(0 0 8px rgba(168,85,247,0.5))",
          }}
        >
          {isLocked ? "WAIT" : "OBJECTION!"}
        </span>
      </button>

      <SlamDetector callback={handleObjection} />
    </div>
  );
}
