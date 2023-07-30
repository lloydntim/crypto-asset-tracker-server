import axios from 'axios';
import { CoinDataType, HoldingsItemType, HoldingsType } from '../mongo/data';

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

type CreateCookies<T> = (cookiesFallback: T) => { i18next?: string };

export const createCookies: CreateCookies<string> = (cookiesFallback: string) =>
  cookiesFallback.split(';').reduce((object, cookieData) => {
    const [key, value] = cookieData.split('=');
    const formattedKey = key
      .trim()
      .replace(/-[a-z0-9]/g, (v) =>
        String.prototype.toUpperCase.apply(v.substring(1))
      );

    return { ...object, [formattedKey]: value };
  }, {});

export const fetchHTML = async (url: string) => {
  try {
    const { data } = await axios.get(url);

    return data;
  } catch (error) {
    console.error(`Something went wrong, ${url} could not be retrieved.`);
    // throw new Error(`Something went wrong, ${url} could not be retreived.`);
  }
};
