"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TokenSchema_1 = __importDefault(require("./TokenSchema"));
exports.default = mongoose_1.default.model('Token', TokenSchema_1.default);
//# sourceMappingURL=TokenModel.js.map