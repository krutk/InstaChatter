import express from "express";
import { Chats } from "./data/data.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.get("/api/chat", (req, res) => {
  res.send(Chats);
});

app.get("/api/chat/:chatId", (req, res) => {
  console.log(req.params.chatId);
  const chatOfId = Chats.find((c) => c.chatId === req.params.chatId);
  res.send(chatOfId);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
