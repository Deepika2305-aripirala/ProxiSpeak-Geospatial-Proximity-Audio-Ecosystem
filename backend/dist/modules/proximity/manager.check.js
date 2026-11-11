"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const proximity_manager_js_1 = require("./proximity.manager.js");
const manager = new proximity_manager_js_1.ProximityManager();
// First update
const first = manager.updateNearbyUsers("alice", ["bob"]);
strict_1.default.deepEqual(first.entered, ["bob"]);
strict_1.default.deepEqual(first.exited, []);
strict_1.default.deepEqual(first.unchanged, []);
console.log("Test 1 passed: Bob entered");
// Second update
const second = manager.updateNearbyUsers("alice", ["bob", "charlie"]);
strict_1.default.deepEqual(second.entered, ["charlie"]);
strict_1.default.deepEqual(second.exited, []);
strict_1.default.deepEqual(second.unchanged, ["bob"]);
console.log("Test 2 passed: Charlie entered, Bob unchanged");
// Third update
const third = manager.updateNearbyUsers("alice", ["charlie"]);
strict_1.default.deepEqual(third.entered, []);
strict_1.default.deepEqual(third.exited, ["bob"]);
strict_1.default.deepEqual(third.unchanged, ["charlie"]);
console.log("Test 3 passed: Bob exited");
// Verify current state
strict_1.default.deepEqual(manager.getNearbyUsers("alice"), ["charlie"]);
console.log("Test 4 passed: Nearby state maintained");
// Remove Alice
manager.removeUser("alice");
strict_1.default.deepEqual(manager.getNearbyUsers("alice"), []);
console.log("Test 5 passed: User cleanup");
console.log("\nALL MANAGER TESTS PASSED!");
