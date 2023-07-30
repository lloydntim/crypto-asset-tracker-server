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
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const i18next_1 = __importDefault(require("i18next"));
const apollo_server_core_1 = require("apollo-server-core");
const http_1 = require("http");
const config_1 = require("./config");
const schema_1 = require("./graphql/schema");
const middleware_1 = require("./middleware");
// import { createCookies } from './helpers';
const app_1 = __importDefault(require("./app"));
function listen(port) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpServer = (0, http_1.createServer)(app_1.default);
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: schema_1.resolvers,
            plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
            context: ({ req: { headers: { authorization, } /*, custom: cookiesFallback },  cookies: { i18next } */, }, res, }) => {
                const token = authorization ? authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1] : '';
                const currentUser = (0, middleware_1.getCurrentUser)(token);
                const { t } = i18next_1.default;
                // const cookies = createCookies(String(cookiesFallback));
                // const currentLanguage = /* i18next || */ cookies.i18next;
                // console.log('i18n', i18n.t);
                // i18next.changeLanguage(cookies?.i18next);
                return { currentUser, t };
                // return { t, currentUser, Sentry };
            },
            formatError: (error) => {
                console.log('Internal Error', error);
                // Sentry.captureException(error);
                throw new Error(error.message);
            },
        });
        yield server.start();
        server.applyMiddleware({ app: app_1.default, path: '/graphql', cors: false });
        return new Promise((resolve, reject) => {
            httpServer.listen(port).once('listening', resolve).once('error', reject);
        });
    });
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield listen(config_1.port);
        console.log(`🚀 Server is ready at ${config_1.domain}`);
        mongoose_1.default.connect(config_1.mongoURI, config_1.mongoConfig);
    }
    catch (err) {
        console.error('💀 Error starting the node server', err);
    }
});
main();
//# sourceMappingURL=server.js.map