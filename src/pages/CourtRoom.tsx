import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import ObjectionShout from "./utils/Objection";

export default function CourtRoom() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>(null);
  const [objectionKey, setObjectionKey] = useState(0);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");

  useEffect(() => {
    socket.on(Events.objection.triggered, (data: ObjectionPayload) => {
      setActiveObjection(data);
      setObjectionKey((k) => k + 1);
      if (data.teamId === "A") setTeamAName(data.userName);
      if (data.teamId === "B") setTeamBName(data.userName);
    });

    return () => {
      socket.off(Events.objection.triggered);
    };
  }, []);

  const handleComplete = () => {
    setActiveObjection(null);
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex-none py-3 text-center">
        <h1 className="text-white text-xl font-bold m-0 tracking-wider">
          Court Room is in Session
        </h1>
      </div>

      <div className="flex-1 flex flex-row relative min-h-0">
        <div className="w-1/2 h-full flex items-center justify-center relative">
          {activeObjection?.teamId === "A" && (
            <ObjectionShout key={objectionKey} side="left" onComplete={handleComplete} />
          )}
          <div className="absolute bottom-0 left-0 p-5 flex flex-col items-start gap-0.5">
            <span className="bg-zinc-800/80 text-zinc-400 px-4 py-1 rounded text-xs font-semibold tracking-widest">
              DEFENDANT
            </span>
            <span className="bg-zinc-800/80 text-white px-4 py-1.5 rounded text-base font-bold tracking-wide">
              {teamAName || "—"}
            </span>
          </div>
        </div>

        <div className="w-px h-3/4 self-center bg-zinc-700" />

        <div className="w-1/2 h-full flex items-center justify-center relative">
          {activeObjection?.teamId === "B" && (
            <ObjectionShout key={objectionKey} side="right" onComplete={handleComplete} />
          )}
          <div className="absolute bottom-0 right-0 p-5 flex flex-col items-end gap-0.5">
            <span className="bg-zinc-800/80 text-zinc-400 px-4 py-1 rounded text-xs font-semibold tracking-widest">
              PROSECUTOR
            </span>
            <span className="bg-zinc-800/80 text-white px-4 py-1.5 rounded text-base font-bold tracking-wide">
              {teamBName || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
