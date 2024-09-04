// @ts-nocheck
import pty from "node-pty";
import { CustomSocket } from "./types";

const connections = {};

export const socketConnectionHandler = async (socket: CustomSocket) => {
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
          if (
            err.toString()?.includes(`Container named ${id} already exists.`)
          ) {
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
        socket.emit("result", connections[id].lastMessage);
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

      socket.on("command", (command: string) => {
        console.log("Command:", command);
        term.write(command);
      });
    });
  } catch (err) {
    throw err;
  }
};
