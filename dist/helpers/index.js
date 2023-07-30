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
exports.fetchHTML = exports.createCookies = exports.processCoinsData = exports.processHoldingsData = exports.getTotal = void 0;
const axios_1 = __importDefault(require("axios"));
const getTotal = (arr, price) => arr.reduce((a, b) => (a + b.amount) * price, 0);
exports.getTotal = getTotal;
const processHoldingsData = (data) => data.reduce((
/* eslint-disable @typescript-eslint/no-explicit-any */
holdingsDataObject, { coinId, exchanges, wallets, staking }) => (Object.assign({ [coinId]: { exchanges, wallets, staking } }, holdingsDataObject)), {});
exports.processHoldingsData = processHoldingsData;
const processCoinsData = (data, currency) => Object.values(data).map(({ id, symbol, quote: { [currency]: { price }, }, }) => ({
    id,
    symbol,
    price,
}));
exports.processCoinsData = processCoinsData;
const createCookies = (cookiesFallback) => cookiesFallback.split(';').reduce((object, cookieData) => {
    const [key, value] = cookieData.split('=');
    const formattedKey = key
        .trim()
        .replace(/-[a-z0-9]/g, (v) => String.prototype.toUpperCase.apply(v.substring(1)));
    return Object.assign(Object.assign({}, object), { [formattedKey]: value });
}, {});
exports.createCookies = createCookies;
const fetchHTML = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url);
        return data;
    }
    catch (error) {
        console.error(`Something went wrong, ${url} could not be retrieved.`);
        // throw new Error(`Something went wrong, ${url} could not be retreived.`);
    }
});
exports.fetchHTML = fetchHTML;
//# sourceMappingURL=index.js.map