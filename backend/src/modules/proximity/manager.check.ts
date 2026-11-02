
import assert from "node:assert/strict";
import { ProximityManager } from "./proximity.manager.js";

const manager = new ProximityManager();

// First update
const first = manager.updateNearbyUsers(
  "alice",
  ["bob"]
);

assert.deepEqual(first.entered, ["bob"]);
assert.deepEqual(first.exited, []);
assert.deepEqual(first.unchanged, []);

console.log("Test 1 passed: Bob entered");

// Second update
const second = manager.updateNearbyUsers(
  "alice",
  ["bob", "charlie"]
);

assert.deepEqual(second.entered, ["charlie"]);
assert.deepEqual(second.exited, []);
assert.deepEqual(second.unchanged, ["bob"]);

console.log("Test 2 passed: Charlie entered, Bob unchanged");

// Third update
const third = manager.updateNearbyUsers(
  "alice",
  ["charlie"]
);

assert.deepEqual(third.entered, []);
assert.deepEqual(third.exited, ["bob"]);
assert.deepEqual(third.unchanged, ["charlie"]);

console.log("Test 3 passed: Bob exited");

// Verify current state
assert.deepEqual(
  manager.getNearbyUsers("alice"),
  ["charlie"]
);

console.log("Test 4 passed: Nearby state maintained");

// Remove Alice
manager.removeUser("alice");

assert.deepEqual(manager.getNearbyUsers("alice"), []);

console.log("Test 5 passed: User cleanup");

console.log("\nALL MANAGER TESTS PASSED!");
