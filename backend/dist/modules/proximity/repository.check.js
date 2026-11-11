"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const proximity_repository_js_1 = require("./proximity.repository.js");
async function testRepository() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI ??
            "mongodb://127.0.0.1:27017/proxispeak");
        console.log("MongoDB connected!");
        // Clear only our test records
        await proximity_repository_js_1.AvatarModel.deleteMany({
            userId: { $in: ["alice-test", "bob-test", "charlie-test", "david-test"] }
        });
        const now = Date.now();
        // Insert sample avatars
        await proximity_repository_js_1.AvatarModel.insertMany([
            {
                userId: "alice-test",
                officeId: "office-test",
                position: [200, 250],
                isOnline: true,
                updatedAt: now
            },
            {
                userId: "bob-test",
                officeId: "office-test",
                position: [250, 280],
                isOnline: true,
                updatedAt: now
            },
            {
                userId: "charlie-test",
                officeId: "office-test",
                position: [280, 300],
                isOnline: true,
                updatedAt: now
            },
            {
                userId: "david-test",
                officeId: "office-test",
                position: [400, 400],
                isOnline: true,
                updatedAt: now
            }
        ]);
        const currentUser = {
            userId: "alice-test",
            officeId: "office-test",
            x: 200,
            y: 250,
            isOnline: true,
            updatedAt: now
        };
        const repository = new proximity_repository_js_1.ProximityRepository();
        const nearbyUsers = await repository.findNearbyAvatars(currentUser);
        console.log("\nNearby avatars:");
        console.log(nearbyUsers);
        console.log("\nRepository test completed!");
    }
    catch (error) {
        console.error("Repository test failed:", error);
    }
    finally {
        await proximity_repository_js_1.AvatarModel.deleteMany({
            userId: { $in: ["alice-test", "bob-test", "charlie-test", "david-test"] }
        });
        await mongoose_1.default.disconnect();
    }
}
testRepository();
