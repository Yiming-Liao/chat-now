import io from "socket.io-client";

export const socket = io("https://chat-now-server.fly.dev/");

// export const socket = io("http://192.168.1.211:3000/");