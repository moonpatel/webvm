import { Socket } from "socket.io";

interface ServerToClientEvents {}

interface ClientToServerEvents {}

interface InterServerEvents {}

interface SocketData {}

export type CustomSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;
