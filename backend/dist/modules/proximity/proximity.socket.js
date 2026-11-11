"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximitySocket = void 0;
const proximity_repository_js_1 = require("./proximity.repository.js");
const proximity_manager_js_1 = require("./proximity.manager.js");
class ProximitySocket {
    repository = new proximity_repository_js_1.ProximityRepository();
    manager = new proximity_manager_js_1.ProximityManager();
    activeSockets = new Map();
    getActiveSocket(userId) {
        return this.activeSockets.get(userId);
    }
    register(io) {
        io.on("connection", (socket) => {
            console.log(`Proximity user connected: ${socket.id}`);
            socket.on("join-office", async (data) => {
                try {
                    const avatar = {
                        ...data,
                        isOnline: true,
                        updatedAt: Date.now()
                    };
                    socket.data.userId = data.userId;
                    socket.data.officeId = data.officeId;
                    this.activeSockets.set(data.userId, socket);
                    await this.repository.updateAvatarPosition(avatar);
                    await this.updateProximity(socket, avatar);
                }
                catch (error) {
                    console.error("Join office error:", error);
                    socket.emit("proximity-error", {
                        message: "Unable to join office"
                    });
                }
            });
            socket.on("update-position", async (data) => {
                try {
                    const userId = socket.data.userId;
                    const officeId = socket.data.officeId;
                    if (!userId || !officeId) {
                        socket.emit("proximity-error", {
                            message: "Join an office first"
                        });
                        return;
                    }
                    const avatar = {
                        userId,
                        officeId,
                        x: data.x,
                        y: data.y,
                        isOnline: true,
                        updatedAt: Date.now()
                    };
                    await this.repository.updateAvatarPosition(avatar);
                    await this.updateProximity(socket, avatar);
                }
                catch (error) {
                    console.error("Position update error:", error);
                }
            });
            socket.on("disconnect", async () => {
                const userId = socket.data.userId;
                if (userId) {
                    if (this.activeSockets.get(userId)?.id === socket.id) {
                        this.activeSockets.delete(userId);
                    }
                    this.manager.removeUser(userId);
                    console.log(`Proximity user disconnected: ${userId}`);
                }
            });
        });
    }
    async updateProximity(socket, currentUser) {
        // Find users near the current user
        const nearbyAvatars = await this.repository.findNearbyAvatars(currentUser);
        const nearbyUserIds = nearbyAvatars.map(avatar => avatar.userId);
        // Detect changes for the current user
        const changes = this.manager.updateNearbyUsers(currentUser.userId, nearbyUserIds);
        // Notify users who have exited the current user's range
        for (const exitedUserId of changes.exited) {
            const exitedSocket = this.getActiveSocket(exitedUserId);
            exitedSocket?.emit("proximity-update", {
                nearbyUsers: [],
                entered: [],
                exited: [currentUser.userId]
            });
        }
        socket.emit("proximity-update", {
            nearbyUsers: nearbyAvatars,
            entered: changes.entered,
            exited: changes.exited
        });
        // Also update the nearby users
        for (const nearbyAvatar of nearbyAvatars) {
            const nearbySocket = this.activeSockets.get(nearbyAvatar.userId);
            if (!nearbySocket)
                continue;
            const theirNearbyAvatars = await this.repository.findNearbyAvatars(nearbyAvatar);
            const theirNearbyIds = theirNearbyAvatars.map(avatar => avatar.userId);
            const theirChanges = this.manager.updateNearbyUsers(nearbyAvatar.userId, theirNearbyIds);
            nearbySocket.emit("proximity-update", {
                nearbyUsers: theirNearbyAvatars,
                entered: theirChanges.entered,
                exited: theirChanges.exited
            });
        }
    }
}
exports.ProximitySocket = ProximitySocket;
