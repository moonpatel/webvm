const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { createContainer, getContainerProcess, getContainerDetails } = require("./docker");
const port = process.env.PORT || 9000;
const cors = require("cors");
const pty = require("node-pty");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const connections = {};

app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

io.on("connection", async (socket) => {
  try {
    console.log("Connections:", connections);
    console.log("New socket connected:", socket.id);

    // register handlers
    socket.on("disconnect", (reason) => {
      console.log(socket.id, "disconnected due to", reason);
    });

    socket.on("id", async (id) => {
      console.log("ID received:", id);
      // container does not exist, create it
      if (!connections[id]) {
        try {
          let containerId = await createContainer(id, "ubuntu");
          console.log("Created container:", containerId);
          connections[id] = {
            containerId,
            socketId: socket.id, // be aware, changes on reconnect
            term: null,
          };
        } catch (err) {
          if (err.toString()?.includes(`Container named ${id} already exists.`)) {
            let containerId = (await getContainerDetails(id)).Id;
            connections[id] = {
              containerId,
              socketId: socket.id, // be aware, changes on reconnect
              term: null,
            };
          } else {
            throw err;
          }
        }
      }

      // bash session does not exist, create it
      if (!connections[id].term) {
        console.log(connections[id].containerId);
        connections[id].term = pty.spawn(
          "docker",
          ["exec", "-it", connections[id].containerId, "bash"],
          {
            name: "xterm-color",
            cols: 95,
            rows: 32,
            cwd: process.env.HOME,
            env: process.env,
          }
        );
      } else {
        socket.emit("result",connections[id].lastMessage);
      }

      let term = connections[id].term;

      // register handlers
      term.onData((data) => {
        console.log("====================================");
        console.log("Terminal output:", data);
        console.log("====================================");
        connections[id].lastMessage = data;
        socket.emit("result", data);
      });

      socket.on("command", (command) => {
        console.log("Command:", command);
        term.write(command);
      });
    });
  } catch (err) {
    throw err;
  }
});

httpServer.listen(port, () => {
  console.log("Listening on port", port);
});
