"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConfig = exports.mongoURI = exports.cmcUrl = exports.clientUrl = exports.domain = exports.port = void 0;
require("dotenv/config");
const { NODE_ENV, DEV_HOST, SERVER_PROD_URL, CLIENT_PROD_URL, CLIENT_DEV_PORT, MONGODB_DEV_URI, MONGODB_URI, PORT, } = process.env;
const SERVER_DEV_URL = `http://${DEV_HOST}:${PORT}`;
const CLIENT_DEV_URL = `http://${DEV_HOST}:${CLIENT_DEV_PORT}`;
exports.port = PORT;
exports.domain = NODE_ENV === 'development' ? SERVER_DEV_URL : SERVER_PROD_URL;
exports.clientUrl = NODE_ENV === 'development' ? CLIENT_DEV_URL : CLIENT_PROD_URL;
exports.cmcUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
exports.mongoURI = NODE_ENV === 'development' ? MONGODB_DEV_URI : MONGODB_URI;
exports.mongoConfig = {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// useCreateIndex: true,
// useFindAndModify: false,
};
//# sourceMappingURL=index.js.map