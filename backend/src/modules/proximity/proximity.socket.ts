
import { Server, Socket } from "socket.io";
import { AvatarPosition } from "../../types/proximity.types.js";
import { ProximityRepository } from "./proximity.repository.js";
import { ProximityManager } from "./proximity.manager.js";

export class ProximitySocket {
  private repository = new ProximityRepository();
  private manager = new ProximityManager();

  private activeSockets = new Map<string, Socket>();
    private getActiveSocket(userId: string): Socket | undefined {
  return this.activeSockets.get(userId);
}
  register(io: Server): void {
    io.on("connection", (socket: Socket) => {
      console.log(`Proximity user connected: ${socket.id}`);

      socket.on("join-office", async (data: {
        userId: string;
        officeId: string;
        x: number;
        y: number;
      }) => {
        try {
          const avatar: AvatarPosition = {
            ...data,
            isOnline: true,
            updatedAt: Date.now()
          };

          socket.data.userId = data.userId;
          socket.data.officeId = data.officeId;

          this.activeSockets.set(data.userId, socket);

          await this.repository.updateAvatarPosition(avatar);

          await this.updateProximity(socket, avatar);
        } catch (error) {
          console.error("Join office error:", error);
          socket.emit("proximity-error", {
            message: "Unable to join office"
          });
        }
      });

      socket.on("update-position", async (data: {
        x: number;
        y: number;
      }) => {
        try {
          const userId = socket.data.userId as string;
          const officeId = socket.data.officeId as string;

          if (!userId || !officeId) {
            socket.emit("proximity-error", {
              message: "Join an office first"
            });
            return;
          }

          const avatar: AvatarPosition = {
            userId,
            officeId,
            x: data.x,
            y: data.y,
            isOnline: true,
            updatedAt: Date.now()
          };

          await this.repository.updateAvatarPosition(avatar);

          await this.updateProximity(socket, avatar);
        } catch (error) {
          console.error("Position update error:", error);
        }
      });

      socket.on("disconnect", async () => {
        const userId = socket.data.userId as string | undefined;

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

  private async updateProximity(
    socket: Socket,
    currentUser: AvatarPosition
  ): Promise<void> {
    // Find users near the current user
    const nearbyAvatars =
      await this.repository.findNearbyAvatars(currentUser);

    const nearbyUserIds = nearbyAvatars.map(
      avatar => avatar.userId
    );

    // Detect changes for the current user
    const changes = this.manager.updateNearbyUsers(
      currentUser.userId,
      nearbyUserIds
    );
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
      const nearbySocket =
        this.activeSockets.get(nearbyAvatar.userId);

      if (!nearbySocket) continue;

      const theirNearbyAvatars =
        await this.repository.findNearbyAvatars(nearbyAvatar);

      const theirNearbyIds = theirNearbyAvatars.map(
        avatar => avatar.userId
      );

      const theirChanges = this.manager.updateNearbyUsers(
        nearbyAvatar.userId,
        theirNearbyIds
      );

      nearbySocket.emit("proximity-update", {
        nearbyUsers: theirNearbyAvatars,
        entered: theirChanges.entered,
        exited: theirChanges.exited
      });
    }
  }
}
