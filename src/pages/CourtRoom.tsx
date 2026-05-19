import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import ObjectionShout from "./utils/Objection";

export default function CourtRoom() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>(null);
  const [objectionKey, setObjectionKey] = useState(0);

  useEffect(() => {
    socket.on(Events.objection.triggered, (data: ObjectionPayload) => {
      setActiveObjection(data);
      setObjectionKey((k) => k + 1);
    });

    return () => {
      socket.off(Events.objection.triggered);
    };
  }, []);

  const handleComplete = () => {
    setActiveObjection(null);
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-row overflow-hidden">
      <div className="w-1/2 h-full flex items-center justify-center">
        {activeObjection?.teamId === "A" && (
          <ObjectionShout key={objectionKey} side="left" onComplete={handleComplete} />
        )}
      </div>

      <div className="w-px h-3/4 self-center bg-zinc-700" />

      <div className="w-1/2 h-full flex items-center justify-center">
        {activeObjection?.teamId === "B" && (
          <ObjectionShout key={objectionKey} side="right" onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
