import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import ObjectionShout from "./utils/Objection";

export default function CourtRoom() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>();

  useEffect(() => {
    socket.on(Events.objection.triggered, (data: ObjectionPayload) => {
      setActiveObjection(data);
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
        <div className="w-full p-16 flex flex-row justify-center">
          <ObjectionShout show={activeObjection != null} />
        </div>
      </div>
    </>
  );
}
