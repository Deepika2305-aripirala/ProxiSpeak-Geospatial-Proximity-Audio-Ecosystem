"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximityRepository = exports.AvatarModel = void 0;
const mongoose_1 = require("mongoose");
const proximity_service_js_1 = require("./proximity.service.js");
// Define the MongoDB schema
const avatarSchema = new mongoose_1.Schema({
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
avatarSchema.index({ position: "2d" }, {
    min: -100000,
    max: 100000
});
// Reuse an existing model if one has already been registered
exports.AvatarModel = mongoose_1.models.Avatar ||
    (0, mongoose_1.model)("Avatar", avatarSchema);
// Repository for fetching nearby avatars
class ProximityRepository {
    async updateAvatarPosition(avatar) {
        await exports.AvatarModel.updateOne({ userId: avatar.userId }, {
            $set: {
                officeId: avatar.officeId,
                position: [avatar.x, avatar.y],
                isOnline: avatar.isOnline,
                updatedAt: avatar.updatedAt
            }
        }, { upsert: true });
    }
    async findNearbyAvatars(currentUser) {
        const minimumUpdatedAt = Date.now() - proximity_service_js_1.MAX_POSITION_AGE_MS;
        const records = await exports.AvatarModel.find({
            userId: { $ne: currentUser.userId },
            officeId: currentUser.officeId,
            isOnline: true,
            updatedAt: { $gte: minimumUpdatedAt },
            position: {
                $near: [currentUser.x, currentUser.y],
                $maxDistance: proximity_service_js_1.PROXIMITY_RADIUS
            }
        })
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
exports.ProximityRepository = ProximityRepository;
