import { io } from "socket.io-client";
const PATH = "http://localhost:8080";
let socket;

export function getSocket() {
  if (!socket) {
    socket = io(PATH, { autoConnect: false });
  }
  return socket;
} 