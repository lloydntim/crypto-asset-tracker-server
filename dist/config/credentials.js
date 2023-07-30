"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmcApiKey = exports.jwtSecret = exports.mailhogConfig = exports.nodemailerAuthConfig = void 0;
require("dotenv/config");
const { NODEMAILER_DOMAIN, NODEMAILER_API_KEY, JWT_SECRET, CMC_PRO_API_KEY } = process.env;
exports.nodemailerAuthConfig = {
    auth: {
        api_key: NODEMAILER_API_KEY,
        domain: NODEMAILER_DOMAIN,
    },
};
exports.mailhogConfig = {
    host: '0.0.0.0',
    port: '1025',
    auth: {
        user: 'admin',
        pass: 'admin',
    },
};
exports.jwtSecret = JWT_SECRET;
exports.cmcApiKey = CMC_PRO_API_KEY;
//# sourceMappingURL=credentials.js.map