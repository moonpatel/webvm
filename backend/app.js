const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");
const Dockerode = require('dockerode');
require("dotenv").config();
const {
  createContainer,
  getContainerProcess,
  getContainerDetails,
  ensureContainer,
} = require("./docker");
const port = process.env.PORT || 9000;
const cors = require("cors");
const pty = require("node-pty");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const connections = {};

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

      /**
       * @type {Dockerode.Container}
       */
      let container;

      if(!connections[id]) {
        container = await ensureContainer(id);
        // await container.start();
        connections[id] = {
          container
        }
      } else {
        container = connections[id].container;
      }

      /**
       * @type {Dockerode.ContainerInspectInfo}
       */
      let containerInfo = await container.inspect();
      if(!containerInfo.State.Running) await container.start();

      // bash session does not exist, create it
      if (!connections[id].term) {
        console.log(connections[id].containerId);
        connections[id].term = pty.spawn(
          "docker",
          ["exec", "-it", containerInfo.Id, "bash"],
          {
            name: "xterm-color",
            cols: 95,
            rows: 10,
            cwd: process.env.HOME,
            env: process.env,
          }
        );
      } else {
        socket.emit("result", connections[id].lastMessage);
      }

      let term = connections[id].term;

      // register handlers
      term.onData((data) => {
        console.log("====================================");
        console.log("Terminal output:", data);
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
