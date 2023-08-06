import * as cheerio from 'cheerio';
import axios from 'axios';
import Coin from './CoinModel';
import {
  cmcServiceLogger,
  fetchHTMLServiceLogger,
  mongoClientLogger,
} from '../../helpers/logger';
import {
  getLatestCoinListings,
  getLatestCoinQuotes,
} from '../../services/cmcService';
import { authenticateUser } from '../../middleware';

export const getCoin = async (parent, { coinId }, { token, t }) => {
  authenticateUser(token);

  try {
    return await Coin.findOne({ coinId });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('Coin_error_listCouldNotBeRetrieved'));
  }
};

export const getCoinListings = async (
  parent,
  { symbols, convert },
  { token, t }
) => {
  authenticateUser(token);

  if (!symbols) return [];

  try {
    const quotes = await getLatestCoinQuotes({
      symbol: symbols,
      convert,
    });

    return Object.values(quotes).map(
      ({
        name,
        id,
        symbol,
        quote: {
          [convert]: { price },
        },
      }: any) => ({ price, id, name, symbol })
    );
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_listing_error_listingouldNotBeRetrieved'));
  }
};

// TODO: change name from creatorId to createdBy / createdByUserId
export const getCoins = async (parent, { creatorId }, { token, t }) => {
  authenticateUser(token);
  try {
    return (await creatorId) ? Coin.find({ creatorId }) : Coin.find({});
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeRetrieved'));
  }
};

export const addCoin = async (
  parent,
  { symbol, slug, creatorId },
  { token, t }
) => {
  authenticateUser(token);

  try {
    let coinSymbol = symbol;

    if (slug) {
      const quotes = await getLatestCoinQuotes({ slug });
      const [newCoin]: any[] = Object.values(quotes);

      coinSymbol = newCoin.symbol;
    }

    // make sure user exists.
    return await Coin.create({
      symbol: coinSymbol,
      creatorId,
      holdings: [],
    });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeAdded'));
  }
};

export const updateCoin = async (parent, { coinId, holding }, { token, t }) => {
  authenticateUser(token);

  try {
    return await Coin.findOneAndUpdate(
      { coinId },
      { $push: { holdings: [holding] } },
      { new: true }
    );
  } catch (error) {
    throw new Error(t('coin_error_listCouldNotBeUpdated'));
  }
};

export const removeCoin = async (parent, args, { token, t }) => {
  authenticateUser(token);

  try {
    const { id: _id, creatorId } = args;

    return creatorId
      ? await Coin.deleteMany({ creatorId })
      : await Coin.findOneAndDelete({ _id });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeRemoved'));
  }
};

export const addCoinHolding = async (parent, { id, holding }, { token, t }) => {
  authenticateUser(token);

  const { type, name } = holding;
  const holdingId = `${type}-${name.toLowerCase().split(' ').join('-')}`;
  try {
    return await Coin.findOneAndUpdate(
      { _id: id, 'holdings.holdingId': { $ne: holdingId } },
      { $push: { holdings: [{ ...holding, holdingId }] } },
      { new: true }
    );
  } catch (error) {
    throw new Error(t('coin_error_listCouldNotBeUpdated'));
  }
};

export const updateCoinHolding = async (
  parent,
  { holdingId, holding },
  { token, t }
) => {
  authenticateUser(token);

  try {
    return await Coin.findOneAndUpdate(
      { 'holdings._id': holdingId },
      {
        $set: {
          'holdings.$.amount': holding.amount,
          'holdings.$.name': holding.name,
        },
      },
      { new: true }
    );
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeUpdated'));
  }
};

export const removeCoinHolding = async (
  parent,
  { holdingId },
  { token, t }
) => {
  authenticateUser(token);

  try {
    return await Coin.findOneAndUpdate(
      { 'holdings._id': holdingId },
      { $pull: { holdings: { _id: holdingId } } },
      { new: true }
    );
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeUpdated'));
  }
};

const fetchHTML = async (url: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    return data;
  } catch (error) {
    fetchHTMLServiceLogger.error(error);
    throw new Error(`Something went wrong, ${url} could not be retrieved.`);
  }
};

export const getSymbols = async (parent, _, { token, t }) => {
  authenticateUser(token);

  try {
    const listings = await getLatestCoinListings();

    return listings.map(({ name, symbol }) => ({ id: symbol, name }));
  } catch (error) {
    cmcServiceLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeRetrieved'));
  }
};

export const getExchanges = async (parent, _, { token, t }) => {
  authenticateUser(token);

  try {
    const html = await fetchHTML('https://www.cryptowisser.com/exchanges');
    const $ = cheerio.load(html);

    const results = $('body').find('body table > tbody > tr > th');

    const exchanges = results
      .map((_, el) => {
        const elementSelector = $(el);

        const image = elementSelector.find('img').attr('src');
        const name = elementSelector.find('a').text().replace(/\n/g, '');

        return { image, name, id: name.toLowerCase().replace(/\s/g, '-') };
      })
      .get();

    return exchanges;
  } catch (error) {
    fetchHTMLServiceLogger.error(error);
    throw new Error(t('coin_error_listCouldNotBeRetrieved'));
  }
};

export default {
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
};
