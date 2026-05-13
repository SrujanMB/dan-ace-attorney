import { useState, useEffect } from "react";
import { routes, getRouteUrl } from "../routes";
import { QRCodeSVG } from "qrcode.react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import { Link } from "react-router";

export default function Setup() {
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
        <h1>SETUP (not the actual thing)</h1>
        <h3 className="text-xl font-bold">
          {activeObjection != null
            ? `Team ${activeObjection.teamId}: ${activeObjection.userName} Objected!`
            : "Nothing yet"}
        </h3>
      </div>

      <div className="p-8 flex flex-row justify-center gap-12">
        <div className="flex flex-col">
          <QRCodeSVG value={getRouteUrl(routes.PLAYER_A)} size={250} />
          <Link
            className="p-4 text-blue-400 font-bold hover:underline"
            to={routes.PLAYER_A}
            target="_blank"
            rel="noopener noreferrer"
          >
            Player A View
          </Link>
        </div>
        <div className="flex flex-col">
          <QRCodeSVG value={getRouteUrl(routes.PLAYER_B)} size={250} />
          <Link
            className="p-4 text-blue-400 font-bold hover:underline"
            to={routes.PLAYER_B}
            target="_blank"
            rel="noopener noreferrer"
          >
            Player B View
          </Link>
        </div>
      </div>
      <Link
        className="py-8 text-white text-3xl font-bold hover:underline"
        to={routes.COURT}
      >
        Start Court
      </Link>
    </>
  );
}
