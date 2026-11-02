
import assert from "node:assert/strict";

import {
  detectProximityChanges
} from "./proximity.changes.js";

// Test 1: Normal entry and exit

const result = detectProximityChanges(
  ["bob", "charlie"],
  ["charlie", "david"]
);

assert.deepEqual(result, {
  entered: ["david"],
  exited: ["bob"],
  unchanged: ["charlie"]
});

console.log("Test 1 passed: Entry and exit detection");

// Test 2: First-time nearby users

const firstEntry = detectProximityChanges(
  [],
  ["alice", "bob"]
);

assert.deepEqual(firstEntry, {
  entered: ["alice", "bob"],
  exited: [],
  unchanged: []
});

console.log("Test 2 passed: Initial entry");

// Test 3: All users leave

const allExited = detectProximityChanges(
  ["alice", "bob"],
  []
);

assert.deepEqual(allExited, {
  entered: [],
  exited: ["alice", "bob"],
  unchanged: []
});

console.log("Test 3 passed: All users exited");

// Test 4: No changes

const noChanges = detectProximityChanges(
  ["alice", "bob"],
  ["alice", "bob"]
);

assert.deepEqual(noChanges, {
  entered: [],
  exited: [],
  unchanged: ["alice", "bob"]
});

console.log("Test 4 passed: No duplicate entry notifications");

console.log("\nALL PROXIMITY CHANGE TESTS PASSED!");
