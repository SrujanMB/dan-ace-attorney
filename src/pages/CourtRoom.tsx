import { useState, useEffect } from "react";
import { socket } from "../socket";
import type { ObjectionPayload } from "../../common/gameData";

export default function CourtRoom() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>();

  useEffect(() => {
    socket.on("OBJECTION_TRIGGERED", (data: ObjectionPayload) => {
      setActiveObjection(data);
    });

    return () => {
      socket.off("OBJECTION_TRIGGERED");
    };
  }, []);

  return (
    <>
      <h1>Court Room</h1>
      <h3>
        {activeObjection != null
          ? `Team ${activeObjection.teamId}: ${activeObjection.userName} Objected!`
          : "Nothing yet"}
      </h3>
    </>
  );
}
