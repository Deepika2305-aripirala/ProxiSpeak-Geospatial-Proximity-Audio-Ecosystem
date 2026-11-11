"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectProximityChanges = detectProximityChanges;
function detectProximityChanges(previousUsers, currentUsers) {
    const previousSet = new Set(previousUsers);
    const currentSet = new Set(currentUsers);
    const entered = currentUsers.filter(userId => !previousSet.has(userId));
    const exited = previousUsers.filter(userId => !currentSet.has(userId));
    const unchanged = currentUsers.filter(userId => previousSet.has(userId));
    return {
        entered,
        exited,
        unchanged
    };
}
