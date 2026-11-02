
import assert from "node:assert/strict";

import {
  calculateDistance,
  isWithinRange,
  findNearbyAvatars,
  PROXIMITY_RADIUS,
  MAX_POSITION_AGE_MS
} from "./proximity.service.js";

import { AvatarPosition } from "../../types/proximity.types.js";

// --------------------------------------------------
// TEST 1: Distance calculation
// --------------------------------------------------

console.log("\nTEST 1: Distance Calculation");

const distance = calculateDistance(200, 250, 260, 280);

console.log("Calculated distance:", distance);

assert.ok(Math.abs(distance - 67.082) < 0.001);

console.log("Distance calculation passed!");

// --------------------------------------------------
// TEST 2: Proximity boundary checking
// --------------------------------------------------

console.log("\nTEST 2: Proximity Boundary");

assert.equal(isWithinRange(99), true);
assert.equal(isWithinRange(100), true);
assert.equal(isWithinRange(101), false);

console.log("99 px: Within range");
console.log("100 px: Within range");
console.log("101 px: Outside range");
console.log("Boundary tests passed!");

// --------------------------------------------------
// TEST 3: Nearby avatar detection
// --------------------------------------------------

console.log("\nTEST 3: Nearby Avatar Detection");

const now = Date.now();

const alice: AvatarPosition = {
  userId: "alice",
  officeId: "office-1",
  x: 200,
  y: 250,
  isOnline: true,
  updatedAt: now
};

const avatars: AvatarPosition[] = [
  alice,

  // Nearby user
  {
    userId: "bob",
    officeId: "office-1",
    x: 250,
    y: 270,
    isOnline: true,
    updatedAt: now
  },

  // Nearby user
  {
    userId: "charlie",
    officeId: "office-1",
    x: 280,
    y: 300,
    isOnline: true,
    updatedAt: now
  },

  // Too far away
  {
    userId: "david",
    officeId: "office-1",
    x: 350,
    y: 350,
    isOnline: true,
    updatedAt: now
  },

  // Different office
  {
    userId: "eve",
    officeId: "office-2",
    x: 210,
    y: 250,
    isOnline: true,
    updatedAt: now
  },

  // Offline user
  {
    userId: "frank",
    officeId: "office-1",
    x: 210,
    y: 260,
    isOnline: false,
    updatedAt: now
  },

  // Stale position (30 seconds old)
  {
    userId: "grace",
    officeId: "office-1",
    x: 210,
    y: 260,
    isOnline: true,
    updatedAt: now - 30000
  }
];

const nearbyUsers = findNearbyAvatars(alice, avatars);

console.log("Nearby users:", nearbyUsers);

// Only Bob and Charlie should be returned.
assert.deepEqual(
  nearbyUsers.map((peer) => peer.userId).sort(),
  ["bob", "charlie"]
);

console.log("Nearby avatar detection passed!");

// --------------------------------------------------
// TEST 4: Verify stale-position timeout
// --------------------------------------------------

console.log("\nTEST 4: Stale Position Filtering");

console.log("Proximity radius:", PROXIMITY_RADIUS, "pixels");
console.log("Maximum position age:", MAX_POSITION_AGE_MS, "ms");

assert.equal(MAX_POSITION_AGE_MS, 15000);

console.log("Stale-position configuration verified!");

// --------------------------------------------------
// FINAL RESULT
// --------------------------------------------------

console.log("\n=================================");
console.log("ALL PROXIMITY TESTS PASSED!");
console.log("=================================");
