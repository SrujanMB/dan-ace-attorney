import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameState, ObjectionPayload } from "../common/types";
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

let state: GameState = {
  teamA: { name: "Defense", score: 0 },
  teamB: { name: "Prosecution", score: 0 },
  isLocked: false,
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Sync state on new connection
  socket.emit("STATE_UPDATE", state);

  socket.on("SEND_OBJECTION", (data: ObjectionPayload) => {
    if (state.isLocked) return;

    state.isLocked = true;

    console.log(`Objection triggered by ${data.userName} (${data.teamId})`);

    io.emit("OBJECTION_TRIGGERED", {
      ...data,
      timestamp: Date.now(),
    });
    
  });
});

httpServer.listen(PORT, HOST, () => {
  getServerIps().forEach((val) => {
    console.log(`Server started on http://${val}:${PORT}`);
  });
});
