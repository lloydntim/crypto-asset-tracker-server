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
exports.getHoldingsData = exports.getCryptoData = exports.removeList = exports.updateList = exports.addList = exports.getLists = exports.getList = void 0;
const axios_1 = __importDefault(require("axios"));
// import dotEnv from 'dotenv';
const apollo_server_express_1 = require("apollo-server-express");
const ListModel_1 = __importDefault(require("./ListModel"));
const helpers_1 = require("../../helpers");
const credentials_1 = require("../../config/credentials");
const config_1 = require("../../config");
// dotEnv.config(({ debug: process.env.DEBUG }));
const getList = (parent, { id, name }, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return (yield id) ? ListModel_1.default.findById(id) : ListModel_1.default.findOne({ name });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('list_error_listCouldNotBeRetrieved'));
    }
});
exports.getList = getList;
const getLists = (parent, { creatorId }, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield ListModel_1.default.find({ creatorId });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('list_error_listCouldNotBeRetrieved'));
    }
});
exports.getLists = getLists;
const addList = (parent, { name, data, creatorId }, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield ListModel_1.default.create({ name, data, creatorId });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('list_error_listCouldNotBeAdded'));
    }
});
exports.addList = addList;
const updateList = (parent, { id, name, data }, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield ListModel_1.default.findByIdAndUpdate(id, {
            $set: {
                name: name || null,
                data: name || null,
            },
        }, { new: true });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('list_error_listCouldNotBeUpdated'));
    }
});
exports.updateList = updateList;
const removeList = (parent, args, { currentUser, t, Sentry }) => __awaiter(void 0, void 0, void 0, function* () {
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
    // if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        const { id: _id, creatorId } = args;
        return creatorId
            ? yield ListModel_1.default.deleteMany({ creatorId })
            : yield ListModel_1.default.findOneAndDelete({ _id });
    }
    catch (error) {
        // Sentry.captureException(error);
        throw new Error(t('list_error_listCouldNotBeRemoved'));
    }
});
exports.removeList = removeList;
const getCryptoData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idList, currency } = req.query;
        const response = yield axios_1.default.get(config_1.cmcUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': credentials_1.cmcApiKey,
            },
            params: {
                id: idList,
                convert: currency,
            },
        });
        const results = (0, helpers_1.processCoinsData)(response.data.data, currency);
        res.status(200).json({ results });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});
exports.getCryptoData = getCryptoData;
const getHoldingsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const holdingsData = (0, helpers_1.processHoldingsData)([]);
        res.status(200).json({ results: holdingsData });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});
exports.getHoldingsData = getHoldingsData;
exports.default = {
    getList: exports.getList,
    getLists: exports.getLists,
    addList: exports.addList,
    updateList: exports.updateList,
    removeList: exports.removeList,
};
//# sourceMappingURL=ListController.js.map