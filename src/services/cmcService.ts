import axios from 'axios';
import { CMC_URL } from '../config';
import { CMC_API_KEY } from '../config/credentials';
import { cmcServiceLogger } from '../helpers/logger';
import { t } from 'i18next';

const headers = {
  'X-CMC_PRO_API_KEY': CMC_API_KEY,
};

export const getLatestCoinListings = async () => {
  try {
    const url = `${CMC_URL}/listings/latest`;

    const response = await axios.get(url, {
      headers,
      params: {
        limit: 100,
      },
    });
    return response.data.data;
  } catch (error) {
    cmcServiceLogger.error(error);
    throw new Error(t('coin_error_listingCouldNotBeRetrieved'));
  }
};

export const getLatestCoinQuotes = async (params) => {
  try {
    const url = `${CMC_URL}/quotes/latest`;

    const response = await axios.get(url, {
      headers,
      params,
    });

    return response.data.data;
  } catch (error) {
    cmcServiceLogger.error(error);
    throw new Error(t('coin_error_quotesCouldNotBeRetrieved'));
  }
};
