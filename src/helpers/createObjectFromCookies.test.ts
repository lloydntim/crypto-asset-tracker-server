import createObjectFromCookies from './createObjectFromCookies';

describe('createObjectFromCookies', () => {
  const cookieData =
    'username=John Doe; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

  it('should return a cookie object', () => {
    expect(createObjectFromCookies(cookieData)).toEqual({
      username: 'John Doe',
      path: '/',
      expires: 'Thu, 01 Jan 1970 00:00:00 UTC',
    });
  });

  it('should return an empty object when no cookies are available', () => {
    expect(createObjectFromCookies('')).toEqual({});
    expect(createObjectFromCookies(undefined)).toEqual({});
  });
});
