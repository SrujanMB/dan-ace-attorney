import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload, NamePayload } from "../../common/gameData";
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

    socket.on(Events.name.updated, (data: NamePayload) => {
      if (data.teamId === "A") setTeamAName(data.userName);
      if (data.teamId === "B") setTeamBName(data.userName);
    });

    return () => {
      socket.off(Events.objection.triggered);
      socket.off(Events.name.updated);
    };
  }, []);

  const handleComplete = () => {
    setActiveObjection(null);
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex-none py-3 text-center">
        <h1 className="text-white text-4xl pt-12 font-bold m-0 tracking-wider">
          Court Room is in Session
        </h1>
      </div>

      <div className="flex-1 flex flex-row relative min-h-0">
        <div className="w-1/2 h-full flex flex-col relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="bg-zinc-800/80 text-zinc-400 px-6 py-2 rounded text-lg font-semibold tracking-[0.2em]">
                DEFENDANT
              </span>
              <span className="bg-zinc-800/80 text-white px-8 py-3 rounded text-4xl font-bold tracking-wide">
                {teamAName || "—"}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {activeObjection?.teamId === "A" && (
              <ObjectionShout
                key={objectionKey}
                side="left"
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>

        <div className="w-px h-3/4 self-center bg-zinc-700 flex-none" />

        <div className="w-1/2 h-full flex flex-col relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="bg-zinc-800/80 text-zinc-400 px-6 py-2 rounded text-lg font-semibold tracking-[0.2em]">
                PROSECUTOR
              </span>
              <span className="bg-zinc-800/80 text-white px-8 py-3 rounded text-4xl font-bold tracking-wide">
                {teamBName || "—"}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {activeObjection?.teamId === "B" && (
              <ObjectionShout
                key={objectionKey}
                side="right"
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
