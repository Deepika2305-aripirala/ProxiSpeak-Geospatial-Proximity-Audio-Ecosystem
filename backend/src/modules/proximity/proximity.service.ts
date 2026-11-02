
import {
  AvatarPosition,
  NearbyPeer
} from "../../types/proximity.types.js";

export const PROXIMITY_RADIUS = 100;
export const MAX_POSITION_AGE_MS = 15_000;
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

export function isWithinRange(distance: number): boolean {
  return distance <= PROXIMITY_RADIUS;
}

export function findNearbyAvatars(
  currentUser: AvatarPosition,
  avatars: AvatarPosition[]
): NearbyPeer[] {

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

  if (
    positionAge < 0 ||
    positionAge > MAX_POSITION_AGE_MS
  ) {
    return false;
  }

  return true;
})
    .map((avatar) => ({
      userId: avatar.userId,
      distance: calculateDistance(
        currentUser.x,
        currentUser.y,
        avatar.x,
        avatar.y
      )
    }))
    .filter((peer) => isWithinRange(peer.distance));
}
