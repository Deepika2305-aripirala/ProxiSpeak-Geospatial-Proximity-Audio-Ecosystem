"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_POSITION_AGE_MS = exports.PROXIMITY_RADIUS = void 0;
exports.calculateDistance = calculateDistance;
exports.isWithinRange = isWithinRange;
exports.findNearbyAvatars = findNearbyAvatars;
exports.PROXIMITY_RADIUS = 100;
exports.MAX_POSITION_AGE_MS = 15_000;
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function isWithinRange(distance) {
    return distance <= exports.PROXIMITY_RADIUS;
}
function findNearbyAvatars(currentUser, avatars) {
    return avatars
        .filter((avatar) => {
        // Exclude the current user
        if (avatar.userId === currentUser.userId) {
            return false;
        }
        // Exclude users in different offices
        if (avatar.officeId !== currentUser.officeId) {
            return false;
        }
        // Exclude offline users
        if (!avatar.isOnline) {
            return false;
        }
        // Exclude stale position records
        const positionAge = Date.now() - avatar.updatedAt;
        if (positionAge < 0 ||
            positionAge > exports.MAX_POSITION_AGE_MS) {
            return false;
        }
        return true;
    })
        .map((avatar) => ({
        userId: avatar.userId,
        distance: calculateDistance(currentUser.x, currentUser.y, avatar.x, avatar.y)
    }))
        .filter((peer) => isWithinRange(peer.distance));
}
