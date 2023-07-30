"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        required: true,
        expires: 43200,
        default: Date.now,
    },
}, {
    collection: 'token',
    timestamps: true,
});
exports.default = TokenSchema;
//# sourceMappingURL=TokenSchema.js.map