"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.sendVerificationEmail = exports.PASSWORD_RESET_EMAIL = exports.VERIFICATION_EMAIL = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const credentials_1 = require("../../config/credentials");
const TokenModel_1 = __importDefault(require("./TokenModel"));
exports.VERIFICATION_EMAIL = 'email-verification@lloydntim.com';
exports.PASSWORD_RESET_EMAIL = 'password-reset@lloydntim.com';
const sendVerificationEmail = ({ email, username, id }, t, nodemailerMailgun) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = yield TokenModel_1.default.create({
            userId: id,
            token: crypto_1.default.randomBytes(20).toString('hex'),
        });
        yield nodemailerMailgun.sendMail({
            to: email,
            // from: 'email-verification@lloydntim.com',
            from: 'noreply@test.com',
            subject: t('auth_email_subject_emailVerification'),
            text: t('auth_email_content_emailVerificationMessage', {
                username,
                domain: config_1.clientUrl,
                token,
                interpolation: { escapeValue: false },
            }),
        });
    }
    catch (error) {
        // console.log('Error', error);
        // Sentry.captureException(error);
        throw new apollo_server_express_1.ApolloError(error);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const createToken = (user, expiresIn) => ({
    token: jsonwebtoken_1.default.sign(user, credentials_1.jwtSecret, { expiresIn }),
});
exports.createToken = createToken;
//# sourceMappingURL=AuthHelper.js.map