import axios from 'axios';
import fetchHTML from './fetchHTML';
import { BadRequestException } from '../graphql/errors';

jest.mock('axios');

const TARGET_URL = 'https://www.sitepoint.com/';

describe('fetchHTML', () => {
  it('should return data when successful', async () => {
    const htmlContent =
      '<html><head><title></title></head><body>Hello World</body></html>';

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: htmlContent });

    const result = await fetchHTML(TARGET_URL);

    expect(axios.get as jest.Mock).toHaveBeenCalledWith(TARGET_URL);
    expect(result).toEqual(htmlContent);
  });

  it('should return data when it fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(Error('message'));

    expect(axios.get as jest.Mock).toHaveBeenCalledWith(TARGET_URL);

    await expect(fetchHTML(TARGET_URL)).rejects.toThrow(BadRequestException);
  });
});
