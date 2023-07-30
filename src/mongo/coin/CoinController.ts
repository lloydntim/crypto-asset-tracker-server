import { AuthenticationError, ApolloError } from 'apollo-server-express';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { cmcUrl } from '../../config';
import { cmcApiKey } from '../../config/credentials';
import Coin from './CoinModel';

export const getCoin = async (parent, { coinId }, { currentUser, t }) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return await Coin.findOne({ coinId });
  } catch (error) {
    throw new Error(t('Coin_error_listCouldNotBeRetrieved'));
  }
};

export const getCoinListings = async (
  parent,
  { symbols, convert },
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  if (!symbols) return [];
  try {
    const url = `${cmcUrl}/quotes/latest`;
    const response = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': cmcApiKey,
      },
      params: {
        symbol: symbols,
        convert,
      },
    });

    // console.log('length', response.data.data.length);
    // console.log('response', response.data.data.ETH.name);
    // console.log('response', response.data.data.ETH.quote.EUR);
    return Object.values(response.data.data).map(
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
    console.log('error', error);
  }
};

export const getCoins = async (parent, { creatorId }, { currentUser, t }) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return (await creatorId) ? Coin.find({ creatorId }) : Coin.find({});
  } catch (error) {
    throw new Error(t('coin_error_listCouldNotBeRetrieved'));
  }
};

export const addCoin = async (
  parent,
  { symbol, slug, creatorId },
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    let coinSymbol = symbol;

    if (slug) {
      const url = `${cmcUrl}/quotes/latest`;
      const response = await axios
        .get(url, {
          headers: {
            'X-CMC_PRO_API_KEY': cmcApiKey,
          },
          params: {
            slug,
          },
        })
        .catch((error) => {
          console.log(error);
          throw new Error(t('Coin does not seem to exist'));
        });

      const [newCoin]: any[] = Object.values(response.data.data);
      coinSymbol = newCoin.symbol;
    }

    return await Coin.create({
      // coinId: `${creatorId}-${symbol}`.toLowerCase(),
      symbol: coinSymbol,
      creatorId,
      holdings: [],
    });
  } catch (error) {
    console.log('error', error);
    throw new Error(t('coin_error_listCouldNotBeAdded'));
  }
};

export const updateCoin = async (
  parent,
  { coinId, holding },
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return await Coin.findOneAndUpdate(
      { coinId },
      { $push: { holdings: [holding] } },
      { new: true }
    );
  } catch (error) {
    throw new ApolloError(t('coin_error_listCouldNotBeUpdated'));
  }
};

export const removeCoin = async (parent, args, { currentUser, t }) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    const { id: _id, creatorId } = args;

    return creatorId
      ? await Coin.deleteMany({ creatorId })
      : await Coin.findOneAndDelete({ _id });
  } catch (error) {
    throw new Error(t('coin_error_listCouldNotBeRemoved'));
  }
};

export const addCoinHolding = async (
  parent,
  { id, holding },
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
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
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
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
    console.log(error);
    throw new Error(t('coin_error_listCouldNotBeUpdated'));
  }
};

export const removeCoinHolding = async (
  parent,
  { holdingId },
  { currentUser, t }
) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return await Coin.findOneAndUpdate(
      { 'holdings._id': holdingId },
      { $pull: { holdings: { _id: holdingId } } },
      { new: true }
    );
  } catch (error) {
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
    console.log('data 1', data);
    return data;
  } catch (error) {
    console.error('fetchHTMLError ', error);
    throw new Error(`Something went wrong, ${url} could not be retrieved.`);
  }
};

export const getSymbols = async (parent, _, { currentUser, t }) => {
  // if (!currentUser.loggedIn)
  // throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    /*     const html = await fetchHTML('http://www.coingecko.com/');
    const $ = cheerio.load(html);

    const results = $('body').find('body table > tbody > tr > td a');

    const symbols = results
      .map((_, el) => {
        const elementSelector = $(el);

        const name = elementSelector
          .find('span:first')
          .text()
          .replace(/\r?\n|\r/g, '');
        const id = elementSelector
          .find('span:last')
          .text()
          .replace(/\r?\n|\r/g, '');

        return { name, id };
      })
      .get();

    return symbols; */
    const url = `${cmcUrl}/listings/latest`;

    const response = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': cmcApiKey,
      },
      params: {
        limit: 100,
      },
    });

    return response.data.data.map(({ name, symbol }) => ({ id: symbol, name }));
  } catch (error) {
    // console.error(error);
    throw new Error(t('coin_error_listCouldNotBeRetrieved'));
  }
};

export const getExchanges = async (parent, _, { currentUser, t }) => {
  // if (!currentUser.loggedIn)
  // throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
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
    console.error(error);
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
