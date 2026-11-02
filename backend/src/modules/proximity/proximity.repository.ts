
import mongoose, { Schema, model, models } from "mongoose";

import { AvatarPosition } from "../../types/proximity.types.js";
import {
  PROXIMITY_RADIUS,
  MAX_POSITION_AGE_MS
} from "./proximity.service.js";

// MongoDB avatar document structure
interface AvatarRecord {
  userId: string;
  officeId: string;
  position: [number, number];
  isOnline: boolean;
  updatedAt: number;
}

// Define the MongoDB schema
const avatarSchema = new Schema<AvatarRecord>({
  userId: {
    type: String,
    required: true
  },

  officeId: {
    type: String,
    required: true
  },

  position: {
    type: [Number],
    required: true
  },

  isOnline: {
    type: Boolean,
    default: true
  },

  updatedAt: {
    type: Number,
    required: true,
    default: Date.now
  }
});

// Create a 2D geospatial index
avatarSchema.index(
  { position: "2d" },
  {
    min: -100000,
    max: 100000
  }
);
// Reuse an existing model if one has already been registered
export const AvatarModel =
  (models.Avatar as mongoose.Model<AvatarRecord>) ||
  model<AvatarRecord>("Avatar", avatarSchema);

// Repository for fetching nearby avatars
export class ProximityRepository {
    
async updateAvatarPosition(
  avatar: AvatarPosition
): Promise<void> {
  await AvatarModel.updateOne(
    { userId: avatar.userId },
    {
      $set: {
        officeId: avatar.officeId,
        position: [avatar.x, avatar.y],
        isOnline: avatar.isOnline,
        updatedAt: avatar.updatedAt
      }
    },
    { upsert: true }
  );
}

  async findNearbyAvatars(
    currentUser: AvatarPosition
  ): Promise<AvatarPosition[]> {

    const minimumUpdatedAt =
      Date.now() - MAX_POSITION_AGE_MS;

    const records = await AvatarModel.find({
      userId: { $ne: currentUser.userId },
      officeId: currentUser.officeId,
      isOnline: true,
      updatedAt: { $gte: minimumUpdatedAt },

      position: {
        $near: [currentUser.x, currentUser.y],
        $maxDistance: PROXIMITY_RADIUS
      }
    } as any)
      .select("userId officeId position isOnline updatedAt")
      .lean()
      .exec();

    return records.map((avatar) => ({
      userId: avatar.userId,
      officeId: avatar.officeId,
      x: avatar.position[0],
      y: avatar.position[1],
      isOnline: avatar.isOnline,
      updatedAt: avatar.updatedAt
    }));
  }
}
