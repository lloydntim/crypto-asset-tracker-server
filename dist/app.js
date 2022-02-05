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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const data_1 = require("./data");
const helpers_1 = require("./helpers");
const app = (0, express_1.default)();
const apiVersion = '1';
const routes = express_1.default.Router();
const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3002';
const cmcApiKey = process.env.CMC_PRO_API_KEY;
const cmcUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const getCryptoData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idList, currency } = req.params;
        const response = yield axios_1.default.get(cmcUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': cmcApiKey,
            },
            params: {
                id: idList,
                convert: currency,
            },
        });
        const results = (0, helpers_1.processCoinsData)(response.data.data, currency);
        console.log('results', results);
        // res.send('Done – check console log');
        res.status(200).json({ results });
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});
const getHoldingsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('holdings:', data_1.holdingsItems);
        const holdingsData = (0, helpers_1.processHoldingsData)(data_1.holdingsItems);
        console.log('holdingsData', holdingsData);
        res.status(200).json({ results: holdingsData });
    }
    catch (ex) {
        res.status(500).send('Something went wrong');
    }
});
// Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', clientUrl);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
app.use(`/api/v${apiVersion}/`, routes);
app.get('/', (req, res) => {
    res.send('Hello World');
});
routes.get('/test', (req, res) => {
    res.send('Some data');
});
routes.get('/holdings', getHoldingsData);
routes.get('/coins/:currency/:idList', getCryptoData);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map