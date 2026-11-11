"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_http_1 = __importDefault(require("node:http"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const proximity_socket_js_1 = require("./modules/proximity/proximity.socket.js");
// 1. Create the Express application
const app = (0, express_1.default)();
// 2. Create an HTTP server
const httpServer = node_http_1.default.createServer(app);
// 3. Read environment configuration
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/proxispeak";
// 4. Configure middleware
app.use((0, cors_1.default)({ origin: CLIENT_URL }));
app.use(express_1.default.json());
// 5. Attach Socket.IO to the HTTP server
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
    },
});
const proximitySocket = new proximity_socket_js_1.ProximitySocket();
proximitySocket.register(io);
// 6. Health-check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "ProxiSpeak backend",
        database: mongoose_1.default.connection.readyState === 1
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
async function startServer() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("MongoDB connected successfully!");
        httpServer.listen(PORT, () => {
            console.log(`ProxiSpeak backend running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}
startServer();
