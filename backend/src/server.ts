
import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "node:http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ProximitySocket } from "./modules/proximity/proximity.socket.js";
// 1. Create the Express application
const app = express();

// 2. Create an HTTP server
const httpServer = http.createServer(app);

// 3. Read environment configuration
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_URL =
  process.env.CLIENT_URL ?? "http://localhost:5173";
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/proxispeak";

// 4. Configure middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// 5. Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
const proximitySocket = new ProximitySocket();
proximitySocket.register(io);
// 6. Health-check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ProxiSpeak backend",
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected",
    sockets: io.engine.clientsCount,
  });
});

// 7. Socket.IO connection events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 8. Connect to MongoDB and start the server
async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully!");

    httpServer.listen(PORT, () => {
      console.log(`ProxiSpeak backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
