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
exports.removeUser = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const UserModel_1 = __importDefault(require("./UserModel"));
const getUser = (parent, { id, username }, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return id
            ? yield UserModel_1.default.findById(id).select({ password: 0, __v: 0 })
            : yield UserModel_1.default.findOne({ username }).select({ password: 0, __v: 0 });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new apollo_server_express_1.AuthenticationError(t('user_error_listCouldNotBeRetrieved', { id }));
    }
});
exports.getUser = getUser;
const getUsers = (parent, args, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield UserModel_1.default.find({}).select({ password: 0, __v: 0 });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('user_error_usersCouldNotBeRetrieved'));
    }
});
exports.getUsers = getUsers;
const updateUser = (parent, { id, email }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield UserModel_1.default.findByIdAndUpdate(id, { $set: { email } }, { new: true }).select({ password: 0, __v: 0 });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('user_error_userCouldNotBeUpdated'));
    }
});
exports.updateUser = updateUser;
const removeUser = (parent, args, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        // Returns removed user
        return UserModel_1.default.findOneAndRemove({ _id: args.id });
    }
    catch (error) {
        console.log('removeUser error', error);
        // Sentry.captureException(error);
        throw new Error(t('user_error_userCouldNotBeRemoved'));
    }
});
exports.removeUser = removeUser;
exports.default = {
    getUser: exports.getUser,
    getUsers: exports.getUsers,
    updateUser: exports.updateUser,
    removeUser: exports.removeUser,
};
//# sourceMappingURL=UserController.js.map