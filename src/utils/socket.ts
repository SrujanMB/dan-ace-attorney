import { io } from "socket.io-client";

const SERVER_PORT = 3000;

const serverUrl = `http://${window.location.hostname}:${SERVER_PORT}`;

export const socket = io(serverUrl);
