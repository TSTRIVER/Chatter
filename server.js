import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const port = 4400 || process.env.port;

app.use(cors());

const io = new Server(server);

const users = [{}];

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome To The Lobby,${users[socket.id]} `,
    });
    socket.broadcast.emit("userjoined", {
      message: `${users[socket.id]} has joined the chat`,
    });
  });

  socket.on("message", ({ message, userId }) => {
    io.emit("sendMessage", { user: users[userId], message, userId });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      message: `${users[socket.id]} has left the chat`,
    });
  });
});

server.listen(port, () => {
  console.log(`Server is working on Port ${port}`);
});
