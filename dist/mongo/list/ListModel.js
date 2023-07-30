"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ListSchema_1 = __importDefault(require("./ListSchema"));
exports.default = mongoose_1.default.model('List', ListSchema_1.default);
//# sourceMappingURL=ListModel.js.map