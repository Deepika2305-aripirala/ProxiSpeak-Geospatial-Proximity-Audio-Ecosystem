
import mongoose from "mongoose";
import { AvatarModel, ProximityRepository } from "./proximity.repository.js";

async function testRepository() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ??
      "mongodb://127.0.0.1:27017/proxispeak"
    );

    console.log("MongoDB connected!");

    // Clear only our test records
    await AvatarModel.deleteMany({
      userId: { $in: ["alice-test", "bob-test", "charlie-test", "david-test"] }
    });

    const now = Date.now();

    // Insert sample avatars
    await AvatarModel.insertMany([
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

    const repository = new ProximityRepository();

    const nearbyUsers =
      await repository.findNearbyAvatars(currentUser);

    console.log("\nNearby avatars:");
    console.log(nearbyUsers);

    console.log("\nRepository test completed!");

  } catch (error) {
    console.error("Repository test failed:", error);
  } finally {
    await AvatarModel.deleteMany({
      userId: { $in: ["alice-test", "bob-test", "charlie-test", "david-test"] }
    });

    await mongoose.disconnect();
  }
}

testRepository();
