// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { Server } = require("socket.io");

// routes
const authRoutes = require("./routes/auth");
const detectRoutes = require("./routes/detect");
const historyRoutes = require("./routes/history");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ["GET", "POST"] },
});

// attach io to app so routes can emit events (or export io)
app.set("io", io);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "dist")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/detect", detectRoutes);
app.use("/api/history", historyRoutes);

// serve frondend

app.get(/.*/, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// socket.io connection

// --- socket.io user mapping ---
const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // client should send userId after login
  socket.on("register_user", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        console.log(`User ${uid} disconnected`);
        break;
      }
    }
  });
});

// expose userSocketMap
app.set("userSocketMap", userSocketMap);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
