import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Events } from "../common/events";
import { GameState, ObjectionPayload } from "../common/gameData";
import getServerIps from "./utils/network";

const app = express();
const httpServer = createServer(app);

const PORT = Number(process.env.SERVER_PORT) || 3000;
const HOST = "0.0.0.0";

const io = new Server(httpServer, {
  cors: {
    origin: "*", // I understand but it is good enough for a local app.
    methods: ["GET", "POST"],
  },
});

const state: GameState = {
  teamA: { name: "Defense", score: 0 },
  teamB: { name: "Prosecution", score: 0 },
  isLocked: false,
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Sync state on new connection
  socket.emit(Events.game.stateUpdate, state);

  socket.on(Events.objection.send, (data: ObjectionPayload) => {
    if (state.isLocked) return;

    state.isLocked = true;

    console.log(`Objection triggered by ${data.userName} (${data.teamId})`);

    io.emit(Events.objection.triggered, {
      ...data,
      timestamp: Date.now(),
    });

    setTimeout(() => (state.isLocked = false), 3000);
  });
});

httpServer.listen(PORT, HOST, () => {
  getServerIps().forEach((val) => {
    console.log(`Server started on http://${val}:${PORT}`);
  });
});
