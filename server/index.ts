import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { Events } from "../common/events";
import { GameState, ObjectionPayload } from "../common/gameData";
import getServerIps from "./utils/network";

const app = express();
const httpServer = createServer(app);

const OBJECTION_COOLDOWN_MS = 3000;

const PORT = Number(process.env.SERVER_PORT) || 3000;
const HOST = "0.0.0.0";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const state: GameState = {
  isLocked: false,
};

/**
 * Broadcast the current game state to a specific socket or to all sockets.
 *
 * @param socket Optional socket. If omitted, the state will be sent to every
 * connected client via `io.emit`.
 */
function updateState(socket?: Socket): void {
  const target = socket ?? io;
  target.emit(Events.game.stateUpdate, state);
}

/**
 * Helper that mutates the global game state and then broadcasts the new state.
 *
 * @param mutate Callback receives the current state object which can be mutated
 * in‑place. The callback should not return a value; mutation is performed
 * directly on `state`.
 */
function setGameState(mutate: (s: GameState) => void): void {
  mutate(state);
  io.emit(Events.game.stateUpdate, state);
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current state to the newly connected client
  updateState(socket);

  socket.on(Events.objection.send, (data: ObjectionPayload) => {
    if (state.isLocked) return;

    setGameState((s) => {
      s.isLocked = true;
    });

    console.log(`Objection triggered by ${data.userName} (${data.teamId})`);

    io.emit(Events.objection.triggered, {
      ...data,
      timestamp: Date.now(),
    });

    // The state was already broadcasted via setGameState; no extra emit needed

    setTimeout(() => {
      setGameState((s) => {
        s.isLocked = false;
      });
    }, OBJECTION_COOLDOWN_MS);
  });
});

httpServer.listen(PORT, HOST, () => {
  getServerIps().forEach((val) =>
    console.log(`Server started on http://${val}:${PORT}`),
  );
});
