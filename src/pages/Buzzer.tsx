import { useState, useEffect } from "react";
import { socket } from "../socket";
import type { Team, GameState, ObjectionPayload } from "../../common/gameData";

interface BuzzerProps {
  team: Team;
}

export default function Buzzer({ team }: BuzzerProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket.on("STATE_UPDATE", (state: GameState) => {
      setGameState(state);
    });

    return () => {
      socket.off("STATE_UPDATE");
    };
  }, []);

  const handleObjection = () => {
    if (gameState?.isLocked) return;

    const payload: ObjectionPayload = { teamId: team, userName };
    socket.emit("SEND_OBJECTION", payload);
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "40px",
          }}
        ></div>

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
      </div>
    </>
  );
}
