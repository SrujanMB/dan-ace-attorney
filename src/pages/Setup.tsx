import { useState, useEffect } from "react";
import { routes, getRouteUrl } from "../routes";
import { QRCodeSVG } from "qrcode.react";
import { socket } from "../utils/socket";
import { Events } from "../../common/events";
import type { ObjectionPayload } from "../../common/gameData";
import { Link } from "react-router";

export default function Setup() {
  const [activeObjection, setActiveObjection] =
    useState<ObjectionPayload | null>(null);

  useEffect(() => {
    socket.on(Events.objection.triggered, (data: ObjectionPayload) => {
      setActiveObjection(data);
    });

    return () => {
      socket.off(Events.objection.triggered);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-white m-0">
        SETUP
      </h1>

      <div className="text-zinc-400">
        {activeObjection != null
          ? `Team ${activeObjection.teamId}: ${activeObjection.userName} Objected!`
          : "Nothing yet"}
      </div>

      <div className="flex flex-row justify-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded">
            <QRCodeSVG value={getRouteUrl(routes.PLAYER_A)} size={200} />
          </div>
          <Link
            className="text-zinc-400 font-bold hover:text-white no-underline"
            to={routes.PLAYER_A}
            target="_blank"
            rel="noopener noreferrer"
          >
            Player A View
          </Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded">
            <QRCodeSVG value={getRouteUrl(routes.PLAYER_B)} size={200} />
          </div>
          <Link
            className="text-zinc-400 font-bold hover:text-white no-underline"
            to={routes.PLAYER_B}
            target="_blank"
            rel="noopener noreferrer"
          >
            Player B View
          </Link>
        </div>
      </div>

      <Link
        className="text-white text-3xl font-bold hover:text-zinc-300 no-underline mt-4"
        to={routes.COURT}
      >
        Start Court
      </Link>
    </div>
  );
}
