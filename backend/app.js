const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { createContainer, getContainerProcess } = require("./docker");
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

app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.get("/", (req, res) => {
  res.send("OK");
});

io.on("connection", async (socket) => {
  try {
    console.log("New socket connected:", socket.id);

    // register handlers
    socket.on("disconnect", (reason) => {
      console.log(socket.id, "disconnected due to", reason);
    });

    let containerId = await createContainer("test", "ubuntu");
    console.log("Created container:", containerId);

    const term = pty.spawn("bash", [], {
      name: "xterm-color",
      cols: 120,
      rows: 32,
      cwd: process.env.HOME,
      env: process.env,
    });

    term.onData((data) => {
      console.log("====================================");
      console.log("Terminal output:", data);
      console.log("====================================");
      socket.emit("result", data);
    });

    socket.on("command", async (command) => {
      console.log("Command:", command);
      // const containerProcess = await getContainerProcess("test");
      // containerProcess.stdout.on("data", (data) => {
      //   console.log("Data:", data);
      //   socket.emit("result", data);
      // });
      // containerProcess.stderr.on("data", (data) => {
      //   console.log("Error:", data);
      //   socket.emit("result", data);
      // });
      // containerProcess.stdin.write(command + "\n");

     console.log("Command");
      term.write(command);
    });
  } catch (err) {
    throw err;
  }
});

httpServer.listen(port, () => {
  console.log("Listening on port", port);
});
