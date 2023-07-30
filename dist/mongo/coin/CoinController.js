"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getExchanges = exports.getSymbols = exports.removeCoinHolding = exports.updateCoinHolding = exports.addCoinHolding = exports.removeCoin = exports.updateCoin = exports.addCoin = exports.getCoins = exports.getCoinListings = exports.getCoin = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const credentials_1 = require("../../config/credentials");
const CoinModel_1 = __importDefault(require("./CoinModel"));
const getCoin = (parent, { coinId }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield CoinModel_1.default.findOne({ coinId });
    }
    catch (error) {
        throw new Error(t('Coin_error_listCouldNotBeRetrieved'));
    }
});
exports.getCoin = getCoin;
const getCoinListings = (parent, { symbols, convert }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    if (!symbols)
        return [];
    try {
        const url = `${config_1.cmcUrl}/quotes/latest`;
        const response = yield axios_1.default.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': credentials_1.cmcApiKey,
            },
            params: {
                symbol: symbols,
                convert,
            },
        });
        // console.log('length', response.data.data.length);
        // console.log('response', response.data.data.ETH.name);
        // console.log('response', response.data.data.ETH.quote.EUR);
        return Object.values(response.data.data).map(({ name, id, symbol, quote: { [convert]: { price }, }, }) => ({ price, id, name, symbol }));
    }
    catch (error) {
        console.log('error', error);
    }
});
exports.getCoinListings = getCoinListings;
const getCoins = (parent, { creatorId }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return (yield creatorId) ? CoinModel_1.default.find({ creatorId }) : CoinModel_1.default.find({});
    }
    catch (error) {
        throw new Error(t('coin_error_listCouldNotBeRetrieved'));
    }
});
exports.getCoins = getCoins;
const addCoin = (parent, { symbol, slug, creatorId }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        let coinSymbol = symbol;
        if (slug) {
            const url = `${config_1.cmcUrl}/quotes/latest`;
            const response = yield axios_1.default
                .get(url, {
                headers: {
                    'X-CMC_PRO_API_KEY': credentials_1.cmcApiKey,
                },
                params: {
                    slug,
                },
            })
                .catch((error) => {
                console.log(error);
                throw new Error(t('Coin does not seem to exist'));
            });
            const [newCoin] = Object.values(response.data.data);
            coinSymbol = newCoin.symbol;
        }
        return yield CoinModel_1.default.create({
            // coinId: `${creatorId}-${symbol}`.toLowerCase(),
            symbol: coinSymbol,
            creatorId,
            holdings: [],
        });
    }
    catch (error) {
        console.log('error', error);
        throw new Error(t('coin_error_listCouldNotBeAdded'));
    }
});
exports.addCoin = addCoin;
const updateCoin = (parent, { coinId, holding }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield CoinModel_1.default.findOneAndUpdate({ coinId }, { $push: { holdings: [holding] } }, { new: true });
    }
    catch (error) {
        throw new apollo_server_express_1.ApolloError(t('coin_error_listCouldNotBeUpdated'));
    }
});
exports.updateCoin = updateCoin;
const removeCoin = (parent, args, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        const { id: _id, creatorId } = args;
        return creatorId
            ? yield CoinModel_1.default.deleteMany({ creatorId })
            : yield CoinModel_1.default.findOneAndDelete({ _id });
    }
    catch (error) {
        throw new Error(t('coin_error_listCouldNotBeRemoved'));
    }
});
exports.removeCoin = removeCoin;
const addCoinHolding = (parent, { id, holding }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    const { type, name } = holding;
    const holdingId = `${type}-${name.toLowerCase().split(' ').join('-')}`;
    try {
        return yield CoinModel_1.default.findOneAndUpdate({ _id: id, 'holdings.holdingId': { $ne: holdingId } }, { $push: { holdings: [Object.assign(Object.assign({}, holding), { holdingId })] } }, { new: true });
    }
    catch (error) {
        throw new Error(t('coin_error_listCouldNotBeUpdated'));
    }
});
exports.addCoinHolding = addCoinHolding;
const updateCoinHolding = (parent, { holdingId, holding }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield CoinModel_1.default.findOneAndUpdate({ 'holdings._id': holdingId }, {
            $set: {
                'holdings.$.amount': holding.amount,
                'holdings.$.name': holding.name,
            },
        }, { new: true });
    }
    catch (error) {
        console.log(error);
        throw new Error(t('coin_error_listCouldNotBeUpdated'));
    }
});
exports.updateCoinHolding = updateCoinHolding;
const removeCoinHolding = (parent, { holdingId }, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser.loggedIn)
        throw new apollo_server_express_1.AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        return yield CoinModel_1.default.findOneAndUpdate({ 'holdings._id': holdingId }, { $pull: { holdings: { _id: holdingId } } }, { new: true });
    }
    catch (error) {
        throw new Error(t('coin_error_listCouldNotBeUpdated'));
    }
});
exports.removeCoinHolding = removeCoinHolding;
const fetchHTML = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        console.log('data 1', data);
        return data;
    }
    catch (error) {
        console.error('fetchHTMLError ', error);
        throw new Error(`Something went wrong, ${url} could not be retrieved.`);
    }
});
const getSymbols = (parent, _, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!currentUser.loggedIn)
    // throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        /*     const html = await fetchHTML('http://www.coingecko.com/');
        const $ = cheerio.load(html);
    
        const results = $('body').find('body table > tbody > tr > td a');
    
        const symbols = results
          .map((_, el) => {
            const elementSelector = $(el);
    
            const name = elementSelector
              .find('span:first')
              .text()
              .replace(/\r?\n|\r/g, '');
            const id = elementSelector
              .find('span:last')
              .text()
              .replace(/\r?\n|\r/g, '');
    
            return { name, id };
          })
          .get();
    
        return symbols; */
        const url = `${config_1.cmcUrl}/listings/latest`;
        const response = yield axios_1.default.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': credentials_1.cmcApiKey,
            },
            params: {
                limit: 100,
            },
        });
        return response.data.data.map(({ name, symbol }) => ({ id: symbol, name }));
    }
    catch (error) {
        // console.error(error);
        throw new Error(t('coin_error_listCouldNotBeRetrieved'));
    }
});
exports.getSymbols = getSymbols;
const getExchanges = (parent, _, { currentUser, t }) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!currentUser.loggedIn)
    // throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
    try {
        const html = yield fetchHTML('https://www.cryptowisser.com/exchanges');
        const $ = cheerio.load(html);
        const results = $('body').find('body table > tbody > tr > th');
        const exchanges = results
            .map((_, el) => {
            const elementSelector = $(el);
            const image = elementSelector.find('img').attr('src');
            const name = elementSelector.find('a').text().replace(/\n/g, '');
            return { image, name, id: name.toLowerCase().replace(/\s/g, '-') };
        })
            .get();
        return exchanges;
    }
    catch (error) {
        console.error(error);
        throw new Error(t('coin_error_listCouldNotBeRetrieved'));
    }
});
exports.getExchanges = getExchanges;
exports.default = {
    getCoinListings: exports.getCoinListings,
    getCoin: exports.getCoin,
    getCoins: exports.getCoins,
    addCoin: exports.addCoin,
    updateCoin: exports.updateCoin,
    removeCoin: exports.removeCoin,
    addCoinHolding: exports.addCoinHolding,
    updateCoinHolding: exports.updateCoinHolding,
    removeCoinHolding: exports.removeCoinHolding,
    getSymbols: exports.getSymbols,
};
//# sourceMappingURL=CoinController.js.map