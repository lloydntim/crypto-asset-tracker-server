"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    collection: 'user',
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
});
exports.default = UserSchema;
//# sourceMappingURL=UserSchema.js.map