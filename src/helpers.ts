import { CoinDataType, HoldingsItemType, HoldingsType } from './data';

export const getTotal = (arr: HoldingsItemType[], price: number) =>
  arr.reduce((a: number, b: HoldingsItemType) => (a + b.amount) * price, 0);

export const processHoldingsData = (data) =>
  data.reduce(
    (
      /* eslint-disable @typescript-eslint/no-explicit-any */
      holdingsDataObject: any,
      { coinId, exchanges, wallets, staking }: HoldingsType
    ) => ({
      [coinId]: { exchanges, wallets, staking },
      ...holdingsDataObject,
    }),
    {}
  );

export const processCoinsData = (data: any, currency: string): CoinDataType[] =>
  Object.values(data).map(
    ({
      id,
      symbol,
      quote: {
        [currency]: { price },
      },
    }: any) => ({
      id,
      symbol,
      price,
    })
  );
