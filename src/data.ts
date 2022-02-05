export type HoldingsItemType = {
  slug: string;
  name: string;
  amount: number;
};

export type HoldingsType = {
  coinId?: number;
  symbol?: string;
  price?: number;
  currency?: string;
  exchanges: HoldingsItemType[];
  wallets: HoldingsItemType[];
  staking: HoldingsItemType[];
  exchangesTotal?: number;
  walletsTotal?: number;
  stakingTotal?: number;
  total?: number;
};

export type CoinDataType = {
  symbol: string;
  id: string;
  price: number;
};

export const theta: HoldingsType = {
  coinId: 2416,
  symbol: 'THETA',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 2006.83978752 }],
  wallets: [{ slug: 'theta-wallet', name: 'Theta Wallet', amount: 25010 }],
  staking: [],
};

export const tfuel: HoldingsType = {
  coinId: 3822,
  symbol: 'TFUEL',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 6000.55128876 }],
  wallets: [{ slug: 'theta-wallet', name: 'Theta Wallet', amount: 720000 }],
  staking: [{ slug: 'theta-wallet', name: 'Theta Wallet', amount: 33810.031 }],
};

export const ada: HoldingsType = {
  coinId: 2010,
  symbol: 'ADA',
  exchanges: [
    { slug: 'binance', name: 'Binance', amount: 174.844775 },
    { slug: 'kraken', name: 'Kraken', amount: 381 },
    { slug: 'coinbase-pro', name: 'Coinbase Pro', amount: 474.309 },
  ],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 260000.825743 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 5119.920728 }],
};

export const vch: HoldingsType = {
  coinId: 3077,
  symbol: 'VCH',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 204013.1809 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const eth: HoldingsType = {
  coinId: 1027,
  symbol: 'ETH',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 2.0113216 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const xrp: HoldingsType = {
  coinId: 52,
  symbol: 'XRP',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 2281.366 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const btc: HoldingsType = {
  coinId: 1,
  symbol: 'BTC',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 0.02143302 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const ltc: HoldingsType = {
  coinId: 2,
  symbol: 'LTC',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 5.0957 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const xmr: HoldingsType = {
  coinId: 328,
  symbol: 'XMR',
  exchanges: [{ slug: 'binance', name: 'Binance', amount: 2.580667 }],
  wallets: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
  staking: [{ slug: 'yoroi', name: 'Yoroi', amount: 0 }],
};

export const holdingsItems: HoldingsType[] = [
  theta,
  tfuel,
  ada,
  vch,
  eth,
  xrp,
  btc,
  xmr,
  ltc,
];
