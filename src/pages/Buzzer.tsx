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

  if (!gameState) return <div>Connecting to Courtroom...</div>;

  return (
    <>
      <div>
        <h1>Team {team}</h1>

        <input
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ padding: "10px", marginBottom: "20px", width: "80%" }}
        />


        <button
          onClick={handleObjection}
          disabled={gameState.isLocked || !userName}
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: gameState.isLocked ? "#7f8c8d" : "#e74c3c",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: gameState.isLocked ? "not-allowed" : "pointer",
          }}
        >
          {gameState.isLocked ? "WAIT" : "OBJECTION!"}
        </button>
        <SlamDetector callback={handleObjection} />
      </div>
    </>
  );
}
