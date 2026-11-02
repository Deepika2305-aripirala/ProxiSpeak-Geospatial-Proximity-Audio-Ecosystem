
import {
  detectProximityChanges,
  ProximityChanges
} from "./proximity.changes.js";

export class ProximityManager {
  private nearbyUsers = new Map<string, Set<string>>();

  updateNearbyUsers(
    userId: string,
    currentUsers: string[]
  ): ProximityChanges {

    const previousUsers = Array.from(
      this.nearbyUsers.get(userId) ?? []
    );

    const changes = detectProximityChanges(
      previousUsers,
      currentUsers
    );

    this.nearbyUsers.set(
      userId,
      new Set(currentUsers)
    );

    return changes;
  }

  getNearbyUsers(userId: string): string[] {
    return Array.from(
      this.nearbyUsers.get(userId) ?? []
    );
  }

  removeUser(userId: string): void {
    this.nearbyUsers.delete(userId);

    // Remove this user from every other user's nearby set.
    for (const users of this.nearbyUsers.values()) {
      users.delete(userId);
    }
  }
}
