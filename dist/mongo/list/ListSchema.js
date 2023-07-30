"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EntrySchema = new mongoose_1.Schema({
    slug: String,
    name: String,
    amount: Number,
});
const ListSchema = new mongoose_1.Schema({
    coinId: Number,
    symbol: String,
    exchanges: [EntrySchema],
    wallets: [EntrySchema],
    staking: [EntrySchema],
    creatorId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
}, {
    collection: 'list',
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
});
exports.default = ListSchema;
//# sourceMappingURL=ListSchema.js.map