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
      <div className="flex-none flex flex-col items-center pt-10 pb-4 gap-3">
        <div className="border-2 border-purple-500 px-12 py-3">
          <h1 className="text-white text-3xl font-bold m-0 tracking-[0.3em]">
            COURT ROOM IS IN SESSION
          </h1>
        </div>
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>

      <div className="flex-1 flex flex-row relative min-h-0">
        <div className="w-1/2 h-full flex flex-col relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="border border-purple-500/40 px-8 py-1.5">
                <span className="text-purple-400 text-base font-semibold tracking-[0.25em]">
                  DEFENDANT
                </span>
              </div>
              <span className="text-white text-4xl font-bold tracking-wide leading-none">
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

        <div className="w-px self-stretch bg-gradient-to-b from-transparent via-purple-500/60 to-transparent" />

        <div className="w-1/2 h-full flex flex-col relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="border border-purple-500/40 px-8 py-1.5">
                <span className="text-purple-400 text-base font-semibold tracking-[0.25em]">
                  PROSECUTOR
                </span>
              </div>
              <span className="text-white text-4xl font-bold tracking-wide leading-none">
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
