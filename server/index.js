import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// configuration
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// middleware
app.use(cors());

// 追蹤當前連線人數
let userCount = 0;
// 追蹤當前線上的使用者
let usersArray = [];

// 監聽 io 伺服器
io.on("connection", socket => { // 當有人連線時，便會使用一個socket (socket.id)
    userCount++; // 增加當前連線人數，並回傳給全部用戶
    io.emit("user-count", userCount);
    io.emit("all-users", usersArray);

    // 監聽新連接的使用者的 id , userName 並回傳
    socket.on("user-connect", (id, userName) => {
        usersArray.push({ id, userName });
        io.emit("all-users", usersArray);
    });
    // 離線 回到首頁 
    socket.on("user-disconnect", (id) => {
        usersArray = usersArray.filter(user => user.id !== id);
        io.emit("all-users", usersArray); // 更新所有客戶端的用戶列表
    });

    // 監聽 globalMsg 並回傳給除了發送者以外的用戶
    socket.on("globalMsg-from-client", (msg, userName, userId) => {
        socket.broadcast.emit("globalMsg-from-server", msg, userName, userId);
    });

    // Join room (目前只設定為一次只能加入一個房間)
    socket.on("join-room", (roomId) => {
        // 先從所有房間離開，然後加入新房間
        socket.rooms.forEach(room => {
            // 確保不會離開其自己的房間（每個 socket 自動擁有一個與其 id 同名的房間）
            if (room !== socket.id) socket.leave(room);
        });
        socket.join(roomId);
    });
    // Leave room
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
    });

    // roomMsg
    socket.on("roomMsg-from-client", (msg, roomId, userName, userId) => {
        socket.broadcast.to(roomId).emit("roomMsg-from-server", msg, userName, userId);
    });

    // 離線 離開網頁
    socket.on("disconnect", () => {
        usersArray = usersArray.filter(user => user.id !== socket.id);
        io.emit("all-users", usersArray); // 更新所有客戶端的用戶列表
        userCount--; // 減少當前連線人數，並回傳給全部用戶
        io.emit("user-count", userCount);
    });
});



const PORT = 3000
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on: http://${server.address().address}:${PORT}`));
