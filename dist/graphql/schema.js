"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const AuthController_1 = require("../mongo/auth/AuthController");
const ListController_1 = require("../mongo/list/ListController");
const CoinController_1 = require("../mongo/coin/CoinController");
const UserController_1 = require("../mongo/user/UserController");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  scalar Date

  type User {
    id: ID
    username: String
    email: String
    password: String
    isVerified: String
    refreshToken: String
    accessToken: String
  }

  type Auth {
    user: User
    token: String
    info: String
    message: String
  }

  type Entry {
    slug: String
    name: String
    amount: String
  }

  enum HoldingType {
    WALLET
    STAKING
    EXCHANGE
  }

  type Holding {
    id: ID
    holdingId: ID
    slug: String
    name: String
    amount: Float
    type: String
    currency: String
    ownerId: ID
  }

  input HoldingInput {
    name: String
    amount: Float
    type: String
    currency: String
    ownerId: ID
  }

  type Coin {
    id: ID!
    coinId: ID
    name: String
    symbol: String
    holdings: [Holding!]!
    creatorId: ID
    createdAt: Date
    updatedAt: Date
  }

  type CoinListing {
    id: ID
    symbol: String
    name: String
    price: String
  }

  type List {
    coinId: ID
    symbol: String
    exchanges: [String]
    wallets: [String]
    staking: [String]
    creatorId: ID
    createdAt: Date
    updatedAt: Date
  }

  type Symbol {
    id: ID
    name: String
  }

  type Exchange {
    id: ID
    name: String
    image: String
  }

  type Query {
    getPasswordToken(resetPasswordToken: String): Auth

    getUsers: [User]
    getUser(id: ID, username: String, email: String): User

    getLists(creatorId: ID): [List]
    getList(id: ID, name: String): List

    getCoinListings(symbols: String, convert: String): [CoinListing]

    getCoins(creatorId: ID): [Coin]
    getCoin(coinId: ID!): Coin

    getSymbols: [Symbol]
    getExchanges: [Exchange]
  }

  type Mutation {
    register(username: String, email: String, password: String): Auth
    login(username: String, password: String): Auth
    verify(token: String): Auth
    resendVerificationToken(username: String, email: String): Auth
    createPasswordToken(username: String): Auth
    updatePassword(resetPasswordToken: String, password: String): Auth
    updateUser(id: ID, username: String, email: String): User
    removeUser(id: ID): User

    addList(name: String!, data: [[String]], creatorId: ID!): List
    updateList(
      id: ID!
      exchanges: [String]
      wallets: [String]
      staking: [String]
    ): List
    removeList(id: ID, creatorId: ID): List

    addCoin(symbol: String, slug: String, creatorId: ID!): Coin
    updateCoin(id: ID!, symbol: String, holdings: HoldingInput): Coin
    removeCoin(id: ID, creatorId: ID): Coin

    addCoinHolding(id: ID!, holding: HoldingInput): Coin
    updateCoinHolding(holdingId: ID!, holding: HoldingInput): Coin
    removeCoinHolding(holdingId: ID!): Coin
  }
`;
exports.resolvers = {
    HoldingType: {
        WALLET: 'wallet',
        STAKING: 'staking',
        EXCHANGE: 'exchange',
    },
    Query: {
        getPasswordToken: AuthController_1.getPasswordToken,
        getUser: UserController_1.getUser,
        getUsers: UserController_1.getUsers,
        getList: ListController_1.getList,
        getLists: ListController_1.getLists,
        getCoinListings: CoinController_1.getCoinListings,
        getCoin: CoinController_1.getCoin,
        getCoins: CoinController_1.getCoins,
        getSymbols: CoinController_1.getSymbols,
        getExchanges: CoinController_1.getExchanges,
    },
    Mutation: {
        login: AuthController_1.login,
        register: AuthController_1.register,
        verify: AuthController_1.verify,
        resendVerificationToken: AuthController_1.resendVerificationToken,
        createPasswordToken: AuthController_1.createPasswordToken,
        updatePassword: AuthController_1.updatePassword,
        updateUser: UserController_1.updateUser,
        removeUser: UserController_1.removeUser,
        addList: ListController_1.addList,
        updateList: ListController_1.updateList,
        removeList: ListController_1.removeList,
        addCoin: CoinController_1.addCoin,
        updateCoin: CoinController_1.updateCoin,
        removeCoin: CoinController_1.removeCoin,
        updateCoinHolding: CoinController_1.updateCoinHolding,
        removeCoinHolding: CoinController_1.removeCoinHolding,
        addCoinHolding: CoinController_1.addCoinHolding,
    },
};
//# sourceMappingURL=schema.js.map