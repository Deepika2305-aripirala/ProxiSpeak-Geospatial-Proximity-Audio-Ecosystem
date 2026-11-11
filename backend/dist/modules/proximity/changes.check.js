"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const proximity_changes_js_1 = require("./proximity.changes.js");
// Test 1: Normal entry and exit
const result = (0, proximity_changes_js_1.detectProximityChanges)(["bob", "charlie"], ["charlie", "david"]);
strict_1.default.deepEqual(result, {
    entered: ["david"],
    exited: ["bob"],
    unchanged: ["charlie"]
});
console.log("Test 1 passed: Entry and exit detection");
// Test 2: First-time nearby users
const firstEntry = (0, proximity_changes_js_1.detectProximityChanges)([], ["alice", "bob"]);
strict_1.default.deepEqual(firstEntry, {
    entered: ["alice", "bob"],
    exited: [],
    unchanged: []
});
console.log("Test 2 passed: Initial entry");
// Test 3: All users leave
const allExited = (0, proximity_changes_js_1.detectProximityChanges)(["alice", "bob"], []);
strict_1.default.deepEqual(allExited, {
    entered: [],
    exited: ["alice", "bob"],
    unchanged: []
});
console.log("Test 3 passed: All users exited");
// Test 4: No changes
const noChanges = (0, proximity_changes_js_1.detectProximityChanges)(["alice", "bob"], ["alice", "bob"]);
strict_1.default.deepEqual(noChanges, {
    entered: [],
    exited: [],
    unchanged: ["alice", "bob"]
});
console.log("Test 4 passed: No duplicate entry notifications");
console.log("\nALL PROXIMITY CHANGE TESTS PASSED!");
