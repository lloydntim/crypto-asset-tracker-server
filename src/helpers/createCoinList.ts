import logger from './logger';

enum StorageOptionTypes {
  WALLET = 'wallet',
  EXCHANGE = 'exchange',
  STAKING = 'staking',
}

type StorageOptionType = `${StorageOptionTypes}`;

interface Holding {
  id: string;
  name: string;
  amount: number;
}

interface StorageOption {
  type: StorageOptionType;
  total: number;
  holdings: Holding[];
}

interface CoinListItem {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  amount: number;
  value: string;
  storageOptions: StorageOption[];
}

interface CoinList {
  balance: number;
  coins: CoinListItem[];
}

const createCoinList = (userCoins, coinListings): CoinList => {
  logger.log(userCoins);
  logger.log(coinListings);
  return {
    balance: 0,
    coins: [],
  };
};

export default createCoinList;
