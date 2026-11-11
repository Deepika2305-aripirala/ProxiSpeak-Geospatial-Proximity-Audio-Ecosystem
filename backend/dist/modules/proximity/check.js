"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const proximity_service_js_1 = require("./proximity.service.js");
// --------------------------------------------------
// TEST 1: Distance calculation
// --------------------------------------------------
console.log("\nTEST 1: Distance Calculation");
const distance = (0, proximity_service_js_1.calculateDistance)(200, 250, 260, 280);
console.log("Calculated distance:", distance);
strict_1.default.ok(Math.abs(distance - 67.082) < 0.001);
console.log("Distance calculation passed!");
// --------------------------------------------------
// TEST 2: Proximity boundary checking
// --------------------------------------------------
console.log("\nTEST 2: Proximity Boundary");
strict_1.default.equal((0, proximity_service_js_1.isWithinRange)(99), true);
strict_1.default.equal((0, proximity_service_js_1.isWithinRange)(100), true);
strict_1.default.equal((0, proximity_service_js_1.isWithinRange)(101), false);
console.log("99 px: Within range");
console.log("100 px: Within range");
console.log("101 px: Outside range");
console.log("Boundary tests passed!");
// --------------------------------------------------
// TEST 3: Nearby avatar detection
// --------------------------------------------------
console.log("\nTEST 3: Nearby Avatar Detection");
const now = Date.now();
const alice = {
    userId: "alice",
    officeId: "office-1",
    x: 200,
    y: 250,
    isOnline: true,
    updatedAt: now
};
const avatars = [
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
const nearbyUsers = (0, proximity_service_js_1.findNearbyAvatars)(alice, avatars);
console.log("Nearby users:", nearbyUsers);
// Only Bob and Charlie should be returned.
strict_1.default.deepEqual(nearbyUsers.map((peer) => peer.userId).sort(), ["bob", "charlie"]);
console.log("Nearby avatar detection passed!");
// --------------------------------------------------
// TEST 4: Verify stale-position timeout
// --------------------------------------------------
console.log("\nTEST 4: Stale Position Filtering");
console.log("Proximity radius:", proximity_service_js_1.PROXIMITY_RADIUS, "pixels");
console.log("Maximum position age:", proximity_service_js_1.MAX_POSITION_AGE_MS, "ms");
strict_1.default.equal(proximity_service_js_1.MAX_POSITION_AGE_MS, 15000);
console.log("Stale-position configuration verified!");
// --------------------------------------------------
// FINAL RESULT
// --------------------------------------------------
console.log("\n=================================");
console.log("ALL PROXIMITY TESTS PASSED!");
console.log("=================================");
