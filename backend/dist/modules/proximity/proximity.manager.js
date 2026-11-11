"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximityManager = void 0;
const proximity_changes_js_1 = require("./proximity.changes.js");
class ProximityManager {
    nearbyUsers = new Map();
    updateNearbyUsers(userId, currentUsers) {
        const previousUsers = Array.from(this.nearbyUsers.get(userId) ?? []);
        const changes = (0, proximity_changes_js_1.detectProximityChanges)(previousUsers, currentUsers);
        this.nearbyUsers.set(userId, new Set(currentUsers));
        return changes;
    }
    getNearbyUsers(userId) {
        return Array.from(this.nearbyUsers.get(userId) ?? []);
    }
    removeUser(userId) {
        this.nearbyUsers.delete(userId);
        // Remove this user from every other user's nearby set.
        for (const users of this.nearbyUsers.values()) {
            users.delete(userId);
        }
    }
}
exports.ProximityManager = ProximityManager;
