import {
  register,
  login,
  verify,
  resendVerificationToken,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
} from '../mongo/auth/AuthController';

import {
  getCoinListings,
  getCoin,
  getCoins,
  addCoin,
  updateCoin,
  removeCoin,
  addCoinHolding,
  updateCoinHolding,
  removeCoinHolding,
  getSymbols,
  getExchanges,
} from '../mongo/coin/CoinController';

import {
  getUser,
  getUsers,
  updateUser,
  removeUser,
} from '../mongo/user/UserController';

export const typeDefs = `
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

    addCoin(symbol: String, slug: String, creatorId: ID!): Coin
    updateCoin(id: ID!, symbol: String, holdings: HoldingInput): Coin
    removeCoin(id: ID, creatorId: ID): Coin

    addCoinHolding(id: ID!, holding: HoldingInput): Coin
    updateCoinHolding(holdingId: ID!, holding: HoldingInput): Coin
    removeCoinHolding(holdingId: ID!): Coin
  }
`;

export const resolvers = {
  HoldingType: {
    WALLET: 'wallet',
    STAKING: 'staking',
    EXCHANGE: 'exchange',
  },
  Query: {
    getPasswordToken,
    getUser,
    getUsers,
    getCoinListings,
    getCoin,
    getCoins,
    getSymbols,
    getExchanges,
  },
  Mutation: {
    login,
    register,
    verify,
    resendVerificationToken,
    createPasswordToken,
    updatePassword,
    updateUser,
    removeUser,
    addCoin,
    updateCoin,
    removeCoin,
    updateCoinHolding,
    removeCoinHolding,
    addCoinHolding,
  },
};
