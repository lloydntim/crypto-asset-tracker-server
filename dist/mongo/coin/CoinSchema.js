"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HoldingSchema = new mongoose_1.Schema({
    slug: String,
    name: String,
    amount: Number,
    type: String,
    holdingId: String,
    currency: String,
    ownerId: String,
});
const CoinSchema = new mongoose_1.Schema({
    symbol: { type: String, required: true },
    holdings: [HoldingSchema],
    creatorId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
}, {
    collection: 'coin',
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
});
CoinSchema.index({ symbol: 1, creatorId: 1 }, { unique: true });
exports.default = CoinSchema;
//# sourceMappingURL=CoinSchema.js.map