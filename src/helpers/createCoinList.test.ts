import { Coin, Holding } from '../mongo/coin/CoinSchema';
import createCoinList, { createHoldingStorages } from './createCoinList';

const userCoinsData: Coin[] = [
  {
    id: '0',
    coinId: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    holdings: [
      {
        id: '0',
        name: 'Trezor',
        amount: 0.05,
        type: 'wallet',
      },
      {
        id: '1',
        name: 'SafePal',
        amount: 0.05,
        type: 'wallet',
      },
      {
        id: '2',
        name: 'KuCoin',
        amount: 0.5,
        type: 'exchange',
      },
      {
        id: '3',
        name: 'Huobi',
        amount: 0.5,
        type: 'exchange',
      },
      {
        id: '4',
        name: 'Kraken',
        amount: 1,
        type: 'exchange',
      },
    ],
    creatorId: 'user01',
  },
  {
    id: '1',
    coinId: '1027',
    name: 'Ethereum',
    symbol: 'ETH',
    holdings: [
      {
        id: '0',
        name: 'Trezor',
        amount: 2,
        type: 'wallet',
      },
      {
        id: '1',
        name: 'Ledger',
        amount: 3,
        type: 'wallet',
      },
      {
        id: '2',
        name: 'Coinbase',
        amount: 1,
        type: 'exchange',
      },
      {
        id: '3',
        name: 'Kraken',
        amount: 1,
        type: 'exchange',
      },
      {
        id: '4',
        name: 'Binance',
        amount: 1.5,
        type: 'staking',
      },
      {
        id: '5',
        name: 'Random',
        amount: 3.5,
        type: 'staking',
      },
    ],
    creatorId: 'user01',
  },
];

const coinQuotes = {
  BTC: {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    slug: 'btc',
    quote: { USD: { price: 25000 } },
  },
  ETH: {
    id: 1027,
    name: 'Ethereum',
    symbol: 'ETH',
    slug: 'ethereum',
    quote: { USD: { price: 1500 } },
  },
};

const result = {
  balance: 70500,
  coins: [
    {
      id: '0',
      coinId: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 25000,
      value: 52500,
      total: 2.1,
      holdingStorages: [
        {
          type: 'wallet',
          total: 0.1,
          value: 2500,
          holdings: [
            {
              id: '0',
              name: 'Trezor',
              amount: 0.05,
              value: 1250,
            },
            {
              id: '1',
              name: 'SafePal',
              amount: 0.05,
              value: 1250,
            },
          ],
        },
        {
          type: 'exchange',
          total: 2,
          value: 50000,
          holdings: [
            {
              id: '2',
              name: 'KuCoin',
              amount: 0.5,
              value: 12500,
            },
            {
              id: '3',
              name: 'Huobi',
              amount: 0.5,
              value: 12500,
            },
            {
              id: '4',
              name: 'Kraken',
              amount: 1,
              value: 25000,
            },
          ],
        },
      ],
    },
    {
      id: '1',
      coinId: 1027,
      name: 'Ethereum',
      symbol: 'ETH',
      price: 1500,
      value: 18000,
      total: 12,
      holdingStorages: [
        {
          type: 'wallet',
          total: 5,
          value: 7500,
          holdings: [
            {
              id: '0',
              name: 'Trezor',
              amount: 2,
              value: 3000,
            },
            {
              id: '1',
              name: 'Ledger',
              amount: 3,
              value: 4500,
            },
          ],
        },
        {
          type: 'exchange',
          total: 2,
          value: 3000,
          holdings: [
            {
              id: '2',
              name: 'Coinbase',
              amount: 1,
              value: 1500,
            },
            {
              id: '3',
              name: 'Kraken',
              amount: 1,
              value: 1500,
            },
          ],
        },
        {
          type: 'staking',
          total: 5,
          value: 7500,
          holdings: [
            {
              id: '4',
              name: 'Binance',
              amount: 1.5,
              value: 2250,
            },
            {
              id: '5',
              name: 'Random',
              amount: 3.5,
              value: 5250,
            },
          ],
        },
      ],
    },
  ],
};

describe('createCoinOptions', () => {
  it('should return a coin options object', () => {
    const holdings: Holding[] = [
      {
        id: '0',
        name: 'Trezor',
        amount: 2,
        type: 'wallet',
      },
      {
        id: '1',
        name: 'Ledger',
        amount: 3,
        type: 'wallet',
      },
      {
        id: '2',
        name: 'Coinbase',
        amount: 1,
        type: 'exchange',
      },
      {
        id: '3',
        name: 'Kraken',
        amount: 1,
        type: 'exchange',
      },
    ];

    const result = {
      value: 10500,
      total: 7,
      options: {
        wallet: {
          type: 'wallet',
          total: 5,
          value: 7500,
          holdings: [
            {
              id: '0',
              name: 'Trezor',
              amount: 2,
              value: 3000,
            },
            {
              id: '1',
              name: 'Ledger',
              amount: 3,
              value: 4500,
            },
          ],
        },
        exchange: {
          type: 'exchange',
          total: 2,
          value: 3000,
          holdings: [
            {
              id: '2',
              name: 'Coinbase',
              amount: 1,
              value: 1500,
            },
            {
              id: '3',
              name: 'Kraken',
              amount: 1,
              value: 1500,
            },
          ],
        },
      },
    };

    expect(createHoldingStorages(holdings, 1500)).toEqual(result);
  });
});

describe('createCoinList', () => {
  it('should return a coinlist object', () => {
    expect(createCoinList(userCoinsData, coinQuotes, 'USD')).toEqual(result);
  });
});
