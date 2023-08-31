import axios from 'axios';
import { BadRequestException } from '../graphql/errors';
import { fetchHTMLServiceLogger } from './logger';

const fetchHTML = async (url: string) => {
  try {
    const { data } = await axios.get(url);

    return data;
  } catch (error) {
    fetchHTMLServiceLogger.error(error);
    throw new BadRequestException();
  }
};

export default fetchHTML;
