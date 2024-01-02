import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:9000";

export const socket = io(URL, { autoConnect: false });
