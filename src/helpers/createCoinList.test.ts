import createCoinList from './createCoinList';

const userCoinsData = {};

const listingsData = {};

describe('createCoinList', () => {
  it('should return a cookie object', () => {
    expect(createCoinList(userCoinsData, listingsData)).toEqual({
      balance: 0,
      coins: [],
    });
  });
});
