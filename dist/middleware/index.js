"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCurrentUser = token => {
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return Object.assign(Object.assign({}, user), { loggedIn: true });
    }
    catch (error) {
        return {
            error,
            errorMessage: 'Failed to Authenticate',
            loggedIn: false,
        };
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=index.js.map