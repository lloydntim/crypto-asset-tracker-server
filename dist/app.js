"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_http_middleware_1 = require("i18next-http-middleware");
const config_1 = require("./config");
require("./i18n");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: config_1.clientUrl, credentials: true }));
app.use((0, i18next_http_middleware_1.handle)(i18next_1.default));
exports.default = app;
//# sourceMappingURL=app.js.map