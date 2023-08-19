import axios from 'axios';
import { fetchHTMLServiceLogger } from './logger';
import { BadRequestException } from '../graphql/errors';

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
    fetchHTMLServiceLogger.error(error);
    throw new BadRequestException();
  }
};
