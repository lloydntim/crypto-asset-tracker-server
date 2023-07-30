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
exports.updatePassword = exports.getPasswordToken = exports.createPasswordToken = exports.resendVerificationToken = exports.verify = exports.login = exports.register = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_mailgun_transport_1 = __importDefault(require("nodemailer-mailgun-transport"));
const config_1 = require("../../config");
const credentials_1 = require("../../config/credentials");
const AuthHelper_1 = require("./AuthHelper");
const UserModel_1 = __importDefault(require("../user/UserModel"));
const TokenModel_1 = __importDefault(require("./TokenModel"));
require("dotenv/config");
const { NODE_ENV } = process.env;
// const nodemailerMailgun = nodemailer.createTransport(mg(nodemailerAuthConfig));
const transportConfig = NODE_ENV === 'development' ? credentials_1.mailhogConfig : (0, nodemailer_mailgun_transport_1.default)(credentials_1.nodemailerAuthConfig);
const nodemailerMailgun = nodemailer_1.default.createTransport(transportConfig);
const register = (parent, { username, email, password }, { t /*,  Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username }));
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const user = yield UserModel_1.default.create({ username, email, password: hash });
        const vToken = yield TokenModel_1.default.create({
            userId: user.id,
            token: crypto_1.default.randomBytes(20).toString('hex'),
        });
        if (!vToken)
            throw new apollo_server_express_1.AuthenticationError(t('token_error_tokenCouldNotBeCreated'));
        (0, AuthHelper_1.sendVerificationEmail)(user, t, nodemailerMailgun);
        return (0, AuthHelper_1.createToken)({ id: user.id, username }, 60 * 60);
    }
    catch (error) {
        console.log('error', error);
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(t('token_error_tokenCouldNotBeCreated'));
    }
});
exports.register = register;
const login = (parent, { username, password }, { t /* , Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username }));
    try {
        const user = yield UserModel_1.default.findOne({ username });
        if (!user)
            throw new apollo_server_express_1.AuthenticationError(t('user_error_userCouldNotBeFound', { username }));
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_incorrectPassword'));
        return (0, AuthHelper_1.createToken)({ id: user.id, username }, '7d');
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(error.message);
    }
});
exports.login = login;
const verify = (parent, { token }, { t /* , Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationToken = yield TokenModel_1.default.findOne({ token });
        if (!verificationToken)
            throw new apollo_server_express_1.AuthenticationError(t('token_error_tokenNotValid'));
        const user = yield UserModel_1.default.findOne({ _id: verificationToken.userId });
        if (!user)
            throw new apollo_server_express_1.AuthenticationError(t('user_error_userWithIdCouldNotBeFound', {
                userId: verificationToken.userId,
            }));
        // Sentry.configureScope((scope) => scope.setUser({ username: user.username }));
        if (user.isVerified)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_userAlreadyVerified', { username: user.username }));
        user.isVerified = true;
        const updatedUser = yield user.save();
        if (!updatedUser)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_userEmailCouldNotBeVerified'));
        return (0, AuthHelper_1.createToken)({ id: user.id, username: user.username }, 60 * 60);
    }
    catch (error) {
        console.log(error);
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(error.message);
    }
});
exports.verify = verify;
const resendVerificationToken = (parent, { email, username }, { t /*  Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findOne({ email, username });
        if (!user)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_userHasNoSuchEmail', { username }));
        // Sentry.configureScope((scope) => scope.setUser({ username, email }));
        if (user.isVerified)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_userAlreadyVerified', { username }));
        (0, AuthHelper_1.sendVerificationEmail)(user, t, nodemailerMailgun);
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(error.message);
    }
    return {
        message: t('auth_success_verificationEmailSent'),
    };
});
exports.resendVerificationToken = resendVerificationToken;
const createPasswordToken = (parent, { username }, { t /* , Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString('hex');
        console.log('createPasswordToken - resetPasswordToken', resetPasswordToken);
        console.log('createPasswordToken - username', username);
        const currentUser = yield UserModel_1.default.findOneAndUpdate({ username }, { resetPasswordToken, resetPasswordExpires: Date.now() + 3600000 }, { new: true });
        if (!currentUser)
            throw new apollo_server_express_1.ApolloError(t('user_error_userCouldNotBeFound', { username }));
        // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username, email: currentUser.email }));
        yield nodemailerMailgun.sendMail({
            to: currentUser.email,
            from: 'password-reset@lloydntim.com',
            subject: t('auth_email_subject_passwordReset'),
            text: t('auth_email_content_passwordResetMessage', {
                username: currentUser.username,
                resetPasswordToken,
                domain: config_1.clientUrl,
                interpolation: { escapeValue: false },
            }),
        });
        return { message: t('auth_success_passwordEmailSent') };
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(error.message);
    }
});
exports.createPasswordToken = createPasswordToken;
const getPasswordToken = (parent, args, { t /* , Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetPasswordToken } = args;
    console.log('getPasswordToken - resetPasswordToken', resetPasswordToken);
    const currentUser = yield UserModel_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
    try {
        // if (!currentUser)
        //   throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));
        const { id, username, email } = currentUser;
        // Sentry.configureScope((scope) => scope.setUser({ username, email }));
        return (0, AuthHelper_1.createToken)({ id, username, email }, 60 * 10);
    }
    catch (error) {
        console.log('Error', error);
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_passwordTokenInvalid'));
    }
});
exports.getPasswordToken = getPasswordToken;
const updatePassword = (parents, { password, resetPasswordToken }, { t /* , Sentry */ }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const currentUser = yield UserModel_1.default.findOneAndUpdate({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        }, {
            password: hash,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
        if (!currentUser)
            throw new apollo_server_express_1.AuthenticationError(t('auth_error_passwordTokenInvalid'));
        const { id, username, email } = currentUser;
        // Sentry.configureScope((scope) => scope.setUser({ username, email }));
        nodemailerMailgun.sendMail({
            to: email,
            from: 'password-reset@lloydntim.com',
            subject: t('auth_email_subject_passwordChanged'),
            text: t('auth_email_content_passwordChangeMessage', { email, username }),
        });
        return (0, AuthHelper_1.createToken)({ id, username, email }, 60 * 10);
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(error.message);
    }
});
exports.updatePassword = updatePassword;
exports.default = {
    login: exports.login,
    register: exports.register,
    verify: exports.verify,
    resendVerificationToken: exports.resendVerificationToken,
    createPasswordToken: exports.createPasswordToken,
    getPasswordToken: exports.getPasswordToken,
    updatePassword: exports.updatePassword,
};
//# sourceMappingURL=AuthController.js.map