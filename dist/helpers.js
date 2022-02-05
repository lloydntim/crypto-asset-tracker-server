"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCoinsData = exports.processHoldingsData = exports.getTotal = void 0;
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
//# sourceMappingURL=helpers.js.map