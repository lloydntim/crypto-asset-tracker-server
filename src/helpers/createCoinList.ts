import { Coin, Holding as HoldingStorage } from '../mongo/coin/CoinSchema';

// enum HoldingStorageTypes {
//   WALLET = 'wallet',
//   EXCHANGE = 'exchange',
//   STAKING = 'staking',
// }

// type HoldingStorageType = `${HoldingStorageTypes}`;

// export interface Holding {
//   id: string;
//   name: string;
//   amount: number;
//   value?: number;
//   type?: string;
// }

// interface HoldingStorage {
//   type: HoldingStorageType;
//   total: number;
//   holdings: Holding[];
// }

interface CoinListItem {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  price: number;
  amount: number;
  value: number;
  // holdingStorages: HoldingStorage[];
  holdingStorages: HoldingStorage[];
}

interface CoinList {
  balance: number;
  coins: CoinListItem[];
}

interface CoinQuote {
  [key: string]: {
    id: number;
    name: string;
    quote: { [key: string]: { price: number } };
  };
}

export const createHoldingStorages = (
  holdings: HoldingStorage[],
  price: number
) => {
  return holdings.reduce(
    (obj, holding) => {
      const { id, name, amount, type } = holding;
      const { total: existingCoinTotal, options: existingOptions } = obj;
      const { total: existingTotal = 0, holdings: existingHoldings = [] } =
        existingOptions[type] ?? {};

      const newholding = {
        id,
        name,
        amount,
        value: amount * price,
      };

      const coinTotal = existingCoinTotal + amount;
      const optionTotal = existingTotal + amount;

      const newOption = {
        type,
        total: optionTotal,
        value: optionTotal * price,
        holdings: [...existingHoldings, newholding],
      };

      return {
        ...obj,
        total: coinTotal,
        value: coinTotal * price,
        options: {
          ...existingOptions,
          [type]: newOption,
        },
      };
    },
    { total: 0, value: 0, options: {} }
  );
};

const createCoinList = (
  userCoins: Coin[],
  coinQuotes: CoinQuote,
  convert: string
): CoinList => {
  return userCoins.reduce(
    (object, data) => {
      const { id, symbol, holdings } = data;
      const {
        name: coinName,
        id: coinId,
        quote: {
          [convert]: { price },
        },
      } = coinQuotes[symbol] ?? {
        name: '',
        quote: { [convert]: { price: 0 } },
      };
      const holdingStorages = createHoldingStorages(holdings, price);
      const {
        value: totalCoinValue,
        total: totalCoinAmount,
        options,
      } = holdingStorages;
      const { balance: existingBalance, coins: existingCoins } = object;
      const newCoin = {
        id,
        coinId,
        name: coinName,
        symbol,
        price,
        value: totalCoinValue,
        total: totalCoinAmount,
        holdingStorages: Object.values(options),
      };

      return {
        balance: existingBalance + totalCoinValue,
        coins: [...existingCoins, newCoin],
      };
    },
    { balance: 0, coins: [] }
  );
};

export default createCoinList;
