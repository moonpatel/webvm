import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { socket } from "../socket.tsx";

interface TerminalProps {}

// Terminal component
const Terminal: React.FC<TerminalProps> = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerm | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [currentCommand, setCurrentCommand] = useState("");
  let currentCommand = "";

  useEffect(() => {
    socket.connect();
    console.log("hello");
    function onConnect() {
      setIsConnected(true);
      console.log("Socket connection established");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("result", function (result) {
      console.log(result);
      terminalInstance.current?.write("\r\n"+result.replaceAll("\n", "\r\n"));
      terminalInstance.current?.write("\r\n$ ");
    });
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new XTerm({
        fontFamily: "Ubuntu Mono",
        letterSpacing: 1,
        cols: 120,
        rows: 32,
      });
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);

      terminalInstance.current = terminal;
      fitAddon.fit();

      // Example: You can send commands to the terminal
      terminal.write("Hello from xterm.js!\r\n$ ");

      terminal.onKey(async (e) => {
        console.log(e.domEvent.key);
        if (e.domEvent.ctrlKey) {
          switch (e.domEvent.key) {
            case "v":
              const text = await navigator.clipboard.readText();
              terminal.write(text);
              currentCommand = currentCommand.concat(text);
          }
        }
        if (e.domEvent.key === "Enter") {
          socket.emit("command", currentCommand);
          currentCommand = "";
          // terminal.write("\r\n$ ");
        } else if (e.domEvent.key === "Backspace") {
          // how can i prevent the user from deleting $ sign?
          if (terminal.buffer.active.cursorX > 2) {
            terminal.write("\b \b");
            currentCommand = currentCommand.slice(0, -1);
          }
        } else if (e.domEvent.key === "Tab") {
          terminal.write("\t");
        } else {
          terminal.write(e.key);
          currentCommand = currentCommand.concat(e.key);
        }
        console.log(currentCommand);
      });

      return () => {
        if (terminalInstance.current) {
          terminalInstance.current.dispose();
        }
      };
    }
  }, []);

  return (
    <div className="m-auto w-[840px] shadow-2xl shadow-black rounded-md">
      {/* Header */}
      <div className="flex items-center relative bg-gray-800 p-2 px-4 w-full rounded-tl-lg rounded-tr-lg">
        {/* Three dots icon (Mac-style) */}
        <div className="flex gap-2 absolute">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* Title (customize as needed) */}
        <div className="text-slate-300 text-lg font-[JetBrainsMono] text-center w-full">bash</div>
      </div>

      <div className="p-3 bg-black w-full rounded-b-md">
        <div id="terminal-container" className="w-full rounded-md" ref={terminalRef}></div>
      </div>
    </div>
  );
};

export default Terminal;
