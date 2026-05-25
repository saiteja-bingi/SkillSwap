import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://skillswap-zrev.onrender.com";

const socket = io(SOCKET_URL, {
    transports: ["websocket"]
});

export default socket;