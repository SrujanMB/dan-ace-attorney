import { useState, useEffect } from "react";
import { routes, getRouteUrl } from "../routes";
import { QRCodeSVG } from "qrcode.react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import { Link } from "react-router";

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
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "3rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <QRCodeSVG value={getRouteUrl(routes.PLAYER_A)} />
          <Link to={routes.PLAYER_A} target="_blank" rel="noopener noreferrer">
            Player A View
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <QRCodeSVG value={getRouteUrl(routes.PLAYER_B)} />
          <Link to={routes.PLAYER_B} target="_blank" rel="noopener noreferrer">
            Player B View
          </Link>
        </div>
      </div>
    </>
  );
}
