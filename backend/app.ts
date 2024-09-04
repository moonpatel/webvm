import { socketConnectionHandler } from "./socket";
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";

const port = process.env.PORT || 9000;
require("dotenv").config();

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  console.log(req.ip, req.url);
  next();
});
app.use(cors());

if (process.env.MODE === "PRODUCTION") {
  console.log("Starting in production...");
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("OK");
});

io.on("connection", socketConnectionHandler);

httpServer.listen(port, () => {
  console.log("Listening on port", port);
});
