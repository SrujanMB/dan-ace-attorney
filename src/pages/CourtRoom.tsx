import { useState, useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import ObjectionShout from "./utils/Objection";

export default function CourtRoom() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>(null);
  const [objectionKey, setObjectionKey] = useState(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    socket.on(Events.objection.triggered, (data: ObjectionPayload) => {
      setActiveObjection(data);
      setObjectionKey((k) => k + 1);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setActiveObjection(null), 3000);
    });

    return () => {
      socket.off(Events.objection.triggered);
    };
  }, []);

  return (
    <>
      <div>
        <h1>Court Room</h1>
        <h3>
          {activeObjection != null
            ? `Team ${activeObjection.teamId}: ${activeObjection.userName} Objected!`
            : "Nothing yet"}
        </h3>
        <div className="w-full h-screen flex flex-row">
          <div className="w-1/2 h-full flex items-center justify-center">
            {activeObjection?.teamId === "A" && (
              <ObjectionShout key={objectionKey} side="left" />
            )}
          </div>
          <div className="w-1/2 h-full flex items-center justify-center">
            {activeObjection?.teamId === "B" && (
              <ObjectionShout key={objectionKey} side="right" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
