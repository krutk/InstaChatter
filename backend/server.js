import express from "express";
import { Chats } from "./data/data.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io"; // Import Server from socket.io module
import path from "path";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("Welcome to the server");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// for deployment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontEnd/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontEnd", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// for deployment

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server listening on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new-message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log(
      "chat: " + JSON.stringify(chat.users),
      "new message: " + newMessageRecieved
    );
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      console.log("first", user._id === newMessageRecieved.sender._id);
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData?._id);
  });
});
